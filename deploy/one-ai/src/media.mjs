const models = {
  transcribe: '@cf/openai/whisper-large-v3-turbo',
  speak: '@cf/deepgram/aura-2-en',
  image: '@cf/black-forest-labs/flux-1-schnell',
}

function validAudio(value) {
  if (typeof value !== 'string' || value.length > 2_560_060 || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)) return false
  try {
    const bytes = Uint8Array.from(atob(value), c => c.charCodeAt(0))
    if (bytes.length < 46 || bytes.length > 1_920_044 || bytes.length % 2) return false
    const header = new DataView(bytes.buffer)
    return header.getUint32(0) === 0x52494646 && header.getUint32(4, true) === bytes.length - 8 &&
      header.getUint32(8) === 0x57415645 && header.getUint32(12) === 0x666d7420 &&
      header.getUint32(16, true) === 16 && header.getUint16(20, true) === 1 &&
      header.getUint16(22, true) === 1 && header.getUint32(24, true) === 16000 &&
      header.getUint32(28, true) === 32000 && header.getUint16(32, true) === 2 &&
      header.getUint16(34, true) === 16 && header.getUint32(36) === 0x64617461 &&
      header.getUint32(40, true) === bytes.length - 44
  } catch {
    return false
  }
}

export async function runMedia({ env, input, reserve, day, slot, json, cap }) {
  if (env.MEDIA_ENABLED !== 'true') return json({ error: 'media_not_enabled' }, 503)
  if (!input || !Object.hasOwn(models, input.task)) return json({ error: 'invalid_request' }, 400)
  if (input.classification !== 'public' || input.confirmPublic !== true) {
    return json({ error: 'private_route_unavailable' }, 422)
  }
  const task = input.task
  const text = typeof input.text === 'string' ? input.text.trim() : ''
  if (task === 'transcribe' ? !validAudio(input.audio) : !text || text.length > (task === 'speak' ? 200 : 600)) {
    return json({ error: 'invalid_media_input' }, 400)
  }
  const cost = task === 'transcribe' ? 50 : task === 'speak' ? Math.ceil(text.length * 2.8) : 120
  if (!await reserve(env.DB, day + ':media:' + slot + ':' + task, 1, task === 'transcribe' ? 5 : 2) ||
      !await reserve(env.DB, day + ':cloudflare', cost, cap)) {
    return json({ error: 'media_daily_limit' }, 429)
  }
  const model = models[task]
  if (task === 'transcribe') {
    const result = await env.AI.run(model, { audio: input.audio, task: 'transcribe' })
    if (typeof result.text !== 'string') throw new Error('Invalid transcript')
    return json({ text: result.text, model })
  }
  if (task === 'speak') {
    const audio = await env.AI.run(model, { text, speaker: 'luna', encoding: 'mp3' })
    if (!(audio instanceof ReadableStream)) throw new Error('Invalid audio')
    return new Response(audio, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' } })
  }
  const result = await env.AI.run(model, { prompt: text, steps: 4 })
  if (typeof result.image !== 'string' || result.image.length > 2_000_000) throw new Error('Invalid image')
  const mime = result.image.startsWith('/9j/') ? 'image/jpeg'
    : result.image.startsWith('iVBORw0KGgo') ? 'image/png' : null
  if (!mime) throw new Error('Unsupported image')
  return new Response(Uint8Array.from(atob(result.image), c => c.charCodeAt(0)), {
    headers: { 'Content-Type': mime, 'Cache-Control': 'no-store' },
  })
}
