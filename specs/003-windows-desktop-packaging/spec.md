# Feature Specification: Windows Desktop Portable Packaging

**Feature Branch**: `003-run-feature-branch-hook`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "Convert the current browser-based Tetris application into a Windows-first packaged desktop application for portable local use with local persistent best-score tracking."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Startup Best Score Visibility (Priority: P1)

As a local player launching the packaged desktop app, I can see my saved best score at startup after I have established a record, so I know whether my progress is preserved.

**Why this priority**: Immediate confidence in persistence is the core user value and the primary acceptance outcome for the feature.

**Independent Test**: Launch the packaged Windows app with an existing local database and verify the best score shown at startup matches the saved on-disk value.

**Acceptance Scenarios**:

1. **Given** the app is launched for the first time and no local database file exists next to the app, **When** startup completes, **Then** the app creates the local database automatically, initializes stored best score to `0`, and keeps best-score UI hidden until the first completed game.
2. **Given** a local database with a saved best score exists next to the app, **When** the app starts, **Then** the app loads that value and displays it before gameplay begins.

---

### User Story 2 - Best Score Update Rules at Game Over (Priority: P1)

As a local player finishing a game, I want the app to update my saved best score only when I truly beat it, so my record remains accurate.

**Why this priority**: Correct comparison and update rules prevent data integrity issues and misleading player feedback.

**Independent Test**: Run three game-over outcomes against the same saved best score (greater than, equal to, lower than) and verify update and messaging behavior for each case.

**Acceptance Scenarios**:

1. **Given** a saved best score exists, **When** game-over final score is strictly greater than that value, **Then** the app updates the stored best score and shows a clear congratulations message for a new record.
2. **Given** a saved best score exists, **When** game-over final score is equal to or lower than that value, **Then** the app does not change stored best score and does not show a congratulations message.
3. **Given** a new best score was saved in a prior run, **When** the app is closed and launched again, **Then** the updated best score is displayed at startup.

---

### User Story 3 - Portable Local Desktop Operation (Priority: P2)

As a player running the packaged app on Windows, I want the game to run fully offline and locally with no external infrastructure, so I can use it as a portable local app.

**Why this priority**: Local-only packaged operation is the main platform transition objective and a required scope constraint.

**Independent Test**: Run the portable packaged app (folder containing executable and required local runtime files) on a Windows machine with no server process and no network dependency; confirm gameplay and best-score persistence continue to work.

**Acceptance Scenarios**:

1. **Given** the packaged app is executed on Windows, **When** the player starts and plays locally, **Then** no separate server, online service, or externally managed database is required.
2. **Given** maintainers inspect responsibilities, **When** they review feature boundaries, **Then** gameplay behavior, desktop runtime responsibilities, and persistence responsibilities are clearly separated.
3. **Given** a release artifact is produced, **When** distribution is prepared for this feature, **Then** a portable folder distribution (`.exe` plus required local runtime files) is accepted as the mandatory baseline and single-executable packaging remains optional.

---

### Edge Cases

- What happens when the database file is missing at startup after prior use? The app recreates required database structures automatically and continues with a valid best-score value.
- What happens when the app directory is not writable? The app uses `%LOCALAPPDATA%/<AppName>/` for the best-score database and shows a one-time notice describing the fallback location.
- What happens when the database file is unreadable or corrupt? The app renames it to `.corrupt.<timestamp>`, creates a fresh database automatically, and shows a one-time warning that best score was reset.
- How does the app handle a score equal to the saved best score? It must not overwrite the saved value and must not show a new-record congratulations message.
- What happens if the player never completes a game in a session? Stored best score remains `0` and best-score UI remains hidden on subsequent launches until a completed game establishes a record.
- What happens if the app is closed normally and relaunched multiple times? The most recent valid saved best score persists and is shown at every startup.
- What happens if the player quits or restarts before game-over? The run is not treated as completed and must not update best score.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a Windows desktop packaged application experience for local single-player use.
- **FR-002**: The packaged application MUST run fully locally without requiring a separate server process, online service, or externally managed database.
- **FR-003**: On startup, the system MUST check for a local on-disk database located next to the packaged application.
- **FR-004**: If no local database exists at startup, the system MUST create it automatically without requiring manual setup.
- **FR-005**: The system MUST persist exactly one best-score record for the local player context.
- **FR-006**: The persisted best score MUST be stored in a local on-disk database next to the packaged app when that location is writable.
- **FR-006a**: If the packaged app location is not writable, the system MUST automatically store the best-score database at `%LOCALAPPDATA%/<AppName>/` and MUST show a one-time notice indicating this fallback location.
- **FR-006b**: If the best-score database is unreadable or corrupt at startup, the system MUST rename the broken file to `.corrupt.<timestamp>`, create a fresh database automatically, and show a one-time warning that the best score was reset.
- **FR-007**: On every application startup, the system MUST load the persisted best score from the local database.
- **FR-008**: The startup UI MUST display the loaded best score to the player before or at gameplay readiness when at least one completed game record exists.
- **FR-008a**: On first run (or any run where only the initialized value `0` exists and no completed-game record has been established), the system MUST keep the best-score value hidden from the player.
- **FR-009**: At game over, the system MUST compare final score against the saved best score.
- **FR-009a**: A "completed game" for best-score evaluation MUST mean reaching game-over state only.
- **FR-009b**: Quitting or restarting mid-run MUST NOT trigger best-score update evaluation.
- **FR-010**: If final score is strictly greater than saved best score, the system MUST update persisted best score to the final score.
- **FR-011**: If final score is strictly greater than saved best score, the system MUST display a congratulations message indicating a new best score.
- **FR-012**: If final score is equal to or lower than saved best score, the system MUST NOT update the persisted best score.
- **FR-013**: If final score is equal to or lower than saved best score, the system MUST NOT display the new-record congratulations message.
- **FR-014**: Best score updates MUST remain available across normal application shutdown and restart.
- **FR-015**: The feature MUST preserve current core gameplay behavior and scoring outcomes while adding desktop packaging and persistence behavior.
- **FR-016**: The feature MUST keep responsibility boundaries clear between gameplay behavior, desktop runtime responsibilities, and persistence responsibilities.
- **FR-017**: Scope for this feature MUST remain Windows-only and single-player local context.
- **FR-018**: The feature MUST include first-run behavior, missing-database behavior, startup display behavior, and restart persistence behavior.
- **FR-019**: The feature MUST support portable local folder distribution on Windows as the required release baseline (`.exe` plus required local runtime files).
- **FR-020**: Single-executable distribution MAY be provided, but MUST NOT be required for feature acceptance.

### Non-Functional Requirements

- **NFR-001**: The feature MUST define code quality expectations for merge, including lint/test cleanliness and maintainability of changed paths.
- **NFR-002**: The feature MUST define minimum test coverage for first-run creation, startup load/display, score comparison outcomes, and restart persistence.
- **NFR-003**: User-facing messaging MUST remain consistent and unambiguous, including correct use of congratulations messaging only for strict new records.
- **NFR-004**: Startup best-score availability MUST be performant enough that the score is visible as part of normal startup experience with no perceptible delay to the player.

### Key Entities *(include if feature involves data)*

- **Best Score Record**: Single numeric persistent record representing the local player's highest achieved score.
- **Local Database Presence State**: Startup state indicating whether a database file exists next to the packaged application and whether creation is required.
- **Game Over Comparison Result**: Evaluation outcome of `final_score` vs `saved_best_score` used to drive persistence updates and congratulations messaging.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In first-run tests on Windows with no existing database, startup completes with automatic database creation, initialized stored best score of `0`, and hidden best-score UI in 100% of test runs.
- **SC-002**: In startup tests with an existing saved record, the displayed startup best score matches on-disk value in 100% of test runs.
- **SC-003**: In game-over comparison tests, update and congratulations behavior is correct for all three outcomes (`>`, `=`, `<`) in 100% of test runs.
- **SC-004**: In restart tests after saving a new best score, the updated value is preserved and shown on next launch in 100% of test runs.
- **SC-005**: Validation confirms packaged desktop operation requires no separate server, no cloud service, and no externally managed database for primary gameplay and best-score persistence.
- **SC-006**: In corrupted-database startup tests, the app recovers by backup-renaming the broken file, creating a new database, and showing a one-time reset warning in 100% of test runs.
- **SC-007**: In quit/restart-mid-run tests, best score remains unchanged in 100% of test runs unless game-over is reached.
- **SC-008**: Release validation confirms a portable folder artifact runs locally on Windows and preserves best-score behavior without requiring installer-managed infrastructure.

Success criteria include measurable user-facing quality outcomes, primary-flow correctness, and persistence durability across restarts.

## Assumptions

- There is exactly one local player context for this feature.
- Best score is represented as a single numeric value.
- Missing local database at startup is treated as a normal first-run or recovery condition and is auto-recreated.
- If the packaged app path is read-only, `%LOCALAPPDATA%/<AppName>/` is an acceptable local fallback path that still satisfies local-only operation.
- Portable local use means local execution without separate infrastructure dependencies.
- Portable distribution baseline for this feature is a runnable folder artifact on Windows (`.exe` with required local runtime files).
- Online sync, cloud backup, multiplayer, user accounts, multiple profiles, and broader history/statistics remain out of scope.

## Clarifications

### Session 2026-04-12

- Q: If the app directory is not writable, what should happen to database placement? → A: Prefer database next to executable; if not writable, automatically use `%LOCALAPPDATA%/<AppName>/` and show a one-time notice.
- Q: On first run, how should the initialized best score be presented? → A: Initialize to `0`, but keep best-score UI hidden until the first completed game establishes a record.
- Q: If the database is unreadable/corrupt at startup, what should recovery behavior be? → A: Rename broken DB to `.corrupt.<timestamp>`, create a fresh DB automatically, and show a one-time warning that best score was reset.
- Q: What counts as a completed game for best-score updates? → A: Completed game means game-over only; quitting/restarting mid-run does not update best score.
- Q: What packaging artifact is required for acceptance? → A: Portable folder distribution (`.exe` plus required local runtime files) is required baseline; single executable remains optional.
