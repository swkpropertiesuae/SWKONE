import { useState, type FormEvent } from 'react'
import { post } from '../lib/api'
import { OllamaStudio } from './OllamaStudio'
import { OneDedicatedTools, type DedicatedTool } from './OneDedicatedTools'
import {
  QrVcardStudio,
  AreaCurrencyConverter,
  WhatsAppPortalFormatter,
  SmartDocGenerator,
  UaeComplianceValidator,
  LeadDataStudio,
  VoiceNotesStudio,
  UtmCampaignBuilder,
} from './OnePremiumUtilities'

const dedicated = new Set(['ocr', 'review', 'transcribe', 'speak', 'image'])

export const tasks = {
  // Core & Client Communications
  reply: 'Client reply (Email / Portal)',
  whatsapp_followup: 'WhatsApp VIP Follow-Up',
  cold_outreach: 'Investor & Landlord Outreach',
  objection_handler: 'Buyer / Seller Objection Handler',
  negotiation_script: 'Price & Terms Negotiation Script',
  apology_escalation: 'Service Recovery & Escalation Reply',
  // Listings, Portals & Marketing
  listing_copy: 'Portal Listing Copy (PF / Bayut / Dubizzle)',
  seo: 'SEO Metadata & Schema Keywords',
  campaign: 'Multi-Channel Social Campaign',
  video_walkthrough: 'Reels / TikTok / YouTube Walkthrough Script',
  brochure_copy: 'Luxury Project Brochure Copy',
  press_release: 'Real Estate PR & Launch Announcement',
  // DLD, RERA & Legal Contracts
  rera_forms: 'RERA Form A / B / F (MOU) Special Conditions',
  ejari_addendum: 'Ejari Tenancy Additional Terms Addendum',
  noc_letter: 'Developer / Landlord NOC Request Letter',
  loi_generator: 'Formal Letter of Intent (LOI) Draft',
  poa_checklist: 'Power of Attorney (POA) & DLD Transfer Checklist',
  rera_dispute: 'RERA / RDC Rental Dispute Case Brief',
  // Financial, ROI & Investment Advisory
  cma_report: 'Comparative Market Analysis (CMA) Narrative',
  roi_memo: 'Investor ROI & Cash-Flow Memorandum',
  offplan_comparison: 'Off-Plan vs. Ready Property Comparison',
  mortgage_advisory: 'UAE Non-Resident & Resident Mortgage Brief',
  golden_visa_brief: '10-Year UAE Golden Visa Property Qualification',
  closing_statement: 'DLD Transfer Financial Closing Statement',
  // Operations, Compliance & Intelligence
  kyc_aml_memo: 'AML / KYC & goAML Risk Assessment Memo',
  snagging_report: 'Property Snagging & Handover Defect Report',
  meeting_minutes: 'Structured Client / Board Meeting Minutes',
  sop_drafter: 'Brokerage Standard Operating Procedure (SOP)',
  data_extractor: 'Unstructured Text → Structured Deal Table',
  sentiment_scorer: 'Lead Intent, Urgency & Sentiment Scorer',
  translate: 'Multilingual Real Estate Translation',
  summary: 'Executive Document & Thread Summary',
  chat: 'Ask SWK ONE (UAE Real Estate Copilot)',
} as const

const TASK_PRESETS: Partial<Record<keyof typeof tasks, string>> = {
  reply: 'Buyer inquired about a 2BR in Dubai Marina (AED 3.1M, 1,380 sqft, full marina view, vacant on transfer). Confirm availability and propose a viewing tomorrow at 4 PM.',
  whatsapp_followup: 'Client viewed Downtown Views II unit 3104 yesterday (AED 3.6M). Send a warm WhatsApp follow-up with ROI highlights (6.8% net) and Form F next steps.',
  objection_handler: 'Buyer says the 4% DLD fee and AED 22/sqft service charge make the unit expensive compared to off-plan. Address with ready rental cash-flow math.',
  listing_copy: '3BR + Maid Penthouse in Address Harbour Point, Dubai Creek Harbour. 2,420 sqft, Burj Khalifa skyline view, AED 7.9M, Trakheesi Permit #7148920154.',
  rera_forms: 'Draft 6 protective Form F (MOU) special conditions for a mortgaged villa sale in Dubai Hills Estate where Seller settles existing bank liability prior to NOC.',
  ejari_addendum: 'Draft Ejari additional terms for a 1-year lease in Business Bay (AED 145,000 in 2 cheques): landlord covers major MEP above AED 500, tenant covers minor maintenance under AED 500.',
  cma_report: 'Prepare a CMA valuation brief for a 2BR apartment in Marina Gate 1 (1,345 sqft, mid-floor). Recent DLD transfers: AED 3.15M, AED 3.28M, AED 3.35M.',
  roi_memo: 'Prepare an investment memo for a studio + 1BR portfolio in JVC totaling AED 1.95M generating AED 168,000 gross annual rent.',
  golden_visa_brief: 'Explain 10-year UAE Golden Visa eligibility for an investor purchasing an off-plan unit at AED 2.4M with a 50/50 payment plan.',
  kyc_aml_memo: 'Prepare a UAE goAML compliance assessment for an international buyer purchasing a AED 5.5M apartment via corporate manager cheque and bank wire.',
}

async function exportPhoto(
  file: File,
  size: number,
  options: { format: 'image/webp' | 'image/jpeg' | 'image/png'; quality: number; watermark: boolean; watermarkText: string; brightness: number; contrast: number }
) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 20_000_000) {
    throw new Error('Choose a JPEG, PNG or WebP photo under 20 MB.')
  }
  const image = await createImageBitmap(file)
  try {
    const scale = Math.min(1, size / Math.max(image.width, image.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.width * scale))
    canvas.height = Math.max(1, Math.round(image.height * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Photo export is unavailable in this browser.')
    context.filter = `brightness(${options.brightness}%) contrast(${options.contrast}%)`
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    context.filter = 'none'

    if (options.watermark && options.watermarkText.trim()) {
      const fontSize = Math.max(14, Math.round(canvas.width * 0.022))
      context.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`
      const text = options.watermarkText.trim()
      const pad = Math.round(fontSize * 0.8)
      const metrics = context.measureText(text)
      const boxW = metrics.width + pad * 2
      const boxH = fontSize + pad
      const x = canvas.width - boxW - pad
      const y = canvas.height - boxH - pad
      context.fillStyle = 'rgba(15, 23, 42, 0.72)'
      context.fillRect(x, y, boxW, boxH)
      context.fillStyle = '#ffffff'
      context.fillText(text, x + pad, y + fontSize + Math.round(pad * 0.2))
    }

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, options.format, options.quality))
    if (!blob) throw new Error('Photo could not be exported.')
    const ext = options.format === 'image/webp' ? 'webp' : options.format === 'image/jpeg' ? 'jpg' : 'png'
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `swk-one-photo-${size}px.${ext}`
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
  const [tone, setTone] = useState('Executive Luxury')
  const [language, setLanguage] = useState('English (UAE)')
  const [engineMode, setEngineMode] = useState<'smart' | 'gateway'>('smart')
  const [confirmed, setConfirmed] = useState(false)
  const [output, setOutput] = useState<{ text: string; provider: string; model: string }>()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Photo Studio Pro state
  const [photo, setPhoto] = useState<File>()
  const [size, setSize] = useState(1600)
  const [photoFormat, setPhotoFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp')
  const [photoQuality, setPhotoQuality] = useState(90)
  const [photoWatermark, setPhotoWatermark] = useState(true)
  const [watermarkText, setWatermarkText] = useState('SWK Properties L.L.C · RERA ORN 51517')
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [photoError, setPhotoError] = useState('')
  const [photoBusy, setPhotoBusy] = useState(false)

  // PDF Suite Pro state
  const [pdfs, setPdfs] = useState<File[]>([])
  const [pageOrder, setPageOrder] = useState('')
  const [rotation, setRotation] = useState(0)
  const [pdfStamp, setPdfStamp] = useState('')
  const [pdfPageNumbers, setPdfPageNumbers] = useState(true)
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
      if (engineMode === 'gateway') {
        setOutput(await post('/api/one/ai/text', { task, text, classification: 'public', confirmPublic: true }))
      } else {
        try {
          setOutput(await post('/api/one/ai/execute', { task, text, tone, language, classification: 'public', confirmPublic: true }))
        } catch {
          setOutput(await post('/api/one/ai/text', { task, text, classification: 'public', confirmPublic: true }))
        }
      }
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
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1 text-sm sm:col-span-1">AI Task ({Object.keys(tasks).length} specialized tasks)
          <select className="select" value={task} onChange={event => setTask(event.target.value as keyof typeof tasks)}>
            {Object.entries(tasks).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm">Tone & Style
          <select className="select" value={tone} onChange={event => setTone(event.target.value)}>
            <option value="Executive Luxury">Executive Luxury</option>
            <option value="Warm & Consultative">Warm & Consultative</option>
            <option value="Concise & Direct">Concise & Direct</option>
            <option value="Formal Legal / RERA">Formal Legal / RERA</option>
            <option value="High-Converting Sales">High-Converting Sales</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">Output Language
          <select className="select" value={language} onChange={event => setLanguage(event.target.value)}>
            <option value="English (UAE)">English (UAE)</option>
            <option value="Arabic (العربية)">Arabic (العربية)</option>
            <option value="Bilingual English + Arabic">Bilingual English + Arabic</option>
            <option value="Russian (Русский)">Russian (Русский)</option>
            <option value="Chinese (中文)">Chinese (中文)</option>
            <option value="French (Français)">French (Français)</option>
            <option value="Hindi / Urdu">Hindi / Urdu</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-muted">Quick Scenario:</span>
          {TASK_PRESETS[task] && (
            <button
              type="button"
              className="btn outline sm"
              onClick={() => { setText(TASK_PRESETS[task] || ''); setConfirmed(true) }}
            >
              Load Sample Prompt for {tasks[task]}
            </button>
          )}
        </div>
        <label className="flex items-center gap-1.5">
          <span className="text-muted">Engine:</span>
          <select className="select text-xs py-1" value={engineMode} onChange={e => setEngineMode(e.target.value as 'smart' | 'gateway')}>
            <option value="smart">Smart Multi-Engine (Cloud + OS + Local + UAE Domain)</option>
            <option value="gateway">Strict Cloud Gateway (/api/one/ai/text)</option>
          </select>
        </label>
      </div>

      <label className="grid gap-1 text-sm">Instructions and approved public material
        <textarea className="input min-h-32" maxLength={6000} dir="auto" value={text}
          onChange={event => { setText(event.target.value); setConfirmed(false) }} required />
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />
        I confirm this contains only approved public information.
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn green justify-self-start" disabled={busy || !confirmed || !text.trim()}>
          {busy ? 'Generating…' : 'Generate'}
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      {output && <div className="card p-3 grid gap-2">
        <div className="text-xs text-muted">{output.provider} · {output.model}</div>
        <p dir="auto" className="whitespace-pre-wrap break-words">{output.text}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn outline sm justify-self-start" onClick={async () => {
            try { await navigator.clipboard.writeText(output.text); setCopyStatus('Copied.') }
            catch { setCopyStatus('Select the response to copy it manually.') }
          }}>Copy response</button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(output.text)}`}
            target="_blank"
            rel="noreferrer"
            className="btn outline sm"
          >
            Share to WhatsApp
          </a>
          <button
            type="button"
            className="btn outline sm"
            onClick={() => {
              const url = URL.createObjectURL(new Blob([output.text], { type: 'text/markdown;charset=utf-8' }))
              const a = document.createElement('a')
              a.href = url
              a.download = `swk-ai-${task}.md`
              a.click()
              setTimeout(() => URL.revokeObjectURL(url), 5000)
            }}
          >
            Download .MD
          </button>
        </div>
        <span role="status" className="text-xs text-muted">{copyStatus}</span>
      </div>}
    </form>}

    {tab === 'private' && <OllamaStudio compact={compact} />}

    {tab === 'pdf' && <div className="grid gap-3 text-sm">
      <p>Merge up to 20 PDFs, extract/reorder pages, rotate, stamp RERA/Confidential watermarks, and number pages locally on your device.</p>
      <label className="grid gap-1">PDF files
        <input type="file" multiple accept="application/pdf,.pdf"
          onChange={event => { setPdfs(Array.from(event.target.files || [])); setPageOrder(''); setPdfError('') }} />
      </label>
      <ol className="list-decimal ps-5">{pdfs.slice(0, 20).map((file, index) => <li key={index}>{file.name} ({Math.round(file.size / 1024)} KB)</li>)}</ol>
      {pdfs.length === 1 && <label className="grid gap-1">Page order or extract list (optional)
        <input className="input" value={pageOrder} maxLength={1200} placeholder="Example: 3,1,2"
          onChange={event => setPageOrder(event.target.value)} />
      </label>}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1">Rotate selected pages clockwise
          <select className="select" value={rotation} onChange={event => setRotation(Number(event.target.value))}>
            {[0, 90, 180, 270].map(angle => <option key={angle} value={angle}>{angle}°</option>)}
          </select>
        </label>
        <label className="grid gap-1">Stamp Watermark (optional)
          <input className="input" value={pdfStamp} onChange={e => setPdfStamp(e.target.value)} placeholder="e.g. CONFIDENTIAL · SWK ORN 51517" />
        </label>
        <label className="flex items-center gap-2 pt-5">
          <input type="checkbox" checked={pdfPageNumbers} onChange={e => setPdfPageNumbers(e.target.checked)} />
          Add Footer & Page Numbers
        </label>
      </div>
      <button type="button" className="btn green justify-self-start" disabled={pdfBusy || !pdfs.length}
        onClick={async () => {
          setPdfError('')
          if (pdfs.length > 20 || pdfs.reduce((sum, file) => sum + file.size, 0) > 50_000_000) {
            setPdfError('Choose up to 20 PDFs under 50 MB combined.')
            return
          }
          setPdfBusy(true)
          try {
            const { PDFDocument, degrees, rgb, StandardFonts } = await import('pdf-lib')
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
            if (pdfStamp.trim() || pdfPageNumbers) {
              const font = await merged.embedFont(StandardFonts.HelveticaBold)
              const allPages = merged.getPages()
              allPages.forEach((p, idx) => {
                const { width, height } = p.getSize()
                if (pdfStamp.trim()) {
                  p.drawText(pdfStamp.trim(), {
                    x: Math.max(24, width * 0.15),
                    y: height * 0.5,
                    size: 22,
                    font,
                    color: rgb(0.75, 0.15, 0.15),
                    opacity: 0.22,
                    rotate: degrees(30),
                  })
                }
                if (pdfPageNumbers) {
                  p.drawText(`Page ${idx + 1} of ${allPages.length} · SWK Properties L.L.C (ORN 51517)`, {
                    x: 28,
                    y: 16,
                    size: 8,
                    font,
                    color: rgb(0.35, 0.4, 0.45),
                  })
                }
              })
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
      <p>Resize, optimize format, adjust lighting, and stamp RERA compliance watermarks on listing photos locally on this device (EXIF metadata stripped automatically).</p>
      <label className="grid gap-1">Photo
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setPhoto(event.target.files?.[0])} />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1">Maximum edge
          <select className="select" value={size} onChange={event => setSize(Number(event.target.value))}>
            <option value="1080">1080 px (Instagram / WhatsApp)</option>
            <option value="1200">1200 px (Social OG Share)</option>
            <option value="1600">1600 px (Standard Portal)</option>
            <option value="1920">1920 px (Full HD 1080p)</option>
            <option value="2048">2048 px (PF / Bayut SuperHot HD)</option>
            <option value="3840">3840 px (4K Brochure Print)</option>
          </select>
        </label>
        <label className="grid gap-1">Output Format
          <select className="select" value={photoFormat} onChange={e => setPhotoFormat(e.target.value as any)}>
            <option value="image/webp">WebP (Portal High Speed)</option>
            <option value="image/jpeg">JPEG (Universal Compatibility)</option>
            <option value="image/png">PNG (Lossless Graphic)</option>
          </select>
        </label>
        <label className="grid gap-1">Compression Quality ({photoQuality}%)
          <input type="range" min={60} max={100} step={5} value={photoQuality} onChange={e => setPhotoQuality(Number(e.target.value))} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1">Brightness ({brightness}%)
          <input type="range" min={75} max={135} step={5} value={brightness} onChange={e => setBrightness(Number(e.target.value))} />
        </label>
        <label className="grid gap-1">Contrast ({contrast}%)
          <input type="range" min={80} max={135} step={5} value={contrast} onChange={e => setContrast(Number(e.target.value))} />
        </label>
        <label className="grid gap-1">Watermark Badge Text
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={photoWatermark} onChange={e => setPhotoWatermark(e.target.checked)} />
            <input className="input flex-1" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} />
          </div>
        </label>
      </div>
      <button type="button" className="btn green justify-self-start" disabled={!photo || photoBusy}
        onClick={async () => {
          if (!photo || photoBusy) return
          setPhotoBusy(true)
          setPhotoError('')
          try {
            await exportPhoto(photo, size, {
              format: photoFormat,
              quality: photoQuality / 100,
              watermark: photoWatermark,
              watermarkText,
              brightness,
              contrast,
            })
          }
          catch (err) { setPhotoError(err instanceof Error ? err.message : 'Export failed.') }
          finally { setPhotoBusy(false) }
        }}>{photoBusy ? 'Resizing…' : 'Download resized photo'}</button>
      {photoError && <p role="alert" className="text-red-800">{photoError}</p>}
    </div>}

    {tab === 'qr' && <QrVcardStudio />}
    {tab === 'converter' && <AreaCurrencyConverter />}
    {tab === 'whatsapp' && <WhatsAppPortalFormatter />}
    {tab === 'docgen' && <SmartDocGenerator />}
    {tab === 'validator' && <UaeComplianceValidator />}
    {tab === 'datastudio' && <LeadDataStudio />}
    {tab === 'voicenotes' && <VoiceNotesStudio />}
    {tab === 'utm' && <UtmCampaignBuilder />}
  </section>
}
