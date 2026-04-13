# Analysis Resolution Plan: Desktop App Packaging

## Resolution Strategy

Apply the smallest set of spec, plan, and task updates needed to restore traceability between the clarified requirements, the implementation plan, and the executable task list. No clarification stage is required.

## Per-Issue Actions

### ARW-001

- Governing basis: Constitution II and IV, `NFR-006`, plan Technical Context performance goals, plan Constitution Check performance gate
- Affected files: `specs/003-desktop-app-packaging/tasks.md`
- Intended change: Add explicit performance-verification tasks for desktop startup, best-score hydration fallback time, and desktop save latency, with the defined measurement method and thresholds anchored to the plan budgets.
- Rationale: Performance budgets are mandatory release-gate inputs and must appear as concrete implementation work rather than implied final polish.
- Dependency notes: Depends on the current plan's performance targets; no spec clarification required.
- Validation method: Confirm `tasks.md` includes named verification tasks covering startup, hydration, and save budgets.
- Expected downstream impact: The feature regains constitution compliance before implementation begins.

### ARW-002

- Governing basis: `FR-013`, `FR-015`, contract persistence boundary, Constitution II
- Affected files: `specs/003-desktop-app-packaging/tasks.md`
- Intended change: Add explicit implementation and validation tasks that prove desktop persistence does not import, merge, or overwrite browser persistence in the first release.
- Rationale: A scoped prohibition requires direct task coverage, not indirect inference from adapter design.
- Dependency notes: Align with existing desktop and browser runtime tasks.
- Validation method: Confirm the task list names a separation-proof test or validation path and the implementation work needed to enforce it.
- Expected downstream impact: Desktop/browser persistence isolation becomes an explicit deliverable rather than an assumption.

### ARW-003

- Governing basis: Constitution V, plan structure decision, task traceability
- Affected files: `specs/003-desktop-app-packaging/plan.md`
- Intended change: Update the plan's project-structure section to include `docs/` as a planned deliverable area used by the task list.
- Rationale: The planned file layout should reflect all intended implementation artifacts.
- Dependency notes: None.
- Validation method: Confirm `plan.md` now includes the `docs/` paths referenced throughout `tasks.md`.
- Expected downstream impact: Plan-to-task traceability becomes structurally consistent.

### ARW-004

- Governing basis: Constitution V, contract version metadata, data model app version fields, task coverage for preload version metadata
- Affected files: `specs/003-desktop-app-packaging/spec.md`
- Intended change: Restore a functional requirement for build/version identification in the packaged desktop product and align the surrounding numbering and wording with the current scope.
- Rationale: The existing design and task artifacts already rely on version metadata, and the requirement was present in the original feature intent before later edits removed it.
- Dependency notes: Keep the change minimal to avoid widening scope beyond version visibility.
- Validation method: Confirm the specification explicitly owns version identification and the design/task artifacts no longer exceed the spec.
- Expected downstream impact: App version metadata regains a governing requirement and consistent traceability.

### ARW-005

- Governing basis: `SC-004`, `NFR-001`, Constitution V
- Affected files: `specs/003-desktop-app-packaging/spec.md`, `specs/003-desktop-app-packaging/tasks.md`
- Intended change: Define what counts as independently reviewable evidence of progress and align task checkpoints to that definition.
- Rationale: Staged delivery only works if checkpoints have explicit evidence outputs.
- Dependency notes: Reuse existing task checkpoints instead of inventing a new delivery model.
- Validation method: Confirm `SC-004` defines acceptable evidence and `tasks.md` checkpoints map to it.
- Expected downstream impact: Story checkpoints become objectively reviewable.

## Coverage Verification

| Issue ID | Covered By |
| --- | --- |
| ARW-001 | Explicit performance verification tasks in `tasks.md` |
| ARW-002 | Browser/desktop persistence separation tasks in `tasks.md` |
| ARW-003 | Project-structure update in `plan.md` |
| ARW-004 | Version-identification requirement restoration in `spec.md` |
| ARW-005 | Evidence definition in `spec.md`; aligned checkpoints and validation tasks in `tasks.md` |

All issues from `analysis-report.md` are covered by concrete plan actions. No clarification artifact is required.