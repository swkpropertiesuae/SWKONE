import { useEffect, useState, type FormEvent } from 'react'
import { get, post, postMedia } from '../lib/api'

export type DedicatedTool = 'ocr' | 'review' | 'transcribe' | 'speak' | 'image'
type Page = { page: number; text: string; ocr: boolean }
type Review = {
  summary: string
  findings: { category: string; note: string; evidence: { document: string; page: number; quote: string }[] }[]
  questions: string[]
  truncated: boolean
  rejectedFindings: number
}
const labels = {
  ocr: 'Extract document text', review: 'Review documents', transcribe: 'Transcribe audio',
  speak: 'Generate spoken audio', image: 'Generate image',
}

function base64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('The file could not be read.'))
    reader.onload = () => resolve(String(reader.result).split(',', 2)[1] ?? '')
    reader.readAsDataURL(blob)
  })
}

async function document(file: File) {
  if (file.size > 6 * 1024 * 1024) throw new Error('Use files up to 6 MiB each.')
  const mime = file.type || (/\.pdf$/i.test(file.name) ? 'application/pdf'
    : /\.png$/i.test(file.name) ? 'image/png' : /\.jpe?g$/i.test(file.name) ? 'image/jpeg' : '')
  if (!['application/pdf', 'image/jpeg', 'image/png'].includes(mime)) throw new Error('Choose a PDF, JPEG, or PNG file.')
  return { mime, data: await base64(file) }
}

async function audioWav(file: File) {
  if (file.size > 8 * 1024 * 1024) throw new Error('Use an audio file up to 8 MiB.')
  const rate = 16000
  const context = new OfflineAudioContext(1, 1, rate)
  const decoded = await context.decodeAudioData(await file.arrayBuffer())
  if (!decoded.length || decoded.duration > 60) throw new Error('Choose an audio clip of 60 seconds or less.')
  const mix = new OfflineAudioContext(1, decoded.length, rate)
  const source = mix.createBufferSource()
  source.buffer = decoded
  source.connect(mix.destination)
  source.start()
  const samples = (await mix.startRendering()).getChannelData(0)
  const bytes = new DataView(new ArrayBuffer(44 + samples.length * 2))
  bytes.setUint32(0, 0x52494646)
  bytes.setUint32(4, bytes.byteLength - 8, true)
  bytes.setUint32(8, 0x57415645)
  bytes.setUint32(12, 0x666d7420)
  bytes.setUint32(16, 16, true)
  bytes.setUint16(20, 1, true)
  bytes.setUint16(22, 1, true)
  bytes.setUint32(24, rate, true)
  bytes.setUint32(28, rate * 2, true)
  bytes.setUint16(32, 2, true)
  bytes.setUint16(34, 16, true)
  bytes.setUint32(36, 0x64617461)
  bytes.setUint32(40, samples.length * 2, true)
  for (let i = 0; i < samples.length; i++) {
    const value = Math.max(-1, Math.min(1, samples[i]))
    bytes.setInt16(44 + i * 2, Math.round(value * (value < 0 ? 32768 : 32767)), true)
  }
  return base64(new Blob([bytes.buffer as ArrayBuffer], { type: 'audio/wav' }))
}

export function OneDedicatedTools({ tool }: { tool: DedicatedTool }) {
  const [status, setStatus] = useState<{ ocr: boolean; review: boolean; media: boolean }>()
  const [error, setError] = useState('')
  const [file, setFile] = useState<File>()
  const [comparison, setComparison] = useState<File>()
  const [language, setLanguage] = useState('eng')
  const [text, setText] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [pages, setPages] = useState<Page[]>()
  const [review, setReview] = useState<Review>()
  const [transcript, setTranscript] = useState<string>()
  const [media, setMedia] = useState<Blob>()
  const [mediaUrl, setMediaUrl] = useState('')
  const local = tool === 'ocr' || tool === 'review'
  const upload = local || tool === 'transcribe'
  const limit = tool === 'speak' ? 200 : 600
  useEffect(() => {
    const controller = new AbortController()
    get<typeof status>('/api/one/utilities/status', undefined, controller.signal).then(setStatus, err => {
      if (!controller.signal.aborted) setError(err.message)
    })
    return () => controller.abort()
  }, [])
  useEffect(() => {
    if (!media) { setMediaUrl(''); return }
    const url = URL.createObjectURL(media)
    setMediaUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [media])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (busy || !status || (upload && !file) || (!local && !confirmed)) return
    setBusy(true)
    setError('')
    setPages(undefined)
    setReview(undefined)
    setTranscript(undefined)
    setMedia(undefined)
    try {
      if (local && file) {
        const payload = { file: await document(file), language }
        if (tool === 'ocr') setPages((await post<{ pages: Page[] }>('/api/one/utilities/ocr', payload)).pages)
        else setReview(await post<Review>('/api/one/utilities/review', {
          ...payload, ...(comparison ? { comparison: await document(comparison) } : {}),
        }))
      } else {
        const input = tool === 'transcribe' && file ? { task: tool, audio: await audioWav(file) } : { task: tool, text }
        const response = await postMedia('/api/one/utilities/media', { input, classification: 'public', confirmPublic: true })
        if (tool === 'transcribe') setTranscript((await response.json()).text)
        else setMedia(await response.blob())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The request could not be completed.')
    } finally {
      setBusy(false)
    }
  }

  const available = status && (tool === 'review' ? status.review : local ? status.ocr : status.media)
  const accept = local ? 'application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png' : 'audio/*'
  return <div className="grid gap-4">
    {!status && !error && <p role="status">Checking your SWK ONE tools seat…</p>}
    {status && !available && <p role="status">This tool needs administrator setup.</p>}
    {available && <form onSubmit={submit} className="grid gap-3">
      <fieldset disabled={busy} className="grid gap-3">
        <p className="text-sm">
          {local ? 'PDFs up to 10 pages and PNG or JPEG images up to 6 MiB per file. Processing stays on the configured SWK server and private review endpoint.'
            : tool === 'transcribe' ? 'Choose a public audio clip of up to 60 seconds. Cloudflare processes the audio.'
            : tool === 'speak' ? 'Generate an English MP3 from approved public text using Cloudflare.'
            : 'Generate a concept image using Cloudflare. Review it before publishing.'}
        </p>
        {upload ? <label className="grid gap-1 text-sm">{tool === 'review' ? 'Document A' : 'Source file'}
          <input type="file" accept={accept} required onChange={event => { setFile(event.target.files?.[0]); setConfirmed(false) }} />
        </label> : <label className="grid gap-1 text-sm">{tool === 'image' ? 'Image prompt' : 'English text'}
          <textarea className="input min-h-28" value={text} maxLength={limit} required
            onChange={event => { setText(event.target.value); setConfirmed(false) }} />
        </label>}
        {tool === 'review' && <label className="grid gap-1 text-sm">Document B to compare (optional)
          <input type="file" accept={accept} onChange={event => setComparison(event.target.files?.[0])} />
        </label>}
        {local ? <label className="grid gap-1 text-sm">OCR language
          <select className="select" value={language} onChange={event => setLanguage(event.target.value)}>
            <option value="eng">English</option><option value="ara">Arabic</option><option value="eng+ara">English and Arabic</option>
          </select>
        </label> : <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={confirmed} required onChange={event => setConfirmed(event.target.checked)} />
          I confirm this contains only approved public material.
        </label>}
        <button className="btn green justify-self-start" type="submit" disabled={!local && !confirmed}>
          {busy ? 'Processing…' : labels[tool]}
        </button>
      </fieldset>
    </form>}
    {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
    {pages?.map(page => <section className="card p-3" key={page.page}>
      <h3 className="font-semibold">Page {page.page} · {page.ocr ? 'OCR' : 'PDF text'}</h3>
      <p dir="auto" className="whitespace-pre-wrap break-words">{page.text || 'No text found.'}</p>
    </section>)}
    {review && <section className="card p-3 grid gap-3">
      <h3 className="font-semibold">Review draft</h3>
      <p className="text-sm">Verify the findings against the originals before acting.</p>
      {review.truncated && <p className="text-sm">The review used the first 1,000 normalized characters per page. Split dense pages for a fuller review.</p>}
      {review.rejectedFindings > 0 && <p className="text-sm">{review.rejectedFindings} findings were omitted because their evidence did not match the source.</p>}
      <p dir="auto">{review.summary}</p>
      {review.findings.map((finding, index) => <article key={index} className="border-t pt-2">
        <h4 className="font-semibold capitalize">{finding.category}</h4>
        <p dir="auto">{finding.note}</p>
        {finding.evidence.map((item, i) => <blockquote key={i} className="border-s-2 ps-2 mt-1">
          <span className="text-xs text-muted">Document {item.document} · page {item.page}</span>
          <p dir="auto">{item.quote}</p>
        </blockquote>)}
      </article>)}
      {review.questions.length > 0 && <><h4 className="font-semibold">Questions to verify</h4>
        <ul className="list-disc ps-5">{review.questions.map((question, i) => <li key={i} dir="auto">{question}</li>)}</ul></>}
    </section>}
    {transcript !== undefined && <p dir="auto" className="card p-3 whitespace-pre-wrap">{transcript || 'No speech detected.'}</p>}
    {mediaUrl && (tool === 'speak' ? <audio src={mediaUrl} controls /> : <img src={mediaUrl} alt="Generated concept" className="max-w-full rounded-lg" />)}
    {mediaUrl && <a className="btn outline justify-self-start" href={mediaUrl}
      download={tool === 'speak' ? 'swk-one-speech.mp3' : media?.type === 'image/png' ? 'swk-one-concept.png' : 'swk-one-concept.jpg'}>Download</a>}
  </div>
}
