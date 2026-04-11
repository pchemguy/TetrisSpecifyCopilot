# Analysis Report: Classic Browser Tetris

**ARW Round**: CUR  
**Mode**: bootstrap  
**Created**: 2026-04-11  
**Issue Source**: prior `/speckit.analyze` findings from conversation context  
**Governed Artifacts**: `spec.md`, `plan.md`, `tasks.md`

## Normalized Issue Registry

| Issue ID | Category | Severity | Source Location(s) | Summary | Recommended Resolution Direction | Clarification Needed |
| -------- | -------- | -------- | ------------------ | ------- | ------------------------------- | ------------------- |
| ISSUE-001 | Ambiguity | HIGH | `spec.md#L75`, `tasks.md#L67`, `tasks.md#L68` | Lock timing exists in scope but is not explicitly defined, forcing undocumented implementation choices. | Add explicit lock delay, reset, hard-drop, and pause interaction rules to the spec and align plan/tasks wording. | No |
| ISSUE-002 | Ambiguity | HIGH | `spec.md#L77`, `spec.md#L79`, `tasks.md#L61`, `tasks.md#L69` | Scoring and gravity progression are required but not quantified. | Define the scoring table, drop bonuses, and gravity progression in the spec and tighten affected tasks. | No |
| ISSUE-003 | Underspecification | HIGH | `spec.md#L88`, `spec.md#L90`, `plan.md#L21`, `tasks.md#L121`, `tasks.md#L122`, `tasks.md#L123` | Session, score-history, and replay persistence appear in plan/tasks but are not explicitly part of the specification scope. | Update the spec to explicitly include locally persisted session, score, and replay records while keeping replay UI out of scope. | No |
| ISSUE-004 | Underspecification | MEDIUM | `spec.md#L71`, `tasks.md#L39` | The spec leaves randomized generation vague while the tasks hard-code 7-bag behavior. | Promote 7-bag randomization into the spec to match the chosen gameplay model. | No |
| ISSUE-005 | Inconsistency | MEDIUM | `plan.md#L26`, `tasks.md#L219` | Client-only and no-network constraints are enforced downstream but not explicitly required in the spec. | Add an explicit non-functional requirement and measurable outcome for client-only, offline-capable operation. | No |
| ISSUE-006 | Ambiguity | MEDIUM | `spec.md#L97`, `spec.md#L111`, `plan.md#L23` | Performance targets depend on “supported desktop browsers,” but that browser set is only defined in the plan. | Add the supported desktop browser set to the spec and align the success criteria wording. | No |
| ISSUE-007 | Duplication | LOW | `spec.md#L80`, `spec.md#L81` | The next-piece preview requirement is duplicated between FR-012 and FR-013. | Narrow FR-013 so it specifies the exact preview behavior rather than repeating FR-012. | No |

## High-Severity Issue Details

### ISSUE-001

- Category: Ambiguity
- Severity: HIGH
- Source locations: `spec.md#L75`, `tasks.md#L67`, `tasks.md#L68`
- Summary: The current spec requires locking behavior but leaves the exact timing model undefined.
- Resolution direction: adopt an explicit deterministic lock-delay rule that matches the chosen modern Tetris interaction model already implied by SRS rotation, hold, and ghost-piece behavior.

### ISSUE-002

- Category: Ambiguity
- Severity: HIGH
- Source locations: `spec.md#L77`, `spec.md#L79`, `tasks.md#L61`, `tasks.md#L69`
- Summary: The spec requires scoring and speed progression but does not quantify either, which blocks deterministic testing.
- Resolution direction: codify a scoring table, soft/hard drop bonuses, and a gravity progression formula in the spec, then update tasks to implement and test those values directly.

### ISSUE-003

- Category: Underspecification
- Severity: HIGH
- Source locations: `spec.md#L88`, `spec.md#L90`, `plan.md#L21`, `tasks.md#L121`, `tasks.md#L122`, `tasks.md#L123`
- Summary: The downstream artifacts assume structured local session, score, and replay persistence that the spec does not yet explicitly authorize.
- Resolution direction: bring the spec up to the already selected browser-only architecture by explicitly requiring local structured persistence for those records while keeping the UI requirement limited to best-score display and persistence status messaging.

## Clarification Assessment

No clarification is required for this ARW round. All recorded issues can be resolved from the existing user requests, plan decisions, research decisions, and constitutional guidance without introducing new product ambiguity.
