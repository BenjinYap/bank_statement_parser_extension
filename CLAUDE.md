# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome browser extension for parsing bank statement data from web pages. The extension consists of two main parts:

1. **Chrome Extension** (root directory): Content script, service worker, and manifest for browser integration
2. **Svelte App** (app/ directory): User interface for parsing and analyzing financial data

The extension injects a content script that detects date selections on banking websites, then opens a new tab with a Svelte-based interface to parse and display transaction data.

## Development Commands

All development commands should be run from the `app/` directory:

```bash
cd app/
```

### Core Commands
- `npm run dev` - Start Vite development server for the Svelte app
- `npm run build` - Build the Svelte app for production (outputs to app/dist/)
- `npm run preview` - Preview the built app locally
- `npm test` - Run Jest tests with ES modules support

### Testing
- Tests are located in `app/src/utils/tests/` with `.spec.mjs` extension
- Jest is configured to use ES modules via `NODE_OPTIONS=--experimental-vm-modules`
- Test pattern: `**/*.spec.mjs`

## Architecture

### Extension Structure
- `manifest.json` - Chrome extension manifest (v3)
- `content.js` - Content script that detects date selections and injects UI
- `service_worker.js` - Background script that manages tab creation
- `app/dist/` - Built Svelte app served as extension popup

### Svelte App Architecture
- **Entry Point**: `app/src/App.svelte` - Main application component
- **Parsing Engine**: `app/src/utils/parser.mjs` - DOM parsing logic for bank tables
- **Data Models**: 
  - `app/src/models/ParsedRow.mjs` - Transaction row data structure
  - `app/src/models/Settings.svelte.js` - Application settings with Svelte 5 runes
- **Utilities**:
  - `app/src/utils/replacements.mjs` - Category and item text replacements
  - `app/src/utils/calculator.mjs` - Financial calculations
  - `app/src/utils/date.mjs` - Date formatting utilities
  - `app/src/utils/StorageLayer.mjs` - Browser storage abstraction

### Component Structure
- `app/src/components/sections/` - Main UI sections (Intro, Results, Settings, Meta)
- `app/src/components/sections/results_section/` - Table components for displaying parsed data
- `app/src/components/` - Reusable UI components (Button, Stack, etc.)

### Key Technical Details
- Uses Svelte 5 with runes ($state, etc.)
- Tailwind CSS 4.0 for styling
- Vite for build tooling with custom rollup configuration
- Extension communicates via Chrome runtime messaging API
- Supports both development mode (with mock data) and extension mode
- Targets banking websites that use `.mat-table` class structure

### Data Flow
1. Content script detects date selection on banking page
2. Service worker creates new tab with Svelte app
3. Bank page HTML is passed to Svelte app via runtime messaging
4. Parser extracts transaction data from DOM tables
5. Results are displayed and can be modified/exported

## File Organization
- Root: Chrome extension files
- `app/`: Svelte application
- `tab/`: Legacy tab implementation (appears unused)
- Bank data parsing targets `.treetop` elements and `.mat-table` structures