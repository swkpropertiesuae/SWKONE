# SWK ONE

This is the complete source checkout for the combined Operations and AI & Utilities application. The upstream snapshot is SWKAI commit `670a65019885827d055920aff3b3e810436afaf0`. The intended production address is `https://one.swk.properties`.

## Open a local copy

1. Install Node.js 22.20 or later on your computer. Open a terminal inside the extracted SWK_ONE folder.
2. Run `npm ci`, then `npm run build`.
3. Copy `deploy/one.env.example` to `.env`. Set unique, strong administrator and manager passwords and a random 64-character hexadecimal application secret. You can generate the secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Keep `.env` private.
4. Run `npm start` and open [SWK ONE locally](http://127.0.0.1:8080). Sign in with the administrator email and password from your `.env`, then complete the password change if prompted. Use fresh test data.
5. Open AI & Utilities inside SWK ONE. Photo resizing, PDF merging, page selection, reordering and rotation work on the device. Configure an approved Ollama server for local AI. Cloud text needs the separate gateway and provider setup below.

## Prepare staging and production

Read [the master plan](docs/SWK_ONE_MASTER_PLAN.md) for the architecture, 10-person rollout and utility roadmap. Run the app separately from the existing SWKAI production deployment. Use a private source repository, staging database and unique passwords. Keep production secrets in the deployment environment.

- App container configuration: `deploy/cloudflare/wrangler.one.jsonc`
- Cloud AI Worker template and quota schema: `deploy/one-ai`
- Android: `npm run android:sync`, then open `android/` in Android Studio. Build and test the APK against an approved HTTPS server before signing and distribution.
- Verification: `npm run typecheck`, `npm run build`, `node --import tsx tests/one-cloud-bridge.ts`, and `node --test deploy/one-ai/src/worker.test.mjs`.

The original public source previously exposed staff passwords. This checkout removes those values and requires an explicitly configured test password to seed development fixtures. Production accounts must be provisioned separately. If importing existing accounts, reset any exposed passwords and revoke sessions before the imported deployment is made available.

## Enable the ten-person utility studio

1. Create or select the ten staff accounts and give them AI view permission. Set the same `STAFF_SLOTS` JSON in the app container and AI Worker. For example, `{"101":1,"102":2}` maps two staging user IDs to unique seats. Use up to ten IDs and slots 1–10. Users outside the roster are denied. Do not use email addresses, display names, or API credentials as keys.
2. For OCR, install Poppler and the English and Arabic Tesseract language packs when running outside Docker. The app processes PNG, JPEG and PDFs on the server, extracts embedded PDF text, and runs OCR on pages without a text layer. Files are limited to 6 MiB and PDFs to ten pages.
3. For document review, set `ONE_PRIVATE_REVIEW_URL` to an Ollama endpoint reachable only from approved infrastructure. Use HTTPS, or loopback for local development. Set `ONE_PRIVATE_REVIEW_MODEL` if different from `qwen3.5:9b`. The app can compare two documents and checks each finding's quoted evidence. It sends at most the first 1,000 normalized characters of each page to Ollama. Review results before acting. Document review never falls back to a cloud model.
4. For transcription, English MP3 generation, and image generation, set `MEDIA_ENABLED=true` on the deployed AI Worker after verifying Workers AI access. Configure the existing gateway URL and bridge secret in the app. The Worker shares the existing daily Cloudflare allowance across chat and media, with per-seat caps of five transcriptions, two speech requests and two image requests per UTC day. A transcript clip is capped at 60 seconds and prepared as mono WAV by the browser. Only approved public inputs may go to the cloud.
5. Pilot the utilities with approved sample documents, recordings and prompts before enabling live staff use. Verify the Ollama service is privately reachable, OCR language packs are installed, and all three Workers AI models respond in your account.

Local checks: `node --import tsx tests/one-cloud-bridge.ts`, `node --test deploy/one-ai/src/worker.test.mjs`, `npm run typecheck`, and `npm run build`.
