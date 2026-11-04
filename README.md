# SWK AI & SWK ONE Mobile App (`ae.swkproperties.one`)

<p align="center">
  <img src="public/brand/swk-os-wordmark.svg" alt="SWK Properties LLC" width="220" />
</p>

**Official Mobile Application (`SWK ONE` — `ae.swkproperties.one`), Local AI Studio (`OllamaStudio` / `Qwen 3.5`), PDF Handbooks & Utility Suite** for **SWK Properties LLC (Dubai, UAE)**.

---

## 📱 1. SWK ONE Native Android & Mobile Workspace (`/swk-one`)

- **Android Application ID**: `ae.swkproperties.one` (`android/`)
- **Mobile Workspace (`src/web/mobile/`)**:
  - `SwkOneApp.tsx` — 5-tab mobile command center (`Command`, `Field Duty`, `Inventory`, `CRM`, `HR & Pay`)
  - `SwkOneRestrictedStaffView.tsx` — Restricted `@swk.property` staff portal (`Attendance`, `Company Manual`, `Market Pulse`, `General`)
  - `SwkOneTabs.tsx` & `SwkOneModals.tsx` — Live GPS site-visit verification, Dubai 24-community Area Companion, camera Title Deed/Passport OCR, offline queue sync, and end-of-day reporting
  - `native-bridge.ts` — Hardware device telemetry, foreground GPS duty service bridge (`SwkNativePlugin.java`, `SwkDutyLocationService.java`), and cross-origin session token persistence

---

## 🤖 2. SWK AI Studio & Local Model Workspace (`/ai`)

- **Internal Ollama Studio (`src/web/components/OllamaStudio.tsx`)**:
  - On-premise model selector (`qwen3.5:4b` Fast Mode & `qwen3.5:9b` Pro + Vision)
  - Deep Think vs. 1-second Fast Mode toggle
  - Image/Vision upload for Title Deeds, floorplans, and property photos
  - One-click UAE real estate prompt templates (Bayut/Dubizzle copy, DLD 4% closing table, WhatsApp follow-up, RERA Form A/F checklist)
  - Company domain verification (`@swkpropertiesuae.com` & `@swk.property`) and Cloudflare Tunnel script (`start-ollama-tunnel.bat`)

---

## 🖨️ 3. Printable PDF Assets & Utility Tools

- **Permanent Reception QR Poster**: [`public/SWK_Office_Attendance_QR_Poster.pdf`](public/SWK_Office_Attendance_QR_Poster.pdf) (`SWK-RECEPTION-STAND-DXB-1`)
- **Owner & Manager Master Handbooks**:
  - `docs/SWK_Properties_OS_Owner_Master_Handbook.pdf`
  - `docs/SWK_Properties_OS_Manager_Handbook_Mohammad_Haseeb.pdf`
- **UAE Deal Calculators (`/toolkit`)**: Buyer Cost-to-Close, CBUAE Mortgage, RERA Rent Index, Yield & ROI, Golden Visa, Commission Split, Tenant Move-In, and Off-Plan Schedule.

---

## ▶️ 4. Building & Verifying

```bash
npm install
npm run dev                  # API on :8080 + Web on :5173
npm run build                # Build Web (dist/web) + API (dist/server/index.mjs)
npm run android:sync         # Sync web bundle into android/app/src/main/assets/public
npm run android:apk          # Build native Android APK (android/app/build/outputs/apk/debug/)
npx tsx tests/swk-one-android.ts   # Run 63/63 SWK ONE Android & Mobile acceptance checks
npx tsx tests/mobile.ts            # Run mobile workday & GPS field session checks
```

See [docs/ANDROID.md](docs/ANDROID.md) and [docs/ANDROID_FEATURE_COVERAGE.md](docs/ANDROID_FEATURE_COVERAGE.md) for complete Android architecture and feature coverage.
