# SWK ONE
## Master implementation and rollout plan

**Target:** one.swk.properties
**Audience:** 10 named SWK employees
**Source audited:** swkpropertiesuae/SWKAI at 670a65019885827d055920aff3b3e810436afaf0
**Product structure:** Operations and AI & Utilities share one staff session. Existing role and record permissions govern operational work. A separate AI gateway handles eligible cloud text.

## 1. Repository audit and reuse

| Area | Evidence in SWKAI | Reuse and verification |
|---|---|---|
| Web and API | Vite/React frontend, Fastify on Node, shared entity registry, SQLite/PostgreSQL bridge | Reuse existing app shell and endpoints. Deploy Fastify on a Node host or Cloudflare Container. The ordinary Workers runtime is for the separate AI gateway. |
| Android | ae.swkproperties.one, Gradle project, bundled WebView UI, native bridge and foreground duty service | Keep the existing application ID. Use the new backend URL in new builds. Verify existing server overrides, signing continuity, camera, foreground location, uploads, and offline replay on real devices. |
| Field operations | SwkOneApp, restricted staff view, attendance, viewing and field endpoints, daily reports | Preserve role restrictions and workflow behavior. Validate each authorized action against staging. Repo documentation lists broad coverage but does not establish production readiness. |
| Inventory and CRM | Native workspaces and shared APIs for leads, viewings, listings and associated workflows | Use server-owned records. Keep one system of record per entity. Evaluate scoped OS API access before any live sync or write-back. |
| AI | OllamaStudio and /api/ai/ollama routes, existing agents, integrations and approvals | Keep local Ollama UI. Add a separate public-text path with the new Worker. Audit legacy agents separately before allowing external model access to live operational context. |
| Utilities | ToolkitPage, documents and print modules, OCR/document dependencies, handbook and reception assets | Retain existing utility entry points. Verify each permission, source, calculation and output. |
| Branding | Attached ONE and Properties logo/app-icon kits | Use the supplied ONE mark in the application and preserve Properties assets for corporate documents. Package native adaptive and iOS icons in later platform builds after device checks. |
| Authentication | Existing role checks and known staff fixture passwords in public source | Release blocker. The implementation removes those passwords from the app source and limits staff fixture provisioning to explicitly configured development tests. Rotate active/reused passwords and revoke affected sessions in every existing deployment. Check public history and built artifacts. Verify production account provisioning before opening the domain. |

Source links: [SWKAI snapshot](https://github.com/swkpropertiesuae/SWKAI/tree/670a65019885827d055920aff3b3e810436afaf0), [Android guide](https://github.com/swkpropertiesuae/SWKAI/blob/670a65019885827d055920aff3b3e810436afaf0/docs/ANDROID.md).

## 2. Architecture and boundaries

| Layer | Proposed production choice | Responsibility |
|---|---|---|
| Web | Existing React build, served by SWK ONE Fastify | Operations, AI studio, browser file utilities, bilingual layouts, review and export. |
| Android | Existing Android app with native integrations | Camera, GPS while on duty, protected session and offline queue, deep links and mobile tools. iOS is a separate scope. |
| Application API | Separate SWK ONE deployment, using the bundled Cloudflare Container config or a dedicated Node host behind Cloudflare | Staff authentication, records, roles, session checks, data classification, approvals, and call to AI gateway. |
| Operational database | Dedicated PostgreSQL database or isolated schema and credentials | Staff, attendance, CRM, inventory, documents, permissions, review. Start on a fresh staging database. Decide the canonical source and migration cutover before importing records. |
| Cloud AI gateway | Cloudflare Worker with Workers AI binding and D1 usage ledger | Shared Cloudflare route, approved per-staff fallbacks, quotas, timeouts, no provider key in the browser. |
| Private jobs | Authenticated worker, private storage and durable queue | OCR, audio, legal document analysis and private Ollama. Production queue and worker orchestration are future phases. |
| Storage | Private object buckets for ordinary files, separate approved store for restricted data | Metadata owner, file limits, expiry, short-lived downloads and backup policy. Browser PDF/photo utilities keep files on the device. |

Request paths:

- Operations: Staff session → Fastify → role and record authorization → operational store.
- Cloud text: Staff session → Fastify → public-data confirmation and validation → HTTPS AI gateway with server-only bridge secret → D1 reservation → shared Workers AI or approved staff-specific fallback.
- Restricted work: Staff session → approved private storage and worker → OCR, Whisper or Ollama → authorized result. If private compute is unavailable, show a queued status when the queue exists.
- Browser tools: file input → device processing → download. No model usage.

## 3. Staff and AI provisioning

Create ten named staff accounts through the approved account provisioning flow. Assign staff, reviewer and administrator roles inside those accounts. Start with two test staff, then add eight after acceptance. Restrict ordinary staff to their own or explicitly assigned records. Review access to location, payroll, IDs and client recordings separately. Staff sign in once, change a temporary password where required, and select a task. IT provisions and rotates all provider keys.

1. Deploy the AI gateway with a D1 database and run deploy/one-ai/schema.sql. Copy its Wrangler example to the live config and fill in the D1 ID.
2. Set ONE_AI_BRIDGE_SECRET in the gateway and app to the same strong random value. Set ONE_AI_GATEWAY_URL in the app to the approved HTTPS gateway origin. Never expose these in the app bundle.
3. Set STAFF_SLOTS in the gateway as a JSON mapping of existing SWK ONE numeric user IDs to unique slots 1 through 10, such as {"123":1,"124":2}. Use the staging roster separately.
4. Set STAFF_PROVIDER_KEYS keyed by slot with opencode, groq and gemini values. Use official provider keys provisioned for the intended usage. Remove the slot mapping on offboarding and rotate its upstream keys. The shared Workers AI connection needs no staff-specific key.
5. Set FREE_ROUTES only after verifying the precise model, business-use terms, billing and actual quota. Current starter takes one model per provider with a shared request cap. Shape: {"opencode":{"enabled":true,"model":"glm-5.3-flash-free","dailyRequests":25}}. Test fallback before opening production.
6. The app estimates a 6,500-Neuron daily cap by default and applies a separate per-staff request cap. Reserve allowance for other Cloudflare workloads, test concurrent use and reconcile with the dashboard. Separate credentials support attribution and revocation. Independent free quotas require confirmation in each provider account. Paid API routing stays disabled unless deliberately configured in a future release.

| Capability | Candidate route | Policy |
|---|---|---|
| Daily public writing | Cloudflare Qwen3 30B A3B FP8 | Shared first route in starter. |
| Public text fallback | OpenCode GLM Flash or DeepSeek Flash, then approved Groq and Gemini candidates | Only exact, currently eligible IDs. Big Pickle may be evaluated on public data. Trial-only routes remain evaluations. |
| Public brochures and imagery | Gemini Flash-Lite or approved Workers AI vision | Planned separately. Use source excerpts and check AED figures. |
| Speech and creative imagery | Cloudflare Whisper Turbo, Deepgram Aura by language, and FLUX Klein | Planned separately with separate quotas and consent/data classification. |
| Confidential or long work | Private Qwen 3.5 4B/9B, Tesseract, PaddleOCR, faster-whisper | Keep on approved infrastructure. Benchmark English, Arabic and mixed speech on actual samples. |
| Premium capability | OpenAI project API | Optional future route, explicit admin budget and allowlist. |

The GitHub directories Free-LLM, awesome-freellm-apis and awesome-free-llm-apis are provider discovery inputs. FreeLLMAPI can be piloted on Oracle or AWS for approved public text once it demonstrates credential isolation and clear upstream usage. The current app uses direct adapters and keeps provider selection server-side.

## 4. Master utility catalogue

| Workspace | Utilities and workflows | Delivery |
|---|---|---|
| Command | Workday dashboard, checklist, schedule, daily report, reminders, task inbox, shift handoff, notifications | Reuse and verify. |
| Attendance | Reception QR, check-in/out, history, corrections, field attendance, approval and export | Reuse. Verify production QR mode and stand, authorization and server time. Keep existing printed codes functional during migration. |
| Field | Itinerary, maps, arrival, GPS evidence, no-show, viewing notes, duty status, SOS, offline replay | Reuse and device-test. Define GPS activation and retention. |
| Sales | Assigned lead queue, lead brief, call log, viewing outcome, follow-up draft, offer and negotiation timeline, closing checklist | Reuse records. Add a reviewed handoff from AI output in a later phase. |
| Listings | Inventory intake, duplicate checks, owner authority, price freshness, condition photos, key custody, permit and publication status | Reuse workflows. Gate publishing behind explicit approval and verified account access. |
| People | Staff profile, onboarding, leave, HR document wallet, renewal and pay views | Reuse only with role and record validation. Protect HR files separately. |
| Deal calculators | Cost-to-close, commission, rental yield, ROI, off-plan installments, mortgage estimates, move-in estimate | Reuse toolkit. Maintain dated assumptions, editable inputs, and verified formulas. |
| Writing | Client replies, translation, SEO metadata, campaign drafts, summaries, general prompts | Implemented public-text UI and bridge in this package. Extend with reviewed reusable templates. |
| Documents | Browser PDF merge, page selection, reordering and rotation. Next add scan OCR, compression, watermark, page extraction, compare, verified redaction | Browser PDF tools added. Reuse existing print/document functionality where verified. Separate signed or restricted inputs. |
| Voice | Transcription, editable timecodes, action extraction, draft reply, subtitles, text-to-speech | Future standalone utility. Verify audio support, consent, expiry, and language-specific quality. |
| Photos | Browser resize, next crop/blur/brand overlays and channel exports, listing quality review, optional generative edits | Browser resize added. Verify factual listing imagery and label virtual staging. |
| Marketing | Bilingual campaign packs, SEO metadata, social captions, video hooks, alt text, approval/export, UTM links and measured reporting | Drafts implemented. Structured source brief, approvals and integrations follow. |
| Legal review | Clause comparison, dates and obligations, page-cited review and checklist preparation | Private workflow. Human review before any client-facing interpretation. |
| Office files | DOCX templates, CSV cleanup and exports, PDF statements, multilingual RTL exports | Reuse report and document foundations where verified. Add conversions incrementally. |
| Team | Project threads, mentions, task handoff, shared approved files and versioned campaign review | Future workspace enhancement. Apply access before AI summarizes. |
| Admin | Account lifecycle, AI budgets, provider health, job monitoring, access and approval metadata, backups | Start with secret configuration and ledger. Build admin UI after stabilizing routing. |

## 5. End-to-end staff journeys

- **After a viewing:** Open the assigned viewing, record the outcome, create a follow-up draft using approved or private processing, check names and AED amounts, then copy it into the employee’s usual messaging app. Later add an explicit, audited save-back operation.
- **Market a property:** Supply dated price and availability, approved photos, project name and source. Generate bilingual listing and social drafts, review claims, then export. Save a campaign version before adding any direct publication workflow.
- **Prepare a document:** Merge ordinary PDFs in the browser or upload a restricted document to approved private processing. Return page-linked evidence, review missing fields, and preserve the original separately.
- **Run the workday:** Check in, see authorized work, record visit and outcome, submit the report, then check out. A provider outage should leave operational work usable.

## 6. Deployment runbook

1. Apply this implementation on the pinned GitHub commit in a separate private repository. Keep staging and production environment settings and database credentials distinct.
2. Resolve the credential exposure before production. Verify new and existing users cannot sign in using the old credentials, sessions are revoked, admin 2FA is enabled where supported, demo is disabled, and existing integrations have been reviewed.
3. Provision a staging database and validate schema and migration from a backup. Decide whether to import approved records or use authorized APIs for shared data. Keep reception QR and operational event contracts stable during cutover.
4. Deploy the AI Worker with D1 and test its shared and two individual credential paths. Choose a Cloudflare Account with the SWK zone and the required Worker and Container capabilities. Verify budget and region before deployment.
5. Use deploy/cloudflare/wrangler.one.jsonc for the separate SWK ONE deployment. It names the Worker swk-one and uses PG_SCHEMA=swk_one and PUBLIC_URL=https://one.swk.properties. Provision DATABASE_URL, APP_SECRET, ADMIN_PASSWORD, MANAGER_PASSWORD, applicable database CA, and the bridge settings before deploying. For staging, change the worker name, custom domain and schema in a copy.
6. Confirm swk.properties is an active zone in the intended account, inspect any existing DNS or Worker binding for one.swk.properties, and deploy the configured custom domain. If using a dedicated Node origin, use a verified Cloudflare Tunnel or proxied origin instead. Validate TLS, /api/health, sign-in, password setup and domain isolation.
7. Build and sign Android using the existing application ID and release signing key only after the hostname is reachable. Confirm native requests and a device with a saved old server override. Avoid replacing existing installs before migration QA.
8. Release to two staff with synthetic records, then the full ten after acceptance. Keep the previous build and database backup ready. Roll back the application and pause AI routes independently if needed.

## 7. Release gates and ownership

| Stage | Exit test |
|---|---|
| Local code | Typecheck, web/API build, automated gateway tests. Verify browser PDF/photo utilities, signed-in access and native functions in appropriate environments. |
| Staging identities | Uninvited user rejected, revoked user rejected, two authorized accounts see only allowed records. Demo and machine keys cannot invoke the cloud bridge. |
| Provider smoke | Shared route first, employee fallback key isolation, no paid fallback configured, no private payload sent to a public route, rate limits visible. |
| Operations smoke | Reception scan from a real phone, GPS arrival, offline replay without duplicate writes, daily report and checkout, audit trail. |
| Data and operations | Backup/restore, credential rotation, cancellation and outage behavior, admin spend and usage review. |
| Ten-user acceptance | Ten concurrent jobs respect limits. Field operations still work with cloud AI unavailable. Use approved or synthetic records until data handling is signed off. |

Owner approves access and budget. Operations validates field and checkout journeys. IT owns provider credentials, DNS, deployments, backups and incident response. Marketing reviews public copy and publication. An assigned reviewer handles restricted document outputs. Report first-month job completion, cost, corrections in English/Arabic, and time saved by workflow.

## 8. Implementation boundary

This delivery adds an integrated utility studio, a Fastify bridge, an independently deployable Worker, a D1 quota schema, the SWK ONE brand assets, and target-domain configuration. The existing Android and Operations modules are carried forward from the source. The application, live DNS, provider credentials, production database, Android signing and future utility modules require the rollout steps above. The connected Cloudflare account did not return swk.properties when queried during this work.
