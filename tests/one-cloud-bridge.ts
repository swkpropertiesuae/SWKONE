import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const data = mkdtempSync(join(tmpdir(), 'swk-one-test-'))
const bridgeSecret = randomBytes(32).toString('hex')
const password = 'TestOnly!aA1-' + randomBytes(18).toString('hex')
Object.assign(process.env, {
  NODE_ENV: 'test', DATA_DIR: data, DATABASE_URL: '', REQUIRE_DATABASE_URL: 'false',
  ADMIN_PASSWORD: password, COOKIE_SECURE: 'false', DEMO_ENABLED: 'false',
  ONE_AI_GATEWAY_URL: 'https://gateway.example.invalid', ONE_AI_BRIDGE_SECRET: bridgeSecret,
})
const [{ syncSchema }, { seedReference }, { buildApp }, { config }, { db }] = await Promise.all([
  import('../src/server/schema'), import('../src/server/seed'), import('../src/server/app'),
  import('../src/server/config'), import('../src/server/db'),
])
syncSchema()
await seedReference()
const app = await buildApp()
const originalFetch = globalThis.fetch
try {
  const payload = { task: 'reply', text: 'Summarize public listing details.', classification: 'public', confirmPublic: true }
  const base = { method: 'POST' as const, url: '/api/one/ai/text', payload }
  assert.equal((await app.inject(base)).statusCode, 401)

  const login = await app.inject({
    method: 'POST', url: '/api/auth/login', headers: { 'x-swk-client': 'android' },
    payload: { email: config.accounts.adminEmail, password },
  })
  assert.equal(login.statusCode, 200)
  const identity = login.json()
  const headers = { 'x-swk-client': 'android', 'x-swk-session': identity.sessionToken }
  const unlock = await app.inject({
    method: 'POST', url: '/api/auth/change-password', headers,
    payload: { current: password, next: 'NewOnly!aA1-' + randomBytes(18).toString('hex') },
  })
  assert.equal(unlock.statusCode, 200)

  let calls = 0
  globalThis.fetch = async (input, init) => {
    calls++
    assert.equal(String(input), 'https://gateway.example.invalid/api/text')
    const sent = new Headers(init?.headers)
    assert.equal(sent.get('x-swk-staff-id'), String(identity.user.id))
    assert.equal(sent.get('authorization'), 'Bearer ' + bridgeSecret)
    assert.deepEqual(JSON.parse(String(init?.body)), payload)
    return Response.json({ text: 'Sample draft', provider: 'cloudflare', model: 'mock-model' })
  }
  assert.equal((await app.inject({ ...base, headers, payload: { ...payload, classification: 'restricted' } })).statusCode, 400)
  assert.equal(calls, 0)
  const response = await app.inject({ ...base, headers: { ...headers, 'x-swk-staff-id': '999' } })
  assert.equal(response.statusCode, 200)
  assert.deepEqual(response.json(), { text: 'Sample draft', provider: 'cloudflare', model: 'mock-model' })
  assert.equal(calls, 1)
  console.log('SWK ONE application bridge checks passed.')
} finally {
  globalThis.fetch = originalFetch
  await app.close()
  db.close()
  rmSync(data, { recursive: true, force: true })
}
