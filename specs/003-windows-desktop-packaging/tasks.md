# Tasks: Windows Desktop Portable Packaging

**Input**: Design documents from `/specs/003-windows-desktop-packaging/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/desktop-persistence-contract.md, quickstart.md

**Tests**: Test tasks are required for each user story. Write the listed tests first, confirm they fail, then implement the story until the story-specific validation passes.

**Organization**: Tasks are grouped by user story so each phase produces an independently reviewable increment with clear frontend, native, persistence, and integration boundaries.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the minimum desktop scaffolding required to build and run a Tauri-based Windows app.

- [X] T001 Add Tauri npm scripts and desktop dependencies in package.json
- [X] T002 [P] Create the native Rust crate manifest with bundled SQLite dependencies in src-tauri/Cargo.toml
- [X] T003 [P] Create the Tauri Rust build script in src-tauri/build.rs
- [X] T004 [P] Create the Windows Tauri application configuration in src-tauri/tauri.conf.json
- [X] T005 Create the native desktop entrypoint and command registration shell in src-tauri/src/main.rs

**Checkpoint**: The repository can host a Tauri desktop runtime and has the files needed for story-specific native implementation.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the shared frontend/native command boundary used by all stories.

- [X] T006 Define shared desktop persistence DTOs and command names in src/types/desktopPersistence.ts
- [X] T007 Create the frontend desktop persistence invoke wrapper in src/app/services/desktopPersistenceClient.ts

**Checkpoint**: Frontend code has a single explicit boundary for calling native persistence commands.

---

## Phase 3: User Story 1 - Startup Best Score Visibility (Priority: P1) MVP

**Goal**: Launch the packaged desktop app, bootstrap the native SQLite database, and show or hide the startup best score correctly.

**Independent Test**: Run the desktop app with either no database or an existing database and verify first-run auto-creation, hidden-until-first-record behavior, and startup best-score display from the stored value.

### Tests for User Story 1 ⚠️

- [X] T008 [P] [US1] Add startup command contract tests for first-run database creation and existing-score hydration in src-tauri/tests/load_best_score_state_contract.rs
- [X] T009 [P] [US1] Add app hydration integration coverage for hidden-until-first-record and startup best-score display in tests/integration/app/desktop-startup-hydration.spec.tsx

### Implementation for User Story 1

- [ ] T010 [US1] Implement native SQLite bootstrap and single-row best-score initialization in src-tauri/src/persistence/database.rs
- [ ] T011 [US1] Implement executable-adjacent database path resolution with LocalAppData fallback metadata in src-tauri/src/runtime/storage_path.rs
- [ ] T012 [US1] Implement the load_best_score_state command response mapping in src-tauri/src/commands/load_best_score_state.rs
- [ ] T013 [US1] Register the startup hydration command in src-tauri/src/main.rs
- [ ] T014 [US1] Replace browser best-score hydration with desktop command loading in src/app/providers/PersistenceProvider.tsx
- [ ] T015 [US1] Hide or reveal the startup best-score panel from hydration state in src/components/hud/BestScorePanel.tsx
- [ ] T016 [US1] Update startup shell copy to remove browser-specific persistence wording in src/app/App.tsx

**Checkpoint**: The desktop app boots through Tauri, creates or opens native storage, and displays startup best-score state correctly without any game-over update logic yet.

---

## Phase 4: User Story 2 - Best Score Update Rules at Game Over (Priority: P1)

**Goal**: Submit end-of-game scores through the native command boundary and persist a new best score only on strict-greater results.

**Independent Test**: Complete three game-over flows against the same stored best score and verify strict-greater persistence, no update for equal/lower scores, congratulations only for a new record, and restart persistence after saving a new best.

### Tests for User Story 2 ⚠️

- [ ] T017 [P] [US2] Add game-over command contract tests for greater-than, equal, and lower score outcomes in src-tauri/tests/submit_game_over_score_contract.rs
- [ ] T018 [P] [US2] Add unit coverage for game-over-only score submission triggering in tests/unit/app/useGameSession.spec.ts
- [ ] T019 [P] [US2] Add desktop restart-persistence end-to-end coverage for a newly saved best score in tests/e2e/desktop-best-score-restart.spec.ts
- [ ] T020 [US2] Add integration coverage for congratulations visibility and live best-score updates in tests/integration/app/desktop-game-over-score.spec.tsx

### Implementation for User Story 2

- [ ] T021 [US2] Implement strict-greater best-score comparison and update logic in src-tauri/src/persistence/best_score_repository.rs
- [ ] T022 [US2] Implement the submit_game_over_score command response mapping in src-tauri/src/commands/submit_game_over_score.rs
- [ ] T023 [US2] Register the game-over submission command in src-tauri/src/main.rs
- [ ] T024 [US2] Route completed-game score submissions through the desktop persistence client in src/app/providers/PersistenceProvider.tsx
- [ ] T025 [US2] Emit explicit game_over submission payloads only when the session reaches game over in src/app/state/useGameSession.ts
- [ ] T026 [US2] Pass new-best submission state into the playfield overlay in src/app/App.tsx
- [ ] T027 [US2] Render congratulations messaging only for strict new records in src/components/overlays/GameOverOverlay.tsx
- [ ] T028 [US2] Update saved-best-score copy for desktop-local persistence in src/components/hud/BestScorePanel.tsx

**Checkpoint**: The desktop app completes the core best-score lifecycle: startup load, game-over submission, strict-greater persistence, congratulations messaging, and relaunch verification.

---

## Phase 5: User Story 3 - Portable Local Desktop Operation (Priority: P2)

**Goal**: Finish the Windows-portable desktop slice with recovery behavior, startup notices, and offline local execution validation.

**Independent Test**: Run the packaged Windows app locally with networking unavailable, verify gameplay still works with no separate server, and confirm missing/corrupt database recovery plus startup notices behave as specified.

### Tests for User Story 3 ⚠️

- [ ] T029 [P] [US3] Add startup recovery contract tests for missing-database recreation and corrupt-file backup rename in src-tauri/tests/startup_recovery_contract.rs
- [ ] T030 [P] [US3] Add integration coverage for fallback-path and database-reset startup notices in tests/integration/app/desktop-startup-notices.spec.tsx

### Implementation for User Story 3

- [ ] T032 [US3] Implement corrupt-database backup rename and recreation in src-tauri/src/persistence/database.rs
- [ ] T033 [US3] Emit fallback and reset notices from load_best_score_state in src-tauri/src/commands/load_best_score_state.rs
- [ ] T034 [US3] Surface startup notice payloads in desktop persistence state in src/app/providers/PersistenceProvider.tsx
- [ ] T035 [US3] Render desktop fallback and reset notices in src/components/overlays/PersistenceWarning.tsx
- [ ] T036 [US3] Add Windows file-system and command capability permissions in src-tauri/capabilities/default.json
- [ ] T037 [US3] Finalize portable Windows bundle settings for desktop distribution in src-tauri/tauri.conf.json
- [ ] T031 [US3] Add portable desktop smoke coverage for offline local startup and play in tests/e2e/portable-desktop-offline.spec.ts

**Checkpoint**: The desktop build runs as a portable local Windows app, recovers from missing or corrupt databases, and surfaces only event-scoped startup notices.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run release-quality validation, preserve gameplay behavior, and remove obsolete browser best-score artifacts.

- [ ] T038 [P] Run frontend lint and TypeScript/Vitest validation from package.json and record results in specs/003-windows-desktop-packaging/quickstart.md
- [ ] T039 [P] Run native Rust unit and contract validation from src-tauri/Cargo.toml and record results in specs/003-windows-desktop-packaging/quickstart.md
- [ ] T040 Validate desktop gameplay and scoring regression coverage using tests/integration/app/core-gameplay.spec.tsx and tests/e2e/core-gameplay.spec.ts, then record any desktop-specific findings in specs/003-windows-desktop-packaging/quickstart.md
- [ ] T041 Run the portable desktop build and offline smoke validation using src-tauri/tauri.conf.json and record Windows execution notes plus ordinary responsiveness observations in specs/003-windows-desktop-packaging/quickstart.md
- [ ] T042 [P] Remove obsolete browser best-score local-storage code in src/persistence/local-storage/bestScoreStore.ts
- [ ] T043 [P] Remove obsolete browser best-score unit coverage in tests/unit/persistence/best-score-store.spec.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational and delivers the MVP desktop startup slice.
- **User Story 2 (Phase 4)**: Depends on User Story 1 because it extends the same native/frontend persistence path with game-over writes.
- **User Story 3 (Phase 5)**: Depends on User Stories 1 and 2 because it validates the completed desktop lifecycle under recovery and portable-runtime conditions.
- **Polish (Phase 6)**: Depends on the desired story phases being complete.

### User Story Dependencies

- **US1**: No dependency on later stories.
- **US2**: Builds directly on US1 startup hydration and shared command DTOs.
- **US3**: Builds on the completed startup and game-over persistence lifecycle from US1 and US2.

### Within Each User Story

- Write tests first and confirm they fail before implementation.
- Complete native persistence and command tasks before frontend integration tasks that invoke them.
- Complete frontend provider orchestration before UI-only rendering tasks.
- Validate each story independently before moving to the next story.

---

## Parallel Opportunities

- **Setup**: T002, T003, and T004 can run in parallel after T001.
- **US1**: T008 and T009 can run in parallel.
- **US2**: T017, T018, and T019 can run in parallel; T020 should follow once the primary command/UI assertions are clear.
- **US3**: T029 and T030 can run in parallel; T031 should follow after the portable build path is available.
- **Polish**: T038 and T039 can run in parallel; T042 and T043 can run in parallel after validation work is complete.

---

## Parallel Example: User Story 1

```bash
# Write the startup validation tests together:
Task: "T008 Add startup command contract tests for first-run database creation and existing-score hydration in src-tauri/tests/load_best_score_state_contract.rs"
Task: "T009 Add app hydration integration coverage for hidden-until-first-record and startup best-score display in tests/integration/app/desktop-startup-hydration.spec.tsx"
```

## Parallel Example: User Story 2

```bash
# Write the core score-submission checks together:
Task: "T017 Add game-over command contract tests for greater-than, equal, and lower score outcomes in src-tauri/tests/submit_game_over_score_contract.rs"
Task: "T018 Add unit coverage for game-over-only score submission triggering in tests/unit/app/useGameSession.spec.ts"
Task: "T019 Add desktop restart-persistence end-to-end coverage for a newly saved best score in tests/e2e/desktop-best-score-restart.spec.ts"
```

## Parallel Example: User Story 3

```bash
# Write the recovery and notice checks together:
Task: "T029 Add startup recovery contract tests for missing-database recreation and corrupt-file backup rename in src-tauri/tests/startup_recovery_contract.rs"
Task: "T030 Add integration coverage for fallback-path and database-reset startup notices in tests/integration/app/desktop-startup-notices.spec.tsx"
```

---

## Implementation Strategy

### MVP First (US1 → US2)

1. Complete Setup and Foundational.
2. Deliver US1 to prove the app boots as a desktop runtime, creates native storage, and hydrates startup best-score state.
3. Deliver US2 immediately after US1 to complete the full best-score lifecycle: game-over submission, strict-greater persistence, congratulations behavior, and restart verification.
4. Stop after US2 for MVP review and demo.

### Incremental Delivery

1. Setup + Foundational establish the desktop command boundary.
2. US1 adds desktop startup hydration as the first runnable slice.
3. US2 adds native best-score updates at game over without broadening scope beyond the best-score lifecycle.
4. US3 adds portable packaging hardening, recovery behavior, and offline/local validation.
5. Polish removes browser-only remnants and records final validation notes.

### Commit Strategy

1. Prefer one commit per task when the task stands alone cleanly.
2. If a task pair is tightly coupled, commit the smallest adjacent cluster that leaves tests green and the increment reviewable.
3. Do not combine native persistence tasks, frontend orchestration tasks, and UI rendering tasks into one commit unless the task is explicitly an integration step.

---

## Notes

- [P] tasks are limited to work on different files with low merge-conflict risk.
- Tasks intentionally keep frontend/UI, Tauri command, native persistence, and integration work separated.
- The earliest complete MVP is the end of Phase 4, where the full best-score lifecycle works on the desktop runtime.