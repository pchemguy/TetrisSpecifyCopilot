# Classic Browser Tetris

Classic Browser Tetris is a React + TypeScript Tetris implementation with two supported runtime paths:

- browser mode for fast renderer iteration with `npm run dev:web`
- Windows-first Electron desktop mode with `npm run dev` and portable packaging through `npm run dist:win`

## Start Here

- [User Guide](docs/user-guide.md)
- [Development Guide Entry Point](DEVELOPMENT.md)
- [Reviewer Guide](docs/reviewer-guide.md)

## Prerequisites

- Windows 11 with Git Bash on `PATH`
- Node.js 22 LTS or newer
- npm 10 or newer

PowerShell is not a supported workflow for this repository.

## Quick Start

Install dependencies once:

```bash
npm install
```

Run browser mode for renderer-only work:

```bash
npm run dev:web
```

Run desktop mode for Electron-shell validation:

```bash
npm run dev
```

Build production assets and the portable Windows package:

```bash
npm run build
npm run dist:win
```

## Runtime Summary

- Browser mode shows `Runtime browser/web` and keeps persistence in browser storage.
- Desktop mode shows `Runtime desktop/<platform> v<version>` and persists desktop best score in a file-backed SQLite database under the app data directory.
- Browser and desktop persistence are intentionally separate in the first release.

## More Documentation

- [Developer Guide](docs/developer-guide.md)
- [Windows Development Workflow](docs/windows-development.md)
- [Desktop Architecture](docs/desktop-architecture.md)
- [Persistence Reference](docs/persistence-reference.md)
- [Packaging Guide](docs/packaging/packaging.md)
