import React, { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download, Copy, Check, QrCode, ArrowLeftRight, MessageSquare, FileText, ShieldCheck, Database, Mic, MicOff, Link2, Sparkles, Printer } from 'lucide-react'

const num = (v: number, d = 0) => new Intl.NumberFormat('en-AE', { maximumFractionDigits: d, minimumFractionDigits: d }).format(Number.isFinite(v) ? v : 0)

function copyText(text: string, onDone?: () => void) {
  navigator.clipboard?.writeText(text)
  onDone?.()
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

function downloadText(text: string, name: string, mime = 'text/plain;charset=utf-8') {
  downloadBlob(new Blob([text], { type: mime }), name)
}

/* ============================================================================
 * 1. QR & Digital vCard 3.0 Studio
 * ========================================================================== */
export function QrVcardStudio() {
  const [mode, setMode] = useState<'vcard' | 'whatsapp' | 'url' | 'wifi' | 'location'>('vcard')
  const [name, setName] = useState('Tariq Al-Mansoori')
  const [title, setTitle] = useState('Senior Property Consultant')
  const [company, setCompany] = useState('SWK Properties L.L.C (ORN 51517)')
  const [phone, setPhone] = useState('+971501234567')
  const [email, setEmail] = useState('tariq@swkproperties.ae')
  const [website, setWebsite] = useState('https://swkproperties.ae')
  const [brn, setBrn] = useState('BRN-64821')
  const [waPhone, setWaPhone] = useState('971501234567')
  const [waText, setWaText] = useState('Assalamu Alaikum, I am interested in your Dubai property listing (Trakheesi Permit verified).')
  const [url, setUrl] = useState('https://swkproperties.ae/listings/dubai-marina-penthouse')
  const [ssid, setSsid] = useState('SWK_VIP_LOUNGE')
  const [wifiPass, setWifiPass] = useState('DubaiLuxury2026')
  const [lat, setLat] = useState('25.1972')
  const [lng, setLng] = useState('55.2744')
  const [fgColor, setFgColor] = useState('#0f172a')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState(320)
  const [pngUrl, setPngUrl] = useState('')
  const [svgText, setSvgText] = useState('')
  const [copied, setCopied] = useState(false)

  const payload = useMemo(() => {
    if (mode === 'vcard') {
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${name}`,
        `ORG:${company}`,
        `TITLE:${title} (${brn})`,
        `TEL;TYPE=CELL,VOICE:${phone}`,
        `EMAIL;TYPE=PREF,INTERNET:${email}`,
        `URL:${website}`,
        `NOTE:RERA Licensed Broker ${brn} - ${company}`,
        'END:VCARD',
      ].join('\n')
    }
    if (mode === 'whatsapp') {
      const clean = waPhone.replace(/[^\d]/g, '')
      return `https://wa.me/${clean}?text=${encodeURIComponent(waText)}`
    }
    if (mode === 'wifi') {
      return `WIFI:T:WPA;S:${ssid};P:${wifiPass};;`
    }
    if (mode === 'location') {
      return `https://maps.google.com/?q=${lat.trim()},${lng.trim()}`
    }
    return url
  }, [mode, name, title, company, phone, email, website, brn, waPhone, waText, url, ssid, wifiPass, lat, lng])

  useEffect(() => {
    let active = true
    QRCode.toDataURL(payload || 'https://swkproperties.ae', {
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    })
      .then((u) => { if (active) setPngUrl(u) })
      .catch(() => {})
    QRCode.toString(payload || 'https://swkproperties.ae', {
      type: 'svg',
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    })
      .then((s) => { if (active) setSvgText(s) })
      .catch(() => {})
    return () => { active = false }
  }, [payload, size, fgColor, bgColor])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">QR & Digital vCard 3.0 Studio</h3>
          <p className="text-xs text-slate-500">Generate high-resolution QR codes for RERA Broker vCards, WhatsApp lead capture, Trakheesi portals, VIP Wi-Fi & viewing pins.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {([
            ['vcard', 'Broker vCard 3.0'],
            ['whatsapp', 'WhatsApp Lead Link'],
            ['url', 'Trakheesi / Portal URL'],
            ['wifi', 'Office / Villa Wi-Fi'],
            ['location', 'Viewing Pin (Maps)'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${mode === id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-7">
          {mode === 'vcard' && (
            <div className="grid gap-2.5 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-700">Agent Full Name
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
              <label className="text-xs font-medium text-slate-700">Job Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
              <label className="text-xs font-medium text-slate-700">Brokerage & ORN
                <input value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
              <label className="text-xs font-medium text-slate-700">RERA BRN Number
                <input value={brn} onChange={(e) => setBrn(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
              <label className="text-xs font-medium text-slate-700">Mobile (E.164)
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
              <label className="text-xs font-medium text-slate-700">Email Address
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
              <label className="text-xs font-medium text-slate-700 sm:col-span-2">Website / Portfolio URL
                <input value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
            </div>
          )}

          {mode === 'whatsapp' && (
            <div className="space-y-2.5">
              <label className="block text-xs font-medium text-slate-700">WhatsApp Number (with country code, e.g. 971501234567)
                <input value={waPhone} onChange={(e) => setWaPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
              <label className="block text-xs font-medium text-slate-700">Pre-filled Lead Message
                <textarea value={waText} onChange={(e) => setWaText(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
            </div>
          )}

          {mode === 'url' && (
            <label className="block text-xs font-medium text-slate-700">Target Listing / Trakheesi Verification URL
              <input value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
            </label>
          )}

          {mode === 'wifi' && (
            <div className="grid gap-2.5 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-700">Wi-Fi Network Name (SSID)
                <input value={ssid} onChange={(e) => setSsid(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
              <label className="text-xs font-medium text-slate-700">Wi-Fi Password (WPA2/WPA3)
                <input value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
            </div>
          )}

          {mode === 'location' && (
            <div className="grid gap-2.5 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-700">Latitude (e.g. Downtown Dubai)
                <input value={lat} onChange={(e) => setLat(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
              <label className="text-xs font-medium text-slate-700">Longitude
                <input value={lng} onChange={(e) => setLng(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <label className="text-xs font-medium text-slate-700">Foreground
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="mt-1 h-9 w-full cursor-pointer rounded border border-slate-300" />
            </label>
            <label className="text-xs font-medium text-slate-700">Background
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="mt-1 h-9 w-full cursor-pointer rounded border border-slate-300" />
            </label>
            <label className="text-xs font-medium text-slate-700">Resolution ({size}px)
              <input type="range" min={200} max={600} step={40} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-2 w-full" />
            </label>
          </div>

          <div className="rounded-lg bg-slate-50 p-2.5 text-xs font-mono text-slate-600 break-all">
            {payload}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 lg:col-span-5">
          {pngUrl && <img src={pngUrl} alt="Generated QR Code" className="h-52 w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-sm" />}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {pngUrl && (
              <a
                href={pngUrl}
                download={`swk-qr-${mode}.png`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
              >
                <Download className="h-3.5 w-3.5" /> PNG
              </a>
            )}
            {svgText && (
              <button
                type="button"
                onClick={() => downloadText(svgText, `swk-qr-${mode}.svg`, 'image/svg+xml')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                <Download className="h-3.5 w-3.5" /> SVG Vector
              </button>
            )}
            {mode === 'vcard' && (
              <button
                type="button"
                onClick={() => downloadText(payload, `${name.toLowerCase().replace(/\s+/g, '-')}.vcf`, 'text/vcard')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                <Download className="h-3.5 w-3.5" /> .VCF Card
              </button>
            )}
            <button
              type="button"
              onClick={() => copyText(payload, () => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />} Copy Payload
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
 * 2. Area, Price/Sqft & Multi-Currency Deal Converter
 * ========================================================================== */
const FX_RATES: Record<string, { label: string; rateFromAed: number; symbol: string }> = {
  USD: { label: 'US Dollar (USD - Pegged)', rateFromAed: 1 / 3.6725, symbol: '$' },
  EUR: { label: 'Euro (EUR)', rateFromAed: 0.251, symbol: '€' },
  GBP: { label: 'British Pound (GBP)', rateFromAed: 0.214, symbol: '£' },
  SAR: { label: 'Saudi Riyal (SAR)', rateFromAed: 1.021, symbol: 'SAR ' },
  KWD: { label: 'Kuwaiti Dinar (KWD)', rateFromAed: 0.0838, symbol: 'KWD ' },
  QAR: { label: 'Qatari Riyal (QAR)', rateFromAed: 0.991, symbol: 'QAR ' },
  BHD: { label: 'Bahraini Dinar (BHD)', rateFromAed: 0.1026, symbol: 'BHD ' },
  OMR: { label: 'Omani Rial (OMR)', rateFromAed: 0.1048, symbol: 'OMR ' },
  CHF: { label: 'Swiss Franc (CHF)', rateFromAed: 0.241, symbol: 'CHF ' },
  RUB: { label: 'Russian Ruble (RUB)', rateFromAed: 24.8, symbol: '₽' },
  CNY: { label: 'Chinese Yuan (CNY)', rateFromAed: 1.97, symbol: '¥' },
  INR: { label: 'Indian Rupee (INR)', rateFromAed: 22.85, symbol: '₹' },
  PKR: { label: 'Pakistani Rupee (PKR)', rateFromAed: 75.8, symbol: 'Rs ' },
  CAD: { label: 'Canadian Dollar (CAD)', rateFromAed: 0.376, symbol: 'C$' },
  USDT: { label: 'Tether Stablecoin (USDT)', rateFromAed: 1 / 3.6725, symbol: 'USDT ' },
}

export function AreaCurrencyConverter() {
  const [sqft, setSqft] = useState(1450)
  const [priceAed, setPriceAed] = useState(3200000)
  const [targetCur, setTargetCur] = useState('USD')

  const sqm = sqft / 10.7639104
  const sqyd = sqft / 9
  const acres = sqft / 43560
  const hectares = sqm / 10000
  const psfAed = sqft > 0 ? priceAed / sqft : 0
  const psmAed = sqm > 0 ? priceAed / sqm : 0

  const fx = FX_RATES[targetCur] || FX_RATES.USD
  const foreignPrice = priceAed * fx.rateFromAed
  const foreignPsf = psfAed * fx.rateFromAed
  const foreignPsm = psmAed * fx.rateFromAed
  const dld4PctAed = priceAed * 0.04
  const down20PctAed = priceAed * 0.2

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">UAE Area, PSF/PSM & International Investor FX Converter</h3>
        <p className="text-xs text-slate-500">Convert DLD Title Deed Sq.M ↔ Sq.Ft, Price/Sq.Ft ↔ Price/Sq.M, and AED deal economics into 15 international buyer currencies.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs font-medium text-slate-700">Property Area (Sq.Ft)
          <input
            type="number"
            value={sqft}
            onChange={(e) => setSqft(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
          />
        </label>
        <label className="text-xs font-medium text-slate-700">Area in Sq.M (Title Deed Standard)
          <input
            type="number"
            value={Math.round(sqm * 100) / 100}
            onChange={(e) => setSqft(Math.max(0, Math.round(Number(e.target.value) * 10.7639104)))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
          />
        </label>
        <label className="text-xs font-medium text-slate-700">Property Price (AED)
          <input
            type="number"
            value={priceAed}
            onChange={(e) => setPriceAed(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-[11px] text-slate-500">Square Feet</div>
          <div className="text-sm font-bold text-slate-900">{num(sqft, 0)} sq.ft</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-[11px] text-slate-500">Square Meters (DLD)</div>
          <div className="text-sm font-bold text-slate-900">{num(sqm, 2)} sq.m</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-[11px] text-slate-500">Price / Sq.Ft</div>
          <div className="text-sm font-bold text-emerald-700">AED {num(psfAed, 0)}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-[11px] text-slate-500">Price / Sq.M</div>
          <div className="text-sm font-bold text-emerald-700">AED {num(psmAed, 0)}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-[11px] text-slate-500">Plot Acres / Hectares</div>
          <div className="text-xs font-bold text-slate-900">{num(acres, 3)} ac · {num(hectares, 3)} ha</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">International Investor Currency Breakdown</div>
          <select
            value={targetCur}
            onChange={(e) => setTargetCur(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold"
          >
            {Object.entries(FX_RATES).map(([code, info]) => (
              <option key={code} value={code}>{info.label}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs text-slate-500">Purchase Price ({targetCur})</div>
            <div className="text-base font-bold text-slate-900">{fx.symbol}{num(foreignPrice, 0)}</div>
            <div className="text-[11px] text-slate-400">AED {num(priceAed)}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs text-slate-500">Price / Sq.Ft & Sq.M ({targetCur})</div>
            <div className="text-sm font-bold text-slate-900">{fx.symbol}{num(foreignPsf, 0)} /ft²</div>
            <div className="text-[11px] text-slate-500">{fx.symbol}{num(foreignPsm, 0)} /m²</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs text-slate-500">DLD 4% Transfer Fee ({targetCur})</div>
            <div className="text-base font-bold text-amber-700">{fx.symbol}{num(dld4PctAed * fx.rateFromAed, 0)}</div>
            <div className="text-[11px] text-slate-400">AED {num(dld4PctAed)}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs text-slate-500">20% Down Payment ({targetCur})</div>
            <div className="text-base font-bold text-emerald-700">{fx.symbol}{num(down20PctAed * fx.rateFromAed, 0)}</div>
            <div className="text-[11px] text-slate-400">AED {num(down20PctAed)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
 * 3. WhatsApp & Portal Copy Formatter
 * ========================================================================== */
export function WhatsAppPortalFormatter() {
  const [text, setText] = useState(
    `🌟 *EXCLUSIVE WATERFRONT LISTING — DUBAI MARINA*\n\n• *Unit:* 3 BR + Maid Sky Residence\n• *BUA:* 2,150 Sq.Ft (Full Marina Yacht View)\n• *Price:* AED 4,850,000 (Golden Visa Eligible)\n• *Status:* Vacant on Transfer · High ROI\n\n📞 Reply *VIEW* for private chauffeur viewing today.`
  )
  const [permit, setPermit] = useState('7148920154')
  const [orn, setOrn] = useState('51517')
  const [brn, setBrn] = useState('64821')
  const [copied, setCopied] = useState(false)

  const appendBlock = (snippet: string) => setText((prev) => `${prev.trim()}\n\n${snippet}`)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">WhatsApp VIP Broadcast & Portal Copy Studio</h3>
          <p className="text-xs text-slate-500">Format WhatsApp markdown (*bold*, _italic_), inject DLD Trakheesi compliance blocks, and preview live mobile bubbles.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => appendBlock(`🏛️ *DLD / RERA Compliance*\nTrakheesi Permit: #${permit}\nSWK Properties L.L.C · ORN: ${orn} · BRN: ${brn}`)}
            className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            + Trakheesi Footer
          </button>
          <button
            type="button"
            onClick={() => appendBlock(`🇪🇺 *Golden Visa Qualified:* Purchase qualifies buyer & family for 10-Year UAE Residency (AED 2M+ DLD threshold).`)}
            className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            + Golden Visa Badge
          </button>
          <button
            type="button"
            onClick={() => appendBlock(`للتواصل والاستفسار وحجز موعد المعاينة الخاصة، يرجى الرد على هذه الرسالة الآن.`)}
            className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            + Arabic CTA
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs font-medium text-slate-700">Trakheesi Permit #
          <input value={permit} onChange={(e) => setPermit(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs" />
        </label>
        <label className="text-xs font-medium text-slate-700">RERA ORN #
          <input value={orn} onChange={(e) => setOrn(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs" />
        </label>
        <label className="text-xs font-medium text-slate-700">Agent BRN #
          <input value={brn} onChange={(e) => setBrn(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs" />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm font-mono"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{text.length} chars · {text.trim().split(/\s+/).filter(Boolean).length} words · {text.split('\n').length} lines</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => copyText(text, () => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy Formatted
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(text)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white"
              >
                Open in WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-[#efeae2] p-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600">WhatsApp Preview</div>
          <div className="rounded-xl bg-[#d9fdd3] p-3.5 text-xs leading-relaxed text-slate-900 shadow-sm whitespace-pre-wrap">
            {text}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
 * 4. Smart Document & Legal Template Generator
 * ========================================================================== */
const DOC_TEMPLATES: Record<string, { label: string; build: (v: Record<string, string>) => string }> = {
  loi: {
    label: 'Letter of Intent (LOI) / Purchase Offer',
    build: (v) => `LETTER OF INTENT TO PURCHASE REAL ESTATE (SUBJECT TO CONTRACT / FORM F)
Date: ${v.date}
Ref: SWK-LOI-${Date.now().toString().slice(-5)}

1. PROPERTY DETAILS
Community / Project: ${v.property}
Unit / Plot Number: ${v.unit}
Title Deed / Oqood Reference: Verified upon Form F signing

2. PRINCIPAL PARTIES
Proposed Buyer: ${v.client}
Seller / Landlord: ${v.counterparty}
 Facilitating Brokerage: SWK Properties L.L.C (RERA ORN: 51517) — Consultant: ${v.agent}

3. COMMERCIAL OFFER TERMS
Offered Purchase Price: AED ${v.amount}
Security Deposit Cheque: 10% of Purchase Price (held in escrow by SWK Properties L.L.C until DLD Transfer)
DLD Transfer Fee (4%): As per standard Dubai Land Department schedule
Financing Mode: ${v.notes}
Target DLD Transfer Window: Within 30 calendar days of Form F (MOU) execution

4. VALIDITY & CONDITIONS
This Letter of Intent is non-binding until execution of the official RERA Unified Contract F (MOU) and receipt of the 10% security deposit cheque.

Signed (Buyer): ___________________________    Date: _______________
Received by (SWK Properties L.L.C): ___________________________`,
  },
  viewing: {
    label: 'Property Viewing Confirmation & Non-Circumvention Sheet',
    build: (v) => `PROPERTY VIEWING & REGISTRATION ACKNOWLEDGEMENT (RERA FORM I / B COMPLIANT)
Date: ${v.date}

Client Name: ${v.client}
Property Inspected: ${v.property} — Unit ${v.unit}
Quoted Guide Price / Rent: AED ${v.amount}
Accompanying Consultant: ${v.agent} (SWK Properties L.L.C · ORN 51517)

ACKNOWLEDGEMENT:
1. The undersigned client confirms having physically/virtually inspected the above property through SWK Properties L.L.C.
2. Should the client or any related party proceed to lease or purchase the said property within 12 months from the date of this viewing, SWK Properties L.L.C shall be recognized as the introducing broker of record entitled to standard RERA-compliant brokerage remuneration.
3. Special Viewing Notes: ${v.notes}

Client Signature: ___________________________    Consultant Signature: ___________________________`,
  },
  deposit: {
    label: 'Security / Holding Deposit Receipt Acknowledgement',
    build: (v) => `HOLDING CHEQUE / DEPOSIT RECEIPT ACKNOWLEDGEMENT
Receipt Date: ${v.date}
Receipt No: SWK-DEP-${Date.now().toString().slice(-5)}

Received From: ${v.client}
In Favour Of (Beneficiary): ${v.counterparty}
Property Reference: ${v.property} — Unit ${v.unit}
Cheque / Deposit Amount: AED ${v.amount}
Payment / Cheque Details: ${v.notes}

CUSTODIAN UNDERTAKING:
SWK Properties L.L.C acknowledges custody of the above post-dated/current security cheque strictly as stakeholder custodian pending bilateral signature of the RERA Unified Contract / Ejari Tenancy Contract. The instrument shall not be encashed or released without written mutual authorization or executed contract terms.

Issued by Consultant: ${v.agent} — SWK Properties L.L.C (ORN 51517)`,
  },
  rera90: {
    label: '90-Day RERA Tenancy Renewal & Rent Adjustment Notice',
    build: (v) => `STATUTORY 90-DAY TENANCY RENEWAL NOTICE (DUBAI LAW NO. 33 OF 2008 & DECREE NO. 43 OF 2013)
Notice Date: ${v.date}

To Tenant: ${v.client}
From Landlord / Managing Agent: ${v.counterparty} (c/o SWK Properties L.L.C)
Leased Premises: ${v.property} — Unit ${v.unit}
Proposed Renewal Annual Rent: AED ${v.amount}

NOTICE PURSUANT TO ARTICLE (14):
Please be advised that in accordance with Article (14) of Dubai Law No. (33) of 2008 (requiring at least 90 days' prior notice before lease expiry) and RERA Rental Index Decree No. (43) of 2013, the Landlord hereby notifies you of the revised renewal terms above.
Additional Terms / Cheque Schedule: ${v.notes}

Kindly confirm acceptance within 14 days so that our Ejari Administration team (${v.agent}) may prepare the renewal contract.`,
  },
  handover: {
    label: 'Property Handover & Key Release Protocol',
    build: (v) => `PROPERTY HANDOVER, METER READING & KEY RELEASE PROTOCOL
Handover Date: ${v.date}

Property: ${v.property} — Unit ${v.unit}
Outgoing Party (Seller/Landlord): ${v.counterparty}
Incoming Party (Buyer/Tenant): ${v.client}
Supervising Officer: ${v.agent} (SWK Properties L.L.C)

HANDOVER INVENTORY CHECKLIST:
[x] Main Entrance Access Cards / Smart Lock Codes Released
[x] Mailbox, Parking Access Barrier Cards & Gym Fobs Handed Over
[x] DEWA Final Bill & Chiller (Empower/Emicool) Clearance Verified
[x] Security / Maintenance Deposit Settlement: AED ${v.amount}
[x] Meter Readings & Notes: ${v.notes}

Outgoing Signature: _____________________    Incoming Signature: _____________________`,
  },
  snagging: {
    label: 'Property Snagging & Defect Liability Inspection Report',
    build: (v) => `TECHNICAL SNAGGING & DEFECT LIABILITY (DLP) INSPECTION REPORT
Inspection Date: ${v.date}

Project / Building: ${v.property} — Unit ${v.unit}
Client / Owner: ${v.client}
Developer / Contractor: ${v.counterparty}
Inspector: ${v.agent} (SWK Properties Technical Services)
Estimated Rectification Holdback / Value: AED ${v.amount}

INSPECTION SUMMARY:
1. MEP & HVAC (AC Thermostat, Diffusers, Drainage Pressure): Inspected
2. Joinery, Wardrobes, Fire Doors & Balcony Hinges: Inspected
3. Porcelain Flooring, Grouting, Skirting & Marble Countertops: Inspected
4. Glazing, Acoustic Seals & Waterproofing: Inspected
5. Recorded Snag Items & Rectification Deadlines:
${v.notes}

Inspector Sign-off: _____________________    Developer Representative: _____________________`,
  },
}

export function SmartDocGenerator() {
  const [tpl, setTpl] = useState<keyof typeof DOC_TEMPLATES>('loi')
  const [fields, setFields] = useState({
    date: new Date().toISOString().slice(0, 10),
    property: 'Marina Gate Tower 1, Dubai Marina',
    unit: '2402 (2BR + Study)',
    client: 'Mr. Alexander Vance',
    counterparty: 'Al Habtoor Holdings Representative',
    amount: '3,450,000',
    agent: 'Tariq Al-Mansoori (BRN 64821)',
    notes: 'Cash buyer · 10% security cheque in hand · Vacant on transfer.',
  })
  const [copied, setCopied] = useState(false)

  const docText = useMemo(() => DOC_TEMPLATES[tpl].build(fields), [tpl, fields])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Smart UAE Real Estate Document & Notice Generator</h3>
          <p className="text-xs text-slate-500">Generate ready-to-sign LOIs, Viewing Sheets, Holding Receipts, 90-Day RERA Notices, Handover Protocols & Snagging Reports.</p>
        </div>
        <select
          value={tpl}
          onChange={(e) => setTpl(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold"
        >
          {Object.entries(DOC_TEMPLATES).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-4">
        <label className="text-xs font-medium text-slate-700">Date
          <input type="date" value={fields.date} onChange={(e) => setFields({ ...fields, date: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs" />
        </label>
        <label className="text-xs font-medium text-slate-700">Building / Community
          <input value={fields.property} onChange={(e) => setFields({ ...fields, property: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs" />
        </label>
        <label className="text-xs font-medium text-slate-700">Unit / Plot #
          <input value={fields.unit} onChange={(e) => setFields({ ...fields, unit: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs" />
        </label>
        <label className="text-xs font-medium text-slate-700">Amount (AED)
          <input value={fields.amount} onChange={(e) => setFields({ ...fields, amount: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs" />
        </label>
        <label className="text-xs font-medium text-slate-700">Client (Buyer / Tenant)
          <input value={fields.client} onChange={(e) => setFields({ ...fields, client: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs" />
        </label>
        <label className="text-xs font-medium text-slate-700">Counterparty (Seller / Landlord)
          <input value={fields.counterparty} onChange={(e) => setFields({ ...fields, counterparty: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs" />
        </label>
        <label className="text-xs font-medium text-slate-700">RERA Consultant
          <input value={fields.agent} onChange={(e) => setFields({ ...fields, agent: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs" />
        </label>
        <label className="text-xs font-medium text-slate-700">Special Terms / Notes
          <input value={fields.notes} onChange={(e) => setFields({ ...fields, notes: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs" />
        </label>
      </div>

      <pre className="max-h-72 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-mono">
        {docText}
      </pre>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => copyText(docText, () => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy Document
        </button>
        <button
          type="button"
          onClick={() => downloadText(docText, `swk-${tpl}-${fields.date}.txt`)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
        >
          <Download className="h-3.5 w-3.5" /> Download .TXT
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
        >
          <Printer className="h-3.5 w-3.5" /> Print / Save PDF
        </button>
      </div>
    </div>
  )
}

/* ============================================================================
 * 5. UAE IBAN, Emirates ID, FTA TRN & goAML Compliance Validator
 * ========================================================================== */
const UAE_BANKS: Record<string, string> = {
  '033': 'Mashreq Bank',
  '026': 'Emirates NBD (ENBD)',
  '003': 'Abu Dhabi Commercial Bank (ADCB)',
  '035': 'First Abu Dhabi Bank (FAB)',
  '024': 'Dubai Islamic Bank (DIB)',
  '034': 'Emirates Islamic Bank (EIB)',
  '050': 'Abu Dhabi Islamic Bank (ADIB)',
  '040': 'RAKBANK (National Bank of Ras Al Khaimah)',
  '023': 'Commercial Bank of Dubai (CBD)',
  '044': 'Standard Chartered Bank UAE',
  '020': 'HSBC Bank Middle East',
  '046': 'Wio Bank PJSC',
}

function validateUaeIban(raw: string) {
  const clean = raw.replace(/\s+/g, '').toUpperCase()
  if (!/^AE\d{21}$/.test(clean)) {
    return { valid: false, reason: 'UAE IBAN must start with AE and contain exactly 23 characters (AE + 21 digits).', bank: 'Unknown' }
  }
  const rearranged = clean.slice(4) + clean.slice(0, 4)
  const numeric = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55))
  let remainder = 0
  for (const digit of numeric) {
    remainder = (remainder * 10 + Number(digit)) % 97
  }
  const bankCode = clean.slice(4, 7)
  const bank = UAE_BANKS[bankCode] || `UAE Central Bank Code #${bankCode}`
  return {
    valid: remainder === 1,
    reason: remainder === 1 ? `Valid ISO-13616 MOD-97 Checksum · ${bank}` : 'Invalid MOD-97 checksum digit — verify beneficiary IBAN before wire transfer.',
    bank,
  }
}

function validateEmiratesId(raw: string) {
  const digits = raw.replace(/[^\d]/g, '')
  if (!/^784\d{12}$/.test(digits)) {
    return { valid: false, reason: 'Emirates ID must be 15 digits starting with 784 (UAE country code).' }
  }
  const birthYear = Number(digits.slice(3, 7))
  let sum = 0
  for (let i = 0; i < 14; i++) {
    let d = Number(digits[i])
    if (i % 2 === 1) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  const checkDigit = (10 - (sum % 10)) % 10
  const actualCheck = Number(digits[14])
  return {
    valid: checkDigit === actualCheck,
    reason: checkDigit === actualCheck
      ? `Valid ICP 15-Digit Emirates ID · Holder Year Cohort: ${birthYear}`
      : `Format valid (784-${birthYear}-...) · Luhn check expected ${checkDigit}, got ${actualCheck}`,
  }
}

export function UaeComplianceValidator() {
  const [iban, setIban] = useState('AE070331234567890123456')
  const [eid, setEid] = useState('784-1988-1234567-1')
  const [trn, setTrn] = useState('100234567890003')
  const [cashAmount, setCashAmount] = useState(75000)

  const ibanCheck = useMemo(() => validateUaeIban(iban), [iban])
  const eidCheck = useMemo(() => validateEmiratesId(eid), [eid])
  const trnDigits = trn.replace(/[^\d]/g, '')
  const trnValid = /^100\d{12}$/.test(trnDigits)
  const goAmlFlag = cashAmount >= 55000

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">UAE IBAN, Emirates ID, FTA TRN & goAML Compliance Validator</h3>
        <p className="text-xs text-slate-500">Verify escrow/beneficiary UAE IBANs (ISO 13616 MOD-97), ICP Emirates IDs, 15-digit FTA VAT TRNs, and UAE goAML AED 55,000 reporting thresholds.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-3.5 space-y-2">
          <label className="block text-xs font-semibold text-slate-700">UAE Beneficiary IBAN (23 chars)
            <input value={iban} onChange={(e) => setIban(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-mono" />
          </label>
          <div className={`rounded-lg p-2.5 text-xs font-medium ${ibanCheck.valid ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
            {ibanCheck.reason}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3.5 space-y-2">
          <label className="block text-xs font-semibold text-slate-700">UAE Emirates ID (784-YYYY-NNNNNNN-C)
            <input value={eid} onChange={(e) => setEid(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-mono" />
          </label>
          <div className={`rounded-lg p-2.5 text-xs font-medium ${eidCheck.valid ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
            {eidCheck.reason}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3.5 space-y-2">
          <label className="block text-xs font-semibold text-slate-700">UAE Federal Tax Authority (FTA) TRN (15 digits)
            <input value={trn} onChange={(e) => setTrn(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-mono" />
          </label>
          <div className={`rounded-lg p-2.5 text-xs font-medium ${trnValid ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
            {trnValid ? 'Valid 15-digit UAE FTA Tax Registration Number (100... prefix verified).' : 'FTA TRN must be 15 digits beginning with 100.'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3.5 space-y-2">
          <label className="block text-xs font-semibold text-slate-700">Cash / Virtual Asset Receipt Amount (AED)
            <input type="number" value={cashAmount} onChange={(e) => setCashAmount(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-mono" />
          </label>
          <div className={`rounded-lg p-2.5 text-xs font-medium ${goAmlFlag ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'}`}>
            {goAmlFlag
              ? `MANDATORY UAE goAML REAL ESTATE ACTIVITY REPORT (REAR): Amount (AED ${num(cashAmount)}) meets/exceeds AED 55,000 cash/crypto threshold. Collect Source of Funds + Passport/EID.`
              : `Below AED 55,000 cash threshold · Standard customer due diligence (CDD) applies. VAT 5% Exclusive = AED ${num(cashAmount * 0.05)}`}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
 * 6. CSV / JSON / vCard Lead & Inventory Data Studio
 * ========================================================================== */
export function LeadDataStudio() {
  const [rawCsv, setRawCsv] = useState(
    `name,phone,email,budget_aed,community\nRashid Al Maktoum,050 987 6543,rashid@example.ae,4500000,Dubai Marina\nElena Petrova,+971-52-334-1122,elena@example.ru,2800000,Business Bay\nSameer Khan,00971551112233,sameer@example.com,6200000,Palm Jumeirah`
  )
  const [copied, setCopied] = useState(false)

  const parsedRows = useMemo(() => {
    const lines = rawCsv.trim().split(/\r?\n/).filter(Boolean)
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map((h) => h.trim())
    const seenPhones = new Set<string>()
    return lines.slice(1).map((line) => {
      const cols = line.split(',').map((c) => c.trim())
      const obj: Record<string, string> = {}
      headers.forEach((h, i) => { obj[h] = cols[i] || '' })
      let p = (obj.phone || '').replace(/[^\d+]/g, '')
      if (p.startsWith('00971')) p = '+' + p.slice(2)
      else if (p.startsWith('05')) p = '+971' + p.slice(1)
      else if (p.startsWith('5') && p.length === 9) p = '+971' + p
      else if (p.startsWith('971')) p = '+' + p
      obj.phone_e164 = p
      obj.duplicate = seenPhones.has(p) ? 'DUPLICATE' : 'UNIQUE'
      if (p) seenPhones.add(p)
      return obj
    })
  }, [rawCsv])

  const jsonOutput = useMemo(() => JSON.stringify(parsedRows, null, 2), [parsedRows])
  const vcfBatch = useMemo(
    () =>
      parsedRows
        .map(
          (r) =>
            `BEGIN:VCARD\nVERSION:3.0\nFN:${r.name || 'SWK Lead'}\nTEL;TYPE=CELL:${r.phone_e164 || r.phone || ''}\nEMAIL:${r.email || ''}\nNOTE:Community: ${r.community || ''} | Budget AED ${r.budget_aed || ''}\nEND:VCARD`
        )
        .join('\n'),
    [parsedRows]
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Lead & Inventory CSV ↔ JSON ↔ Batch vCard Studio</h3>
          <p className="text-xs text-slate-500">Normalize UAE mobile numbers (`050...` → `+97150...`), flag duplicate leads, convert CSV to JSON, and export batch `.vcf` contacts.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => copyText(jsonOutput, () => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy JSON ({parsedRows.length})
          </button>
          <button
            type="button"
            onClick={() => downloadText(vcfBatch, 'swk-leads-batch.vcf', 'text/vcard')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
          >
            <Download className="h-3.5 w-3.5" /> Export Batch .VCF
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block text-xs font-medium text-slate-700">Paste Portal / CRM CSV Rows
          <textarea
            value={rawCsv}
            onChange={(e) => setRawCsv(e.target.value)}
            rows={8}
            className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-xs font-mono"
          />
        </label>
        <div className="overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-1.5 text-xs font-semibold text-slate-600">Normalized Output (E.164 UAE Phone + Dedup Check)</div>
          <pre className="text-[11px] text-slate-800 font-mono">{jsonOutput}</pre>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
 * 7. Voice Dictation & Meeting Note Formatter
 * ========================================================================== */
export function VoiceNotesStudio() {
  const [lang, setLang] = useState<'en-US' | 'ar-AE'>('en-US')
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState(
    'Met with buyer Mr. Kareem at Downtown Views II unit 3104. Client budget is AED 3.6M cash. Requested DLD 4% fee breakdown and service charge history. Follow up tomorrow by 11 AM with Form F draft.'
  )
  const recRef = useRef<any>(null)

  const toggleDictation = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRec) {
      alert('Browser SpeechRecognition API is not supported in this browser.')
      return
    }
    if (listening && recRef.current) {
      recRef.current.stop()
      setListening(false)
      return
    }
    const rec = new SpeechRec()
    rec.lang = lang
    rec.continuous = true
    rec.interimResults = false
    rec.onresult = (e: any) => {
      const chunk = Array.from(e.results)
        .map((r: any) => r[0]?.transcript || '')
        .join(' ')
      setTranscript((prev) => `${prev.trim()} ${chunk}`.trim())
    }
    rec.onend = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  const structuredSummary = useMemo(() => {
    const sentences = transcript.split(/(?<=[.!?])\s+/).filter(Boolean)
    const amounts = transcript.match(/AED\s?[\d,.]+\s?[MKBmkb]?/gi) || []
    return [
      `📋 SWK STRUCTURED VIEWING & MEETING BRIEF`,
      `• Date: ${new Date().toISOString().slice(0, 10)}`,
      `• Detected Deal Figures: ${amounts.length ? amounts.join(', ') : 'None mentioned'}`,
      ``,
      `KEY DISCUSSION POINTS:`,
      ...sentences.map((s) => `- ${s.trim()}`),
      ``,
      `RECOMMENDED NEXT STEPS:`,
      `- [ ] Log note in SWK OS CRM & update deal stage`,
      `- [ ] Send WhatsApp follow-up with DLD 4% + ROI sheet`,
    ].join('\n')
  }, [transcript])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Voice Dictation & Viewing Note Structurer</h3>
          <p className="text-xs text-slate-500">Dictate site inspection or client meeting notes in English or Arabic and auto-format CRM action items.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={lang} onChange={(e) => setLang(e.target.value as any)} className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs">
            <option value="en-US">English (UAE / International)</option>
            <option value="ar-AE">العربية (UAE Arabic)</option>
          </select>
          <button
            type="button"
            onClick={toggleDictation}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white ${listening ? 'bg-rose-600 animate-pulse' : 'bg-slate-900'}`}
          >
            {listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            {listening ? 'Stop Dictation' : 'Start Voice Dictation'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={7}
          className="w-full rounded-xl border border-slate-300 p-3 text-sm"
          placeholder="Speak or type raw meeting notes..."
        />
        <pre className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-mono">
          {structuredSummary}
        </pre>
      </div>
    </div>
  )
}

/* ============================================================================
 * 8. UTM & Portal Attribution Campaign Link Builder
 * ========================================================================== */
export function UtmCampaignBuilder() {
  const [base, setBase] = useState('https://swkproperties.ae/projects/emaar-beachfront')
  const [source, setSource] = useState('propertyfinder')
  const [medium, setMedium] = useState('portal_featured')
  const [campaign, setCampaign] = useState('q4_waterfront_investors')
  const [content, setContent] = useState('3br_corner_unit')
  const [copied, setCopied] = useState(false)

  const fullUrl = useMemo(() => {
    try {
      const u = new URL(base)
      if (source) u.searchParams.set('utm_source', source)
      if (medium) u.searchParams.set('utm_medium', medium)
      if (campaign) u.searchParams.set('utm_campaign', campaign)
      if (content) u.searchParams.set('utm_content', content)
      return u.toString()
    } catch {
      return `${base}?utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`
    }
  }, [base, source, medium, campaign, content])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Portal & Paid Media UTM Attribution Builder</h3>
        <p className="text-xs text-slate-500">Build tracked campaign links for Property Finder, Bayut, Dubizzle, Meta Lead Ads, Google Search & WhatsApp broadcasts.</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {([
          ['propertyfinder', 'portal_superhot', 'Property Finder SuperHot'],
          ['bayut', 'trucheck_featured', 'Bayut TruCheck'],
          ['dubizzle', 'featured_listing', 'Dubizzle Featured'],
          ['meta_ig', 'paid_reels', 'Instagram Reels Ad'],
          ['google_ads', 'cpc_search', 'Google Search Intent'],
          ['whatsapp_vip', 'broadcast_list', 'WhatsApp VIP Broadcast'],
        ] as const).map(([s, m, label]) => (
          <button
            key={s}
            type="button"
            onClick={() => { setSource(s); setMedium(m) }}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium ${source === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <label className="text-xs font-medium text-slate-700 sm:col-span-2">Landing Page URL
          <input value={base} onChange={(e) => setBase(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
        </label>
        <label className="text-xs font-medium text-slate-700">utm_source
          <input value={source} onChange={(e) => setSource(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
        </label>
        <label className="text-xs font-medium text-slate-700">utm_medium
          <input value={medium} onChange={(e) => setMedium(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
        </label>
        <label className="text-xs font-medium text-slate-700">utm_campaign
          <input value={campaign} onChange={(e) => setCampaign(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
        </label>
        <label className="text-xs font-medium text-slate-700">utm_content
          <input value={content} onChange={(e) => setContent(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <code className="text-xs text-slate-800 break-all">{fullUrl}</code>
        <button
          type="button"
          onClick={() => copyText(fullUrl, () => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shrink-0"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy Tracked URL
        </button>
      </div>
    </div>
  )
}
