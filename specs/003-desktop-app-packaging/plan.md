# Implementation Plan: Desktop App Packaging

**Branch**: `003-desktop-app-packaging` | **Date**: 2026-04-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-desktop-app-packaging/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Package the existing React/Vite Tetris renderer as a Windows-first desktop app by adding a
thin Electron main process and preload bridge around the current client application, while
keeping the renderer independent of Electron internals. The renderer will continue to own
gameplay, React UI, and `sql.js` persistence logic; desktop-specific behavior will be
accessed only through `window.desktopApi`, which will expose minimal file-backed database
operations implemented in Electron using `userData` storage and atomic temp-file writes.
The repository will continue to support pure browser development through `npm run dev:web`
while `npm run dev` runs the Electron shell against the same Vite-based renderer.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 6.x, React 19, Node.js 22 LTS  
**Primary Dependencies**: React, Vite, Electron, electron-builder, sql.js, Vitest, React Testing Library, Playwright  
**Storage**: Browser mode keeps localStorage and IndexedDB-backed SQLite; desktop mode persists a `sql.js` SQLite database as bytes in a single file under Electron `userData`, written atomically via temp file + rename; no backend server  
**Testing**: Vitest for persistence/runtime adapters and Electron entrypoint helpers, React Testing Library for renderer integration with mocked `window.desktopApi`, Playwright for browser regression and Electron desktop smoke validation  
**Target Platform**: Windows 11 as the primary packaged target; modern desktop browsers remain supported for `npm run dev:web`; macOS and Linux remain future packaging targets  
**Project Type**: Hybrid desktop application with a shared web renderer  
**Performance Goals**: Packaged desktop app reaches a usable main UI within 5 seconds on the Windows review machine; best-score hydration or fallback completes within 250 ms of renderer boot; best-score save completes off the hot input path and within 250 ms after game-over persistence begins  
**Constraints**: Renderer code must not import `electron`; desktop capabilities are exposed only through `window.desktopApi`; Electron main/preload stay thin; no backend or network dependency; first desktop release is portable-only; first desktop release requires restart persistence only for best score; browser development flow must remain available as `npm run dev:web`  
**Scale/Scope**: Single-player local desktop app, one primary window, one portable Windows artifact, one shared renderer codebase serving both browser and desktop runtimes, one desktop bridge surface for persistence/file-backed runtime access

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code Quality Gate: Extend the existing `npm run lint` and `tsc --noEmit` validation to cover both the renderer config and a new Electron TypeScript config. Keep Electron code confined to `electron/` and `src/platform/desktop` so new desktop behavior remains reviewable without spreading platform conditionals through the React tree. Refactor current persistence access just enough to introduce runtime-aware adapters instead of duplicating persistence logic per runtime.
- Testing Gate: Add unit tests for runtime detection, desktop database file adapter selection, and best-score fallback behavior. Add renderer integration tests using a mocked `window.desktopApi` to prove desktop hydration, warning fallback, and browser-mode continuity. Add contract tests for the preload bridge surface. Add Playwright coverage for browser regression plus a desktop-shell smoke test that launches Electron, verifies offline local play, and confirms best-score retention across relaunch.
- UX Consistency Gate: Preserve the existing renderer layout, terminology, controls, overlays, and persistence-warning tone. Desktop-specific recovery for invalid best-score data must reuse the established non-blocking warning pattern instead of introducing modal startup blockers. Browser mode and desktop mode must present the same gameplay UI and labels for supported flows.
- Performance Gate: Validate packaged desktop startup time with timestamps emitted from Electron launch to first rendered HUD state. Measure best-score hydrate/fallback timing in the renderer and verify it stays under 250 ms on the review machine. Confirm best-score save occurs after gameplay completion and does not delay active input processing.
- Decision Traceability Gate: Record the reasons for choosing Electron over alternative desktop wrappers, a preload bridge over direct renderer Electron imports, file-backed `sql.js` persistence over a desktop server or native database daemon, and a portable Windows artifact over installer-based packaging for the first release. Each decision is documented in `research.md` with rejected alternatives.

**Post-Design Re-check**: Phase 1 artifacts keep Electron-specific behavior bounded to thin adapters, preserve the existing renderer as the product UI, define the `window.desktopApi` contract explicitly, and retain browser-mode development as a first-class path. No constitution violations remain after design.

## Project Structure

### Documentation (this feature)

```text
specs/003-desktop-app-packaging/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── desktop-interfaces.md
└── tasks.md
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
electron/
├── main.ts
└── preload.ts

src/
├── app/
│   ├── App.tsx
│   ├── providers/
│   └── state/
├── canvas/
│   ├── GameCanvas.tsx
│   └── renderer/
├── components/
│   ├── controls/
│   ├── hud/
│   └── overlays/
├── engine/
│   ├── commands/
│   ├── core/
│   ├── replay/
│   └── rules/
├── persistence/
│   ├── local-storage/
│   ├── sqlite/
│   ├── desktop/
│   └── runtime/
├── platform/
│   ├── browser/
│   └── desktop/
├── styles/
├── types/
└── main.tsx

public/
└── [renderer static assets]

dist/
└── [Vite renderer build output]

dist-electron/
└── [compiled Electron main/preload output]

tests/
├── contract/
│   └── desktop-api.contract.spec.ts
├── e2e/
│   ├── core-gameplay.spec.ts
│   ├── session-persistence.spec.ts
│   └── desktop-shell.spec.ts
├── integration/
│   └── app/
└── unit/
```

**Structure Decision**: Keep a single repository and a single renderer codebase. Add `electron/` for the only Electron-owned entrypoints, keep runtime-specific persistence adapters under `src/persistence` and `src/platform`, and preserve the existing renderer folders for gameplay, HUD, and persistence orchestration. This keeps desktop-specific code thin while allowing browser mode and desktop mode to share the same React, engine, and repository logic.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations are currently identified. The added complexity of an Electron shell, preload bridge, and runtime-aware persistence adapters is required to satisfy the desktop packaging goal while preserving browser-mode development and keeping the renderer independent of Electron internals.
