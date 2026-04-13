# Tasks: Desktop App Packaging

**Input**: Design documents from `/specs/003-desktop-app-packaging/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are REQUIRED for this feature. Each user story includes the unit, integration, contract, or end-to-end validation needed to prove the story independently.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each increment while preserving the browser renderer as the primary product surface.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Freeze architecture intent and contributor guardrails before desktop runtime changes begin.

- [X] T001 Create the desktop architecture decision note in docs/desktop-architecture.md
- [X] T002 [P] Update desktop boundary and Windows shell rules in AGENTS.md
- [X] T003 [P] Create the Windows developer workflow guide skeleton in docs/windows-development.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared runtime boundary, build scaffolding, and persistence abstractions that every story depends on.

**⚠️ CRITICAL**: No user story work should be treated as complete until this phase is done.

- [X] T004 Add shared Electron dependencies and script scaffolding in package.json
- [X] T005 [P] Add Electron TypeScript build configuration in tsconfig.electron.json and tsconfig.json
- [X] T006 [P] Create Electron shell scaffolds in electron/main.ts and electron/preload.ts
- [X] T007 [P] Add typed runtime detection and global desktop API declarations in src/platform/runtime.ts and src/types/global.d.ts
- [X] T008 [P] Create runtime-specific persistence adapter skeletons in src/persistence/runtime/browserAdapter.ts and src/persistence/runtime/desktopAdapter.ts
- [X] T009 Refactor shared SQLite bootstrap to consume runtime-selected byte loaders and savers in src/persistence/sqlite/database.ts and src/app/providers/PersistenceProvider.tsx
- [ ] T010 Capture shared packaging, persistence, and rollback guardrails in docs/desktop-architecture.md and specs/003-desktop-app-packaging/quickstart.md

**Checkpoint**: Shared runtime and persistence boundaries are ready; user story work can proceed in small vertical slices.

---

## Phase 3: User Story 1 - Launch And Use As A Desktop App (Priority: P1) 🎯 MVP

**Goal**: Launch the existing React/Vite app inside an Electron shell and produce a reviewable portable Windows artifact.

**Independent Test**: Start the desktop shell with `npm run dev`, launch the packaged Windows artifact, and confirm the game UI opens and remains playable offline without a browser tab or backend service.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Add preload contract coverage for desktop runtime info and app version metadata in tests/contract/desktop-api.contract.spec.ts
- [ ] T012 [P] [US1] Add renderer integration coverage for desktop runtime detection in tests/integration/app/desktop-runtime.spec.tsx
- [ ] T013 [P] [US1] Add Electron launch and offline shell smoke coverage in tests/e2e/desktop-shell.spec.ts

### Implementation for User Story 1

- [ ] T014 [US1] Implement BrowserWindow creation, secure webPreferences, and dev/prod renderer loading in electron/main.ts
- [ ] T015 [US1] Implement the preload runtime-info bridge with platform and app version metadata in electron/preload.ts and src/platform/runtime.ts
- [ ] T016 [US1] Wire desktop development and production build commands in package.json, vite.config.ts, and tsconfig.electron.json
- [ ] T017 [US1] Configure portable Windows packaging with electron-builder in package.json
- [ ] T018 [US1] Fix packaged renderer, preload, and static asset resolution in electron/main.ts, src/persistence/sqlite/database.ts, and vite.config.ts
- [ ] T019 [US1] Validate packaged desktop launch behavior, build/version identification, and the launch lifecycle in docs/desktop-architecture.md and docs/windows-development.md
- [ ] T054 [P] [US1] Measure and record packaged desktop startup time to the usable main UI against the 5-second budget in docs/desktop-architecture.md and specs/003-desktop-app-packaging/quickstart.md

**Checkpoint**: User Story 1 delivers a runnable desktop shell and a portable Windows artifact that can be reviewed independently. Evidence: passing T011-T013, a launchable Electron shell, a portable Windows artifact, and updated operating docs.

---

## Phase 4: User Story 2 - Keep Best Score Across Restarts (Priority: P1)

**Goal**: Persist best score across desktop relaunches through a file-backed `sql.js` database while keeping failure recovery non-blocking.

**Independent Test**: Launch the desktop app, achieve a new best score, close the app, relaunch it, and confirm the best score survives. Then corrupt or remove the desktop database bytes and confirm the app warns and falls back to the default best score.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T020 [P] [US2] Add unit coverage for desktop file load/save, atomic replace, stale temp cleanup, and interrupted-save recovery in tests/unit/persistence/desktopFileStore.spec.ts
- [ ] T021 [P] [US2] Add renderer integration coverage for best-score hydration, bridge-unavailable fallback warnings, and persistence-disabled launch behavior in tests/integration/app/desktop-persistence.spec.tsx
- [ ] T022 [P] [US2] Extend desktop restart persistence validation in tests/e2e/session-persistence.spec.ts

### Implementation for User Story 2

- [ ] T023 [US2] Implement `db:load` and `db:save` IPC handlers with `userData` path resolution, temp-file cleanup, and last-committed-file preference in electron/main.ts
- [ ] T024 [US2] Implement typed database byte bridging in electron/preload.ts and src/types/global.d.ts
- [ ] T025 [US2] Implement the desktop runtime adapter for loading and saving database bytes in src/persistence/runtime/desktopAdapter.ts and src/platform/runtime.ts
- [ ] T026 [US2] Add desktop best-score persistence and schema bootstrap helpers in src/persistence/sqlite/database.ts and src/persistence/sqlite/schema.ts
- [ ] T027 [US2] Persist desktop database exports after best-score mutations in src/app/providers/PersistenceProvider.tsx and src/persistence/sqlite/database.ts
- [ ] T028 [US2] Surface missing or invalid desktop best-score recovery through existing warning UI in src/app/providers/PersistenceProvider.tsx and src/components/overlays/PersistenceWarning.tsx
- [ ] T029 [US2] Handle unreadable or corrupt desktop database bytes plus permission, locked-file, and disk-space write failures with deterministic recovery in electron/main.ts and src/types/persistence.ts
- [ ] T055 [P] [US2] Add integration coverage proving desktop mode does not import, merge, or overwrite browser persistence in tests/integration/app/desktop-persistence-isolation.spec.tsx
- [ ] T056 [US2] Enforce browser/desktop persistence separation in src/persistence/runtime/browserAdapter.ts, src/persistence/runtime/desktopAdapter.ts, and src/platform/runtime.ts
- [ ] T057 [P] [US2] Measure and record desktop best-score hydration fallback time and save latency against the 250 ms budgets in docs/desktop-architecture.md and specs/003-desktop-app-packaging/quickstart.md

**Checkpoint**: User Story 2 keeps best score across desktop restarts and recovers predictably from missing or invalid data. Evidence: passing T020-T022 and T055, a restart-persistence demo, fallback-warning validation, and recorded performance measurements.

---

## Phase 5: User Story 3 - Preserve A Fast Browser-Based Development Workflow (Priority: P2)

**Goal**: Keep the browser renderer as a first-class development workflow after desktop support is added.

**Independent Test**: Run `npm run dev:web`, verify the app still launches in a browser, and confirm browser-mode persistence and existing gameplay regressions still pass without any Electron dependency.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T030 [P] [US3] Add unit coverage for runtime selection, absent desktop bridge behavior, and incomplete desktop bridge fallback in tests/unit/platform/runtime.spec.ts
- [ ] T031 [P] [US3] Add browser-mode integration coverage for persistence bootstrap in tests/integration/app/browser-runtime.spec.tsx
- [ ] T032 [P] [US3] Extend browser regression coverage for `dev:web` behavior in tests/e2e/core-gameplay.spec.ts and tests/e2e/session-persistence.spec.ts

### Implementation for User Story 3

- [ ] T033 [US3] Implement the browser runtime adapter for localStorage and IndexedDB-backed SQLite in src/persistence/runtime/browserAdapter.ts and src/platform/runtime.ts
- [ ] T034 [US3] Add the pure browser workflow command as `npm run dev:web` in package.json and keep browser server settings explicit in vite.config.ts
- [ ] T035 [US3] Remove Electron assumptions from shared renderer bootstrap in src/app/providers/PersistenceProvider.tsx and src/persistence/sqlite/database.ts
- [ ] T036 [US3] Isolate runtime-specific behavior behind platform modules in src/platform/runtime.ts, src/platform/browser/, and src/platform/desktop/
- [ ] T037 [US3] Validate browser-mode continuity and update the dual-runtime workflow notes in docs/desktop-architecture.md and docs/windows-development.md

**Checkpoint**: User Story 3 keeps browser development and browser persistence working independently of the desktop shell. Evidence: passing T030-T032, a working `npm run dev:web` path, and updated dual-runtime workflow docs.

---

## Phase 6: User Story 4 - Support Bounded Agentic Development On Windows (Priority: P2)

**Goal**: Make the repository practical for Windows, Git Bash, and agentic incremental delivery without leaking desktop concerns into shared product code.

**Independent Test**: On Windows with Git Bash, follow the documented workflow to run `npm run dev:web`, `npm run dev`, and `npm run build`, then use the guidance to validate the desktop smoke path without undocumented shell steps.

### Tests for User Story 4 ⚠️

> **NOTE: Write these validation tasks FIRST and confirm the workflow gaps they expose before implementation**

- [ ] T038 [P] [US4] Add unit coverage for Windows-safe path and command helper behavior in tests/unit/platform/windowsRuntime.spec.ts
- [ ] T039 [P] [US4] Add a contributor smoke validation checklist for Windows workflows in docs/windows-development.md

### Implementation for User Story 4

- [ ] T040 [US4] Normalize Windows-safe desktop and browser scripts in package.json
- [ ] T041 [US4] Document the supported Node, Git Bash, and troubleshooting workflow in docs/windows-development.md
- [ ] T042 [US4] Add a repeatable desktop smoke workflow and rollback checkpoints in docs/windows-development.md and specs/003-desktop-app-packaging/quickstart.md
- [ ] T043 [US4] Update architecture and agent guardrails for preload-only desktop access in docs/desktop-architecture.md and AGENTS.md
- [ ] T044 [US4] Verify the Windows contributor workflow end to end and record the final command set in docs/windows-development.md

**Checkpoint**: User Story 4 provides a bounded Windows development workflow that agents and contributors can follow without guesswork. Evidence: the validated Windows command set, the contributor smoke checklist, and updated Windows workflow documentation.

---

## Phase 7: User Story 5 - Keep The Desktop Path Open For Broader Cross-Platform Use (Priority: P3)

**Goal**: Preserve platform-neutral runtime and packaging boundaries so Windows-first delivery does not force a redesign later.

**Independent Test**: Review the implementation and confirm that Electron path logic, runtime info, and shared persistence boundaries remain platform-aware rather than Windows-hardcoded inside shared renderer code.

### Tests for User Story 5 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T045 [P] [US5] Add unit coverage for platform-neutral runtime info and path helpers in tests/unit/platform/runtimeInfo.spec.ts
- [ ] T046 [P] [US5] Extend preload contract coverage for platform and version metadata in tests/contract/desktop-api.contract.spec.ts

### Implementation for User Story 5

- [ ] T047 [US5] Keep platform branching isolated to shell/runtime boundaries in electron/main.ts and src/platform/runtime.ts
- [ ] T048 [US5] Keep packaging configuration extensible beyond Windows-only assumptions in package.json and docs/desktop-architecture.md
- [ ] T049 [US5] Document current Windows-first limits and future extension points in docs/desktop-architecture.md and docs/windows-development.md

**Checkpoint**: User Story 5 leaves the runtime and packaging architecture open for later cross-platform extension without changing the renderer model. Evidence: passing T045-T046, platform-neutral runtime boundaries, and documented extension points.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Close the feature with cross-runtime validation, documentation alignment, and architecture hardening.

- [ ] T050 [P] Run a desktop boundary audit to confirm there are no direct Electron imports under src/ and record the result in docs/desktop-architecture.md
- [ ] T051 [P] Re-run the requirement-quality checks in specs/003-desktop-app-packaging/checklists/requirements.md and specs/003-desktop-app-packaging/checklists/desktop.md and close any findings in specs/003-desktop-app-packaging/spec.md or docs/desktop-architecture.md
- [ ] T052 [P] Execute the full validation pass from specs/003-desktop-app-packaging/quickstart.md, including `npm run dev:web`, `npm run dev`, `npm run build`, desktop restart persistence, bridge-unavailable fallback behavior, atomic-save recovery, write-failure handling, and portable packaging output validation
- [ ] T053 Finalize desktop runtime and persistence lifecycle documentation in docs/desktop-architecture.md and docs/windows-development.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; starts immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories because it establishes the runtime, typing, and persistence seams.
- **User Stories (Phases 3-7)**: Depend on Foundational completion.
- **Polish (Phase 8)**: Depends on completion of all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2; establishes the desktop shell MVP and portable packaging path.
- **User Story 2 (P1)**: Starts after Phase 2; final validation depends on a runnable desktop shell from US1, but the persistence slice remains independently testable through unit and integration coverage.
- **User Story 3 (P2)**: Starts after Phase 2; can proceed in parallel with US1/US2 because it focuses on preserving the browser workflow.
- **User Story 4 (P2)**: Starts after Phase 2; builds on the command surface established in US1 and US3.
- **User Story 5 (P3)**: Starts after Phase 2; is safest after the main shell and persistence seams exist because it hardens extensibility rather than introducing the initial capability.

### Within Each User Story

- Tests or validation tasks must be written first and fail or expose gaps before implementation.
- Runtime and contract surfaces come before shell or persistence behavior.
- Shell bootstrap comes before file-backed persistence.
- Desktop persistence comes before packaging validation.
- Story-specific docs and workflow updates complete the story before polish begins.

### Parallel Opportunities

- T002 and T003 can run in parallel.
- T005, T006, T007, and T008 can run in parallel after T004 starts the shared toolchain.
- Within US1, T011, T012, and T013 can run in parallel.
- Within US2, T020, T021, and T022 can run in parallel.
- Within US3, T030, T031, and T032 can run in parallel.
- Within US4, T038 and T039 can run in parallel.
- Within US5, T045 and T046 can run in parallel.
- T050, T051, and T052 can run in parallel during polish.

---

## Parallel Example: User Story 2

```bash
Task: "Add unit coverage for desktop file load/save and atomic replace behavior in tests/unit/persistence/desktopFileStore.spec.ts"
Task: "Add renderer integration coverage for best-score hydration and fallback warnings in tests/integration/app/desktop-persistence.spec.tsx"
Task: "Extend desktop restart persistence validation in tests/e2e/session-persistence.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the Electron shell plus portable Windows artifact independently.

### Incremental Delivery

1. Finish Setup and Foundational once.
2. Deliver the desktop shell and portable packaging path in US1.
3. Add file-backed desktop best-score persistence in US2.
4. Preserve browser-mode continuity in US3.
5. Add Windows agent workflow hardening in US4.
6. Finish with cross-platform-friendly boundary hardening in US5.
7. Close the feature with cross-cutting validation and documentation polish.

### Parallel Team Strategy

With multiple contributors after Phase 2:

1. Contributor A: User Story 1 shell and packaging.
2. Contributor B: User Story 2 persistence.
3. Contributor C: User Story 3 browser workflow.
4. Contributor D: User Story 4 Windows workflow and documentation.
5. Contributor E: User Story 5 extensibility hardening.

---

## Notes

- This task plan follows the requested shell-first, bridge-next, persistence-next, packaging-last sequencing.
- The user-provided installer phase was intentionally excluded because the active spec marks installer packaging out of scope for this feature.
- Best-score retention is the only desktop restart persistence requirement in scope for the first release.
- Independently reviewable evidence for each staged increment means the story-specific validation tasks pass, the checkpoint workflow or artifact is runnable, and the related docs/scripts are updated for reviewers and contributors.
- Keep renderer code Electron-agnostic throughout implementation; any direct `electron` import under `src/` fails the architecture boundary.
