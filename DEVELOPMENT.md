# Development Guide Entry Point

This is the top-level entry point for contributors and maintainers.

## Primary Developer Documentation

- [Developer Guide](docs/developer-guide.md)

## Validation and Review Documentation

- [Reviewer Guide](docs/reviewer-guide.md)
- [Persistence Reference](docs/persistence-reference.md)

## Tech Stack

- **Frontend:** React 19 with TypeScript
- **Build tooling:** Vite 8 with `@vitejs/plugin-react`
- **Persistence:** client-side SQLite via `sql.js`
- **Linting:** ESLint 9 with TypeScript and React Hooks support
- **Unit / component testing:** Vitest with Testing Library and `jsdom`
- **End-to-end testing:** Playwright (Chromium)

The project is an ESM-based browser application with no server framework declared in `package.json`; persistence is handled in-browser rather than through a backend database.

## Core Commands

Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

```bash
npm install
npm run lint
npm run test
npx playwright install chromium
npm run build
```

For architecture, directory map, data flow, and contribution workflow details, continue in the full Developer Guide.
