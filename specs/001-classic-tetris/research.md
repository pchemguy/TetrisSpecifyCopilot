# Research: Classic Browser Tetris

## Decision 1: Use a React SPA with HTML5 Canvas for gameplay rendering

- Decision: Build the application as a single-page React app, using React for the HUD, overlays, and persistence-driven shell while rendering the board and active gameplay objects on a single Canvas surface.
- Rationale: React is well suited for static and semi-static UI such as score panels, hold/next previews, overlays, and configuration state. Canvas provides more predictable performance for a rapidly updating 10x20 board, ghost piece, lock transitions, and redraw-heavy gameplay than a DOM cell grid.
- Alternatives considered: A DOM/CSS grid was rejected because it complicates high-frequency redraw behavior and visual layering for ghost and active pieces. A WebGL-first renderer was rejected because it adds implementation complexity without a clear need for a game with simple 2D primitives.

## Decision 2: Keep the game engine deterministic with a fixed-step update loop and command log

- Decision: Implement gameplay as a pure TypeScript engine that advances in fixed simulation ticks, consumes normalized input commands, and emits immutable state snapshots for rendering and persistence.
- Rationale: Determinism is required for reliable replay storage, consistent tests, and predictable behavior across pause/resume, hold, level speed changes, and restart boundaries. A command-driven engine also makes unit testing and replay serialization straightforward.
- Alternatives considered: A frame-time-driven mutable loop was rejected because timing variance would complicate replay fidelity and test determinism. Encoding game logic directly in React component state was rejected because it would tightly couple rendering lifecycle with rules evaluation.

## Decision 3: Use 7-bag randomization and SRS-compatible rotation data

- Decision: Generate tetrominoes with a 7-bag randomizer and use Super Rotation System style rotation definitions with wall-kick tables for standard tetromino movement behavior.
- Rationale: This matches player expectations for modern classic Tetris implementations and satisfies the requirement for standard tetromino behavior while preventing extreme starvation cases in piece generation.
- Alternatives considered: Fully uniform random generation was rejected because it can starve specific pieces for long stretches and produce less fair play. Custom simplified rotation rules were rejected because they would create avoidable UX inconsistency for experienced players.

## Decision 4: Store settings in localStorage and structured run history in SQLite WASM persisted through IndexedDB

- Decision: Persist user settings and transient UI state in localStorage, and store sessions, scores, and replay data in a SQLite database powered by `sql.js`, with the database file serialized and persisted in IndexedDB.
- Rationale: localStorage is simple and synchronous for small shell configuration values. SQLite in WASM satisfies the requirement for structured browser-resident data while enabling relational queries for best score, session history, and replay metadata. IndexedDB is a more appropriate browser storage target than localStorage for binary database persistence.
- Alternatives considered: Plain IndexedDB object stores were rejected because the requirement explicitly asks for SQLite in the browser. Persisting the SQLite database in localStorage was rejected because binary payload size and write characteristics are poor for that storage medium. A remote database was rejected because the application must run entirely on the client with no network dependency.

## Decision 5: Persist replay records as command streams keyed to deterministic seeds

- Decision: Store replay records as deterministic command sequences and timing metadata associated with a session seed and engine version, rather than storing only frame-by-frame board snapshots.
- Rationale: Command streams are smaller, align with the deterministic engine design, and allow regression testing by re-simulating a known session to confirm equivalent outcomes.
- Alternatives considered: Full board snapshots for every frame were rejected because they greatly increase storage volume and do not add value for routine replay reconstruction. Storing only final score summaries was rejected because it would not satisfy replay requirements.

## Decision 6: Test at three layers: engine, app integration, and end-to-end browser play

- Decision: Use Vitest for pure engine and persistence tests, React Testing Library for app-shell integration, and Playwright for desktop play validation in a real browser.
- Rationale: The engine contains most of the rule complexity and benefits from fast deterministic unit tests. Integration tests catch hydration and orchestration issues between React, Canvas, localStorage, and SQLite adapters. End-to-end tests prove that real keyboard input, overlays, restart flow, and persisted best-score behavior work together.
- Alternatives considered: Browser-only testing was rejected because it would be too slow and coarse to validate detailed rule edge cases. Unit-only testing was rejected because it would miss integration failures in storage hydration, focus handling, and browser input behavior.

## Decision 7: Seed demo data on first launch while keeping gameplay immediately available

- Decision: On first load in an empty browser profile, seed default localStorage entries and insert a small set of demo session, score, and replay records into the SQLite database without blocking the user from starting a fresh run immediately.
- Rationale: This satisfies the requirement for immediate exercise and reviewability while preserving the ability to start a clean new game at any time.
- Alternatives considered: Shipping no sample data was rejected because it would not satisfy the review requirement. Shipping only static JSON fixtures outside the runtime stores was rejected because it would not prove that persistence and historical UI views are wired correctly.
