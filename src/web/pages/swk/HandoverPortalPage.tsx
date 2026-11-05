import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  FileCheck2,
  Globe,
  Layers,
  Lock,
  Printer,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Server,
  Terminal,
  Workflow,
  ArrowLeft,
  Bot,
  MapPin,
} from 'lucide-react'
const SWK_COMPANY_NAME = 'SWK Properties LLC'
const SWK_OFFICIAL_WEBSITES_TEXT = 'www.swk.properties · www.swkpropertiesuae.com · www.swk.rent'

type DocTab = 'owner-dossier' | 'tech-manual' | 'staff-guide' | 'certificate'

export default function HandoverPortalPage() {
  const [tab, setTab] = useState<DocTab>('owner-dossier')

  const printCurrentDocument = (targetTab: DocTab) => {
    setTab(targetTab)
    setTimeout(() => window.print(), 120)
  }

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#0b1a33] pb-16">
      {/* Top Executive Banner */}
      <header
        className="print:hidden border-b border-[#c9a96e]/35 text-white"
        style={{ background: 'linear-gradient(135deg, #061022 0%, #0b1a33 55%, #14305c 100%)' }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#050c1b]/85 border border-[#c9a96e]/40">
                <img
                  src="/brand/one/portal-arch-emblem.png"
                  alt="SWK ONE Emblem"
                  className="h-10 w-10 object-contain"
                />
                <img
                  src="/brand/one/primary-logo.png"
                  alt="SWK ONE"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#e8d4a2]">
                  <Sparkles size={13} /> Official Software Agency Handover &amp; Detailed User Guide Suite
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white m-0 mt-0.5">
                  SWK ONE — Complete Mobile, AI &amp; Operations Handover Package
                </h1>
                <div className="text-xs sm:text-sm text-[#c7d2e4] mt-1">
                  Architected, Engineered &amp; Delivered Pin-to-Pin by{' '}
                  <strong className="text-[#f3dfb8]">SHAMEEM HARFATH S M</strong> for{' '}
                  <strong className="text-white">{SWK_COMPANY_NAME}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                to="/swk-one"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold no-underline inline-flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Back to SWK ONE
              </Link>
              <a
                href="/handover/SWK_ONE_Office_Attendance_QR_Code_And_Method.pdf"
                download
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-[#c9a96e]/50 text-[#f3dfb8] text-xs font-bold no-underline inline-flex items-center gap-1.5"
              >
                <QrCode size={14} /> Attendance QR &amp; Method PDF
              </a>
              <a
                href="/handover/00_SWK_ONE_Staff_Login_Credentials_And_Access_Policy.pdf"
                download
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-[#c9a96e]/50 text-[#f3dfb8] text-xs font-bold no-underline inline-flex items-center gap-1.5"
              >
                <FileCheck2 size={14} /> Staff Credentials PDF
              </a>
              <a
                href="/handover/SWK_ONE_Complete_Software_Handover_And_App_User_Manual_By_Shameem_Harfath.pdf"
                download
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-[#08142a] no-underline inline-flex items-center gap-2 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #f1e3c2 0%, #c9a96e 100%)' }}
              >
                <Printer size={15} /> Download Complete Handover &amp; User Manual PDF
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
              >
                <Printer size={14} /> Print Active Tab
              </button>
            </div>
          </div>

          {/* Quick Engineering Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
            {[
              { label: 'Total Source Code', val: '58,474 LOC', sub: '289 Engineered Files' },
              { label: 'Backend API Routes', val: '384 Endpoints', sub: 'Fastify 5 + Mobile/AI Bridges' },
              { label: 'Mobile & Android', val: '65 Features', sub: 'ae.swkproperties.one + GPS' },
              { label: 'AI & Utility Studio', val: '9 Studio Tabs', sub: '32 AI Tasks + Ollama + OCR/PDF' },
              { label: 'Database Schema', val: '75+ Tables', sub: 'PostgreSQL 16 + SQLite WAL' },
              { label: 'Automated QA Suites', val: '38 Test Suites', sub: '63/63 Android + Cloud Bridge' },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/[0.06] border border-[#c9a96e]/30 px-3.5 py-3 backdrop-blur-sm"
              >
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#e8d4a2] font-bold">{stat.label}</div>
                <div className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">{stat.val}</div>
                <div className="text-[11px] text-[#b8c3d7]">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Document Selector Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10">
            {[
              {
                id: 'owner-dossier' as const,
                icon: Award,
                label: 'Doc 01 · Owner Executive Dossier (Pin-to-Pin)',
              },
              {
                id: 'tech-manual' as const,
                icon: Cpu,
                label: 'Doc 02 · Technical, Android & Hybrid AI Manual',
              },
              {
                id: 'staff-guide' as const,
                icon: BookOpen,
                label: 'Doc 03 · How to Use SWK ONE in Detail (User Manual)',
              },
              {
                id: 'certificate' as const,
                icon: FileCheck2,
                label: 'Doc 04 · Official Handover Certificate & Sign-Off',
              },
            ].map(t => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 border ${
                    active
                      ? 'bg-[#c9a96e] text-[#08142a] border-[#e8d4a2] shadow-md'
                      : 'bg-[#08142a]/60 text-white/85 border-white/15 hover:border-[#c9a96e]/60'
                  }`}
                >
                  <t.icon size={15} />
                  <span>{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-7">
        <div className="bg-white rounded-3xl shadow-xl border border-[#e7e1d4] p-6 sm:p-10">
          {/* Printable Corporate Letterhead */}
          <div
            className="flex flex-wrap items-start justify-between gap-6 pb-5 mb-6"
            style={{ borderBottom: '3px solid #08142a' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center rounded-2xl px-5 py-3"
                style={{
                  background: 'linear-gradient(135deg, #08142a 0%, #102445 100%)',
                  border: '1px solid rgba(201,169,110,.55)',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                }}
              >
                <img
                  src="/brand/one/horizontal-lockup.png"
                  alt="SWK ONE"
                  style={{ height: 46, width: 'auto', display: 'block', objectFit: 'contain' }}
                />
              </div>
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#9a7a42]">
                  Enterprise Mobile, AI &amp; Operations Software Handover
                </div>
                <div className="font-display text-xl font-bold text-[#08142a]">{SWK_COMPANY_NAME}</div>
                <div className="text-xs font-bold text-[#0b1a33] mt-0.5">{SWK_OFFICIAL_WEBSITES_TEXT}</div>
              </div>
            </div>

            <div className="text-right text-xs leading-relaxed text-[#4b5568]">
              <div>
                <strong className="text-[#08142a]">Lead Architect &amp; Engineer:</strong> SHAMEEM HARFATH S M
              </div>
              <div>
                <strong className="text-[#08142a]">Client Entity:</strong> SWK Properties LLC (Dubai, UAE · RERA ORN 51517)
              </div>
              <div>
                <strong className="text-[#08142a]">Production URL:</strong> https://one.swkpropertiesuae.com · ae.swkproperties.one
              </div>
              <div>
                <strong className="text-[#08142a]">Repository:</strong> github.com/swkpropertiesuae/SWKONE
              </div>
            </div>
          </div>

          {/* ================================================================ TAB 1: OWNER EXECUTIVE DOSSIER */}
          {tab === 'owner-dossier' && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#fbf9f4] border border-[#e7e1d4] rounded-2xl p-5">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-[#9a7a42]">
                    DOCUMENT 01 OF 04 · OWNER EXECUTIVE ENGINEERING DOSSIER
                  </div>
                  <h2 className="font-display text-2xl font-bold text-[#08142a] m-0 mt-1">
                    SWK ONE — Pin-to-Pin Software Engineering Inventory, Codebase Audit &amp; Valuation
                  </h2>
                  <p className="text-xs text-[#5a6578] m-0 mt-1">
                    Prepared for <strong>Shabib Siraj (Owner, SWK Properties LLC)</strong> by{' '}
                    <strong>SHAMEEM HARFATH S M</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => printCurrentDocument('owner-dossier')}
                  className="print:hidden px-4 py-2 rounded-xl bg-[#0b1a33] text-[#f3dfb8] text-xs font-bold border-0 cursor-pointer inline-flex items-center gap-2"
                >
                  <Printer size={14} /> Print Owner Dossier
                </button>
              </div>

              <section className="space-y-3">
                <h3 className="font-display text-lg font-bold text-[#08142a] flex items-center gap-2 m-0">
                  <Award size={19} className="text-[#9a7a42]" /> 1. Executive Summary &amp; Scope of SWK ONE
                </h3>
                <p className="text-sm leading-relaxed text-[#2b3548] m-0">
                  <strong>SWK ONE</strong> (<code className="text-xs font-bold">github.com/swkpropertiesuae/SWKONE</code> ·{' '}
                  <code className="text-xs font-bold">ae.swkproperties.one</code>) is the unified Mobile Field Super-App,
                  Private &amp; Cloud AI Studio, Reception QR Attendance Platform, and Enterprise Real Estate Operating
                  System custom-engineered by <strong>SHAMEEM HARFATH S M</strong> exclusively for{' '}
                  <strong>SWK Properties LLC</strong>. It combines a 65-feature native Android &amp; mobile field cockpit,
                  a 9-tab Hybrid AI &amp; Document Utility Studio (Cloudflare Workers AI + Private Local Ollama Qwen 3.5 +
                  OCR + PDF/Photo tools), a 5-layer anti-loophole Reception QR attendance system, and all 9 UAE RERA/DLD
                  brokerage suites in a single zero-latency codebase.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display text-lg font-bold text-[#08142a] flex items-center gap-2 m-0">
                  <Code2 size={19} className="text-[#9a7a42]" /> 2. Verified Codebase Volume &amp; Architectural Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0b1a33] text-[#f3dfb8]">
                        <th className="p-3 rounded-tl-xl">Engineering Layer</th>
                        <th className="p-3">Directory / Scope</th>
                        <th className="p-3">Files</th>
                        <th className="p-3">Lines of Code (LOC)</th>
                        <th className="p-3">Source Size</th>
                        <th className="p-3 rounded-tr-xl">Primary Technologies &amp; Capabilities</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7e1d4]">
                      <tr>
                        <td className="p-3 font-bold">1. Backend Core, Mobile &amp; AI API</td>
                        <td className="p-3 font-mono">src/server/**</td>
                        <td className="p-3 font-bold">91 files</td>
                        <td className="p-3 font-mono font-bold">18,875 LOC</td>
                        <td className="p-3">1,227.6 KB</td>
                        <td className="p-3">Fastify 5, 384 REST endpoints (/api/swk-one/*, /api/one/ai/*, /api/ai/ollama/*), Dual DB, OCR, PDF Studio</td>
                      </tr>
                      <tr className="bg-[#fbf9f4]">
                        <td className="p-3 font-bold">2. SWK ONE Mobile Cockpit</td>
                        <td className="p-3 font-mono">src/web/mobile/**</td>
                        <td className="p-3 font-bold">6 files</td>
                        <td className="p-3 font-mono font-bold">6,094 LOC</td>
                        <td className="p-3">277.3 KB</td>
                        <td className="p-3">5-Tab Command Center (Command, Field Duty, Inventory, CRM, HR &amp; Pay), 4-Tab Staff Portal, Offline Queue, Native Bridge</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">3. Native Android App (APK)</td>
                        <td className="p-3 font-mono">android/**</td>
                        <td className="p-3 font-bold">21 files</td>
                        <td className="p-3 font-mono font-bold">1,231 LOC</td>
                        <td className="p-3">51.4 KB</td>
                        <td className="p-3">Native Android (ae.swkproperties.one), SwkNativePlugin.java, SwkDutyLocationService.java foreground GPS, Biometric lock</td>
                      </tr>
                      <tr className="bg-[#fbf9f4]">
                        <td className="p-3 font-bold">4. React 19 Web UI &amp; AI Studio</td>
                        <td className="p-3 font-mono">src/web/** (Desktop &amp; AI)</td>
                        <td className="p-3 font-bold">83 files</td>
                        <td className="p-3 font-mono font-bold">17,302 LOC</td>
                        <td className="p-3">1,237.7 KB</td>
                        <td className="p-3">OneUtilityStudio (9 tabs, 32 AI tasks), OllamaStudio (Qwen 3.5), OnePremiumUtilities, 9 UAE Brokerage Suites</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">5. Shared UAE Domain &amp; RBAC</td>
                        <td className="p-3 font-mono">src/shared/**</td>
                        <td className="p-3 font-bold">28 files</td>
                        <td className="p-3 font-mono font-bold">3,729 LOC</td>
                        <td className="p-3">269.1 KB</td>
                        <td className="p-3">75+ entity schemas, 7 UAE statutory calculators, hard staff RBAC policy (swk-staff-access.ts), corporate footers</td>
                      </tr>
                      <tr className="bg-[#fbf9f4]">
                        <td className="p-3 font-bold">6. Design System &amp; Print CSS</td>
                        <td className="p-3 font-mono">src/web/**/*.css</td>
                        <td className="p-3 font-bold">3 files</td>
                        <td className="p-3 font-mono font-bold">1,910 LOC</td>
                        <td className="p-3">136.0 KB</td>
                        <td className="p-3">Royal Midnight Navy Blue (#08142a → #0b1a33) &amp; Champagne Gold (#E0C1A3 / #B68F70) design system, A4 print styling</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">7. Cloudflare Container &amp; AI Worker</td>
                        <td className="p-3 font-mono">deploy/**</td>
                        <td className="p-3 font-bold">13 files</td>
                        <td className="p-3 font-mono font-bold">2,254 LOC</td>
                        <td className="p-3">82.6 KB</td>
                        <td className="p-3">Cloudflare Container (swk-one) + Dedicated Cloud AI Gateway Worker (deploy/one-ai) with D1 10-seat quota ledger</td>
                      </tr>
                      <tr className="bg-[#fbf9f4]">
                        <td className="p-3 font-bold">8. Automated QA &amp; Build Tools</td>
                        <td className="p-3 font-mono">tests/** + tools/**</td>
                        <td className="p-3 font-bold">44 files</td>
                        <td className="p-3 font-mono font-bold">7,079 LOC</td>
                        <td className="p-3">439.8 KB</td>
                        <td className="p-3">38 automated test suites (63/63 SWK ONE Android checks, Cloud AI bridge, compliance) + PDF/QR/Brand generators</td>
                      </tr>
                      <tr className="bg-[#f3ead8] font-extrabold text-[#08142a]">
                        <td className="p-3 rounded-bl-xl">TOTAL ENGINEERED SYSTEM</td>
                        <td className="p-3 font-mono">Full SWKONE Repository</td>
                        <td className="p-3">289 Files</td>
                        <td className="p-3 font-mono">58,474 LOC</td>
                        <td className="p-3">3,721.4 KB</td>
                        <td className="p-3 rounded-br-xl">100% Type-Safe TypeScript + Java · Engineered End-to-End by SHAMEEM HARFATH S M</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ================================================================ TAB 2: TECHNICAL MANUAL */}
          {tab === 'tech-manual' && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#fbf9f4] border border-[#e7e1d4] rounded-2xl p-5">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-[#9a7a42]">
                    DOCUMENT 02 OF 04 · TECHNICAL ARCHITECTURE, ANDROID, AI &amp; CLOUD MANUAL
                  </div>
                  <h2 className="font-display text-2xl font-bold text-[#08142a] m-0 mt-1">
                    5-Tier Architecture, Native Android Bridge, Hybrid AI Routing &amp; Runbook
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => printCurrentDocument('tech-manual')}
                  className="print:hidden px-4 py-2 rounded-xl bg-[#0b1a33] text-[#f3dfb8] text-xs font-bold border-0 cursor-pointer inline-flex items-center gap-2"
                >
                  <Printer size={14} /> Print Technical Manual
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="rounded-2xl border border-[#e7e1d4] p-4 bg-[#fbf9f4]">
                  <div className="font-bold text-sm text-[#08142a] flex items-center gap-2 mb-2">
                    <Smartphone size={16} className="text-[#9a7a42]" /> Native Android &amp; Mobile
                  </div>
                  <ul className="m-0 pl-4 space-y-1.5 text-[#3b4659]">
                    <li><strong>App ID:</strong> <code>ae.swkproperties.one</code> (<code>android/</code>)</li>
                    <li><strong>Foreground GPS:</strong> <code>SwkDutyLocationService.java</code> (active only on Field Duty)</li>
                    <li><strong>JS Bridge:</strong> <code>SwkNativePlugin.java</code> + <code>native-bridge.ts</code></li>
                    <li><strong>Offline Queue:</strong> <code>swk_one_offline_queue_v1</code> auto-replay on reconnect</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#e7e1d4] p-4 bg-[#fbf9f4]">
                  <div className="font-bold text-sm text-[#08142a] flex items-center gap-2 mb-2">
                    <Bot size={16} className="text-[#9a7a42]" /> Hybrid AI &amp; Document Engine
                  </div>
                  <ul className="m-0 pl-4 space-y-1.5 text-[#3b4659]">
                    <li><strong>Cloud AI Worker:</strong> <code>deploy/one-ai</code> + D1 10-seat quota ledger</li>
                    <li><strong>Private Local AI:</strong> Ollama <code>qwen3.5:4b</code> (Fast) &amp; <code>qwen3.5:9b</code> (Vision/Legal)</li>
                    <li><strong>Server OCR:</strong> Poppler + Tesseract (English + Arabic, 6 MiB / 10 pages)</li>
                    <li><strong>On-Device Browser Tools:</strong> WebP/JPEG watermark resize &amp; PDF merge/rotate</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#e7e1d4] p-4 bg-[#fbf9f4]">
                  <div className="font-bold text-sm text-[#08142a] flex items-center gap-2 mb-2">
                    <Server size={16} className="text-[#9a7a42]" /> Fastify 5, Dual DB &amp; Edge
                  </div>
                  <ul className="m-0 pl-4 space-y-1.5 text-[#3b4659]">
                    <li><strong>Backend:</strong> Fastify 5.12 on Node.js 22 with 384 validated routes</li>
                    <li><strong>Dual Persistence:</strong> Cloud PostgreSQL 16 + local SQLite WAL sync</li>
                    <li><strong>Edge Container:</strong> Cloudflare Worker <code>swk-one</code> + <code>SwkOs</code> container</li>
                    <li><strong>Domain:</strong> <code>https://one.swkpropertiesuae.com</code></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ TAB 3: HOW TO USE SWK ONE GUIDE */}
          {tab === 'staff-guide' && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#fbf9f4] border border-[#e7e1d4] rounded-2xl p-5">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-[#9a7a42]">
                    DOCUMENT 03 OF 04 · COMPLETE USER MANUAL &amp; STAFF SOP GUIDE
                  </div>
                  <h2 className="font-display text-2xl font-bold text-[#08142a] m-0 mt-1">
                    How to Use SWK ONE in Detail — Step-by-Step Guide for Every Tab &amp; Tool
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => printCurrentDocument('staff-guide')}
                  className="print:hidden px-4 py-2 rounded-xl bg-[#0b1a33] text-[#f3dfb8] text-xs font-bold border-0 cursor-pointer inline-flex items-center gap-2"
                >
                  <Printer size={14} /> Print User Manual
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {[
                  {
                    title: '1. Morning Attendance: 5-Layer Reception QR Check-In',
                    items: [
                      'Step 1: Connect phone to SWK-Properties-Office Wi-Fi (4G/5G cellular is blocked for office check-in).',
                      'Step 2: Scan the permanent Reception QR Stand (SWK-RECEPTION-STAND-DXB-1) with your phone camera or SWK ONE app.',
                      'Step 3: Sign in with your @swk.property email & password and tap "Sign In & Check In".',
                      'Step 4: Arrive by 10:05 AM GST for On-Time status; check-ins from 10:06 AM log exact late minutes.',
                    ],
                  },
                  {
                    title: '2. Using the 5-Tab SWK ONE Mobile Cockpit (/swk-one)',
                    items: [
                      'Tab 1 — Command: View live staff roll-call, switch Office/Field/Break mode, complete daily checklist, and submit 1-tap EOD Report.',
                      'Tab 2 — Field Duty: Start foreground GPS duty, view itinerary, launch Google Maps/Waze, log geofenced arrival, or trigger SOS.',
                      'Tab 3 — Inventory: Add listings in 60s, scan Title Deeds via Camera OCR, track key custody, and follow up on Developer NOCs.',
                      'Tab 4 — CRM & Deals: Work SLA-scored leads, generate AI Lead Briefings, compare units, compose digital offers, and reply on WhatsApp.',
                      'Tab 5 — HR & Pay: Track your 6-stage 50/50 commission waterfall, Verified Activity Score (0–100), HR Document Wallet, and leave.',
                    ],
                  },
                  {
                    title: '3. Using the 4-Tab Restricted @swk.property Staff Portal',
                    items: [
                      'Attendance Tab: Scan Reception QR, check in/out, submit Daily Work Summary, and request annual/emergency leave.',
                      'Manual Tab: Search official SWK Properties SOPs, RERA ORN 51517 rules, and ask the interactive Knowledge Assistant.',
                      'Market Pulse Tab: Inspect live AED/sqft, gross rental yields, 15-year forecasts, and client pitch scripts across 24 Dubai areas.',
                      'General Tab: Open UAE Deal Calculators, AI Studio, and install the native Android APK.',
                    ],
                  },
                  {
                    title: '4. Using the 9-Tab SWK ONE AI & Utilities Studio',
                    items: [
                      'Cloud AI & Local Ollama: Generate 32 types of UAE real estate content in 7 languages or analyze confidential docs on-premise with Qwen 3.5.',
                      'Photo Resize & Watermark: Resize listing photos to 1600px WebP/JPEG on-device and stamp "SWK Properties L.L.C · RERA ORN 51517".',
                      'PDF Tools & OCR: Merge, reorder, rotate, and stamp PDFs in the browser, or run bilingual English/Arabic OCR on scanned Title Deeds.',
                      'Document Review, Speech & Image: Compare two contracts with page-quoted findings, transcribe 60s audio notes, or generate MP3/images.',
                    ],
                  },
                ].map(sec => (
                  <div key={sec.title} className="rounded-2xl border border-[#e7e1d4] bg-[#fbf9f4] p-4 space-y-2">
                    <div className="font-display font-bold text-sm text-[#08142a]">{sec.title}</div>
                    <ul className="m-0 pl-4 space-y-1.5 text-[#2b3548]">
                      {sec.items.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================ TAB 4: CERTIFICATE */}
          {tab === 'certificate' && (
            <div className="space-y-8">
              <div className="rounded-3xl border-2 border-[#c9a96e] bg-[#fbf9f4] p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-1.5 border-b border-[#e7e1d4] pb-5">
                  <div className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#9a7a42]">
                    OFFICIAL CERTIFICATE OF SOFTWARE ENGINEERING HANDOVER
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#08142a] m-0">
                    SWK ONE — Mobile Super-App, AI Studio &amp; Operations Platform (v1.0 Production)
                  </h3>
                  <div className="text-xs text-[#4b5568]">
                    Delivered to <strong>{SWK_COMPANY_NAME}</strong> · {SWK_OFFICIAL_WEBSITES_TEXT}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 text-xs">
                  <div className="space-y-4">
                    <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#9a7a42]">
                      ARCHITECTED, ENGINEERED &amp; DELIVERED BY
                    </div>
                    <div className="font-display text-lg font-bold text-[#08142a]">SHAMEEM HARFATH S M</div>
                    <div className="text-[#4b5568]">Principal Software Architect &amp; Lead Full-Stack Engineer</div>
                    <div className="border-t border-[#08142a] pt-2 italic font-serif font-bold text-[#0b1a33]">
                      Digitally Signed — Shameem Harfath S M
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#9a7a42]">
                      RECEIVED &amp; ACCEPTED BY (OWNER — SWK PROPERTIES LLC)
                    </div>
                    <div className="font-display text-lg font-bold text-[#08142a]">MR. SHABIB SIRAJ</div>
                    <div className="text-[#4b5568]">Owner &amp; Managing Director, SWK Properties LLC</div>
                    <div className="border-t border-[#08142a] pt-2 text-[#4b5568]">
                      Owner Signature, Company Stamp &amp; Date · Dubai, UAE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <footer className="mt-10 pt-4 border-t-2 border-[#08142a] flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#4b5568]">
            <div>
              <strong className="text-[#08142a]">{SWK_COMPANY_NAME}</strong> · Dubai, United Arab Emirates ·{' '}
              <strong className="text-[#08142a]">{SWK_OFFICIAL_WEBSITES_TEXT}</strong>
            </div>
            <div>
              SWK ONE v1.0 · Architected &amp; Engineered by <strong className="text-[#08142a]">SHAMEEM HARFATH S M</strong>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
