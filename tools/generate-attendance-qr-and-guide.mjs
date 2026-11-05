import fs from 'node:fs'
import path from 'node:path'
import QRCode from 'qrcode'
import { chromium } from 'playwright-core'

const root = path.resolve(import.meta.dirname, '..')
const pubDir = path.join(root, 'public')
const oneBrandDir = path.join(pubDir, 'brand', 'one')
const artifactDir = 'C:/Users/shamh/.gemini/antigravity/brain/41ab3c83-72df-4793-9436-1f9580148f65'
const CHROME_EXE = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const STAND_CODE = 'SWK-RECEPTION-STAND-DXB-1'
const SCAN_URL = `https://one.swkpropertiesuae.com/reception-qr?scan=1&stand=${STAND_CODE}`

function toDataUri(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.svg' ? 'image/svg+xml' : 'image/png'
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`
}

async function main() {
  const horizLogoUri = toDataUri(path.join(oneBrandDir, 'horizontal-lockup.png'))
  const masterLogoUri = toDataUri(path.join(oneBrandDir, 'master-lockup.png'))
  const archEmblemUri = toDataUri(path.join(oneBrandDir, 'portal-arch-emblem.png'))
  const darkAppIconUri = toDataUri(path.join(oneBrandDir, 'app-icon-dark-labeled.png'))

  const qrDataUri = await QRCode.toDataURL(SCAN_URL, {
    width: 960,
    margin: 2,
    color: {
      dark: '#0b1a33',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  })

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      background: #08142a;
      color: #F3EFE6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 210mm;
      height: 297mm;
      padding: 11mm 12mm;
      background: radial-gradient(circle at 50% 0%, #14305c 0%, #0b1a33 58%, #08142a 100%);
      position: relative;
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
    }
    .frame {
      flex: 1;
      border: 1.5px solid rgba(224, 193, 163, 0.42);
      border-radius: 22px;
      padding: 22px 26px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: linear-gradient(180deg, rgba(13, 31, 60, 0.72) 0%, rgba(8, 20, 42, 0.90) 100%);
      box-shadow: inset 0 0 0 1px rgba(224, 193, 163, 0.12);
    }
    .top-brand {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .top-brand img.horiz {
      height: 68px;
      width: auto;
      object-fit: contain;
    }
    .sub-org {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: #E0C1A3;
      opacity: 0.92;
    }
    .pill {
      display: inline-block;
      margin-top: 4px;
      padding: 5px 16px;
      border-radius: 999px;
      border: 1px solid rgba(224, 193, 163, 0.45);
      background: rgba(20, 48, 92, 0.65);
      color: #E0C1A3;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }
    .hero-title {
      font-size: 29px;
      font-weight: 900;
      letter-spacing: 0.02em;
      color: #FFFFFF;
      margin-top: 4px;
    }
    .hero-sub {
      font-size: 13px;
      color: #c5d1e6;
    }
    /* QR Card */
    .qr-wrap {
      margin: 8px auto;
      background: #FFFFFF;
      border-radius: 26px;
      padding: 20px 22px 16px;
      border: 4px solid #B68F70;
      box-shadow: 0 22px 50px rgba(0, 0, 0, 0.55);
      text-align: center;
      width: 390px;
    }
    .qr-box {
      position: relative;
      width: 336px;
      height: 336px;
      margin: 0 auto;
    }
    .qr-box img.qr {
      width: 100%;
      height: 100%;
      display: block;
    }
    .qr-center-badge {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 74px;
      height: 74px;
      border-radius: 18px;
      background: linear-gradient(145deg, #14305c 0%, #0b1a33 100%);
      border: 3px solid #E0C1A3;
      box-shadow: 0 6px 18px rgba(8, 20, 42, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
    }
    .qr-center-badge img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .stand-tag {
      display: inline-block;
      margin-top: 10px;
      padding: 5px 16px;
      border-radius: 8px;
      background: #F3EFE6;
      border: 1px solid #d5c7b2;
      color: #0b1a33;
      font-family: Consolas, 'Courier New', monospace;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.12em;
    }
    /* 3 quick steps on Poster */
    .quick-steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .q-card {
      background: rgba(20, 48, 92, 0.42);
      border: 1px solid rgba(224, 193, 163, 0.28);
      border-radius: 16px;
      padding: 13px 14px;
    }
    .q-num {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: linear-gradient(135deg, #E0C1A3, #B68F70);
      color: #0b1a33;
      font-weight: 900;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }
    .q-title {
      font-size: 13px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 4px;
    }
    .q-desc {
      font-size: 11px;
      line-height: 1.42;
      color: #c5d1e6;
    }
    .q-desc b { color: #E0C1A3; }
    .poster-foot {
      border-top: 1px solid rgba(224, 193, 163, 0.22);
      padding-top: 10px;
      text-align: center;
      font-size: 11px;
      color: #E0C1A3;
      font-weight: 700;
    }
    .poster-foot .url {
      margin-top: 3px;
      font-family: Consolas, monospace;
      font-size: 10px;
      color: #9fb0cc;
      font-weight: 500;
    }

    /* PAGE 2: STEP-BY-STEP ATTENDANCE INFOGRAPHIC */
    .info-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(224, 193, 163, 0.28);
      padding-bottom: 12px;
    }
    .info-header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .info-header-left img {
      height: 52px;
      width: 52px;
      border-radius: 12px;
      object-fit: contain;
    }
    .info-eyebrow {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #E0C1A3;
    }
    .info-title {
      font-size: 22px;
      font-weight: 900;
      color: #FFFFFF;
      margin-top: 2px;
    }
    .info-sub {
      font-size: 11.5px;
      color: #b9c7de;
    }
    .schedule-banner {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin: 12px 0;
    }
    .sched-box {
      background: rgba(20, 48, 92, 0.55);
      border: 1px solid rgba(224, 193, 163, 0.30);
      border-radius: 12px;
      padding: 9px 12px;
      text-align: center;
    }
    .sched-lbl {
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #9fb0cc;
    }
    .sched-val {
      font-size: 13px;
      font-weight: 800;
      color: #E0C1A3;
      margin-top: 3px;
    }
    /* Step timeline */
    .steps-stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .step-row {
      display: grid;
      grid-template-columns: 52px 1fr 175px;
      gap: 14px;
      align-items: center;
      background: rgba(15, 34, 68, 0.78);
      border: 1px solid rgba(224, 193, 163, 0.26);
      border-left: 4px solid #B68F70;
      border-radius: 14px;
      padding: 11px 15px;
    }
    .step-badge {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #E0C1A3 0%, #B68F70 100%);
      color: #0b1a33;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      line-height: 1;
    }
    .step-badge small {
      font-size: 8px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .step-badge b {
      font-size: 18px;
    }
    .step-main h3 {
      font-size: 14px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 3px;
    }
    .step-main p {
      font-size: 11.2px;
      line-height: 1.42;
      color: #c5d1e6;
    }
    .step-main p b { color: #E0C1A3; }
    .step-tag {
      background: rgba(8, 20, 42, 0.85);
      border: 1px solid rgba(224, 193, 163, 0.28);
      border-radius: 10px;
      padding: 8px 10px;
      font-size: 10.5px;
      color: #E0C1A3;
      font-weight: 700;
      text-align: center;
      line-height: 1.35;
    }
    .step-tag span {
      display: block;
      font-size: 9.5px;
      color: #9fb0cc;
      font-weight: 500;
      margin-top: 2px;
    }
    /* Bottom 2-column grid: 5-Layer Security + Field & Check-out rules */
    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 10px;
    }
    .info-panel {
      background: rgba(20, 48, 92, 0.38);
      border: 1px solid rgba(224, 193, 163, 0.28);
      border-radius: 14px;
      padding: 12px 14px;
    }
    .info-panel h4 {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #E0C1A3;
      margin-bottom: 8px;
      border-bottom: 1px solid rgba(224, 193, 163, 0.18);
      padding-bottom: 5px;
    }
    .check-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 5px;
      font-size: 10.8px;
      color: #d5dfef;
      line-height: 1.38;
    }
    .check-list li b {
      color: #FFFFFF;
    }
  </style>
</head>
<body>
  <!-- PAGE 1: PRINTABLE RECEPTION ATTENDANCE QR POSTER -->
  <section class="page" id="page-qr-poster">
    <div class="frame">
      <div class="top-brand">
        <img src="${horizLogoUri}" alt="SWK ONE" class="horiz" />
        <div class="sub-org">SWK Properties L.L.C · Dubai Head Office · RERA ORN 51517</div>
        <div><span class="pill">Permanent Office Reception QR</span></div>
        <h1 class="hero-title">STAFF ATTENDANCE CHECK-IN</h1>
        <p class="hero-sub">Scan with your mobile camera while connected to Office Wi-Fi</p>
      </div>

      <div class="qr-wrap" id="qr-card-only">
        <div class="qr-box">
          <img src="${qrDataUri}" alt="SWK ONE Attendance QR" class="qr" />
          <div class="qr-center-badge">
            <img src="${archEmblemUri}" alt="SWK ONE Emblem" />
          </div>
        </div>
        <div class="stand-tag">${STAND_CODE}</div>
      </div>

      <div class="quick-steps">
        <div class="q-card">
          <div class="q-num">1</div>
          <div class="q-title">Connect to Office Wi-Fi</div>
          <div class="q-desc">Connect your phone to <b>SWK-Properties-Office</b> (cellular 4G/5G is blocked for office check-in).</div>
        </div>
        <div class="q-card">
          <div class="q-num">2</div>
          <div class="q-title">Scan QR with Camera</div>
          <div class="q-desc">Point your phone camera or <b>SWK ONE App</b> scanner at this QR code to open the Attendance Sign-In screen.</div>
        </div>
        <div class="q-card">
          <div class="q-num">3</div>
          <div class="q-title">Sign In &amp; Check In</div>
          <div class="q-desc">Enter your <b>@swk.property</b> email &amp; password and tap <b>Sign In &amp; Check In</b> to log verified attendance.</div>
        </div>
      </div>

      <div class="poster-foot">
        Working Hours: Mon–Fri 10:00 AM – 7:00 PM · Sat 10:00 AM – 4:00 PM · Grace Cutoff: 10:05 AM GST
        <div class="url">${SCAN_URL}</div>
      </div>
    </div>
  </section>

  <!-- PAGE 2: STEP-BY-STEP ATTENDANCE INFOGRAPHIC GUIDE -->
  <section class="page" id="page-infographic">
    <div class="frame">
      <div class="info-header">
        <div class="info-header-left">
          <img src="${darkAppIconUri}" alt="SWK ONE" />
          <div>
            <div class="info-eyebrow">SWK ONE · Standard Operating Procedure</div>
            <div class="info-title">HOW TO COMPLETE DAILY ATTENDANCE (STEP BY STEP)</div>
            <div class="info-sub">Mandatory Daily Check-In, Field Duty &amp; End-of-Day Check-Out Workflow for All SWK Staff</div>
          </div>
        </div>
        <img src="${masterLogoUri}" alt="SWK ONE Master" style="height:56px;width:auto;object-fit:contain;" />
      </div>

      <div class="schedule-banner">
        <div class="sched-box">
          <div class="sched-lbl">Mon – Fri Shift</div>
          <div class="sched-val">10:00 AM – 7:00 PM</div>
        </div>
        <div class="sched-box">
          <div class="sched-lbl">Saturday Shift</div>
          <div class="sched-val">10:00 AM – 4:00 PM</div>
        </div>
        <div class="sched-box">
          <div class="sched-lbl">Grace Cutoff (GST)</div>
          <div class="sched-val">10:05 AM Sharp</div>
        </div>
        <div class="sched-box">
          <div class="sched-lbl">Approved Wi-Fi</div>
          <div class="sched-val">SWK-Properties-Office</div>
        </div>
      </div>

      <div class="steps-stack">
        <div class="step-row">
          <div class="step-badge"><small>STEP</small><b>1</b></div>
          <div class="step-main">
            <h3>Connect Your Phone to Office Wi-Fi</h3>
            <p>Upon arriving at the Dubai Head Office, connect your handset to <b>SWK-Properties-Office</b>. The reception page automatically checks your network and blocks mobile data (<b>4G/5G cellular</b>) or external hotspots.</p>
          </div>
          <div class="step-tag">
            Wi-Fi Verified ✓
            <span>SSID: SWK-Properties-Office</span>
          </div>
        </div>

        <div class="step-row">
          <div class="step-badge"><small>STEP</small><b>2</b></div>
          <div class="step-main">
            <h3>Scan the Permanent Reception QR Stand</h3>
            <p>Open your phone’s native <b>Camera App</b> (or the <b>SWK ONE Mobile App → QR Check-In</b>) and scan the reception QR code (<b>${STAND_CODE}</b>). Works 24/7 even if all office computers are turned off.</p>
          </div>
          <div class="step-tag">
            QR Stand Token ✓
            <span>${STAND_CODE}</span>
          </div>
        </div>

        <div class="step-row">
          <div class="step-badge"><small>STEP</small><b>3</b></div>
          <div class="step-main">
            <h3>Sign In with Your Personal @swk.property Credentials</h3>
            <p>Enter your individual <b>name@swk.property</b> email address and password on the <b>Office Attendance Sign-In</b> screen, then tap <b>Sign In &amp; Check In</b>. Never sign in on another colleague’s phone.</p>
          </div>
          <div class="step-tag">
            1-to-1 Device Lock ✓
            <span>Anti-Buddy-Punching Active</span>
          </div>
        </div>

        <div class="step-row">
          <div class="step-badge"><small>STEP</small><b>4</b></div>
          <div class="step-main">
            <h3>Verify Your Instant Check-In Confirmation Card</h3>
            <p>Wait 1 second for the green <b>Checked In Successfully</b> screen showing your <b>GST Timestamp</b>, <b>On Time ✓</b> status (if before <b>10:05 AM GST</b>), verified Wi-Fi network, and unique reference code (<b>ATT-…</b>).</p>
          </div>
          <div class="step-tag">
            Live Roll-Call Sync ✓
            <span>Visible on Manager Board</span>
          </div>
        </div>

        <div class="step-row">
          <div class="step-badge"><small>STEP</small><b>5</b></div>
          <div class="step-main">
            <h3>Field Duty / Viewings &amp; End-of-Day Check-Out Gate</h3>
            <p>Leaving for a client viewing? Tap <b>Start Field Duty</b> in SWK ONE and log your <b>GPS Viewing Arrival</b> on-site. Before leaving at <b>7:00 PM</b> (<b>4:00 PM Sat</b>), submit your <b>1-Tap EOD Report</b> to unlock <b>Office Check-Out</b>.</p>
          </div>
          <div class="step-tag">
            EOD Gate + Check-Out ✓
            <span>Auto-Reconciles CRM &amp; Calls</span>
          </div>
        </div>
      </div>

      <div class="bottom-grid">
        <div class="info-panel">
          <h4>5-Layer Anti-Loophole Security Rules</h4>
          <ul class="check-list">
            <li>• <b>Layer 1 — Office Wi-Fi &amp; IP Lock:</b> Cellular data &amp; remote networks are rejected.</li>
            <li>• <b>Layer 2 — Physical QR Stand Code:</b> Requires scanning <b>${STAND_CODE}</b>.</li>
            <li>• <b>Layer 3 — Personal Staff Auth:</b> Requires valid <b>@swk.property</b> password.</li>
            <li>• <b>Layer 4 — Hardware Device Binding:</b> 1 phone = 1 staff member (blocks buddy-punching).</li>
            <li>• <b>Layer 5 — GST Cutoff Audit:</b> Check-ins after <b>10:05 AM GST</b> record exact late minutes.</li>
          </ul>
        </div>
        <div class="info-panel">
          <h4>Special Scenarios &amp; Troubleshooting</h4>
          <ul class="check-list">
            <li>• <b>First Person Arriving Early:</b> Scan the printed QR stand — no office PC needs to be on.</li>
            <li>• <b>Direct Morning Client Viewing:</b> Start <b>Field Duty</b> in SWK ONE &amp; check in via live GPS at the property.</li>
            <li>• <b>“Not on Office Wi-Fi” Warning:</b> Turn off Mobile Data temporarily so your phone routes via Office Wi-Fi.</li>
            <li>• <b>New Phone / Handset Upgrade:</b> Ask Admin/Manager to reset your enrolled device binding in SWK ONE.</li>
          </ul>
        </div>
      </div>

      <div class="poster-foot">
        SWK ONE · Enterprise Real Estate Operating System · https://one.swkpropertiesuae.com
      </div>
    </div>
  </section>
</body>
</html>`

  const browser = await chromium.launch({
    executablePath: CHROME_EXE,
    headless: true,
  })
  try {
    const page = await browser.newPage({
      viewport: { width: 1240, height: 1754 },
      deviceScaleFactor: 2,
    })
    await page.setContent(html, { waitUntil: 'networkidle' })

    // 1. Save 2-page A4 PDF (Poster + Step-by-Step Infographic)
    const pdfBuf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    })
    fs.writeFileSync(path.join(pubDir, 'SWK_Office_Attendance_QR_Poster.pdf'), pdfBuf)
    fs.writeFileSync(path.join(pubDir, 'SWK_ONE_Attendance_Step_By_Step_Guide.pdf'), pdfBuf)
    fs.writeFileSync(path.join(artifactDir, 'SWK_Office_Attendance_QR_Poster.pdf'), pdfBuf)

    // 2. Save Page 1 full poster PNG
    const page1El = page.locator('#page-qr-poster')
    const posterPng = await page1El.screenshot({ type: 'png' })
    fs.writeFileSync(path.join(oneBrandDir, 'attendance-qr-poster.png'), posterPng)
    fs.writeFileSync(path.join(artifactDir, 'SWK_ONE_Attendance_QR_Poster.png'), posterPng)

    // 3. Save Page 2 Step-by-Step Infographic PNG
    const page2El = page.locator('#page-infographic')
    const infoPng = await page2El.screenshot({ type: 'png' })
    fs.writeFileSync(path.join(oneBrandDir, 'attendance-step-by-step-infographic.png'), infoPng)
    fs.writeFileSync(path.join(artifactDir, 'SWK_ONE_Attendance_Step_By_Step_Infographic.png'), infoPng)

    // 4. Save standalone QR card PNG
    const qrCardEl = page.locator('#qr-card-only')
    const qrCardPng = await qrCardEl.screenshot({ type: 'png' })
    fs.writeFileSync(path.join(oneBrandDir, 'attendance-qr-code.png'), qrCardPng)
    fs.writeFileSync(path.join(artifactDir, 'SWK_ONE_Attendance_QR_Code.png'), qrCardPng)

    console.log('✓ Generated SWK ONE Attendance QR Code PNG, Poster PNG, Step-by-Step Infographic PNG, and 2-page A4 PDF.')
  } finally {
    await browser.close()
  }
}

main()
