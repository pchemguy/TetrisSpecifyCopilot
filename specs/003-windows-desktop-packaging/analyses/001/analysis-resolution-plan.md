# Analysis Resolution Plan

## Resolution Strategy

Apply the smallest governed-artifact changes necessary to close all four recorded issues without widening feature scope. The plan is limited to `plan.md` and `tasks.md` because the issues concern exception metadata and task coverage, not product requirements.

## Planned Actions By Issue

### C1 — Incomplete Constitution Exception Metadata

- Governing basis: Constitution Delivery Workflow; `plan.md` Performance Gate exception.
- Affected files: `specs/003-windows-desktop-packaging/plan.md`
- Intended change: Expand the Complexity Tracking entry to explicitly identify the impacted constitutional principle, preserve the business reason, and add an owner plus expiration/removal condition for the exception.
- Rationale: This satisfies the constitution without changing the approved decision that dedicated benchmarking is non-gating for this feature.
- Dependency notes: None.
- Validation method: Re-read the updated Complexity Tracking row and confirm it now contains impacted principle, business reason, owner, and expiration/removal condition.
- Expected downstream impact: Restores constitution compliance for implementation and review.

### C2 — Missing Quality-Gate Tasks

- Governing basis: `spec.md` NFR-001; constitution Implementation Standards.
- Affected files: `specs/003-windows-desktop-packaging/tasks.md`
- Intended change: Add explicit task items for linting, frontend tests, Rust tests, and Windows desktop validation commands in the final cross-cutting phase.
- Rationale: The constitution requires quality-tooling and verification work to appear in the task list when those concerns apply.
- Dependency notes: These tasks should remain late-phase validation work after feature slices are complete.
- Validation method: Confirm `tasks.md` contains dedicated command-oriented quality-gate tasks.
- Expected downstream impact: Makes release-readiness work explicit for implementers and reviewers.

### C3 — Missing Gameplay Preservation Validation

- Governing basis: `spec.md` FR-015.
- Affected files: `specs/003-windows-desktop-packaging/tasks.md`
- Intended change: Add an explicit regression-validation task that exercises gameplay and scoring behavior under the desktop runtime, ideally reusing existing gameplay coverage where possible.
- Rationale: Migration work must prove that gameplay and scoring remain unchanged while persistence moves to the native layer.
- Dependency notes: The task should execute after the desktop runtime and persistence flow are functional.
- Validation method: Confirm `tasks.md` includes a gameplay/scoring regression task tied to the desktop runtime.
- Expected downstream impact: Prevents persistence migration from silently changing engine behavior.

### I1 — US3 Ordering Inconsistency

- Governing basis: Internal consistency of `tasks.md` dependency ordering.
- Affected files: `specs/003-windows-desktop-packaging/tasks.md`
- Intended change: Reorder the US3 bundle-settings and smoke-validation tasks so the file order matches the stated dependency guidance.
- Rationale: This removes an avoidable contradiction and keeps the execution order trustworthy.
- Dependency notes: Update any phase text only if needed to match the new order.
- Validation method: Confirm the bundle-settings task now precedes the portable smoke-validation task and the guidance remains consistent.
- Expected downstream impact: Clearer execution order for implementation and review.

## Execution Sequence

1. Update `plan.md` to close C1.
2. Update `tasks.md` to close C2, C3, and I1 together.
3. Validate that every issue ID from `analysis-report.md` is now covered by concrete artifact changes.
4. Record results in `analysis-resolution-report.md`.

## Coverage Verification

| Issue ID | Planned Action Coverage |
| --- | --- |
| C1 | `plan.md` Complexity Tracking update |
| C2 | `tasks.md` explicit quality-gate tasks |
| C3 | `tasks.md` explicit gameplay/scoring regression task |
| I1 | `tasks.md` US3 task reordering |

## Clarification Reflection

- No clarification artifact exists for this round.
- No clarification-dependent plan actions are required.

## Completion Check

- Every issue from `analysis-report.md` is covered by at least one concrete action: `yes`
- Planned actions are specific enough to execute without reinterpretation: `yes`