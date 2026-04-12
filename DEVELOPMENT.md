# Development Guide Entry Point

This is the top-level entry point for contributors and maintainers.

## Primary Developer Documentation

- [Developer Guide](docs/developer-guide.md)

## Validation and Review Documentation

- [Reviewer Guide](docs/reviewer-guide.md)
- [Persistence Reference](docs/persistence-reference.md)
- [Packaging Guide](docs/packaging/packaging.md)
- [Windows Packaging Quickstart](specs/003-windows-desktop-packaging/quickstart.md)

## Tech Stack

- **Frontend:** React 19 with TypeScript
- **Desktop runtime:** Tauri 2 with Rust
- **Build tooling:** Vite 8 with `@vitejs/plugin-react`
- **Persistence:** native SQLite for desktop best score, `localStorage` for settings and UI state, `sql.js` persisted to IndexedDB for sessions, scores, and replay history
- **Linting:** ESLint 9 with TypeScript and React Hooks support
- **Unit / integration testing:** Vitest with Testing Library and `jsdom`
- **End-to-end testing:** Playwright (Chromium)

The project is a Windows-first desktop application with no backend service. Frontend-only browser mode remains available for local UI iteration, but desktop best-score behavior is exercised through Tauri commands and the Rust runtime.

## Core Commands

Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

```bash
npm install
npm run dev
npm run tauri dev
npm run lint
npm run test
cargo test --manifest-path src-tauri/Cargo.toml
npx playwright install chromium
npm run tauri build
```

For architecture, directory map, data flow, validation flow, and contribution workflow details, continue in the full Developer Guide.
