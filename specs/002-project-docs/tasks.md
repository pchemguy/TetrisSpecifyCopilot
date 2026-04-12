# Tasks: Comprehensive Project Documentation

**Input**: Design documents from `/specs/002-project-docs/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No new automated test files are required for this documentation-only feature. Validation tasks are still required in each story to prove the documented behavior, commands, and cross-references independently.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation of each document deliverable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the deliverable files and shared authoring baseline for all four documentation outputs.

- [x] T001 Create initial document skeletons with top-level headings in docs/user-guide.md, docs/developer-guide.md, docs/reviewer-guide.md, and docs/persistence-reference.md
- [x] T002 [P] Add the shared Bash prerequisite note and top-level cross-links in docs/user-guide.md and docs/developer-guide.md
- [x] T003 [P] Add the shared Bash prerequisite note and top-level cross-links in docs/reviewer-guide.md and docs/persistence-reference.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared source-of-truth and consistency rules that every document depends on.

**⚠️ CRITICAL**: No user story work should be treated as complete until this phase is done.

- [x] T004 Validate and extract the source-of-truth inventory for controls, scoring, and seed-data behavior from specs/002-project-docs/research.md for use in docs/user-guide.md and docs/persistence-reference.md
- [x] T005 [P] Validate and extract the source-of-truth command set and expected outputs from specs/002-project-docs/quickstart.md for use in docs/developer-guide.md and docs/reviewer-guide.md
- [x] T006 [P] Record the canonical terminology, cross-link targets, and consistency rules to follow from specs/002-project-docs/contracts/documentation-interfaces.md while drafting docs/user-guide.md, docs/developer-guide.md, docs/reviewer-guide.md, and docs/persistence-reference.md

**Checkpoint**: Shared validation baseline is ready; user story document work can proceed in parallel.

---

## Phase 3: User Story 1 - New Player Sets Up and Plays the Game (Priority: P1) 🎯 MVP

**Goal**: Deliver a player-facing User Guide that gets a new player from clone to a successful local play session.

**Independent Test**: Follow only docs/user-guide.md to install dependencies, run the game, use the documented controls, understand scoring and persistence, and resolve at least one troubleshooting scenario.

### Implementation for User Story 1

- [x] T007 [US1] Draft prerequisites, installation, launch, and desktop-browser support sections in docs/user-guide.md
- [x] T008 [P] [US1] Add the controls reference and exact scoring table in docs/user-guide.md
- [x] T009 [P] [US1] Add persistence, best-score, and seeded demo data sections in docs/user-guide.md
- [x] T010 [US1] Add troubleshooting guidance, including blocked localStorage/IndexedDB fallback messaging, in docs/user-guide.md
- [x] T011 [US1] Run the player onboarding walkthrough and revise docs/user-guide.md to satisfy SC-001 and SC-004

**Checkpoint**: User Story 1 is independently usable as an MVP player guide.

---

## Phase 4: User Story 2 - Developer Understands the Codebase to Contribute (Priority: P2)

**Goal**: Deliver a Developer Guide that explains setup, architecture, scripts, and the main data flow clearly enough for a contributor to make a safe change.

**Independent Test**: Use only docs/developer-guide.md to set up the app, run the documented commands, identify the primary engine/rendering/persistence paths, and understand the end-to-end input-to-render flow.

### Implementation for User Story 2

- [x] T012 [US2] Draft contributor setup and npm scripts reference in docs/developer-guide.md
- [x] T013 [P] [US2] Add the repository directory map and architecture overview in docs/developer-guide.md
- [x] T014 [P] [US2] Add the Mermaid data-flow diagram and step-by-step prose explanation in docs/developer-guide.md
- [x] T015 [P] [US2] Add testing strategy, build workflow, and code quality expectations in docs/developer-guide.md
- [x] T016 [US2] Run the contributor walkthrough and revise docs/developer-guide.md to satisfy SC-002

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Reviewer Validates the Implementation Quickly (Priority: P3)

**Goal**: Deliver a Reviewer Guide with a linear validation flow that can be completed in under 30 minutes.

**Independent Test**: Follow only docs/reviewer-guide.md and verify the implementation through install, run, quality checks, E2E checks, build, offline validation, and failure-handling guidance.

### Implementation for User Story 3

- [x] T017 [US3] Draft the numbered validation checklist with at most 12 top-level steps in docs/reviewer-guide.md
- [x] T018 [P] [US3] Add copy-paste validation commands and expected outcomes in docs/reviewer-guide.md
- [x] T019 [P] [US3] Add offline verification, Playwright install remedy, and failed-command exception workflow in docs/reviewer-guide.md
- [x] T020 [US3] Tune the reviewer sequence and wording in docs/reviewer-guide.md to satisfy NFR-004, NFR-005, and SC-003

**Checkpoint**: User Stories 1, 2, and 3 all work independently.

---

## Phase 6: User Story 4 - Maintainer Understands Persistence and Data Model (Priority: P4)

**Goal**: Deliver a persistence reference that accurately documents SQLite tables, localStorage keys, seed-data invariants, and recovery behavior.

**Independent Test**: Read only docs/persistence-reference.md and verify that it fully answers the schema, storage, migration, seed-data, and fallback questions defined by the spec.

### Implementation for User Story 4

- [x] T021 [US4] Draft the SQLite tables and schema-purpose reference in docs/persistence-reference.md
- [x] T022 [P] [US4] Add localStorage keys, document shapes, and IndexedDB/SQLite lifecycle sections in docs/persistence-reference.md
- [x] T023 [P] [US4] Add seed-data invariants, best-score protection rules, and persistence failure/recovery guidance in docs/persistence-reference.md
- [ ] T024 [US4] Run the maintainer verification pass and revise docs/persistence-reference.md to satisfy SC-006

**Checkpoint**: All four user stories are independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, verification, and release-gate closure across all four documents.

- [ ] T025 [P] Run a cross-document terminology and internal-link consistency pass across docs/user-guide.md, docs/developer-guide.md, docs/reviewer-guide.md, and docs/persistence-reference.md
- [ ] T026 [P] Execute the documented command-validation pass and update docs/reviewer-guide.md and docs/developer-guide.md with verified expected outcomes
- [ ] T027 Re-run the requirements-quality checklist in specs/002-project-docs/checklists/docs.md and update docs/user-guide.md, docs/developer-guide.md, docs/reviewer-guide.md, and docs/persistence-reference.md to close any findings
- [ ] T028 Run the full quickstart acceptance checklist from specs/002-project-docs/quickstart.md, including FR-025 failed-command handling, FR-026 Playwright remedy coverage, FR-027 persistence fallback messaging, and the NFR-005 reviewer checklist cap, then complete the final editorial/release-gate pass across docs/user-guide.md, docs/developer-guide.md, docs/reviewer-guide.md, and docs/persistence-reference.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; starts immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks story completion because it defines shared source-of-truth and terminology.
- **User Stories (Phases 3-6)**: Depend on Foundational completion; can then proceed in parallel if staffed.
- **Polish (Phase 7)**: Depends on completion of all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2; no dependency on other stories.
- **User Story 2 (P2)**: Starts after Phase 2; independent of US1, but should reuse shared terminology and commands.
- **User Story 3 (P3)**: Starts after Phase 2; depends on the shared command baseline but not on completion of US1 or US2.
- **User Story 4 (P4)**: Starts after Phase 2; independent of the other stories except shared terminology and source-of-truth rules.

### Within Each User Story

- Source-of-truth research before narrative drafting.
- Core sections before validation pass.
- Validation pass before calling the story complete.
- Story must be independently readable and executable before polish begins.

### Parallel Opportunities

- T002 and T003 can run in parallel.
- T005 and T006 can run in parallel after T004 starts the shared baseline.
- Within US1, T008 and T009 can run in parallel.
- Within US2, T013, T014, and T015 can run in parallel.
- Within US3, T018 and T019 can run in parallel.
- Within US4, T022 and T023 can run in parallel.
- T025 and T026 can run in parallel during polish.

---

## Parallel Example: User Story 2

```bash
Task: "Add the repository directory map and architecture overview in docs/developer-guide.md"
Task: "Add the Mermaid data-flow diagram and step-by-step prose explanation in docs/developer-guide.md"
Task: "Add testing strategy, build workflow, and code quality expectations in docs/developer-guide.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate docs/user-guide.md against the independent test.

### Incremental Delivery

1. Finish Setup and Foundational once.
2. Deliver docs/user-guide.md as the MVP.
3. Add docs/developer-guide.md and validate contributor workflows.
4. Add docs/reviewer-guide.md and validate the review flow.
5. Add docs/persistence-reference.md and validate maintainer correctness.
6. Finish with cross-document polish and checklist closure.

### Parallel Team Strategy

With multiple contributors after Phase 2:

1. Contributor A: docs/user-guide.md
2. Contributor B: docs/developer-guide.md
3. Contributor C: docs/reviewer-guide.md
4. Contributor D: docs/persistence-reference.md

---

## Notes

- [P] tasks are parallelizable when they avoid conflicting dependencies.
- Every task includes exact file paths for the deliverable or governing artifact it updates.
- Validation is mandatory even though no new automated test files are introduced.
- Keep implementation behavior as the source of truth if any doc statement conflicts with code.
