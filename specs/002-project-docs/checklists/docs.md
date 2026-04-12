# Docs Checklist: Comprehensive Project Documentation

**Purpose**: Requirements-quality release gate for documentation deliverables (clarity, completeness, consistency, measurability, and traceability)
**Created**: 2026-04-12
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [ ] CHK001 Are all four required deliverable documents explicitly named with exact paths under `docs/` (`user-guide.md`, `developer-guide.md`, `reviewer-guide.md`, `persistence-reference.md`)? [Completeness, Spec §FR-022]
- [ ] CHK002 Does the spec define mandatory section sets for each of the four documents so no author must infer structure? [Completeness, Spec §FR-001..FR-021, Plan §Phase 1]
- [ ] CHK003 Are Bash prerequisite requirements stated for every document that contains command examples? [Completeness, Spec §FR-023]
- [ ] CHK004 Are troubleshooting requirements complete enough to cover startup failure, controls failure, missing best score, and IndexedDB quota/storage constraints? [Completeness, Spec §FR-006]
- [ ] CHK005 Are persistence reference requirements complete for SQLite tables, localStorage keys, seed-row identification, and best-score protection invariant? [Completeness, Spec §FR-019..FR-021]
- [ ] CHK006 Are reviewer-flow requirements complete for install, gameplay smoke checks, persistence reload, quality checks, E2E checks, build, and offline verification? [Completeness, Spec §FR-016..FR-018]

## Requirement Clarity

- [ ] CHK007 Is the scoring requirement quantified with exact values (single/double/triple/tetris, soft drop, hard drop) and explicit no-combo rule? [Clarity, Spec §FR-004]
- [ ] CHK008 Is the data-flow requirement explicit that both Mermaid and prose are required, rather than allowing an ambiguous either/or interpretation? [Clarity, Spec §FR-012]
- [ ] CHK009 Is the shell policy unambiguous about Bash-only commands and explicit non-support for PowerShell variants? [Clarity, Spec §FR-023]
- [ ] CHK010 Is "plain English" defined in practical terms (jargon explained on first use) so reviewers can assess pass/fail objectively? [Clarity, Spec §FR-024]
- [ ] CHK011 Is the phrase "accurate with respect to implementation" operationalized with a verification approach (what must be checked and where)? [Clarity, Spec §FR-022, Plan §Testing Gate]
- [ ] CHK012 Are timing expectations (under 5 minutes, under 15 minutes, under 30 minutes) tied to clear preconditions so they are measurable and fair? [Clarity, Spec §SC-001..SC-003]

## Requirement Consistency

- [ ] CHK013 Do the requirements consistently place deliverable docs in `docs/` without conflicting references to `specs/` as output location? [Consistency, Spec §FR-022, Spec §Assumptions]
- [ ] CHK014 Are command requirements consistent between developer and reviewer journeys (no mismatched scripts, flags, or sequence)? [Consistency, Spec §FR-009, Spec §FR-016..FR-018]
- [ ] CHK015 Are canonical gameplay terms (tetromino, ghost piece, hard drop, hold, best score) used consistently across all requirement sections? [Consistency, Spec §NFR-003]
- [ ] CHK016 Do quickstart/reviewer references align on offline verification intent (offline only after first asset load)? [Consistency, Spec §FR-018, Plan §Constraints]

## Acceptance Criteria Quality

- [ ] CHK017 Does each functional requirement have objective acceptance evidence rather than subjective wording such as "professional" or "comprehensive" without criteria? [Measurability, Spec §FR-001..FR-024]
- [ ] CHK018 Are success criteria mapped to corresponding requirement groups so each SC has a traceable owner requirement? [Traceability, Spec §SC-001..SC-007, Gap]
- [ ] CHK019 Is SC-004 (100% control mapping accuracy) defined with a concrete verification method and source of truth? [Measurability, Spec §SC-004, Contract §Content Consistency]
- [ ] CHK020 Is SC-005 (all commands exit 0) scoped to specific commands and environments to avoid ambiguous interpretation? [Measurability, Spec §SC-005, Spec §FR-023]

## Scenario Coverage

- [ ] CHK021 Are requirements present for each audience scenario class: player onboarding, contributor onboarding, reviewer validation, maintainer persistence updates? [Coverage, Spec §User Stories 1-4]
- [ ] CHK022 Are alternate-flow requirements defined for readers who need only one section (for example controls-only or persistence-only)? [Coverage, Spec §NFR-002]
- [ ] CHK023 Are exception-flow requirements defined for command failure during review and documentation correction workflow? [Coverage, Contract §Failure Handling, Gap]

## Edge Case Coverage

- [ ] CHK024 Are edge-case requirements explicit for missing Playwright browser install and the resulting remedy path? [Edge Case, Spec §Edge Cases, Spec §FR-017]
- [ ] CHK025 Are edge-case requirements explicit for blocked localStorage/IndexedDB environments and expected fallback messaging? [Edge Case, Spec §Edge Cases, Contract §Failure Handling]
- [ ] CHK026 Are edge-case requirements explicit for unsupported browsers lacking required features (for example WebAssembly/IndexedDB)? [Edge Case, Spec §Edge Cases, Spec §FR-001]

## Non-Functional Requirements

- [ ] CHK027 Is NFR-001 internally consistent with the chosen policy (no new Markdown linter, manual broken-link verification) and free of contradictory wording elsewhere? [Consistency, Spec §NFR-001]
- [ ] CHK028 Are readability and terminology requirements sufficient to evaluate non-specialist comprehension objectively? [Non-Functional, Spec §FR-024, Spec §NFR-003]
- [ ] CHK029 Are reviewer throughput constraints (<= 30 minutes) supported by requirements that cap checklist complexity and sequencing overhead? [Performance, Spec §NFR-004, Spec §SC-003]

## Dependencies & Assumptions

- [ ] CHK030 Are assumptions about branch baseline (`001-prepare-spec-branch`) and source-of-truth references still valid and explicitly time-bounded? [Assumption, Spec §Assumptions]
- [ ] CHK031 Are dependencies on existing scripts and toolchain versions documented as requirements rather than implicit background knowledge? [Dependency, Spec §FR-001, Spec §FR-009, Plan §Technical Context]
- [ ] CHK032 Is the no-external-hosting assumption explicitly reflected in scope boundaries so future tasks do not drift to docs-site work? [Scope Boundary, Spec §Assumptions]

## Ambiguities & Conflicts

- [ ] CHK033 Are there any remaining duplicate or contradictory clarification entries that could create conflicting implementation guidance? [Conflict, Spec §Clarifications]
- [ ] CHK034 Are any requirement terms still subjective (for example "clear", "focused", "concise") without measurable acceptance thresholds? [Ambiguity, Gap]
- [ ] CHK035 Is requirement traceability sufficient that each checklist finding can point to FR/NFR/SC or a documented gap marker? [Traceability, Spec §FR-001..FR-024, Spec §NFR-001..NFR-004, Spec §SC-001..SC-007]

## Notes

- This checklist validates the quality of requirements writing, not implementation behavior.
- Intended use: strict release-gate review by QA/docs lead with docs-to-implementation traceability.
- Mark findings inline under each CHK item during review.