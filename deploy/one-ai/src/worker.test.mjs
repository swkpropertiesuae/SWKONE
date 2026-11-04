import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from './worker.mjs'

test('only the authenticated staff slot can be used for fallback', async (t) => {
  const secret = 'example-test-bridge-secret-not-for-production'
  Object.defineProperty(crypto.subtle, 'timingSafeEqual', { configurable: true, value: (a, b) => Buffer.from(a).equals(Buffer.from(b)) })
  t.after(() => { Reflect.deleteProperty(crypto.subtle, 'timingSafeEqual') })
  const headers = { authorization: 'Bearer ' + secret, 'x-swk-staff-id': '2', 'content-type': 'application/json' }
  const request = (classification = 'public', token = headers.authorization) => new Request('https://ai.swk.property/api/text', {
    method: 'POST', headers: { ...headers, authorization: token }, body: JSON.stringify({ task: 'reply', text: 'Test', classification, confirmPublic: true }),
  })
  const env = {
    ONE_AI_BRIDGE_SECRET: secret,
    STAFF_SLOTS: '{"1":1,"2":2}',
    STAFF_PROVIDER_KEYS: '{"1":{"opencode":"first"},"2":{"opencode":"second"}}',
    FREE_ROUTES: '{"opencode":{"enabled":true,"model":"big-pickle","dailyRequests":10}}',
    CF_DAILY_NEURONS: '6500',
    AI: { run: async () => { throw new Error('Unavailable') } },
    DB: { prepare: () => ({ bind: () => ({ run: async () => ({ meta: { changes: 1 } }) }) }) },
  }
  let sent = 0
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    sent += 1
    assert.equal(options.headers.Authorization, 'Bearer second')
    return Response.json({ choices: [{ message: { content: 'Test reply' } }] })
  })
  assert.equal((await worker.fetch(request('public', 'Bearer invalid'), env)).status, 401)
  assert.equal((await worker.fetch(request('restricted'), env)).status, 422)
  assert.equal(sent, 0)
  assert.equal((await (await worker.fetch(request(), env)).json()).provider, 'opencode')
  assert.equal(sent, 1)
  env.STAFF_SLOTS = '{"1":1}'
  assert.equal((await worker.fetch(request(), env)).status, 403)
  assert.equal(sent, 1)
})

test('media is public-only and shares the Cloudflare reservation', async t => {
  const secret = 'example-test-bridge-secret-not-for-production'
  Object.defineProperty(crypto.subtle, 'timingSafeEqual', { configurable: true, value: (a, b) => Buffer.from(a).equals(Buffer.from(b)) })
  t.after(() => { Reflect.deleteProperty(crypto.subtle, 'timingSafeEqual') })
  const reservations = []
  let limit = false
  const env = {
    ONE_AI_BRIDGE_SECRET: secret, STAFF_SLOTS: '{"10":10}', MEDIA_ENABLED: 'true', CF_DAILY_NEURONS: '6500',
    AI: { run: async (model, input) => {
      if (model.includes('whisper')) {
        assert.equal(input.task, 'transcribe')
        return { text: 'Voice transcript' }
      }
      if (model.includes('aura')) {
        assert.equal(input.encoding, 'mp3')
        return new Response(new Uint8Array([1, 2, 3])).body
      }
      assert.equal(input.steps, 4)
      return { image: '/9j/AA==' }
    } },
    DB: { prepare: () => ({ bind: bucket => ({ run: async () => {
      reservations.push(bucket)
      return { meta: { changes: limit && bucket.endsWith(':cloudflare') ? 0 : 1 } }
    } }) }) },
  }
  const call = (body, id = '10') => worker.fetch(new Request('https://ai.swk.property/api/media', {
    method: 'POST', headers: { authorization: 'Bearer ' + secret, 'x-swk-staff-id': id, 'content-type': 'application/json' },
    body: JSON.stringify({ classification: 'public', confirmPublic: true, ...body }),
  }), env)
  assert.equal((await call({ task: 'speak', text: 'Public text' }, '9')).status, 403)
  assert.equal((await call({ task: 'speak', text: 'Text', classification: 'restricted' })).status, 422)
  assert.equal((await call({ task: 'transcribe', audio: 'aGVsbG8=' })).status, 400)
  assert.equal(reservations.length, 0)

  const wav = Buffer.alloc(46)
  wav.write('RIFF', 0); wav.writeUInt32LE(38, 4); wav.write('WAVEfmt ', 8)
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22)
  wav.writeUInt32LE(16000, 24); wav.writeUInt32LE(32000, 28); wav.writeUInt16LE(2, 32)
  wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(2, 40)
  assert.equal((await (await call({ task: 'transcribe', audio: wav.toString('base64') })).json()).text, 'Voice transcript')
  assert.equal((await call({ task: 'speak', text: 'Public text' })).headers.get('content-type'), 'audio/mpeg')
  assert.equal((await call({ task: 'image', text: 'Public concept' })).headers.get('content-type'), 'image/jpeg')
  assert.equal(reservations.filter(bucket => bucket.endsWith(':cloudflare')).length, 3)
  limit = true
  assert.equal((await call({ task: 'image', text: 'Public concept' })).status, 429)
})
