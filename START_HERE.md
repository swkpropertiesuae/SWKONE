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
