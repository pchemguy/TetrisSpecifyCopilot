# Task to Issue Mapping: Windows Desktop Portable Packaging

Feature: `003-windows-desktop-packaging`

Label strategy used:
- `enhancement` on every issue
- phase or story traceability labels where available
- type labels (`type: tooling`, `type: implementation`, `type: testing`, `type: validation`, `type: refactor`) where appropriate
- existing milestone-style labels (`milestone: mvp`, `milestone: persistence`, `milestone: polish`) for additional traceability

Milestone status:
- Actual GitHub milestone creation or assignment was not completed because the available GitHub tools in this environment do not expose milestone management.
- All issue numbers and URLs below are verified against the target repository `pchemguy/TetrisSpecifyCopilot`.

| Task ID | Short Task Description | GitHub Issue # | GitHub Issue URL |
| --- | --- | --- | --- |
| T001 | Add Tauri npm scripts and desktop dependencies | 94 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/94 |
| T002 | Create native Rust crate manifest with bundled SQLite dependencies | 91 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/91 |
| T003 | Create the Tauri Rust build script | 93 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/93 |
| T004 | Create the Windows Tauri application configuration | 92 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/92 |
| T005 | Create native desktop entrypoint and command registration shell | 95 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/95 |
| T006 | Define desktop persistence DTOs and command names | 98 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/98 |
| T007 | Create frontend desktop persistence invoke wrapper | 96 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/96 |
| T008 | Add startup contract tests for first-run and existing-score hydration | 99 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/99 |
| T009 | Add app hydration integration coverage for startup best-score visibility | 97 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/97 |
| T010 | Implement native SQLite bootstrap and single-row best-score initialization | 100 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/100 |
| T011 | Implement executable-adjacent database path resolution with LocalAppData fallback metadata | 103 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/103 |
| T012 | Implement the load_best_score_state command response mapping | 102 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/102 |
| T013 | Register the startup hydration command | 104 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/104 |
| T014 | Replace browser best-score hydration with desktop command loading | 101 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/101 |
| T015 | Hide or reveal the startup best-score panel from hydration state | 105 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/105 |
| T016 | Update startup shell copy to remove browser-specific persistence wording | 109 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/109 |
| T017 | Add game-over command contract tests for greater-than equal and lower outcomes | 107 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/107 |
| T018 | Add unit coverage for game-over-only score submission triggering | 106 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/106 |
| T019 | Add desktop restart-persistence end-to-end coverage for a new best score | 110 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/110 |
| T020 | Add integration coverage for congratulations visibility and live best-score updates | 108 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/108 |
| T021 | Implement strict-greater best-score comparison and update logic | 112 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/112 |
| T022 | Implement the submit_game_over_score command response mapping | 111 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/111 |
| T023 | Register the game-over submission command | 113 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/113 |
| T024 | Route completed-game score submissions through the desktop persistence client | 115 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/115 |
| T025 | Emit explicit game_over submission payloads only at game over | 114 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/114 |
| T026 | Pass new-best submission state into the playfield overlay | 118 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/118 |
| T027 | Render congratulations messaging only for strict new records | 116 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/116 |
| T028 | Update saved-best-score copy for desktop-local persistence | 120 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/120 |
| T029 | Add startup recovery contract tests for missing-database recreation and corrupt backup rename | 117 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/117 |
| T030 | Add integration coverage for fallback-path and database-reset startup notices | 119 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/119 |
| T031 | Add portable desktop smoke coverage for offline local startup and play | 121 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/121 |
| T032 | Implement corrupt-database backup rename and recreation | 123 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/123 |
| T033 | Emit fallback and reset notices from load_best_score_state | 122 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/122 |
| T034 | Surface startup notice payloads in desktop persistence state | 124 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/124 |
| T035 | Render desktop fallback and reset notices | 125 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/125 |
| T036 | Add Windows file-system and command capability permissions | 126 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/126 |
| T037 | Finalize portable Windows bundle settings for desktop distribution | 127 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/127 |
| T038 | Run frontend lint and TypeScript or Vitest validation | 129 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/129 |
| T039 | Run native Rust unit and contract validation | 130 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/130 |
| T040 | Validate desktop gameplay and scoring regression coverage | 128 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/128 |
| T041 | Run portable desktop build and offline smoke validation | 131 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/131 |
| T042 | Remove obsolete browser best-score local-storage code | 132 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/132 |
| T043 | Remove obsolete browser best-score unit coverage | 133 | https://github.com/pchemguy/TetrisSpecifyCopilot/issues/133 |