import { readFileSync } from 'node:fs'
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
  const status = { method: 'GET' as const, url: '/api/one/utilities/status', headers }
  process.env.STAFF_SLOTS = '{}'
  assert.equal((await app.inject(status)).statusCode, 403)
  process.env.STAFF_SLOTS = JSON.stringify({ [identity.user.id]: 10 })
  assert.deepEqual((await app.inject(status)).json(), { ocr: true, review: false, media: true })
  const { PDFDocument } = await import('pdf-lib')
  const pdf = await PDFDocument.create()
  pdf.addPage().drawText('Rent AED 100000 due on 1 January')
  const file = { mime: 'application/pdf', data: await pdf.saveAsBase64() }
  const ocr = { method: 'POST' as const, url: '/api/one/utilities/ocr', headers, payload: { file, language: 'eng' } }
  const scanned = await app.inject(ocr)
  assert.equal(scanned.statusCode, 200, scanned.body)
  assert.match(scanned.json().pages[0].text, /Rent AED 100000/)
  const image = { mime: 'image/png', data: readFileSync('tests/fixtures/ocr-awb.png').toString('base64') }
  const recognized = await app.inject({ ...ocr, payload: { file: image, language: 'eng' } })
  assert.equal(recognized.statusCode, 200, recognized.body)
  assert.equal(recognized.json().pages[0].ocr, true)
  assert.ok(recognized.json().pages[0].text.trim())
  process.env.ONE_PRIVATE_REVIEW_URL = 'http://127.0.0.1:11434'
  globalThis.fetch = async input => {
    assert.equal(String(input), 'http://127.0.0.1:11434/api/chat')
    const result = {
      summary: 'Rent terms',
      findings: [
        { category: 'amount', note: 'Rent amount', evidence: [{ document: 'A', page: 1, quote: 'AED 100000' }] },
        { category: 'risk', note: 'Invented quote', evidence: [{ document: 'A', page: 1, quote: 'Fabricated clause' }] },
      ], questions: [],
    }
    return Response.json({ message: { content: JSON.stringify(result) } })
  }
  const review = await app.inject({ ...ocr, url: '/api/one/utilities/review' })
  assert.equal(review.statusCode, 200, review.body)
  assert.equal(review.json().findings.length, 1)
  assert.equal(review.json().rejectedFindings, 1)
  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), 'https://gateway.example.invalid/api/media')
    assert.equal(new Headers(init?.headers).get('x-swk-staff-id'), String(identity.user.id))
    return new Response(new Uint8Array([255, 216, 255]), { headers: { 'Content-Type': 'image/jpeg' } })
  }
  const media = await app.inject({
    method: 'POST', url: '/api/one/utilities/media', headers,
    payload: { input: { task: 'image', text: 'Public concept' }, classification: 'public', confirmPublic: true },
  })
  assert.equal(media.statusCode, 200, media.body)
  assert.equal(media.headers['content-type'], 'image/jpeg')
  console.log('SWK ONE application bridge checks passed.')
} finally {
  globalThis.fetch = originalFetch
  await app.close()
  db.close()
  rmSync(data, { recursive: true, force: true })
}
