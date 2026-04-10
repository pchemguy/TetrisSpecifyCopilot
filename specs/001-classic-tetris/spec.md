# Feature Specification: Classic Browser Tetris

**Feature Branch**: `001-prepare-spec-branch`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "Implement the feature specification based on the updated constitution. I want to build a browser-based classic Tetris game. The game must implement standard tetromino shapes, randomized piece generation, horizontal movement, rotation, soft drop, hard drop, line clearing, scoring, level progression, speed increase, next-piece preview, hold-piece support, pause/resume, restart, and game-over handling. The UI must display the board, active piece, ghost piece, score, level, cleared lines, next piece, and held piece, with keyboard controls suitable for desktop play. Include persistence for best score and provide sample data or configuration so the game can be exercised immediately."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play a Complete Tetris Run (Priority: P1)

As a player, I want to control falling tetrominoes on a standard Tetris board so I can complete lines, increase my score, and continue playing until I top out.

**Why this priority**: Core gameplay is the product. Without a complete playable loop, the game does not deliver value.

**Independent Test**: Start a new game, move and rotate pieces, soft drop and hard drop them into place, clear at least one line, and continue until the board reaches a game-over state.

**Acceptance Scenarios**:

1. **Given** a new game has started, **When** the player moves, rotates, soft drops, or hard drops the active tetromino, **Then** the piece updates according to standard Tetris movement rules and remains within valid board boundaries.
2. **Given** a placement completes one or more horizontal lines, **When** the piece locks, **Then** the completed lines are removed, the stack collapses downward, and the score and cleared-line count update immediately.
3. **Given** the player continues placing pieces until a new tetromino cannot enter the playfield, **When** the spawn is blocked, **Then** the game ends and the interface clearly shows the final score and restart option.

---

### User Story 2 - Track Progress and Make Decisions (Priority: P2)

As a player, I want to see my score, level, cleared lines, next piece, held piece, and ghost piece so I can plan placements and understand my progress.

**Why this priority**: These feedback systems turn the base game into recognizable, strategically playable Tetris.

**Independent Test**: Play until multiple pieces have spawned, use hold once, confirm the next-piece preview and ghost piece update correctly, and verify score, level, and cleared lines reflect gameplay events.

**Acceptance Scenarios**:

1. **Given** a game is in progress, **When** a new tetromino becomes active, **Then** the next-piece preview shows the upcoming piece and the ghost piece shows the active piece's landing position.
2. **Given** the player uses hold during a turn, **When** hold is available, **Then** the active piece swaps with the held piece or is stored if the hold slot is empty, and hold becomes unavailable again until the current active piece locks.
3. **Given** the player clears enough lines to reach a higher level, **When** the level threshold is crossed, **Then** the level increases and the falling speed becomes faster for subsequent active pieces.

---

### User Story 3 - Pause, Resume, Restart, and Return (Priority: P3)

As a returning player, I want to pause, resume, restart, and keep my best score between sessions so the game is convenient to replay on desktop browsers.

**Why this priority**: Session control and retained best score improve usability and replay value, but depend on the core game loop already working.

**Independent Test**: Pause an active game, resume it, restart it, finish a game with a new best score, reload the game, and confirm the best score is still displayed.

**Acceptance Scenarios**:

1. **Given** a game is active, **When** the player pauses, **Then** piece movement and falling stop until the player resumes.
2. **Given** the player restarts during play or after game over, **When** restart is triggered, **Then** a new game begins with a cleared board, reset run-specific stats, and best score retained.
3. **Given** the player achieves a score higher than the current best score, **When** the game ends or the score is otherwise committed, **Then** the best score is saved and shown again when the game is loaded later on the same device profile.

---

### Edge Cases

- What happens when a rotation would place part of the active tetromino outside the board or overlapping locked blocks near a wall or floor?
- How does the game handle a hard drop, hold action, or pause request submitted at the same moment a piece is locking?
- What happens when line clears, level progression, and a new best score all occur on the same placement?
- How does restart behave if triggered while the game is paused or immediately after game over?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST provide a single-player Tetris playfield with a standard 10-column by 20-row visible board.
- **FR-002**: The game MUST include all seven standard tetromino shapes: I, O, T, S, Z, J, and L.
- **FR-003**: The game MUST generate active tetrominoes using a randomized sequence that distributes all seven tetrominoes regularly and avoids indefinite starvation of any single shape.
- **FR-004**: The player MUST be able to move the active tetromino left and right while the movement remains valid.
- **FR-005**: The player MUST be able to rotate the active tetromino during play, and invalid rotations MUST be rejected without corrupting the game state.
- **FR-006**: The player MUST be able to perform soft drop and hard drop actions on the active tetromino.
- **FR-007**: The game MUST lock an active tetromino when it reaches a valid resting position according to the game's timing rules.
- **FR-008**: The game MUST clear every fully occupied horizontal line after piece lock and shift remaining blocks downward.
- **FR-009**: The game MUST award score for gameplay events, including higher rewards for clearing more lines in a single placement than for clearing fewer lines.
- **FR-010**: The game MUST track cleared lines and increase the level after each 10 cleared lines.
- **FR-011**: The game MUST increase the fall speed as the level increases.
- **FR-012**: The UI MUST display the current board state, active tetromino, ghost piece, score, level, cleared-line count, next piece, and held piece throughout gameplay.
- **FR-013**: The game MUST show a next-piece preview for the immediate upcoming tetromino.
- **FR-014**: The game MUST provide a single hold slot that allows the player to store or swap the active tetromino once per active-piece turn.
- **FR-015**: The game MUST provide desktop keyboard controls for left move, right move, rotate, soft drop, hard drop, hold, pause/resume, and restart.
- **FR-016**: The game MUST clearly communicate paused, active, and game-over states.
- **FR-017**: The game MUST stop active gameplay updates while paused and resume them without losing the in-progress board state.
- **FR-018**: The game MUST allow the player to restart from either an active, paused, or game-over state.
- **FR-019**: The game MUST detect game over when a new tetromino cannot enter the playfield and MUST prevent further gameplay actions other than restart.
- **FR-020**: The game MUST retain the best score across sessions for the same player environment and display it whenever the game is available to play.
- **FR-021**: The game MUST provide an immediately playable default configuration, including initial speed, scoring rules, and control mapping, without requiring manual setup.
- **FR-022**: The game MUST include sample seed data or a sample configuration that allows reviewers to verify core gameplay, scoring, and persisted best-score behavior immediately.

### Non-Functional Requirements

- **NFR-001**: The feature MUST meet the repository quality bar with no unresolved linting, formatting, typing, or static-analysis violations in the delivered game code.
- **NFR-002**: The feature MUST include automated tests that cover core game-state rules, scoring, line clearing, level progression, hold behavior, pause/resume behavior, and best-score persistence, plus at least one end-to-end validation of the primary desktop play flow.
- **NFR-003**: The feature MUST present a consistent desktop-first experience with clear labels, readable state panels, visible focus handling where relevant, and understandable feedback for pause, restart, and game-over conditions.
- **NFR-004**: On supported desktop browsers, 95% of player input actions during standard play sessions MUST produce visible game-state updates within 100 milliseconds, and the game MUST sustain smooth continuous play for at least 15 minutes without requiring a page refresh.

### Key Entities *(include if feature involves data)*

- **Game Session**: Represents one active or completed run, including board state, active tetromino, queued tetromino, held tetromino, score, level, cleared lines, and session status.
- **Tetromino**: Represents one of the seven playable piece types, including its shape identity, orientation, occupied cells, and current board position.
- **Score Record**: Represents the best recorded score available to the current player environment and the conditions under which it was achieved.
- **Control Mapping**: Represents the default keyboard actions associated with movement, rotation, drop, hold, pause/resume, and restart.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of validation playthroughs can start a new game and place at least 20 tetrominoes using only desktop keyboard controls without blocking input confusion.
- **SC-002**: In 95% of validation sessions on supported desktop browsers, player inputs produce visible board updates within 100 milliseconds during active play.
- **SC-003**: In 100% of scripted validation runs, line clears, score updates, level progression, next-piece preview, hold behavior, pause/resume, and game-over handling match the specified game rules.
- **SC-004**: In 100% of restart and revisit validation sessions on the same device profile, the best score remains available after reload and restart while current-run score resets appropriately.

## Assumptions

- The initial release targets desktop browser play only; touch-first and gamepad controls are out of scope.
- Default gameplay uses one visible next-piece preview and one hold slot.
- The game follows familiar modern Tetris interaction expectations, including ghost piece visibility and one hold use per active tetromino turn.
- Level progression uses a default threshold of 10 cleared lines per level.
- The sample configuration may include preselected scoring, speed, and control defaults so reviewers can exercise the game immediately without additional setup.
