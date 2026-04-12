# Gameplay Checklist: Classic Browser Tetris

**Purpose**: Validate the quality, completeness, and measurability of gameplay, persistence, and client-only runtime requirements before implementation review  
**Created**: 2026-04-11  
**Feature**: [Link to spec.md](../spec.md)

## Requirement Completeness

- [x] CHK001 Are the visible playfield dimensions and any implied hidden spawn rows fully specified, not just the 10x20 visible board size? [Completeness, Spec §FR-001]
- [x] CHK002 Are tetromino generation requirements specific enough to define the exact fairness model behind "regularly" and "avoids indefinite starvation"? [Clarity, Spec §FR-003]
- [x] CHK003 Are piece lock timing rules defined precisely enough to avoid different interpretations for floor contact, movement resets, and delayed locking? [Ambiguity, Spec §FR-007]
- [x] CHK004 Are scoring requirements quantified for singles, doubles, triples, tetrises, soft drop, and hard drop bonuses rather than only stating relative reward differences? [Gap, Spec §FR-009]
- [x] CHK005 Are level-speed requirements defined with an explicit progression formula or timing table rather than only stating that speed increases with level? [Gap, Spec §FR-011]
- [x] CHK006 Are hold rules complete about when hold availability resets and whether the first hold immediately spawns the next queued piece? [Clarity, Spec §FR-014]

## Requirement Clarity

- [x] CHK007 Is "standard Tetris movement rules" defined precisely enough to determine expected behavior for wall kicks, floor kicks, and rotation near boundaries? [Ambiguity, Spec §User Story 1]
- [x] CHK008 Is the ghost-piece requirement explicit about whether it updates continuously, remains visible during pause, and disappears at game over? [Gap, Spec §FR-012]
- [x] CHK009 Are next-piece preview requirements clear about whether exactly one upcoming piece is shown and whether additional previews are intentionally excluded? [Clarity, Spec §FR-013]
- [x] CHK010 Are keyboard-control requirements explicit about the default bindings, duplicate bindings, and whether remapping is intentionally out of scope? [Clarity, Spec §FR-015, Spec §FR-021]
- [x] CHK011 Are best-score persistence requirements clear about when a new best score is committed and how seeded demo data must or must not affect that value? [Ambiguity, Spec §FR-020, Spec §FR-022]

## Requirement Consistency

- [x] CHK012 Do the persistence requirements consistently separate localStorage responsibilities from SQLite responsibilities without overlap or contradiction? [Consistency, Spec §FR-020, Spec §FR-022]
- [x] CHK013 Do client-only and offline expectations align with the seeded demo-data requirement so reviewers can tell whether any network access is forbidden or merely unnecessary? [Consistency, Gap]
- [x] CHK014 Do pause, restart, and game-over requirements align on which keyboard inputs remain valid in each state? [Consistency, Spec §FR-015, Spec §FR-018, Spec §FR-019]
- [x] CHK015 Do performance-oriented success criteria align with the non-functional requirement for input responsiveness and extended play sessions? [Consistency, Spec §NFR-004, Spec §SC-002]

## Acceptance Criteria Quality

- [x] CHK016 Can the acceptance criteria for core gameplay be objectively verified from the written requirements alone, without relying on unwritten genre knowledge? [Measurability, Spec §User Story 1]
- [x] CHK017 Are the requirements for level progression and speed increase measurable enough to prove that later levels are correct rather than merely faster? [Acceptance Criteria, Spec §FR-010, Spec §FR-011]
- [x] CHK018 Are persistence success criteria measurable for both restart and full page reload scenarios on the same browser profile? [Acceptance Criteria, Spec §SC-004]
- [x] CHK019 Is the 100-millisecond visible-update target defined in a way that reviewers can observe and measure consistently across supported desktop browsers? [Acceptance Criteria, Spec §NFR-004, Spec §SC-002]

## Scenario Coverage

- [x] CHK020 Are requirements defined for the spawn-blocked game-over path, including what information must remain visible and which actions are still available? [Coverage, Spec §FR-019]
- [x] CHK021 Do the requirements cover simultaneous or near-simultaneous inputs around lock timing, including hard drop, hold, and pause conflicts? [Coverage, Spec §Edge Cases]
- [x] CHK022 Are recovery requirements specified for malformed localStorage data, unavailable IndexedDB/SQLite initialization, or failed replay persistence? [Gap]
- [x] CHK023 Are requirements explicit about what must happen on first launch before seeded demo data and persisted history finish loading? [Coverage, Spec §FR-022]
- [x] CHK024 Are replay requirements complete enough to distinguish whether replay records are only stored for analysis or must also be surfaced in the UI? [Gap]

## Non-Functional Requirements

- [x] CHK025 Are supported desktop browser boundaries specific enough to determine whether behavior differences in Chrome, Edge, Firefox, and Safari are in or out of scope? [Clarity, Spec §NFR-004]
- [x] CHK026 Are storage-retention and growth requirements defined for accumulated sessions, scores, and replay records in local browser storage? [Gap]
- [x] CHK027 Is the no-network-service constraint stated as a requirement in the spec itself, rather than only in planning artifacts or user request context? [Gap]

## Notes

- Focus areas selected: gameplay rules and state transitions, persistence and replay requirements, performance and offline behavior.
- Depth: standard review.
- Audience: reviewer during PR/spec review.
- Completed on 2026-04-11 after promoting remaining gameplay, recovery, and storage constraints into `spec.md`.
