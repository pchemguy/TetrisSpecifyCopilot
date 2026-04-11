---
description: Resolve issues previously identified by `analyze` using a state-aware, resumable Analysis and Resolution Workflow (ARW).
url: https://chatgpt.com/g/g-p-69ca8410ab7c819198782233666b1069-spec-kit/c/69da3111-3e48-838f-8d54-2923cc1cecb7
---

> [!NOTE] Analysis resolution
> 
> `fix` is a resumable issue-resolution workflow that consumes prior analysis findings, creates or resumes ARW artifacts under the feature analysis subspace, asks the user for clarification only when necessary, prepares a traceable resolution plan, applies minimal necessary changes, records outcomes in a resolution report, and finalizes the round by renaming `CUR` to the next numbered analysis directory and committing the result.

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding, if not empty.

## Goal

Resolve the issues previously identified for the current feature by executing a resumable **Analysis and Resolution Workflow (ARW)**. This command operates on an existing analysis context and produces structured ARW artifacts under the feature analysis subspace.

This command is responsible for:

- assessing ARW state at start
- resuming an incomplete ARW round when present
- creating or updating ARW artifacts in the correct sequence
- requesting user clarification only when necessary for high-quality resolution
- preparing and executing a traceable resolution plan
- producing a resolution report
- finalizing the ARW round and committing changes

## Analysis Source Priority

This command is the **resolution phase** that follows prior analysis. It must use one of the following as its issue source of truth, in this priority order:

1. an existing `analysis-report.md` in the current ARW subspace
2. issues already established in current conversation context from a prior `analyze` run
3. explicit user-provided issue list in `$ARGUMENTS`

If no issue source can be established, abort and instruct the user to run `/speckit.analyze` first.

## Operating Constraints

### 1. Resolution Authority

The project constitution remains authoritative. Constitution principles are non-negotiable within this workflow. Any identified conflict must be resolved by changing `spec.md`, `plan.md`, `tasks.md`, or related governed artifacts as appropriate. Do not weaken or reinterpret constitution rules inside this command.

### 2. Controlled Mutability

This command **may modify files** only as required to resolve recorded issues and complete ARW artifacts.

Do **not** make speculative refactors or unrelated cleanup. Every material change must trace back to at least one recorded issue in the analysis source of truth or to a directly required consequence of resolving such an issue.

### 3. Deterministic Recovery

This command must be resumable. If an incomplete ARW round exists, resume from the earliest incomplete stage rather than starting a new round.

### 4. User Clarification Threshold

Ask the user for clarification only when at least one issue cannot be resolved optimally from governing artifacts, existing decisions, and repository context.

If clarification is needed, switch into interactive clarification mode and record answers in the ARW clarification artifact before proceeding further.

### 5. Commit Discipline

Use focused commits reflecting completed ARW progress. Do not squash unrelated work into the same commit.

## Feature and State Initialization

### 1. Determine Feature Context

Run `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` once from repo root and parse JSON for `FEATURE_DIR` and `AVAILABLE_DOCS`.

Derive:

- `SPEC = FEATURE_DIR/spec.md`
- `PLAN = FEATURE_DIR/plan.md`
- `TASKS = FEATURE_DIR/tasks.md`
- `ANALYSES_DIR = FEATURE_DIR/analyses`
- `CUR_DIR = FEATURE_DIR/analyses/CUR`

Abort with a clear error if required prerequisite files (SPEC/PLAN/TASKS) are missing.

For single quotes in args like "I'm Groot", use escape syntax: e.g. `'I'\''m Groot'` or use double quotes when possible.

### 2. State Analysis at Start

Before doing any ARW work, determine whether an incomplete ARW round already exists and whether prior analysis exists in context.

There are three possible states:

#### A. Existing Incomplete ARW Round (Disk State)

- If `CUR_DIR` exists:
    - Treat it as the active incomplete ARW round
    - Resume execution using lock/state detection rules
    - Do NOT re-import or regenerate analysis from context unless explicitly required for recovery

#### B. No ARW Round, But Analysis Exists in Context (Bootstrap State)

- If `CUR_DIR` does not exist AND analysis findings are available in conversation context (from a prior `/speckit.analyze` run):
    - Create `ANALYSES_DIR` if missing
    - If `ANALYSES_DIR` contains uncommitted changes, commit those changes before starting
    - Create `CUR_DIR`
    - Initialize a new ARW round in **bootstrap mode**
    - Proceed to Stage 1
    - Do NOT re-run analysis or reinterpret findings beyond normalization into the issue register

#### C. No ARW Round and No Analysis Available (Invalid State)

- If `CUR_DIR` does not exist AND no analysis findings are available in context:
    - Abort execution
    - Instruct the user to run `/speckit.analyze` first

### 3. ARW Round State Detection

Inside `CUR_DIR`, inspect the presence of the primary ARW artifacts and `*.LOCK` files.

At most one primary artifact lock may exist at any time.

Use the following stage mapping:

| Stage | Artifact                         | Lock file                          |
| ----: | -------------------------------- | ---------------------------------- |
|     1 | `analysis-report.md`             | `analysis-report.LOCK`             |
|     2 | `analysis-clarification-form.md` | `analysis-clarification-form.LOCK` |
|     3 | `analysis-resolution-plan.md`    | `analysis-resolution-plan.LOCK`    |
|     4 | `analysis-resolution-report.md`  | `analysis-resolution-report.LOCK`  |

Resume rules:

- If a recognized lock file exists, resume that stage.
- If no lock file exists but one or more later-stage artifacts exist while an earlier required artifact is missing, resume from the earliest incomplete required stage.
- If multiple lock files exist, treat state as inconsistent:
    - report the inconsistency
    - preserve all existing files
    - continue by selecting the earliest locked stage as the recovery point
    - remove no lock automatically unless doing so is required by explicit recovery logic documented in the resolution report
- If `CUR_DIR` exists and all required artifacts are complete with no locks, proceed directly to finalization.

## ARW Naming Convention

Each feature may have multiple ARW rounds. Each completed round must live under:

- `spec/<feature_name>/analyses/<###>/`

where `###` is a zero-padded three-digit sequential identifier.

The active in-progress round lives under:

- `spec/<feature_name>/analyses/CUR/`

Primary ARW artifacts:

| Stage | Artifact                         | Required | Purpose                                                       |
| ----: | -------------------------------- | -------- | ------------------------------------------------------------- |
|     1 | `analysis-report.md`             | Yes      | Source-of-truth issue record for this ARW round               |
|     2 | `analysis-clarification-form.md` | No       | Clarification record, only when user input is needed          |
|     3 | `analysis-resolution-plan.md`    | Yes      | Detailed, actionable, issue-complete plan for resolution      |
|     4 | `analysis-resolution-report.md`  | Yes      | Traceable account of applied changes, outcomes, and residuals |

## Lock File Policy

Before beginning work on a primary ARW artifact, create its corresponding `*.LOCK` file.

Rules:

- only one primary artifact lock may exist in `CUR_DIR`
- do not create the next stage lock until the current stage is complete
- remove the current stage lock only after the artifact is complete for that stage
- once a stage is completed, treat its artifact as closed except where a later stage explicitly requires appending traceability or recovery notes
- if a stage must be redone due to newly discovered gaps, re-open it explicitly, recreate its lock, and document why in the resolution report

## Workflow

### Stage 0 — Issue Source Determination

Determine the issue source of truth:

1. `CUR_DIR/analysis-report.md` (if present)
2. Prior `/speckit.analyze` findings available in conversation context
3. Explicit user-provided issue list in `$ARGUMENTS`

Prefer `analysis-report.md`, if available, and also consider direct user input `$ARGUMENTS`, if provided.

If no valid source can be established:

- Abort execution
- Instruct the user to run `/speckit.analyze` first

### Stage 1 — Establish or Complete `analysis-report.md`

This stage is responsible for:

- materializing the issue source into a persistent artifact
- normalizing all issues into the Issue Registry format
- assigning stable IDs if missing

#### Behavior

- If `analysis-report.md` already exists:
    - load it as the issue source of truth
    - assign IDs if missing
- If `analysis-report.md` does not exist:
    - create it from the selected issue source
    - transcribe all issues into the Issue Registry Format
    - assign IDs if missing

#### Issue Registry Format

All issues within an ARW round MUST be represented in a normalized issue registry.

Each issue MUST include:

- stable issue ID
- category
- severity
- source location(s)
- summary
- recommended resolution direction

#### Constraints

- Do NOT add, remove, merge, or reinterpret issues
- Only normalize structure, wording, and identifiers
- Preserve semantic equivalence with the original source

#### Required Contents

- ARW round metadata
- normalized issue registry table
- detailed sections for HIGH and CRITICAL issues
- clarification-needed markers (if detectable without user input)

#### Completion Criterion

- all issues from the selected source are represented in the registry
- all issues comply with the Issue Registry Specification
- all issue IDs are stable
- `analysis-report.md` is the single authoritative issue source for subsequent stages

### Stage 2 — Clarification Assessment and `analysis-clarification-form.md` if Needed

Determine whether user clarification is required for any issue. Clarification is required when one or more issues cannot be optimally resolved from constitution, feature artifacts, repository context, or previously recorded decisions.

#### Clarification is not Required

Clarification MUST NOT be triggered for:

- LOW severity issues
- purely editorial or wording issues
- issues resolvable by constitution or existing artifacts

If no clarification is required:

- do not create `analysis-clarification-form.md`
- proceed directly to Stage 3

#### Clarification is Required

Clarification SHOULD be triggered for:

- conflicting requirements
- architectural decisions
- ambiguous non-functional requirements
- missing acceptance criteria affecting implementation


If clarification is required:

- create or resume `analysis-clarification-form.md`
- switch to interactive clarification mode
- present each unresolved issue individually
- for each question:
    - cite the related issue ID
    - explain why clarification is needed
    - propose options when grounded options exist
    - otherwise request concise open input
- record user answers directly in the form next to the corresponding question

#### Completion criterion

- every issue requiring clarification has a recorded answer or an explicit fallback decision rule
- no unresolved clarification dependency remains for Stage 3

### Stage 3 — Prepare `analysis-resolution-plan.md`

Create a detailed, actionable, issue-complete resolution plan.

The plan must be grounded in:

- constitution
- `spec.md`
- `plan.md`
- `tasks.md`
- `analysis-report.md`
- `analysis-clarification-form.md` if present
- any additional relevant governed artifacts

For each issue, include:

- issue ID
- governing basis
- affected files
- intended change
- rationale
- dependency notes
- validation method
- expected downstream impact

The plan must also include a coverage verification section proving that all issues are addressed.

Mandatory completeness loop:

1. verify that every issue from `analysis-report.md` is covered in the resolution plan
2. verify that all clarification answers from `analysis-clarification-form.md`, if present, are reflected in the plan
3. if any gap exists, extend the plan
4. repeat until no gaps remain

Completion criterion:

- every issue in `analysis-report.md` is covered by one or more concrete plan actions
- every clarification answer is reflected where relevant
- planned actions are specific enough to execute without reinterpretation

### Stage 4 — Execute Resolution and Produce `analysis-resolution-report.md`

Execute the resolution plan and modify repository files as needed.

Resolution rules:

- apply only changes justified by the resolution plan
- preserve unrelated existing content
- maintain artifact consistency across `spec.md`, `plan.md`, `tasks.md`, and any other affected files
- when one change creates necessary cascading updates, perform them and document them as derived changes
- if a planned action becomes invalid during execution, update the plan first, then continue

Produce `analysis-resolution-report.md` documenting:

- execution summary
- per-issue resolution status
- actual files changed
- deviations from plan and reasons
- unresolved residual issues, if any
- validation results
- recovery notes, if any
- commit summary

Per-issue status values should be one of:

- `resolved`
- `partially_resolved`
- `blocked`
- `deferred`

Completion criterion:

- all planned executable actions have been attempted
- each issue has a final status
- residuals and deviations are explicitly recorded

## Validation Expectations

Before finalization, verify at minimum:

- `CUR_DIR` must contain at least:  
    - `analysis-report.md`  
    - `analysis-resolution-plan.md`  
    - `analysis-resolution-report.md`  
- all issue IDs from `analysis-report.md` appear in `analysis-resolution-plan.md`
- all issue IDs from `analysis-report.md` appear in `analysis-resolution-report.md`
- all required lock files have been removed
- no unintended edits were made outside ARW scope
- modified artifacts remain internally consistent to the best available evidence

If validation reveals gaps, resume the earliest stage that must be reopened and document the reason in the resolution report.

## Finalization of Completed ARW Round

When the current ARW round is complete:

1. ensure `CUR_DIR` contains no remaining `*.LOCK` files
2. determine the next available zero-padded numbered directory under `ANALYSES_DIR`
3. rename `CUR_DIR` to that numbered directory
4. commit the completed ARW round and all associated resolution changes

## Commit Policy

Use focused commit sequencing.

Recommended pattern:

1. optional commit for staged ARW artifact establishment if a clean checkpoint is useful
2. commit for the actual issue resolution changes
3. final commit for ARW round completion if needed

At minimum, the final state must be committed once the ARW round is successfully completed and numbered.

Commit messages should reflect the feature and ARW round purpose. They should make it clear whether the commit records:

- ARW artifact creation
- resolution changes
- ARW round finalization

## Output Requirements

During execution, provide concise progress updates indicating:

- whether a new ARW round was started or an existing one resumed
- current stage
- whether clarification is required
- whether resolution completed successfully or with residual issues

At the end, output a compact summary including:

- ARW round identifier
- whether the round was resumed or newly created
- artifacts created or updated
- issues resolved count
- residual issue count
- files modified
- commit result

If clarification is needed before Stage 3 or Stage 4 can continue, pause and present the clarification prompts to the user.

## Operating Principles

### State Awareness

Always inspect ARW state first. Never assume a clean start.

### Traceability First

Every meaningful resolution change must be traceable to a recorded issue.

### Recovery Over Restart

Prefer resuming and repairing an incomplete ARW round over creating a new one.

### Deterministic Sequencing

Use the defined stage order, lock policy, and finalization procedure consistently.

### Minimal Necessary Change

Resolve issues completely, but do not perform unrelated improvements.

## Context

$ARGUMENTS


---
---


## A few optional improvements you may want next

I would consider adding these later, but I did not force them into the prompt yet.

### A. Explicit artifact schemas

You may want to define required section templates for:

* `analysis-report.md`
* `analysis-clarification-form.md`
* `analysis-resolution-plan.md`
* `analysis-resolution-report.md`

That would make artifacts more machine-checkable.

### B. Issue taxonomy normalization

You may want a controlled vocabulary for issue categories, such as:

* duplication
* ambiguity
* underspecification
* constitution_conflict
* coverage_gap
* inconsistency

This would help later automation.

### C. “Deferred” policy

You may want to define whether `deferred` is allowed only with explicit user approval, or allowed automatically for low-severity items.

### D. Git cleanliness policy outside `analyses/`

You currently mention committing changes under `analyses/` before starting a new round. You may also want rules for unrelated dirty changes elsewhere in the repo.

### E. Number assignment race policy

If multiple agents could run, you may want stricter wording around numbered directory assignment. That may not matter yet.

---


---

## Suggested shorter protocol summary

If you also want a concise human-facing summary to accompany the prompt, use this:

> `fix` is a resumable issue-resolution workflow that consumes prior analysis findings, creates or resumes ARW artifacts under the feature analysis subspace, asks the user for clarification only when necessary, prepares a traceable resolution plan, applies minimal necessary changes, records outcomes in a resolution report, and finalizes the round by renaming `CUR` to the next numbered analysis directory and committing the result.

If useful, I can next turn this into a paired `analyze` + `fix` design where the two commands share artifact contracts cleanly.
