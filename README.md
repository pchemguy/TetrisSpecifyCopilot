# Classic Tetris Desktop

This repository contains a React + TypeScript implementation of Classic Tetris with a Windows-first Tauri desktop runtime. The desktop app runs fully locally, persists the player best score in native SQLite, and keeps settings, UI state, and structured session history in local browser or webview storage.

## User Documentation Entry Point

Start here for install, launch, controls, persistence behavior, packaging notes, and troubleshooting:

- [User Guide](docs/user-guide.md)

## Quick Start

Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

For desktop runtime development:

```bash
npm install
npm run tauri dev
```

For frontend-only iteration:

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run test
cargo test --manifest-path src-tauri/Cargo.toml
npx playwright install chromium
npx playwright test tests/e2e/core-gameplay.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/hud-and-strategy.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line
npm run tauri build
```

## More Documentation

- [Development Guide Entry Point](DEVELOPMENT.md)
- [Reviewer Guide](docs/reviewer-guide.md)
- [Persistence Reference](docs/persistence-reference.md)
- [Packaging Guide](docs/packaging/packaging.md)
- [Windows Packaging Quickstart](specs/003-windows-desktop-packaging/quickstart.md)
