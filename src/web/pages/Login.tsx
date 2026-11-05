import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, Eye, EyeOff, KeyRound, Loader2, Lock, Mail, Server, ShieldCheck, Smartphone } from 'lucide-react'
import { get, post, getSwkApiBaseUrl, setSwkApiBaseUrl } from '../lib/api'
import { isNativeAndroid, SWK_MOBILE_DOMAIN, SWK_OS_DOMAIN } from '../mobile/native-bridge'
import { useMeta } from '../lib/meta'
import { COMMUNITIES } from '../swk/uae'

/**
 * SWK ONE sign-in — split-screen layout with official SWK ONE Brand Architecture Assets
 * (Portal Arch Emblem + Primary Script Logo + Master Lockup on Deep Emerald #041615 & Champagne Gold #E0C1A3 / Brushed Bronze #B68F70).
 */
const ease = [0.16, 1, 0.3, 1] as const
const item = { hidden: { opacity: 0, y: 12, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } } }

function DubaiTime() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setT(new Date()), 30000); return () => clearInterval(i) }, [])
  return <>{new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: true }).format(t).toUpperCase()}</>
}

function MarketMoments() {
  const moments = useMemo(() => COMMUNITIES.map(c => ({ name: c.name, ppsf: c.ppsf, yoy: ((c.ppsf - c.ppsfLY) / c.ppsfLY) * 100, yieldPct: c.yieldPct })), [])
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => { if (reduce) return; const t = setInterval(() => setI(v => (v + 1) % moments.length), 4200); return () => clearInterval(t) }, [moments.length, reduce])
  const m = moments[i]!
  return (
    <div className="swk-glass p-6 w-full max-w-[560px]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-[10.5px] font-semibold tracking-[.24em] uppercase text-[#E0C1A3]">Dubai market pulse</span>
        <span className="flex gap-1">{moments.map((_, k) => <span key={k} className="h-1 rounded-full transition-all duration-500" style={{ width: k === i ? 18 : 6, background: k === i ? '#B68F70' : 'rgba(255,255,255,.25)' }} />)}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={m.name} initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }} transition={{ duration: 0.5, ease }}>
          <div className="font-display text-white text-[26px] font-semibold leading-tight">{m.name}</div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div><div className="text-[11px] text-white/55 uppercase tracking-wider">Price / sq ft</div><div className="font-display text-white text-[19px] font-semibold mt-0.5">AED {m.ppsf.toLocaleString()}</div></div>
            <div><div className="text-[11px] text-white/55 uppercase tracking-wider">Year on year</div><div className="font-display text-[19px] font-semibold mt-0.5 text-[#8fe3bd]">+{m.yoy.toFixed(1)}%</div></div>
            <div><div className="text-[11px] text-white/55 uppercase tracking-wider">Gross yield</div><div className="font-display text-white text-[19px] font-semibold mt-0.5">{m.yieldPct.toFixed(1)}%</div></div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function Login() {
  const { reload } = useMeta(); const nav = useNavigate(); const loc = useLocation()
  const reduce = useReducedMotion()
  const isAndroid = isNativeAndroid()
  const [email, setEmail] = useState(() => localStorage.getItem('swk.remember') || '')
  const [pw, setPw] = useState(''); const [totp, setTotp] = useState(''); const [needTotp, setNeedTotp] = useState(false)
  const [remember, setRemember] = useState(() => !!localStorage.getItem('swk.remember'))
  const [show, setShow] = useState(false); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false)
  const [help, setHelp] = useState(false); const [caps, setCaps] = useState(false)
  const [showServerCfg, setShowServerCfg] = useState(() => isAndroid && !getSwkApiBaseUrl())
  const [serverUrl, setServerUrl] = useState(() => getSwkApiBaseUrl())
  const [serverSaved, setServerSaved] = useState(false)
  const [demo, setDemo] = useState<{ enabled: boolean; email: string; password: string } | null>(null)
  useEffect(() => { void get<any>('/api/demo/status').then(setDemo).catch(() => {}) }, [serverUrl])

  const signIn = async (em: string, pass: string, targetPath?: string) => {
    setErr(''); setBusy(true)
    try {
      const r = await post<any>('/api/auth/login', { email: em, password: pass, totp: needTotp ? totp : undefined })
      if (r.needsTotp) { setNeedTotp(true); return }
      if (remember && em === email) localStorage.setItem('swk.remember', em); else if (!remember) localStorage.removeItem('swk.remember')
      setDone(true)
      await new Promise(res => setTimeout(res, reduce ? 0 : 550))
      const dest = targetPath || (isAndroid || (loc.state as any)?.from === '/swk-one' ? '/swk-one' : '/home')
      await reload(); nav(dest, { replace: true })
    } catch (e: any) { setErr(e.message || 'Sign-in failed. Check your details or SWK ONE server URL and try again.') } finally { setBusy(false) }
  }
  const submit = (e: React.FormEvent) => { e.preventDefault(); void signIn(email, pw) }

  return (
    <div className="swk-login">
      {/* ---------------------------------------------------------------- form side */}
      <section className="swk-login-form-side">
        <div className="swk-login-grid" aria-hidden />
        <img src="/brand/skyline-front.svg" alt="" aria-hidden className="absolute left-0 right-0 bottom-0 w-full h-[120px] opacity-[.07] pointer-events-none" />

        <motion.header className="relative flex items-center gap-3.5" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <img src="/brand/one/portal-arch-emblem.png" alt="SWK ONE Portal Arch Emblem" className="h-[48px] w-[48px] object-contain" />
          <img src="/brand/one/primary-logo.png" alt="SWK ONE" className="h-[46px] w-auto object-contain" />
          <div className="h-8 w-px bg-[#E0C1A3]/20 mx-0.5" />
          <div>
            <div className="font-display text-[#F3EFE6] text-[16px] font-semibold leading-none tracking-tight">SWK ONE Workspace</div>
            <div className="text-[10px] tracking-[.22em] uppercase text-[#E0C1A3] mt-1.5 font-semibold">SWK Properties · UAE</div>
          </div>
        </motion.header>

        <motion.div className="relative w-full max-w-[430px] mx-auto lg:mx-0 py-10" variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }} initial="hidden" animate="show">
          <motion.div variants={item} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[.26em] uppercase text-[#E0C1A3]"><span className="w-6 h-px bg-[#B68F70]" />Private office · Dubai</motion.div>
          <motion.h1 variants={item} className="mt-4 mb-0 text-[#F3EFE6] font-display font-medium leading-[1.04] text-[44px] sm:text-[52px]">
            Welcome <span className="swk-shimmer-text font-semibold">back</span>
          </motion.h1>
          <motion.p variants={item} className="mt-3 text-[15.5px] text-[#c7c0b4]">Sign in to continue to your SWK ONE workspace.</motion.p>

          <AnimatePresence>{err && (
            <motion.div role="alert" initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 22 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden">
              <div className="px-4 py-3 rounded-2xl text-[13.5px] font-medium text-[#ffcfc3] bg-[rgba(196,73,47,.14)] border border-[rgba(196,73,47,.4)]">{err}</div>
            </motion.div>)}</AnimatePresence>

          <form onSubmit={submit} className="mt-7 grid gap-4" aria-label="Sign in" noValidate={false}>
            <motion.div variants={item}>
              <label htmlFor="email" className="block text-[12.5px] font-medium text-[#d5cfc4] mb-2">Email address (@swk.property or @swkpropertiesuae.com)</label>
              <div className="swk-login-input"><Mail size={18} /><input id="email" type="email" autoComplete="username" required autoFocus={!email} value={email} onChange={e => setEmail(e.target.value)} placeholder="Talha@swk.property or admin@swkpropertiesuae.com" /></div>
            </motion.div>
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-2"><label htmlFor="pw" className="text-[12.5px] font-medium text-[#d5cfc4]">Password</label><button type="button" onClick={() => setHelp(h => !h)} className="text-[12.5px] font-medium text-[#E0C1A3] hover:text-[#F3EFE6] bg-transparent border-0 cursor-pointer p-0">Forgot password?</button></div>
              <div className="swk-login-input"><Lock size={18} />
                <input id="pw" type={show ? 'text' : 'password'} autoComplete="current-password" required autoFocus={!!email} value={pw} onChange={e => setPw(e.target.value)} onKeyUp={e => setCaps(e.getModifierState?.('CapsLock'))} placeholder="••••••••••" />
                <button type="button" className="bg-transparent border-0 cursor-pointer p-1 text-[#9eb0ac] hover:text-white" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              <AnimatePresence>{caps && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[12px] text-[#E0C1A3] mt-2">Caps Lock is on</motion.div>}</AnimatePresence>
              <AnimatePresence>{help && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="mt-3 text-[12.5px] leading-relaxed text-[#d5cfc4] rounded-xl px-3.5 py-3 bg-white/[.04] border border-[#E0C1A3]/20">Password resets are handled by the SWK IT desk. Email <a className="text-[#E0C1A3] underline underline-offset-2" href="mailto:info@swkpropertiesuae.com?subject=SWK%20ONE%20password%20reset">info@swkpropertiesuae.com</a> or call +971 56 433 0448.</div>
                </motion.div>)}</AnimatePresence>
            </motion.div>

            <AnimatePresence>{needTotp && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <label htmlFor="totp" className="block text-[12.5px] font-medium text-[#d5cfc4] mb-2">Authenticator code</label>
                <div className="swk-login-input"><KeyRound size={18} /><input id="totp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus required value={totp} onChange={e => setTotp(e.target.value.replace(/\D/g, ''))} placeholder="6-digit code" className="tracking-[.5em] text-[17px]" /></div>
                <p className="text-[12px] text-[#9eb0ac] mt-2 mb-0">Open your authenticator app and enter the code for SWK ONE.</p>
              </motion.div>)}</AnimatePresence>

            <motion.label variants={item} className="flex items-center gap-3 text-[13.5px] text-[#d5cfc4] cursor-pointer select-none w-fit">
              <input type="checkbox" className="swk-check" checked={remember} onChange={e => setRemember(e.target.checked)} />Keep me signed in on this device
            </motion.label>

            <motion.div variants={item} className="pt-1">
              <button className="swk-login-btn" disabled={busy || done}>
                <span className="relative z-[1] inline-flex items-center justify-center gap-2">
                  <AnimatePresence mode="wait" initial={false}>
                    {done ? <motion.span key="ok" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-2"><Check size={19} />Welcome</motion.span>
                      : busy ? <motion.span key="busy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2"><Loader2 size={18} className="animate-spin" />Signing in…</motion.span>
                      : <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2">{needTotp ? 'Verify & sign in' : 'Sign in'}<ArrowRight size={18} /></motion.span>}
                  </AnimatePresence>
                </span>
              </button>
            </motion.div>

            {demo?.enabled && (
              <motion.div variants={item}>
                <button type="button" className="w-full h-[50px] rounded-2xl border border-[#E0C1A3]/20 bg-white/[.03] text-[#F3EFE6] font-semibold text-[14px] cursor-pointer hover:border-[#E0C1A3]/60 hover:bg-white/[.06] transition-colors" disabled={busy} onClick={() => void signIn(demo.email, demo.password)}>Explore the demo workspace</button>
                <p className="text-[12px] text-[#9eb0ac] mt-2 mb-0 text-center">Fictional company and sample records — never touches live data.</p>
              </motion.div>
            )}

            {/* SWK ONE Native Android & Mobile Domain Server URL Connection Box */}
            <motion.div variants={item} className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between gap-2 flex-wrap text-[12px] text-[#d5cfc4]">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Smartphone size={14} className="text-[#E0C1A3]" />
                  SWK ONE Cloud: <b className="text-[#E0C1A3]">one.swkpropertiesuae.com</b>
                </span>
                <button
                  type="button"
                  onClick={() => setShowServerCfg((s: boolean) => !s)}
                  className="text-[12px] text-[#E0C1A3] hover:text-[#F3EFE6] bg-transparent border-0 cursor-pointer p-0 inline-flex items-center gap-1"
                >
                  <Server size={12} /> {showServerCfg ? 'Hide Domain Settings' : 'Domain & APK Settings'}
                </button>
              </div>
              <AnimatePresence>
                {showServerCfg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-3.5 rounded-2xl bg-white/[.04] border border-[#E0C1A3]/20 space-y-2.5">
                      <label className="block text-[11.5px] font-medium text-[#E0C1A3]">
                        SWK ONE Mobile & Workspace Domain Endpoint
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => { setServerUrl(SWK_MOBILE_DOMAIN); setSwkApiBaseUrl(SWK_MOBILE_DOMAIN); setServerSaved(true) }}
                          className="px-2.5 py-1 rounded-lg bg-[#11423e] border border-[#E0C1A3]/40 text-[#E0C1A3] text-[11px] font-bold cursor-pointer"
                        >
                          one.swkpropertiesuae.com (SWK ONE)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setServerUrl(SWK_OS_DOMAIN); setSwkApiBaseUrl(SWK_OS_DOMAIN); setServerSaved(true) }}
                          className="px-2.5 py-1 rounded-lg bg-[#B68F70]/20 border border-[#B68F70]/40 text-[#F3EFE6] text-[11px] font-bold cursor-pointer"
                        >
                          os.swkpropertiesuae.com (OS)
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={serverUrl}
                          onChange={e => { setServerUrl(e.target.value); setServerSaved(false) }}
                          placeholder={SWK_MOBILE_DOMAIN}
                          className="flex-1 px-3 py-2 rounded-xl bg-black/30 border border-white/15 text-white text-[12.5px] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSwkApiBaseUrl(serverUrl)
                            setServerSaved(true)
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#B68F70] text-[#041615] text-[12px] font-bold border-0 cursor-pointer"
                        >
                          {serverSaved ? 'Saved ✓' : 'Save'}
                        </button>
                      </div>
                      <p className="text-[11px] text-[#9eb0ac] m-0">
                        Connected to <b className="text-[#E0C1A3]">{SWK_MOBILE_DOMAIN}</b> and <b className="text-[#E0C1A3]">{SWK_OS_DOMAIN}</b> for all staff mobile browsers and Android APK handsets.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </form>
        </motion.div>

        <motion.footer className="relative flex items-center justify-between gap-4 flex-wrap text-[12px] text-[#9eb0ac]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }}>
          <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-[#E0C1A3]" />Encrypted session · activity is audited</span>
          <span>© {new Date().getFullYear()} SWK Properties L.L.C · RERA ORN 51517</span>
        </motion.footer>
      </section>

      {/* ---------------------------------------------------------------- hero side: SWK ONE Master Brand Architecture showcase */}
      <section className="swk-login-hero" aria-hidden>
        <motion.div className="swk-login-hero-img" style={{ backgroundImage: 'url(/brand/one/master-lockup-solid.png)', backgroundPosition: 'center 34%', backgroundSize: '58%', backgroundRepeat: 'no-repeat', backgroundColor: '#041615' }}
          initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease }}>
        </motion.div>
        <div className="swk-login-hero-shade" />

        <motion.div className="absolute top-10 left-10 swk-glass px-3.5 py-2.5 flex items-center gap-3 text-[12.5px] text-[#F3EFE6]" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5, ease }}>
          <img src="/brand/one/portal-arch-emblem.png" alt="" className="w-7 h-7 object-contain" />
          <span>SWK Properties L.L.C · <b className="text-[#E0C1A3]">RERA ORN 51517</b></span>
        </motion.div>

        <motion.div className="absolute top-10 right-10 swk-glass px-4 py-2.5 flex items-center gap-3 text-[13px] text-[#F3EFE6]" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5, ease }}>
          <span className="w-2 h-2 rounded-full bg-[#E0C1A3] shadow-[0_0_0_4px_rgba(224,193,163,.22)]" />Dubai · <b className="font-semibold text-[#E0C1A3]"><DubaiTime /></b>
        </motion.div>

        <div className="absolute left-10 right-10 bottom-10 flex items-end justify-between gap-6">
          <motion.div className="flex-1" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6, ease }}>
            <div className="text-[11px] tracking-[.26em] uppercase text-[#E0C1A3] mb-2.5 font-semibold">From arrival to address · Dubai</div>
            <div className="font-display text-[#F3EFE6] text-[34px] xl:text-[40px] leading-[1.08] font-semibold max-w-[540px] mb-5">Every listing, viewing, lease and transfer — <span className="text-[#E0C1A3]">in SWK ONE.</span></div>
            <MarketMoments />
          </motion.div>
          <motion.div className="hidden xl:flex flex-col items-center justify-between w-[196px] rounded-2xl overflow-hidden border border-[#E0C1A3]/35 shadow-2xl flex-none bg-[#041615]/95 p-3.5 gap-2.5" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6, ease }}>
            <img src="/brand/one/app-icons-pair-labeled.png" alt="SWK ONE Dark & Light App Icons" className="w-full h-auto object-contain rounded-xl" />
            <div className="text-[10px] tracking-[.18em] uppercase text-[#E0C1A3] font-bold text-center">SWK ONE · iOS & Android</div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
