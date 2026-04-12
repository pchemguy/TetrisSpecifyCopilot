# Feature Specification: Comprehensive Project Documentation

**Feature Branch**: `002-project-docs`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "I need to create detailed comprehensive professional user and dev project docs"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New Player Sets Up and Plays the Game (Priority: P1)

As a player who has downloaded the repository, I want clear instructions to install, run, and play the game so I can start playing without reading source code or guessing at commands.

**Why this priority**: The player experience is the product's primary purpose. If a new player cannot get the game running and understand its controls from documentation alone, the deliverable fails its most basic obligation.

**Independent Test**: Follow only the documentation (no prior knowledge, no code inspection) to install dependencies, launch the game, learn the controls, and complete a playable session including pause, restart, and score persistence across a page reload.

**Acceptance Scenarios**:

1. **Given** a player has Node.js installed and has cloned the repository, **When** they follow the User Guide setup section step by step, **Then** the game is running in a browser within five minutes with no additional research required.
2. **Given** a running game, **When** the player consults the controls reference in the User Guide, **Then** every keyboard shortcut listed matches the actual game behavior.
3. **Given** a player has finished a game session, **When** they reload the browser page and refer to the persistence section of the User Guide, **Then** they understand why their best score is still displayed and what data is stored locally.
4. **Given** the game does not open or behaves unexpectedly, **When** the player reads the troubleshooting section, **Then** at least one documented remedy addresses their situation.

---

### User Story 2 - Developer Understands the Codebase to Contribute (Priority: P2)

As a developer who is new to the project, I want an architecture overview and development setup guide so I can understand how the pieces fit together, run the full test suite, and make a code change with confidence.

**Why this priority**: Without a developer guide, the project is not maintainable or extensible. This is the second most critical audience after the end player.

**Independent Test**: Using only the Developer Guide and the repository, set up a development environment, run all tests (unit, integration, and end-to-end), navigate to the module responsible for scoring logic, and make and verify a trivial code change—all without asking for external help.

**Acceptance Scenarios**:

1. **Given** a developer has cloned the repository, **When** they follow the Developer Guide setup section, **Then** `npm run dev`, `npm run test`, and the end-to-end test commands all succeed on a clean machine.
2. **Given** a developer is reading the architecture reference, **When** they want to know where a particular concern (engine logic, rendering, persistence, state management) is handled, **Then** the directory structure table and module descriptions in the guide point them to the correct source path.
3. **Given** a developer wants to run only a subset of tests, **When** they consult the testing section, **Then** they can find commands for unit tests, integration tests, and end-to-end tests separately.
4. **Given** a developer wants to build a production bundle, **When** they follow the build section, **Then** `npm run build` completes without errors and the output is a self-contained static bundle.
5. **Given** a developer wants to understand how game state flows from user input to canvas render, **When** they read the data-flow section of the architecture guide, **Then** the narrative and diagram are sufficient to trace the call path without reading source code.

---

### User Story 3 - Reviewer Validates the Implementation Quickly (Priority: P3)

As a code reviewer or evaluator, I want a focused reviewer flow that tells me exactly what to check, in what order, and what commands to run so I can validate the full implementation in a single sitting.

**Why this priority**: The project was built with a spec-driven workflow; a reviewer guide closes the evaluation loop.

**Independent Test**: A reviewer who has never seen the project follows the reviewer section from start to finish and is able to confirm or deny that: the game plays correctly, persistence works, all tests pass, and the build is clean—within thirty minutes.

**Acceptance Scenarios**:

1. **Given** a reviewer opens the project, **When** they follow the reviewer flow, **Then** a numbered checklist guides them through: install, start, gameplay smoke test, test suite, end-to-end suite, build, and offline persistence verification.
2. **Given** the reviewer runs all validation commands listed, **When** the implementation is correct, **Then** every command exits with code 0 and produces the output described in the guide.
3. **Given** the reviewer wants to verify offline persistence, **When** they follow the offline verification step, **Then** specific browser DevTools instructions guide them to disable networking after initial load and confirm the game and scores continue to work.

---

### User Story 4 - Maintainer Understands Persistence and Data Model (Priority: P4)

As a project maintainer, I want a concise reference for the storage model and schema so I can make changes to persistence without risking data loss or silent corruption.

**Why this priority**: The SQLite WASM + IndexedDB persistence layer is non-obvious; documentation prevents future regressions and misconfigurations.

**Independent Test**: Read only the persistence reference section and then correctly answer: what tables exist, what IndexedDB key stores data, what localStorage keys are used, what the schema migration strategy is, and how demo seed data is distinguished from player data.

**Acceptance Scenarios**:

1. **Given** a maintainer reads the persistence reference, **When** they want to understand what is stored in SQLite, **Then** a table listing describes every table, its columns, and its purpose.
2. **Given** a maintainer reads the persistence reference, **When** they want to understand what is in localStorage, **Then** every key and its document structure is documented.
3. **Given** a maintainer reviews the seed data section, **When** they want to verify player data is protected, **Then** the documentation explicitly states how demo rows are distinguished and that they never overwrite a player's best score.

---

### Edge Cases

- What happens if a user skips the `npx playwright install chromium` step and runs E2E tests?
- How does the documentation cover behavior when IndexedDB or localStorage is blocked by the browser (e.g., private mode restrictions)?
- What if the developer is on Windows and uses PowerShell instead of Bash—are shell-specific commands documented with variants?
- What if the game is opened in an unsupported browser (e.g., older Safari without WebAssembly)?
- How is the documentation kept in sync when game behavior or the schema changes?

## Requirements *(mandatory)*

### Functional Requirements

**User Guide (Player-facing)**

- **FR-001**: The User Guide MUST include a prerequisites section listing minimum Node.js and npm versions and browser requirements (WebAssembly, IndexedDB support).
- **FR-002**: The User Guide MUST include a numbered installation procedure that a new player can follow without prior project knowledge.
- **FR-003**: The User Guide MUST include a complete controls reference table mapping every keyboard key to its in-game action.
- **FR-004**: The User Guide MUST explain the scoring system using the exact values from the implementation: single line = 100 × level, double = 300 × level, triple = 500 × level, Tetris (4 lines) = 800 × level; soft drop = +1 point per row; hard drop = +2 points per row. There are no combo bonuses. The guide MUST also explain how crossing each 10-line threshold increases the level and raises the gravity speed.
- **FR-005**: The User Guide MUST explain what data is persisted locally (best score, settings, session history, replay metadata), where it is stored (localStorage keys vs. SQLite), and what happens on first launch (seed data behavior).
- **FR-006**: The User Guide MUST include a troubleshooting section covering at least: game fails to start, controls unresponsive, best score not appearing, IndexedDB quota errors.
- **FR-007**: The User Guide MUST describe demo seed data: what it is, why it exists, and that it never overwrites a player's personal best score.

**Developer Guide (Contributor-facing)**

- **FR-008**: The Developer Guide MUST include a development environment setup section covering: clone, install, start dev server, open browser.
- **FR-009**: The Developer Guide MUST document all npm scripts (`dev`, `build`, `lint`, `test`, `test:watch`, `test:e2e`) with a one-line description of each.
- **FR-010**: The Developer Guide MUST include a directory structure table mapping each top-level folder and key sub-folder to its responsibility.
- **FR-011**: The Developer Guide MUST include an architecture overview describing the four primary concerns: game engine (deterministic state machine), rendering (Canvas), application state (React hooks), and persistence (SQLite WASM + IndexedDB).
- **FR-012**: The Developer Guide MUST include a data-flow section showing how a key press travels from DOM event through the game engine to a canvas repaint. The section MUST contain both a Mermaid flowchart (in a fenced `mermaid` code block, rendered natively by GitHub) and a short prose description of each step.
- **FR-013**: The Developer Guide MUST document the test suite structure: what Vitest covers (unit and integration), what Playwright covers (end-to-end), and how to run each subset independently.
- **FR-014**: The Developer Guide MUST document code quality requirements: linting rules enforced by ESLint, TypeScript strict mode, and the expected state of lint and tests before a change is considered complete.
- **FR-015**: The Developer Guide MUST include a section on the persistence layer: how the SQLite WASM database is initialized, how IndexedDB is used to store and reload the binary database blob, and what the schema migration strategy is.

**Reviewer Guide**

- **FR-016**: The Reviewer Guide MUST contain a numbered linear checklist covering: install, start app, gameplay smoke test (each control key), persistence reload test, lint pass, unit and integration test pass, end-to-end test pass, build pass, and offline persistence verification.
- **FR-017**: The Reviewer Guide MUST list every validation command in copy-paste form and describe the expected output for each.
- **FR-018**: The Reviewer Guide MUST include explicit steps for offline verification using browser DevTools network throttling.

**Persistence Reference**

- **FR-019**: The Persistence Reference MUST list every SQLite table with column names, types, and purpose.
- **FR-020**: The Persistence Reference MUST list every localStorage key with its document schema.
- **FR-021**: The Persistence Reference MUST describe how demo seed rows are identified and what invariant protects the player's best score from being overwritten.

**Cross-cutting**

- **FR-022**: All documentation MUST be accurate with respect to the actual implementation at the time of writing; no placeholder or aspirational content is permitted. All four files MUST be placed under `docs/` at the repository root.
- **FR-023**: All command examples MUST use Bash syntax only. The prerequisites section of every document that contains shell commands MUST include the note: "Windows users require Git Bash (e.g., Git for Windows) or WSL; PowerShell is not supported." No PowerShell variants are provided.
- **FR-024**: Documentation MUST be written in plain English comprehensible to a non-specialist reader; implementation-specific jargon MUST be explained on first use.

### Non-Functional Requirements

- **NFR-001**: All documentation files MUST pass the project linter where applicable (Markdown linting if configured) and contain no broken internal links.
- **NFR-002**: Each document section MUST be independently reviewable; a reader interested only in controls should not need to read the architecture section first.
- **NFR-003**: Documentation language MUST be consistent with the project's existing voice and terminology; terms like "tetromino," "ghost piece," "hard drop," and "hold" MUST match the in-game UI labels.
- **NFR-004**: The Reviewer Guide MUST be completable end-to-end in under thirty minutes on a machine that already has Node.js and a Chromium-based browser installed.

### Key Entities

- **User Guide**: A self-contained document targeting players; covers setup, gameplay, controls, scoring, persistence, and troubleshooting.
- **Developer Guide**: A self-contained document targeting contributors; covers architecture, setup, directory structure, data flow, test suite, and code quality.
- **Reviewer Guide**: A focused checklist document targeting evaluators; covers the complete validation workflow in numbered steps.
- **Persistence Reference**: A technical reference covering the SQLite schema, localStorage keys, IndexedDB usage, and seed data invariants.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A person with no prior project knowledge can install, run, and play the game in under five minutes by following only the User Guide, with no external research required.
- **SC-002**: A developer unfamiliar with the codebase can set up a development environment, run all tests, and locate any primary module in under fifteen minutes by following only the Developer Guide.
- **SC-003**: A reviewer can complete the full validation checklist and confirm or deny correct implementation in under thirty minutes by following only the Reviewer Guide.
- **SC-004**: Every keyboard control listed in the documentation matches the actual game behavior, verifiable by testing each key against the controls reference table (100% accuracy).
- **SC-005**: Every validation command listed in the documentation exits with code 0 on a correct implementation; none require undocumented flags or workarounds.
- **SC-006**: The persistence reference correctly describes every SQLite table and localStorage key present in the actual implementation with no omissions or inaccuracies.
- **SC-007**: Zero contradictions exist between documentation sections (e.g., the controls table in the User Guide matches the controls listed in the Reviewer Guide).

## Clarifications

### Session 2026-04-12

- Q: Where should the four documentation files be placed in the repository? → A: All four documents go in `docs/` at the repo root (`docs/user-guide.md`, `docs/developer-guide.md`, `docs/reviewer-guide.md`, `docs/persistence-reference.md`).
- Q: What is the exact scoring system to document? → A: Classic Guideline, no combo bonus: single=100×level, double=300×level, triple=500×level, Tetris=800×level; soft drop +1pt/row; hard drop +2pt/row.
- Q: What format should the data-flow diagram use? → A: Mermaid flowchart embedded in a fenced code block (rendered natively by GitHub).
- Q: Should command examples include PowerShell variants for Windows? → A: Bash only; Windows users receive a prerequisite note stating Git Bash or WSL is required.
- Q: Should command examples include PowerShell variants for Windows? → A: Bash only; Windows users receive a prerequisite note stating Git Bash or WSL is required.
- Q: Should a Markdown linter be introduced for documentation quality enforcement? → A: No Markdown linter; NFR-001 is scoped to ESLint (TypeScript files unchanged) plus a manual broken-link check during review.
- **NFR-001**: No Markdown linter is introduced by this feature. The existing ESLint configuration MUST continue to pass without modification (`npm run lint`). All documentation files MUST contain no broken internal Markdown links; link correctness is verified manually during the review pass.

## Assumptions

- Documentation is written for the current state of the `001-prepare-spec-branch` implementation; it targets the completed Classic Browser Tetris feature only.
- All four documentation files (User Guide, Developer Guide, Reviewer Guide, Persistence Reference) are authored in Markdown and stored under `docs/` at the repository root. The `specs/` tree remains reserved for spec-kit planning artifacts.
- The primary development and validation environment is Windows with Bash (MSYS), per the `AGENTS.md` shell selection rule; commands are validated there first.
- Mobile browser support is explicitly out of scope; the User Guide MUST note that only desktop browsers are supported.
- No external documentation hosting (e.g., GitHub Pages, ReadTheDocs) is required for this feature; Markdown rendered on GitHub is sufficient.
- The project has no build-time documentation generation pipeline; documentation is written and maintained manually.
- Seed data behavior documented in `quickstart.md` is the canonical source of truth for the demo data section; the new docs MUST be consistent with it.
- The "best score never overwritten by seed data" invariant is already implemented; the documentation only needs to describe it, not implement it.
