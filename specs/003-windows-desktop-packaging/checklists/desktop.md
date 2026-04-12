# Desktop Requirements Checklist: Windows Desktop Portable Packaging

**Purpose**: Reviewer-grade requirements gate for desktop packaging, portability, native persistence boundaries, and score-update behavior
**Created**: 2026-04-12
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [x] CHK001 Are Windows-only scope, local-only operation, and portable folder distribution all explicitly required without leaving room for browser-launched or server-backed interpretations? [Completeness, Spec §FR-001, Spec §FR-002, Spec §FR-017, Spec §FR-019]
- [x] CHK002 Do the requirements fully define the architectural boundary between frontend/UI responsibilities, Tauri/native responsibilities, and persistence responsibilities? [Completeness, Spec §FR-016, Plan §Structure Decision, Contract §1]
- [x] CHK003 Are the persistence requirements complete for first run, missing database recreation, startup hydration, game-over submission, and restart durability? [Completeness, Spec §FR-004, Spec §FR-007..FR-014, Spec §FR-018]
- [x] CHK004 Do the requirements fully define writable-path fallback behavior when the executable directory cannot host the database? [Completeness, Spec §FR-006, Spec §FR-006a, Assumption]
- [x] CHK005 Are corrupt-database detection, backup-renaming, fresh-database recreation, and one-time reset warning requirements all documented end-to-end? [Completeness, Spec §FR-006b, Spec §SC-006]
- [x] CHK006 Are out-of-scope exclusions explicit enough to block drift into online sync, cloud backup, accounts, multi-profile support, and broader statistics/history systems? [Completeness, Assumption, Gap]

## Requirement Clarity

- [x] CHK007 Is “database next to the packaged application” defined precisely enough that reviewers can distinguish executable-adjacent storage from allowed fallback storage without implementer guesswork? [Clarity, Spec §FR-003, Spec §FR-006, Spec §FR-006a]
- [x] CHK008 Is “portable local distribution” defined clearly enough to distinguish the required portable folder baseline from optional single-executable packaging? [Clarity, Spec §FR-019, Spec §FR-020, Clarification]
- [x] CHK009 Is the first-run rule unambiguous that the stored best score initializes to `0` while the UI remains hidden until the first completed game establishes a record? [Clarity, Spec §FR-008, Spec §FR-008a, Spec §SC-001]
- [x] CHK010 Is “completed game” defined precisely enough to exclude quit and restart paths from best-score persistence decisions? [Clarity, Spec §FR-009a, Spec §FR-009b, Spec §SC-007]
- [x] CHK011 Are the strict greater-than update rule and equal/lower non-update rule quantified clearly enough to prevent off-by-one or equality ambiguities? [Clarity, Spec §FR-010..FR-013, Spec §SC-003]

## Requirement Consistency

- [x] CHK012 Do the spec, plan, contract, and data model consistently place database access and file-system ownership on the native side only? [Consistency, Spec §FR-016, Plan §Summary, Contract §1, Data Model §Overview]
- [x] CHK013 Do the startup requirements align across the spec and contract on when best score is loaded, when it is shown, and when notices are returned? [Consistency, Spec §FR-007, Spec §FR-008, Spec §FR-008a, Contract §2]
- [x] CHK014 Do the game-over update requirements align across the spec and contract on when score submission occurs and how congratulations state is derived? [Consistency, Spec §FR-009..FR-013, Contract §3]
- [x] CHK015 Are the Windows portability assumptions consistent with the fallback to `%LOCALAPPDATA%/<AppName>/`, or do they create conflicting interpretations of “next to the app”? [Consistency, Spec §FR-006, Spec §FR-006a, Assumption, Ambiguity]

## Acceptance Criteria Quality

- [x] CHK016 Do the success criteria measure all high-risk requirement areas: first run, startup display, strict greater-than updates, restart persistence, corrupt-database recovery, and quit/restart non-update behavior? [Acceptance Criteria, Spec §SC-001..SC-007]
- [x] CHK017 Is the portable Windows release requirement measurable enough that review can confirm acceptance without depending on installer-specific behavior? [Measurability, Spec §SC-008, Spec §FR-019, Spec §FR-020]
- [x] CHK018 If performance is not a gating concern for this feature, is that exclusion stated explicitly enough to avoid false review failures or hidden benchmark work? [Scope Boundary, Spec §NFR-004, Plan §Technical Context, Plan §Complexity Tracking]

## Scenario Coverage

- [x] CHK019 Are primary scenarios complete for first launch, established-record launch, new-record game over, and non-record game over? [Coverage, User Story 1, User Story 2]
- [x] CHK020 Are alternate and exception scenarios complete for unwritable app directory, missing database after prior use, corrupt database, and quit/restart before game-over? [Coverage, Edge Case, Spec §FR-006a, Spec §FR-006b, Spec §FR-009b]
- [x] CHK021 Do the requirements cover user-visible recovery messaging for both storage fallback and corrupt-database reset, including when those notices should appear? [Coverage, Spec §FR-006a, Spec §FR-006b, Contract §2]

## Dependencies & Assumptions

- [x] CHK022 Are Windows-specific runtime dependencies and environmental assumptions documented tightly enough for review, especially writable-path assumptions, `%LOCALAPPDATA%` availability, and local desktop prerequisites? [Dependency, Plan §Technical Context, Assumption]
- [x] CHK023 Is the single-local-player assumption bounded clearly enough that implementers cannot justify adding account, profile, or history abstractions inside this feature? [Assumption, Spec §FR-005, Assumption]

## Ambiguities & Conflicts

- [x] CHK024 Do the requirements make it explicit whether any remaining browser-side persistence concerns survive this feature, or is there a gap that could blur the frontend/native persistence boundary? [Ambiguity, Spec §FR-016, Plan §Summary, Contract §5]
- [x] CHK025 Are any requirement phrases still subjective or under-specified in the high-risk storage areas, such as “one-time notice,” “next to the app,” or “portable local”? [Ambiguity, Gap]

## Notes

- This checklist validates requirement and planning quality, not implementation correctness.
- Intended use: author and reviewer gate during spec/design review before or alongside planning and task generation.
- Focus on gaps that would permit architecture drift, blurred responsibility boundaries, or ambiguous persistence behavior.

## Run Results

- Run date: 2026-04-12
- Re-run date: 2026-04-12 (post-clarification update)
- Passed: 25
- Gaps found: 0
- Status: Ready for task generation and implementation planning flow.