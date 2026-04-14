# Development Guide Entry Point

This is the top-level entry point for contributors and maintainers working on the browser and desktop runtime paths.

## Primary Developer Documentation

- [Developer Guide](docs/developer-guide.md)
- [Windows Development Workflow](docs/windows-development.md)
- [Desktop Architecture](docs/desktop-architecture.md)

## Validation and Review Documentation

- [Reviewer Guide](docs/reviewer-guide.md)
- [Persistence Reference](docs/persistence-reference.md)
- [Packaging Guide](docs/packaging/packaging.md)

## Tech Stack

- Frontend: React 19 with TypeScript
- Browser build tooling: Vite 8 with `@vitejs/plugin-react`
- Desktop shell: Electron 37 with `electron-builder`
- Persistence: `sql.js` with browser and desktop runtime adapters
- Linting: ESLint 9 with TypeScript and React Hooks support
- Unit and integration testing: Vitest with Testing Library and `jsdom`
- End-to-end testing: Playwright (Chromium)

## Core Commands

Windows users must use Git Bash. PowerShell is not a supported contributor shell for this repository.

```bash
npm install
npm run dev:web
npm run dev
npm run lint
npm run test
npm run build
npm run dist:win
```

Read the full [Developer Guide](docs/developer-guide.md) for the runtime model, directory map, validation workflow, and contribution guardrails.
