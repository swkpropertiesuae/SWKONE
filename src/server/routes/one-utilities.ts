import { Readable } from 'node:stream'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { inDemo } from '../db'
import { HttpError } from '../util'
import { documentFile, extractDocument, privateReviewUrl, reviewDocuments } from '../one/documents'
import { need } from './helpers'

const rosterSchema = z.record(z.string().regex(/^[1-9][0-9]{0,15}$/), z.number().int().min(1).max(10))
const documentInput = z.object({ file: documentFile, language: z.enum(['eng', 'ara', 'eng+ara']) })
const mediaInput = z.discriminatedUnion('task', [
  z.object({ task: z.literal('transcribe'), audio: z.string().min(4).max(2_560_060) }).strict(),
  z.object({ task: z.literal('speak'), text: z.string().trim().min(1).max(200) }).strict(),
  z.object({ task: z.literal('image'), text: z.string().trim().min(1).max(600) }).strict(),
])

function staff(req: FastifyRequest) {
  need(req, 'ai', 'view')
  const user = req.user
  if (!user || !req.sessionHash || inDemo() || user.party_id) throw new HttpError(403, 'An internal staff session is required.')
  let roster: Record<string, number>
  try {
    roster = rosterSchema.parse(JSON.parse(process.env.STAFF_SLOTS || '{}'))
    const slots = Object.values(roster)
    if (slots.length > 10 || new Set(slots).size !== slots.length) throw new Error('Invalid roster')
  } catch {
    throw new HttpError(503, 'The staff roster needs administrator setup.')
  }
  if (!Object.hasOwn(roster, String(user.id))) throw new HttpError(403, 'Ask your administrator to assign you an SWK ONE tools seat.')
  return user.id
}

export default async function registerOneUtilities(app: FastifyInstance) {
  let processing = 0
  async function documentJob<T>(run: () => Promise<T>) {
    if (processing >= 2) throw new HttpError(429, 'Document tools are busy. Try again shortly.')
    processing++
    try { return await run() } finally { processing-- }
  }
  const documentOptions = { bodyLimit: 17_000_000, config: { rateLimit: { max: 6, timeWindow: '1 minute' } } }
  app.get('/api/one/utilities/status', async (req, reply) => {
    staff(req)
    return reply.header('Cache-Control', 'no-store').send({
      ocr: true,
      review: !!privateReviewUrl(),
      media: !!process.env.ONE_AI_GATEWAY_URL && (process.env.ONE_AI_BRIDGE_SECRET?.length ?? 0) >= 32,
    })
  })
  app.post('/api/one/utilities/ocr', documentOptions, async (req, reply) => {
    staff(req)
    const { file, language } = documentInput.strict().parse(req.body)
    const pages = await documentJob(() => extractDocument(file, language, AbortSignal.timeout(55_000)))
    return reply.header('Cache-Control', 'no-store').send({ pages })
  })
  app.post('/api/one/utilities/review', documentOptions, async (req, reply) => {
    staff(req)
    if (!privateReviewUrl()) throw new HttpError(503, 'Private document review needs an administrator-configured Ollama endpoint.')
    const { file, language, comparison } = documentInput.extend({ comparison: documentFile.optional() }).strict().parse(req.body)
    const result = await documentJob(async () => {
      const signal = AbortSignal.timeout(55_000)
      const a = await extractDocument(file, language, signal)
      const b = comparison ? await extractDocument(comparison, language, signal) : undefined
      return reviewDocuments(a, b)
    })
    return reply.header('Cache-Control', 'no-store').send(result)
  })
  app.post('/api/one/utilities/media', { bodyLimit: 2_600_000, config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, async (req, reply) => {
    const userId = staff(req)
    const input = z.object({ input: mediaInput, classification: z.literal('public'), confirmPublic: z.literal(true) }).strict().parse(req.body)
    const bridge = process.env.ONE_AI_GATEWAY_URL
    const secret = process.env.ONE_AI_BRIDGE_SECRET
    if (!bridge || !secret || secret.length < 32) throw new HttpError(503, 'Cloud media needs administrator setup.')
    let upstream: Response
    try {
      const url = new URL('/api/media', bridge)
      if (url.protocol !== 'https:') throw new Error('HTTPS required')
      upstream = await fetch(url, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(55_000),
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + secret, 'X-SWK-Staff-ID': String(userId) },
        body: JSON.stringify({ ...input.input, classification: input.classification, confirmPublic: input.confirmPublic }),
      })
    } catch {
      throw new HttpError(503, 'Cloud media is temporarily unavailable.')
    }
    if (!upstream.ok) {
      await upstream.body?.cancel()
      if (upstream.status === 429) throw new HttpError(429, 'Daily cloud media allowance reached.')
      if (upstream.status === 403) throw new HttpError(403, 'Ask your administrator to assign you a cloud media seat.')
      if (upstream.status === 400) throw new HttpError(400, 'The media request exceeded the format or length limits.')
      throw new HttpError(503, 'Cloud media is disabled or temporarily unavailable.')
    }
    const mime = upstream.headers.get('content-type')?.split(';')[0] || ''
    const accepted = input.input.task === 'transcribe' ? ['application/json']
      : input.input.task === 'speak' ? ['audio/mpeg'] : ['image/jpeg', 'image/png']
    if (!upstream.body || !accepted.includes(mime)) {
      await upstream.body?.cancel()
      throw new HttpError(502, 'The media service returned an unexpected format.')
    }
    const stream = Readable.fromWeb(upstream.body as import('node:stream/web').ReadableStream<Uint8Array>)
    return reply.header('Cache-Control', 'no-store').type(mime).send(stream)
  })
}
