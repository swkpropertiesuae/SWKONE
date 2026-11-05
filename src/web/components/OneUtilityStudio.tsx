import { useState, type FormEvent } from 'react'
import { post } from '../lib/api'
import { OllamaStudio } from './OllamaStudio'
import { OneDedicatedTools, type DedicatedTool } from './OneDedicatedTools'

const dedicated = new Set(['ocr', 'review', 'transcribe', 'speak', 'image'])

const tasks = {
  reply: 'Client reply',
  translate: 'Translation',
  seo: 'SEO metadata',
  campaign: 'Social campaign',
  summary: 'Summary',
  chat: 'Ask SWK ONE',
}

async function exportPhoto(file: File, size: number) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 12_000_000) {
    throw new Error('Choose a JPEG, PNG or WebP photo under 12 MB.')
  }
  const image = await createImageBitmap(file)
  try {
    const scale = Math.min(1, size / Math.max(image.width, image.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.width * scale))
    canvas.height = Math.max(1, Math.round(image.height * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Photo export is unavailable in this browser.')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', 0.9))
    if (!blob) throw new Error('Photo could not be exported.')
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = blob.type === 'image/webp' ? 'swk-one-photo.webp' : 'swk-one-photo.png'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 30_000)
  } finally {
    image.close()
  }
}

export function OneUtilityStudio({ compact = false }: { compact?: boolean }) {
  const [tab, setTab] = useState('cloud')
  const [task, setTask] = useState<keyof typeof tasks>('reply')
  const [text, setText] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [output, setOutput] = useState<{ text: string; provider: string; model: string }>()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [photo, setPhoto] = useState<File>()
  const [size, setSize] = useState(1080)
  const [photoError, setPhotoError] = useState('')
  const [photoBusy, setPhotoBusy] = useState(false)
  const [pdfs, setPdfs] = useState<File[]>([])
  const [pageOrder, setPageOrder] = useState('')
  const [rotation, setRotation] = useState(0)
  const [pdfBusy, setPdfBusy] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [copyStatus, setCopyStatus] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (busy || !confirmed || !text.trim()) return
    setBusy(true)
    setError('')
    setOutput(undefined)
    setCopyStatus('')
    try {
      setOutput(await post('/api/one/ai/text', { task, text, classification: 'public', confirmPublic: true }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cloud AI is unavailable.')
    } finally {
      setBusy(false)
    }
  }

  return <section aria-label="SWK ONE Utility Studio" className="grid gap-4">
    <div
      className="rounded-2xl p-4 text-white border border-[#B68F70]/40 flex flex-wrap items-center justify-between gap-4 shadow-md"
      style={{ background: 'linear-gradient(135deg, #041615 0%, #0a2e2c 55%, #11423e 100%)' }}
    >
      <div className="flex items-center gap-3.5">
        <img
          src="/brand/one/portal-arch-emblem.png"
          alt="SWK ONE Portal Arch"
          className="h-11 w-11 object-contain drop-shadow-md"
        />
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#E0C1A3] font-bold">
            SWK ONE · Private &amp; Cloud AI Studio
          </div>
          <div className="font-display font-bold text-base text-white">
            Executive Brokerage Intelligence &amp; Document Utilities
          </div>
        </div>
      </div>
      <img
        src="/brand/one/primary-logo.png"
        alt="SWK ONE"
        className="h-9 w-auto object-contain opacity-95 hidden sm:block"
      />
    </div>
    <div className="flex flex-wrap gap-2">
      {[['cloud', 'Cloud AI'], ['private', 'Local Ollama'], ['photo', 'Photo Resize'], ['pdf', 'PDF Tools'], ['ocr', 'OCR'], ['review', 'Document Review'], ['transcribe', 'Speech to Text'], ['speak', 'Text to Speech'], ['image', 'Image Generation']].map(([key, label]) =>
        <button type="button" key={key} className={tab === key ? 'btn green sm' : 'btn outline sm'}
          aria-pressed={tab === key} onClick={() => setTab(key)}>{label}</button>
      )}
    </div>
    {dedicated.has(tab) && <OneDedicatedTools key={tab} tool={tab as DedicatedTool} />}
    {tab === 'cloud' && <form onSubmit={submit} className="grid gap-3">
      <label className="grid gap-1 text-sm">Task
        <select className="select" value={task} onChange={event => setTask(event.target.value as keyof typeof tasks)}>
          {Object.entries(tasks).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm">Instructions and approved public material
        <textarea className="input min-h-32" maxLength={6000} dir="auto" value={text}
          onChange={event => { setText(event.target.value); setConfirmed(false) }} required />
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />
        I confirm this contains only approved public information.
      </label>
      <button type="submit" className="btn green justify-self-start" disabled={busy || !confirmed || !text.trim()}>
        {busy ? 'Generating…' : 'Generate'}
      </button>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      {output && <div className="card p-3 grid gap-2">
        <div className="text-xs text-muted">{output.provider} · {output.model}</div>
        <p dir="auto" className="whitespace-pre-wrap break-words">{output.text}</p>
        <button type="button" className="btn outline sm justify-self-start" onClick={async () => {
          try { await navigator.clipboard.writeText(output.text); setCopyStatus('Copied.') }
          catch { setCopyStatus('Select the response to copy it manually.') }
        }}>Copy response</button>
        <span role="status" className="text-xs text-muted">{copyStatus}</span>
      </div>}
    </form>}
    {tab === 'private' && <OllamaStudio compact={compact} />}
    {tab === 'pdf' && <div className="grid gap-3 text-sm">
      <p>Merge up to five PDFs, or select and reorder pages from one PDF. Files stay on this device.</p>
      <label className="grid gap-1">PDF files
        <input type="file" multiple accept="application/pdf,.pdf"
          onChange={event => { setPdfs(Array.from(event.target.files || [])); setPageOrder(''); setPdfError('') }} />
      </label>
      <ol className="list-decimal ps-5">{pdfs.slice(0, 5).map((file, index) => <li key={index}>{file.name}</li>)}</ol>
      {pdfs.length === 1 && <label className="grid gap-1">Page order (optional)
        <input className="input" value={pageOrder} maxLength={1200} placeholder="Example: 3,1,2"
          onChange={event => setPageOrder(event.target.value)} />
      </label>}
      <label className="grid gap-1">Rotate selected pages clockwise
        <select className="select" value={rotation} onChange={event => setRotation(Number(event.target.value))}>
          {[0, 90, 180, 270].map(angle => <option key={angle} value={angle}>{angle}°</option>)}
        </select>
      </label>
      <button type="button" className="btn green justify-self-start" disabled={pdfBusy || !pdfs.length}
        onClick={async () => {
          setPdfError('')
          if (pdfs.length > 5 || pdfs.reduce((sum, file) => sum + file.size, 0) > 20_000_000) {
            setPdfError('Choose up to five PDFs under 20 MB combined.')
            return
          }
          setPdfBusy(true)
          try {
            const { PDFDocument, degrees } = await import('pdf-lib')
            const merged = await PDFDocument.create()
            for (const file of pdfs) {
              const source = await PDFDocument.load(await file.arrayBuffer())
              const pages = pdfs.length === 1 && pageOrder.trim()
                ? pageOrder.split(',').map(value => /^\d+$/.test(value.trim()) ? Number(value) - 1 : NaN)
                : source.getPageIndices()
              if (!pages.length || pages.some(page => !Number.isInteger(page) || page < 0 || page >= source.getPageCount())) {
                throw new Error('Enter valid page numbers separated by commas.')
              }
              if (merged.getPageCount() + pages.length > 250) throw new Error('The output PDF exceeds 250 pages.')
              for (const page of await merged.copyPages(source, pages)) {
                if (rotation) page.setRotation(degrees((page.getRotation().angle + rotation) % 360))
                merged.addPage(page)
              }
            }
            const url = URL.createObjectURL(new Blob([new Uint8Array(await merged.save())], { type: 'application/pdf' }))
            const link = document.createElement('a')
            link.href = url
            link.download = 'swk-one-document.pdf'
            link.click()
            setTimeout(() => URL.revokeObjectURL(url), 30_000)
          } catch (err) {
            setPdfError(err instanceof Error ? err.message : 'PDF merge failed.')
          } finally {
            setPdfBusy(false)
          }
        }}>{pdfBusy ? 'Preparing…' : 'Download PDF'}</button>
      {pdfError && <p role="alert" className="text-red-800">{pdfError}</p>}
    </div>}
    {tab === 'photo' && <div className="grid gap-3 text-sm">
      <p>Your photo is resized on this device and downloaded directly.</p>
      <label className="grid gap-1">Photo
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setPhoto(event.target.files?.[0])} />
      </label>
      <label className="grid gap-1">Maximum edge
        <select className="select" value={size} onChange={event => setSize(Number(event.target.value))}>
          <option value="1080">1080 px</option><option value="1600">1600 px</option><option value="2048">2048 px</option>
        </select>
      </label>
      <button type="button" className="btn green justify-self-start" disabled={!photo || photoBusy}
        onClick={async () => {
          if (!photo || photoBusy) return
          setPhotoBusy(true)
          setPhotoError('')
          try { await exportPhoto(photo, size) }
          catch (err) { setPhotoError(err instanceof Error ? err.message : 'Export failed.') }
          finally { setPhotoBusy(false) }
        }}>{photoBusy ? 'Resizing…' : 'Download resized photo'}</button>
      {photoError && <p role="alert" className="text-red-800">{photoError}</p>}
    </div>}
  </section>
}
