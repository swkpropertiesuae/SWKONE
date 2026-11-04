import { runMedia } from './media.mjs'

const cloudModel = '@cf/qwen/qwen3-30b-a3b-fp8'
const endpoint = {
  opencode: 'https://opencode.ai/inference/openai/v1/chat/completions',
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
}
const tasks = {
  reply: 'Draft a concise client reply. Use placeholders for missing facts.',
  translate: 'Translate into the requested language and preserve figures.',
  seo: 'Write SEO titles and descriptions. Never invent search metrics.',
  campaign: 'Draft social captions, a short video script and SEO metadata using supplied property facts only.',
  summary: 'Summarize the supplied material. Mark uncertain or missing information.',
  chat: 'Answer clearly and mark assumptions.',
}
const outputLimit = 512
const json = (body, status = 200) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store' },
})

async function readJson(request, limit) {
  if (!request.body || !request.headers.get('content-type')?.startsWith('application/json')) return null
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let bytes = 0
  let body = ''
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > limit) {
        await reader.cancel()
        return null
      }
      body += decoder.decode(value, { stream: true })
    }
    return JSON.parse(body + decoder.decode())
  } catch {
    return null
  }
}

async function reserve(db, bucket, amount, limit) {
  const result = await db.prepare(
    'INSERT INTO quota(bucket, used) SELECT ?, ? WHERE ? <= ? ' +
    'ON CONFLICT(bucket) DO UPDATE SET used = used + excluded.used WHERE used + excluded.used <= ?',
  ).bind(bucket, amount, amount, limit, limit).run()
  return result.meta.changes === 1
}

async function identity(request, env) {
  if (!env.ONE_AI_BRIDGE_SECRET || env.ONE_AI_BRIDGE_SECRET.length < 32) return null
  const authorization = request.headers.get('authorization') || ''
  const digest = value => crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  const [given, expected] = await Promise.all([
    digest(authorization), digest('Bearer ' + env.ONE_AI_BRIDGE_SECRET),
  ])
  if (!crypto.subtle.timingSafeEqual(given, expected)) return null
  const id = request.headers.get('x-swk-staff-id') || ''
  return /^[1-9][0-9]{0,15}$/.test(id) ? id : null
}

async function upstream(provider, config, key, messages) {
  const response = await fetch(endpoint[provider], {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: config.model, messages, max_tokens: outputLimit }),
    redirect: 'error',
    signal: AbortSignal.timeout(12000),
  })
  if (!response.ok) {
    await response.body?.cancel()
    return null
  }
  const result = await response.json()
  const content = result.choices?.[0]?.message?.content
  return typeof content === 'string' && content.trim() ? content : null
}

export default {
  async fetch(request, env) {
    try {
      const path = new URL(request.url).pathname
      if (path === '/health' && request.method === 'GET') return json({ ok: true })
      if (!['/api/text', '/api/media'].includes(path) || request.method !== 'POST') return json({ error: 'not_found' }, 404)
      const userId = await identity(request, env)
      if (!userId) return json({ error: 'sign_in_required' }, 401)
      const roster = JSON.parse(env.STAFF_SLOTS)
      const slots = Object.values(roster)
      if (slots.length > 10 || new Set(slots).size !== slots.length) return json({ error: 'invalid_roster' }, 503)
      const slot = Object.hasOwn(roster, userId) ? roster[userId] : null
      if (!Number.isInteger(slot) || slot < 1 || slot > 10) return json({ error: 'staff_invitation_required' }, 403)

      const day = new Date().toISOString().slice(0, 10)
      const cap = Math.min(8000, Math.max(0, Number(env.CF_DAILY_NEURONS) || 0))
      if (path === '/api/media') {
        if (env.MEDIA_ENABLED !== 'true') return json({ error: 'media_not_enabled' }, 503)
        const input = await readJson(request, 2_600_000)
        return await runMedia({ env, input, reserve, day, slot, json, cap })
      }
      const input = await readJson(request, 20_000)
      if (!input || !Object.hasOwn(tasks, input.task) || typeof input.text !== 'string' ||
          !input.text.trim() || input.text.length > 6000) return json({ error: 'invalid_request' }, 400)
      if (input.classification !== 'public' || input.confirmPublic !== true) {
        return json({ error: 'private_route_unavailable' }, 422)
      }
      if (!await reserve(env.DB, day + ':staff:' + slot, 1, 40)) {
        return json({ error: 'staff_daily_limit' }, 429)
      }
      const messages = [
        { role: 'system', content: 'Use source facts only for property claims. ' + tasks[input.task] },
        { role: 'user', content: input.text },
      ]
      // Conservative estimate using UTF-8 bytes and a fixed margin for framing.
      const bytes = new TextEncoder().encode(JSON.stringify(messages)).byteLength
      const estimatedNeurons = Math.ceil((bytes + 1024) * 0.004625 + outputLimit * 0.030475)
      if (await reserve(env.DB, day + ':cloudflare', estimatedNeurons, cap)) {
        try {
          const result = await env.AI.run(cloudModel, { messages, max_tokens: outputLimit })
          if (typeof result.response === 'string' && result.response.trim()) {
            return json({ text: result.response, provider: 'cloudflare', model: cloudModel })
          }
        } catch {
          // Keep the reservation because the upstream request may have incurred usage.
        }
      }
      const routes = JSON.parse(env.FREE_ROUTES || '{}')
      const credentials = JSON.parse(env.STAFF_PROVIDER_KEYS || '{}')[String(slot)] || {}
      for (const provider of Object.keys(endpoint)) {
        const config = routes[provider]
        const key = credentials[provider]
        if (!config?.enabled || typeof key !== 'string' || !key ||
            !/^[a-zA-Z0-9._:/-]{1,100}$/.test(config.model) ||
            (provider === 'opencode' && config.model !== 'big-pickle' && !config.model.endsWith('-free')) ||
            !Number.isSafeInteger(config.dailyRequests) || config.dailyRequests < 1) continue
        if (!await reserve(env.DB, day + ':' + provider, 1, config.dailyRequests)) continue
        try {
          const answer = await upstream(provider, config, key, messages)
          if (answer) return json({ text: answer, provider, model: config.model })
        } catch {
          // Try the next configured provider without switching to another staff key.
        }
      }
      return json({ error: 'approved_routes_unavailable' }, 503)
    } catch {
      return json({ error: 'service_unavailable' }, 503)
    }
  },
}
