# Analysis Resolution Plan: Comprehensive Project Documentation

## Resolution Strategy

Apply the smallest possible set of artifact updates to restore consistency between the clarified spec, the verification contract, the quickstart acceptance flow, and the execution task list. No clarification stage is needed.

## Per-Issue Actions

### ARW-001

- Governing basis: Constitution V (traceable decisions), `FR-022`, `FR-025`, `FR-026`, `FR-027`, `NFR-005`
- Affected files: `specs/002-project-docs/contracts/documentation-interfaces.md`
- Intended change: Replace the stale hard-coded verification range with language that covers the full current spec, explicitly including `FR-025` through `FR-027` and `NFR-005`.
- Rationale: The verification contract must not lag behind the requirements it governs.
- Dependency notes: None beyond the clarified spec.
- Validation method: Read the updated contract and confirm it covers all mandatory requirements added after the initial clarification round.
- Expected downstream impact: Reviewer and maintainer verification steps will align with the real release gate.

### ARW-002

- Governing basis: Constitution II and IV, `FR-017`, `FR-018`, `FR-025`, `FR-026`, `FR-027`, `NFR-004`, `NFR-005`
- Affected files: `specs/002-project-docs/quickstart.md`, `specs/002-project-docs/tasks.md`
- Intended change: Extend the quickstart acceptance checklist with explicit checks for the reviewer exception workflow, Playwright browser remedy, persistence fallback messaging, and reviewer checklist cap; update `T028` to reference those same final-gate checks.
- Rationale: The final acceptance path must verify the complete current requirement set, not the pre-clarification subset.
- Dependency notes: Depends on the clarified spec and updated contract language.
- Validation method: Confirm the quickstart checklist and `T028` both name the newly mandatory checks.
- Expected downstream impact: Final sign-off and implementation execution will no longer miss the added requirements.

### ARW-003

- Governing basis: Constitution V, Plan Phase 0/1 outputs, `FR-022`
- Affected files: `specs/002-project-docs/tasks.md`
- Intended change: Reword `T004` and `T005` from building planning artifacts to validating and extracting source-of-truth information from existing artifacts.
- Rationale: Tasks should consume design artifacts during implementation, not re-author them.
- Dependency notes: None.
- Validation method: Confirm task wording now treats `research.md` and `quickstart.md` as source material rather than outputs to rebuild.
- Expected downstream impact: Cleaner plan-to-task traceability and less implementation ambiguity.

## Coverage Verification

| Issue ID | Covered By |
| --- | --- |
| ARW-001 | Contract verification update in `documentation-interfaces.md` |
| ARW-002 | Acceptance checklist update in `quickstart.md`; final-gate wording update in `tasks.md` |
| ARW-003 | Task wording update for `T004` and `T005` in `tasks.md` |

All issues from `analysis-report.md` are covered by concrete plan actions. No clarification artifact is required.
