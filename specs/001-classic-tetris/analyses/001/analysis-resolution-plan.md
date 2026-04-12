# Analysis Resolution Plan: Classic Browser Tetris

**ARW Round**: 001  
**Created**: 2026-04-11  
**Inputs**: `spec.md`, `plan.md`, `tasks.md`, `analysis-report.md`, constitution v1.1.0

## Resolution Actions by Issue

### ISSUE-001

- Governing basis: Constitution principles II, IV, and V; `spec.md`; `tasks.md`
- Affected files: `spec.md`, `tasks.md`
- Intended change: Add an explicit deterministic lock-delay rule, including hard-drop and pause interaction behavior, and update the gameplay tasks to implement and test that rule.
- Rationale: The engine and tests need a single authoritative timing model.
- Dependency notes: None beyond existing gameplay tasks.
- Validation method: Verify the updated spec text is unambiguous and task coverage explicitly mentions lock timing behavior.
- Expected downstream impact: Removes undocumented implementation choice during engine work.

### ISSUE-002

- Governing basis: Constitution principles II, IV, and V; `spec.md`; `tasks.md`
- Affected files: `spec.md`, `tasks.md`
- Intended change: Quantify line-clear scoring, soft/hard drop bonuses, and gravity progression in the spec and tighten the related test and implementation tasks to those values.
- Rationale: Deterministic tests require concrete formulas or tables.
- Dependency notes: Couples with ISSUE-001 because both affect the engine ruleset.
- Validation method: Confirm the spec contains explicit values and the tasks call out the same rule families.
- Expected downstream impact: Improves testability and replay determinism.

### ISSUE-003

- Governing basis: Constitution principles III and V; user planning request; `plan.md`; `tasks.md`
- Affected files: `spec.md`, `tasks.md`
- Intended change: Add explicit functional and non-functional scope for local structured persistence of scores, sessions, and replay records while keeping user-facing requirements focused on best-score display and persistence warnings.
- Rationale: The downstream architecture was intentionally chosen by the user and should be reflected in the governing spec.
- Dependency notes: Related to ISSUE-005 because both concern runtime scope.
- Validation method: Confirm that plan and tasks no longer exceed the spec and that replay persistence remains client-only.
- Expected downstream impact: Aligns requirements with the chosen browser-storage architecture.

### ISSUE-004

- Governing basis: Constitution principle V; `research.md`; `tasks.md`
- Affected files: `spec.md`
- Intended change: Replace vague randomization language with the explicit 7-bag rule already selected in research and tasks.
- Rationale: Keeps the spec and task list consistent.
- Dependency notes: None.
- Validation method: Confirm the spec now authorizes the selected gameplay model.
- Expected downstream impact: Removes needless review churn over randomizer selection.

### ISSUE-005

- Governing basis: Constitution principles III and IV; user planning request; `plan.md`; `tasks.md`
- Affected files: `spec.md`, `tasks.md`
- Intended change: Add a client-only and no-runtime-network requirement plus a matching success criterion and validation task wording.
- Rationale: A constraint that shapes architecture and validation belongs in the spec.
- Dependency notes: Related to ISSUE-003.
- Validation method: Confirm the spec explicitly prohibits runtime service dependency and tasks validate offline/local-only behavior.
- Expected downstream impact: Keeps implementation from drifting toward backend assumptions.

### ISSUE-006

- Governing basis: Constitution principle IV; `plan.md`; `spec.md`
- Affected files: `spec.md`
- Intended change: Promote the supported desktop browser set from the plan into the spec and reuse it in the performance outcome language.
- Rationale: Performance targets must name the environment they apply to.
- Dependency notes: None.
- Validation method: Confirm browser scope appears in both the non-functional requirement and success criterion.
- Expected downstream impact: Makes performance signoff testable.

### ISSUE-007

- Governing basis: Constitution principle V; `spec.md`
- Affected files: `spec.md`
- Intended change: Rewrite FR-013 so it defines exact preview behavior instead of repeating FR-012.
- Rationale: Requirements should be distinct and non-overlapping.
- Dependency notes: None.
- Validation method: Confirm FR-012 and FR-013 cover different aspects of preview display.
- Expected downstream impact: Reduces confusion during review and implementation.

## Coverage Verification

- ISSUE-001 is covered by spec and task updates.
- ISSUE-002 is covered by spec and task updates.
- ISSUE-003 is covered by spec and task updates.
- ISSUE-004 is covered by a spec update.
- ISSUE-005 is covered by spec and task updates.
- ISSUE-006 is covered by a spec update.
- ISSUE-007 is covered by a spec update.

All issues from `analysis-report.md` are covered by one or more concrete planned actions. No clarification artifact is required for this round.
