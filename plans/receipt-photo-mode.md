# Receipt photo mode for the edit panel

## Context

The slowest step in this extension is the split of one transaction, such as Walmart, into granular rows. Today the user reads the paper receipt, adds the line items by hand, and types each row in the edit grid.

The new photo mode does this:

1. The user selects a transaction and clicks a "Photo" button in the edit panel.
2. A full-screen overlay shows a QR code for a phone upload page. The phone page is served through ngrok. The extension polls the dev server for a photo.
3. The user takes the photo on the phone. The phone page shrinks it and uploads it.
4. The extension fetches the photo, and the dev server deletes it. The extension sends the photo to AWS Textract AnalyzeExpense.
5. The overlay shows the photo with one box on each line item. A left-click on a box opens a category dropdown and an item text input. A right-click clears the assignment.
6. On Accept, the extension groups the assigned boxes by category + item and sums their prices. It adds a flat 13% tax to each row. These rows replace the whole edit grid. Untouched boxes are ignored.

Out of scope for this work: the known-item database, auto-assignment, and a database editor. These come later.

## Decisions

| Topic | Decision |
|---|---|
| OCR | Textract AnalyzeExpense, called from the extension with the stored AWS credentials. Region `us-east-2`. No cache. |
| Server | A Vite plugin inside `app/`. It runs as part of `npm run dev`. |
| Tunnel | ngrok with the free static domain. No upload protection. |
| Start | A new npm script starts Vite and ngrok together. |
| Phone page | Opens the camera directly. Resizes to a long side of 2500 px, JPEG, before upload. |
| Photo storage | One slot in memory. The server deletes the photo when the extension fetches it. |
| Box state | Two colors only: assigned and not assigned. |
| Tax | Flat 13% on each grouped row, through the existing tax logic. |
| Grid | Accept replaces the entire edit grid. After that, the grid works as it does now. Ctrl+S still saves. |
| Tests | None for now. Run the existing suite. |

## Implementation

### 1. Shared AWS credentials

- New `app/src/utils/aws.ts`. Move `S3_REGION` (as `AWS_REGION`) and the credential load and check from `createClient()` in `app/src/utils/s3.ts` into an exported `loadAwsCredentials()`.
- `s3.ts` uses `loadAwsCredentials()`. Its exported functions do not change.

### 2. Tax helper

- In `app/src/utils/amount.ts`, extract the cent arithmetic inside `resolveAmount` into an exported `applyTax(amount:number):number`. `resolveAmount` calls it. The behavior does not change, so the current `amount.spec.ts` tests still cover it.

### 3. Textract client and parser

- Add the dependency `@aws-sdk/client-textract`.
- New `app/src/utils/receipts/textract.ts`: `analyzeExpense(bytes:Uint8Array):Promise<AnalyzeExpenseCommandOutput>`. It makes a new client for each call, like `s3.ts`.
- New `app/src/models/ReceiptLineItem.ts`: `{ id:string; name:string; price:number; box:{ left:number; top:number; width:number; height:number } }`. The box uses Textract's 0 to 1 ratios.
- New `app/src/utils/receipts/parseExpense.ts`: `parseExpense(output):ReceiptLineItem[]`.
  - Read `ExpenseDocuments[].LineItemGroups[].LineItems[].LineItemExpenseFields`.
  - `name` comes from the `ITEM` field. `price` comes from the `PRICE` field. Remove `$`, `,`, and trailing tax letters. A trailing `-` makes the price negative.
  - `box` comes from the `EXPENSE_ROW` field geometry. If that field is missing, use the union of the `ITEM` and `PRICE` boxes.
  - Skip a line item if it has no price that parses.

### 4. Grouping

- New `app/src/utils/receipts/group.ts`: `toEditTransactions(lineItems, assignments):EditTransaction[]`.
  - `assignments` is a `Map<string, { category:string; item:string }>` keyed by line item `id`.
  - Group by category + item in first-assigned order. Sum in integer cents. Call `applyTax` on each sum.

### 5. Vite plugin for the phone

- New `app/vite/receiptServer.ts`, registered in `app/vite.config.ts`. It adds `configureServer` middleware:
  - `GET /receipt` returns the phone page. The page has one large button with `<input type="file" accept="image/*" capture="environment">`. It resizes the photo on a canvas and posts it. It shows "Uploaded" or the error.
  - `POST /receipt/photo` stores the body in the one memory slot. A new upload replaces an older one.
  - `GET /receipt/photo` returns `204` if the slot is empty. Otherwise it returns the JPEG and empties the slot.
- `app/vite.config.ts` reads `NGROK_DOMAIN` from `app/.env.local` with `loadEnv`. It adds the domain to `server.allowedHosts`, because Vite rejects unknown hosts. It also exposes `VITE_NGROK_DOMAIN` to the app for the QR code.
- Add `.env.local` to `.gitignore` if it is not there. Add `app/.env.example` with `NGROK_DOMAIN=`.

### 6. Start script

- New `app/scripts/dev-receipts.mjs`. It reads `NGROK_DOMAIN`, checks that the `ngrok` command exists, and starts `vite` and `ngrok http --url=<domain> 5173`. If ngrok is missing or the domain is empty, it prints the setup steps and exits. When one process stops, it stops the other.
- `app/package.json`: add `"dev:receipts": "node scripts/dev-receipts.mjs"`.

### 7. Manifest

- `manifest.json` `host_permissions`: add `https://textract.us-east-2.amazonaws.com/*` and `http://localhost:5173/*`.

### 8. UI components

All new components go in `app/src/components/ReceiptOverlay/`. Each stays under about 100 lines and follows the CLAUDE.md style.

- `ReceiptOverlay.svelte`: a fixed full-screen modal. It holds the state `'waiting'|'analyzing'|'mapping'|'error'`, the photo URL, the line items, and the assignments. It calls `analyzeExpense` and `parseExpense`. Props: `onaccept(rows:EditTransaction[])` and `oncancel()`.
- `ReceiptWaiting.svelte`: the QR code for `https://<VITE_NGROK_DOMAIN>/receipt`, the URL as text, and Cancel. An `$effect` polls `http://localhost:5173/receipt/photo` each second and clears the interval on cleanup. Add the `qrcode` dependency and `@types/qrcode`.
- `ReceiptMapper.svelte`: the photo in a relative container with one `ReceiptBox` for each line item. It has the Accept and Cancel buttons. Accept calls `toEditTransactions`.
- `ReceiptBox.svelte`: an absolutely placed `<button>` with `%` positions from `box`. Left-click calls `onselect`. Right-click calls `preventDefault` and `onclear`. It uses one color when assigned and another when not.
- `ReceiptAssignPopover.svelte`: shown next to the selected box. It has the `CATEGORIES` dropdown from `app/src/utils/categories.ts`, an item text input, and an OK button. Enter confirms and Escape closes. It fills with the current values when the box is already assigned.
- `app/src/components/EditorSection/TransactionEditPanel.svelte`: add a "Photo" button and an `open:boolean` `$state`. On accept, set `editTransactions` to the rows and close the overlay. The `EditGrid` focus reset in its `$effect` runs because the array reference changes.

### 9. README

- Add a section with these steps: install ngrok in WSL, add the auth token, claim the free static domain, set `NGROK_DOMAIN` in `app/.env.local`, add the `textract:AnalyzeExpense` permission to the IAM user, and run `npm run dev:receipts`.

### 10. Git

- `git add` every new file. Commit on `master` in separate commits: shared AWS credentials, tax helper, Textract client and parser, Vite plugin and start script, overlay UI, README.

## Risks

- The extension needs the dev server and ngrok to run during photo mode. The rest of the extension does not need them.
- The Textract `PRICE` field is usually the line total. If a receipt shows a unit price with a quantity, the box may hold the unit price. The user can fix the row in the edit grid after accept.
- Flat 13% tax also goes on untaxed groceries. This is the chosen behavior.
- The phone page has no protection. Anyone with the ngrok URL can upload an image while ngrok runs. That image only appears in the overlay. It does not go anywhere else.

## Verification

1. Run `npm test -- --run` and `npm run typecheck` in `app/`. Confirm that the existing tests pass.
2. Run `npm run build`, then reload the unpacked extension in Chrome.
3. Run `npm run dev:receipts`. Confirm that the phone opens `https://<domain>/receipt`.
4. Open a statement, parse it, and select a Walmart transaction. Click Photo. Scan the QR code and take a receipt photo.
5. Confirm that the overlay shows boxes on the line items. Assign several boxes to two category + item pairs. Right-click one box and confirm that it clears.
6. Click Accept. Confirm that the edit grid has one row for each pair, and that each amount is the sum of its prices plus 13%. Press Ctrl+S and confirm that the table updates.
7. Run the `code-readability-jin` agent on the changed files.
