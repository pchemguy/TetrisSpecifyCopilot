# Implementation Plan: Windows Desktop Portable Packaging

**Branch**: `003-run-feature-branch-hook` | **Date**: 2026-04-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-windows-desktop-packaging/spec.md`

## Summary

Migrate the current browser-launched Tetris experience into a Windows-first Tauri desktop app while preserving the React + TypeScript + Vite frontend and deterministic gameplay engine. Replace browser-managed `sql.js` + IndexedDB/localStorage persistence with a native Rust-owned SQLite database and explicit Tauri commands for startup best-score hydration and game-over score submission. The release baseline is a portable Windows folder artifact, with the SQLite database stored next to the executable when writable and falling back to `%LOCALAPPDATA%/<AppName>/` only when the portable location is not writable.

## Technical Context

**Language/Version**: TypeScript 6.x / React 19 / Vite 8 frontend, Rust stable with Tauri 2.x native runtime  
**Primary Dependencies**: Tauri 2.x, `@tauri-apps/api`, Rust `tauri`, Rust `rusqlite` with bundled SQLite, `serde`, existing React/Vite/Vitest/Playwright toolchain  
**Storage**: Native SQLite on-disk database with a minimal single-record schema, owned and accessed from the native Tauri layer  
**Testing**: Vitest, Playwright, Rust unit tests via `cargo test`, Tauri command contract tests, Windows portable build smoke validation  
**Target Platform**: Windows 10/11 desktop, portable local folder distribution only for this feature
**Project Type**: Single-repo desktop application with embedded web frontend and native Rust runtime  
**Performance Goals**: Best-score state available as part of normal startup flow in <= 150 ms from native persistence load on typical local disk; no regression to the existing gameplay render cadence and interaction responsiveness  
**Constraints**: Fully local-only, no separate server process, no browser-launched deployment mode, no cloud sync/accounts/history systems, one local player, one persistent best-score record, explicit Tauri command boundary, updates only at startup and game-over  
**Scale/Scope**: One window, one Windows desktop runtime, one SQLite database file, one best-score state record, migration from browser persistence to native persistence while reusing existing gameplay/UI where practical

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code Quality Gate: PASS. Frontend gameplay logic remains isolated from persistence side effects; native persistence moves into `src-tauri` with explicit DTOs and command handlers, replacing browser storage coupling with a maintainable boundary.
- Testing Gate: PASS. Plan includes Rust unit tests for path resolution, corruption recovery, and SQLite repository logic; frontend integration tests for startup hydration and congratulations visibility; Playwright/portable smoke tests for restart persistence on Windows.
- UX Consistency Gate: PASS. Existing controls, scoring, best-score presentation rules, and game-over semantics remain intact; only startup visibility, congratulations messaging, and recovery notices change, all with explicit behavior requirements.
- Performance Gate: PASS. Persistence is limited to startup hydration and game-over submission, avoiding per-frame storage work; startup budget and verification approach are defined.
- Decision Traceability Gate: PASS. Research will record why Rust-side SQLite + Tauri commands is preferred over browser persistence and guest-side SQL access, plus why portable folder packaging is the baseline.

## Project Structure

### Documentation (this feature)

```text
specs/003-windows-desktop-packaging/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── desktop-persistence-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── providers/
│   ├── state/
│   └── services/
├── canvas/
├── components/
├── engine/
├── persistence/
└── types/

src-tauri/
├── Cargo.toml
├── build.rs
├── tauri.conf.json
├── capabilities/
└── src/
    ├── main.rs
    ├── commands/
    ├── persistence/
    ├── runtime/
    └── errors.rs

tests/
├── contract/
├── e2e/
├── integration/
├── setup/
└── unit/
```

**Structure Decision**: Keep the existing React/game-engine code in `src/` and add a dedicated `src-tauri/` native runtime for Windows packaging, path ownership, and SQLite. Frontend code will depend only on a thin application-layer persistence client and typed Tauri commands, keeping engine code deterministic and desktop concerns out of the render/game loop.

## Phase 0: Research Plan

- Select the SQLite integration approach that best fits native ownership, Windows portability, and minimal schema needs.
- Resolve Windows-specific file-placement behavior for executable-adjacent storage and fallback to `%LOCALAPPDATA%/<AppName>/`.
- Define the command/interface contract between the frontend application layer and the Tauri native layer.
- Confirm a minimal persistence schema that stores only best-score state and first-record visibility semantics.

## Phase 1: Design & Contracts Plan

- Define the native persistence data model, startup state, and score-submission response model in `data-model.md`.
- Define the Tauri command contract in `contracts/desktop-persistence-contract.md`.
- Define the implementation/validation quickstart for the desktop migration in `quickstart.md`.
- Update agent context after artifact generation so future implementation work reflects the Tauri + Rust + native SQLite stack.

## Post-Design Constitution Check

- Code Quality Gate: PASS. Responsibility boundaries are explicit: engine stays deterministic, frontend handles orchestration/UI, native layer owns file system and SQLite.
- Testing Gate: PASS. Design includes native repository tests, command contract coverage, frontend integration coverage, and Windows portable restart validation.
- UX Consistency Gate: PASS. Hidden-until-first-record behavior, strict-greater congratulations, corruption reset warning, and fallback-path notice are fully specified.
- Performance Gate: PASS. Persistence remains off the frame loop and is limited to startup/game-over boundaries with measurable startup budget.
- Decision Traceability Gate: PASS. All non-trivial architecture and storage choices are recorded in `research.md` with rejected alternatives.

## Complexity Tracking

No constitution violations identified for this feature.
