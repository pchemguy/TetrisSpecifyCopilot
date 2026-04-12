# Quickstart: Windows Desktop Portable Packaging

## Goal

Convert the current browser-based Tetris app into a Windows-first Tauri desktop app that runs fully locally, persists exactly one best score in native SQLite, and keeps gameplay logic separated from desktop runtime and persistence responsibilities.

## Prerequisites

- Windows 10 or Windows 11
- Node.js 22 LTS or newer
- npm 10 or newer
- Rust stable toolchain for Tauri desktop builds
- WebView2 runtime available on the target Windows machine
- Bash shell
- Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

## Planned Deliverables

- `src-tauri/` Tauri desktop runtime and configuration
- native SQLite persistence service owned by Rust
- typed frontend persistence client that calls explicit Tauri commands
- migration away from browser `sql.js`/IndexedDB best-score persistence
- Windows portable folder build artifact

## Implementation Workflow

1. Install JavaScript dependencies and add Tauri/native dependencies.

```bash
npm install
```

2. Run the desktop app in development mode.

```bash
npm run tauri dev
```

3. Run frontend quality and behavior checks.

```bash
npm run lint
npm run test
```

4. Run native persistence tests.

```bash
cargo test --manifest-path src-tauri/Cargo.toml
```

5. Build the Windows portable desktop artifact.

```bash
npm run tauri build
```

## Acceptance Walkthrough

1. Start with no database file present and confirm startup auto-creates storage while keeping best score hidden.
2. Finish a game without beating the saved best score and confirm no congratulations message appears.
3. Finish a game with a strictly greater score and confirm the congratulations message appears and the new best score is persisted.
4. Close and relaunch the desktop app and confirm the saved best score is shown at startup.
5. Delete the database file, relaunch, and confirm automatic recreation.
6. Simulate a corrupt database file, relaunch, and confirm backup rename plus one-time reset warning.
7. Validate the app runs locally from the Windows portable folder artifact with no separate server process.

## Acceptance Checklist

- best-score persistence is native SQLite, not browser `sql.js`
- database path is resolved on the native side, not in the frontend
- best score is loaded only through explicit startup command boundaries
- best score is updated only through explicit game-over submission boundaries
- quit/restart-mid-run never updates best score
- startup fallback and corruption recovery notices are visible exactly when required
- portable folder artifact is sufficient for Windows acceptance even if single-file bundling is not used
