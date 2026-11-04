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
