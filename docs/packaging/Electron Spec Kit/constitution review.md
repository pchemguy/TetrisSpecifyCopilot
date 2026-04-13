The current constitution is coherent, but it is still shaped like a **generic software delivery constitution**. For your project, it should instead become a **Spec Kit / agentic development constitution** that governs how specifications, plans, tasks, issues, implementation, and validation are produced in small deterministic slices.

The biggest mismatch after inspecting the constitution agent is this:

* the agent expects the constitution to drive **templates and workflow behavior**
* your current constitution mostly governs **product quality outcomes**
* your current priorities are more about:
    * small testable increments
    * documentation-first and spec-driven implementation
    * issue/task granularity
    * deterministic/traceable agent work
    * explicit constraints for Windows/Git Bash/VS Code/coding agents
    * architecture boundaries and minimal complexity

So I would revise it materially. This looks like a **MINOR** bump at minimum, and arguably a stronger restructuring if you replace principle focus substantially. Since the constitutional role remains the same and governance format stays compatible, I would use **1.2.0** rather than 2.0.0.

---

## What I would change conceptually

I would replace the current emphasis set:

* Code Quality Is A Release Gate
* Tests Prove Behavior
* UX Consistency Is A Product Requirement
* Performance Budgets Are Defined Up Front
* Technical Decisions Must Be Traceable

with a constitution centered on the way this repo is actually meant to operate.

A much better principle set for this repository would be along these lines:

1. **Specification First**
2. **Small, Testable, Incremental Delivery**
3. **Tests and Validation Are Mandatory Evidence**
4. **Traceable Decisions and Scope Discipline**
5. **Architecture and Environment Constraints Must Be Respected**

That is much closer to the repo’s real purpose.

---

## Proposed revised constitution

Use this as the new `.specify/memory/constitution.md` content.

```markdown
<!--
Sync Impact Report
Version change: 1.1.0 -> 1.2.0
Modified principles:
- Code Quality Is A Release Gate -> I. Specification And Documentation Are The Source Of Truth
- Tests Prove Behavior -> II. Delivery Proceeds In Small, Testable Increments
- UX Consistency Is A Product Requirement -> III. Validation Evidence Is Mandatory
- Performance Budgets Are Defined Up Front -> IV. Scope, Decisions, And Exceptions Must Be Traceable
- Technical Decisions Must Be Traceable -> V. Architecture And Environment Constraints Must Be Respected
Added sections:
- Spec Kit Workflow Requirements
- Agentic Delivery Requirements
Removed sections:
- None
Templates requiring updates:
- ⚠ pending: .specify/templates/plan-template.md
- ⚠ pending: .specify/templates/spec-template.md
- ⚠ pending: .specify/templates/tasks-template.md
- ⚠ pending: .github/agents/speckit.specify.agent.md
- ⚠ pending: .github/agents/speckit.plan.agent.md
- ⚠ pending: .github/agents/speckit.tasks.agent.md
- ⚠ pending: .github/agents/speckit.checklist.agent.md
- ⚠ pending: .github/agents/speckit.implement.agent.md
- ⚠ pending: .github/agents/speckit.taskstoissues.agent.md
Follow-up TODOs:
- Update all Spec Kit templates and agent prompts so they operationalize the revised principles explicitly.
-->

# TetrisSpecifyCopilot Constitution

## Core Principles

### I. Specification And Documentation Are The Source Of Truth
Implementation MUST be derived from explicit project artifacts rather than inferred from
habit, preference, or undocumented assumptions. Specifications, plans, tasks, issue
descriptions, and governing project documents MUST define what is to be built, what is
out of scope, and what evidence is required for completion. When implementation,
conversation context, and repository documents conflict, the approved project artifacts
take precedence unless they are formally amended. Rationale: this repository exists to
support spec-driven and agent-driven development, which fails when requirements are
implicit or reconstructed ad hoc.

### II. Delivery Proceeds In Small, Testable Increments
Work MUST be decomposed into small, reviewable, and independently testable units.
Specifications MUST be structured so that user stories or feature slices can be
implemented and validated incrementally. Plans, task lists, and GitHub issues MUST avoid
bundling unrelated work, and implementation SHOULD prefer the smallest change that
produces meaningful progress while preserving repository correctness. Large or coupled
changes require an explicit justification in the plan. Rationale: small increments reduce
agent error, simplify review, improve rollback safety, and enable deterministic progress.

### III. Validation Evidence Is Mandatory
No change is complete without concrete evidence that the intended behavior, constraints,
and acceptance conditions have been satisfied. The required evidence MAY include unit,
integration, contract, end-to-end, lint, type, schema, snapshot, replay, packaging, or
manual validation checks, depending on the affected boundary. Tasks and implementation
plans MUST identify the validation work needed for each change, and reviewers MUST reject
changes that claim completion without corresponding evidence. Rationale: in a spec-driven
workflow, validation artifacts are the proof that the specification has been implemented
rather than merely attempted.

### IV. Scope, Decisions, And Exceptions Must Be Traceable
Every non-trivial change MUST make its scope boundaries, design decisions, and exceptions
explicit. Specifications MUST distinguish required behavior from assumptions and
non-goals. Plans MUST identify technical decisions, rejected alternatives when relevant,
and any temporary deviations from the preferred approach. If a principle cannot be fully
met, the exception MUST record the impacted principle, business or technical reason,
owner, and removal condition. Rationale: traceability prevents scope creep, reduces
hidden complexity, and makes agent-generated changes auditable.

### V. Architecture And Environment Constraints Must Be Respected
Implementation MUST preserve the repository's declared architectural boundaries,
technology constraints, and development environment rules. Plans and tasks MUST name any
required platform, runtime, packaging, tooling, shell, or repository constraints that
affect execution. Agents and contributors MUST prefer the simplest approach compatible
with the current architecture and supported environment, and MUST not introduce new
dependencies, toolchains, or cross-boundary coupling without explicit justification.
Rationale: agentic development is most reliable when architectural seams and execution
constraints are explicit, stable, and enforced.

## Spec Kit Workflow Requirements

Specifications MUST define:

- prioritized, independently testable user stories or feature slices
- functional requirements and explicit out-of-scope boundaries
- non-functional requirements when relevant to architecture, reliability, UX,
  packaging, performance, or environment compatibility
- measurable success criteria
- assumptions and dependencies that constrain implementation

Implementation plans MUST translate constitutional principles into concrete execution
rules, including:

- constitution checks tied to the current feature
- architectural constraints and approved technology choices
- validation strategy and required evidence
- complexity tracking for any justified deviations
- explicit sequencing that supports incremental implementation

Task lists MUST be organized to support independent execution and verification. They MUST
separate foundational work from user-story work where applicable and MUST include the
validation, documentation, and integration tasks required to prove completion.

## Agentic Delivery Requirements

Prompts, templates, and issue-generation workflows MUST be written so that coding agents
can act deterministically and with minimal ambiguity. Tasks and issues MUST be small
enough to implement safely in one focused pass, with clear inputs, outputs, constraints,
and acceptance checks. Repository guidance MUST explicitly define shell selection,
environment assumptions, architectural boundaries, and any forbidden shortcuts that would
cause agents to drift from the intended implementation path.

When repository or platform constraints materially affect delivery, the relevant
documents, plans, and tasks MUST say so directly rather than assuming those constraints
will be inferred during implementation.

## Delivery Workflow

Every feature MUST pass a constitution check during planning and again before final
review. The constitution check MUST confirm that the feature:

- is grounded in an explicit specification
- is decomposed into small, testable increments
- defines the evidence required for completion
- records key decisions, assumptions, and exceptions
- respects the repository's architecture and environment constraints

Reviewers MUST reject changes that are too large to review confidently, lack validation
evidence, exceed approved scope without amendment, or violate architectural or
environment constraints without a recorded justification.

Implementation SHOULD prefer the narrowest viable change that satisfies the approved
specification and acceptance criteria.

## Governance

This constitution is the authoritative decision framework for specifications, plans,
tasks, issues, implementation, review, and release readiness in this repository. All
delivery artifacts MUST demonstrate compliance with these principles or document an
approved exception.

Amendments require: (1) a documented change to this constitution, (2) updates to affected
templates, prompts, or workflow guidance, and (3) an explanation of the operational
impact on specification, planning, task decomposition, implementation, and review.
Compliance reviews occur during feature specification, planning, task generation,
implementation review, and pre-release validation.

Versioning policy:

- MAJOR: remove or fundamentally redefine a principle or governance rule in a
  backward-incompatible way
- MINOR: add a principle, add a mandatory workflow section, or materially expand
  constitutional guidance
- PATCH: clarify wording, fix ambiguity, or make non-semantic editorial improvements

Constitutional principles take precedence over feature-level preferences. The order of
precedence is:

1. Constitution
2. Approved feature specification
3. Approved implementation plan
4. Approved task or issue definition
5. Local coding preference

**Version**: 1.2.0 | **Ratified**: 2026-04-10 | **Last Amended**: 2026-04-13
```

---

## Why this version is better

This version makes the constitution actually govern the workflow you are building.

### It aligns with your real priorities

It directly encodes:

* spec-first development
* small increments
* testable slices
* traceability
* architectural and environment constraints
* agent-oriented prompt/template design

### It is more operational for Spec Kit

The current constitution is not wrong, but it does not strongly drive:

* `spec-template`
* `plan-template`
* `tasks-template`
* `taskstoissues`
* `implement`
* checklist generation

The revised one does.

### It is better for your desktop-app work too

Your recent concerns around Electron/Tauri/Windows/Git Bash/agents are exactly the sort of things principle V and the new agentic requirements should govern.

---

## Version bump rationale

I would mark this as:

**1.2.0**

Reason:

* no constitutional structure is broken in a backward-incompatible way
* but the principles are materially reoriented and workflow guidance is expanded
* that is a clear **MINOR** amendment

If you decide to preserve the old principles and only add agentic ones, then 1.2.0 is also right.
If you decide to fully replace the old principles and treat prior template logic as incompatible, 2.0.0 could be argued, but I do not think it is necessary here.

---

## Important downstream updates now required

This constitution change should force updates to at least:

* `.specify/templates/spec-template.md`
* `.specify/templates/plan-template.md`
* `.specify/templates/tasks-template.md`
* `.github/agents/speckit.specify.agent.md`
* `.github/agents/speckit.plan.agent.md`
* `.github/agents/speckit.tasks.agent.md`
* `.github/agents/speckit.checklist.agent.md`
* `.github/agents/speckit.implement.agent.md`
* `.github/agents/speckit.taskstoissues.agent.md`

The most important immediate update targets are:

### `plan-template`

It should explicitly require:

* small independent increments
* architecture/environment constraints
* decision traceability
* validation evidence strategy

### `tasks-template`

It should explicitly require:

* tasks grouped into independently testable slices
* mandatory validation tasks
* no merged unrelated work
* foundational vs story work separation

### `taskstoissues`

It should explicitly require:

* issue granularity optimized for one focused implementation pass
* no merging tasks into broad omnibus issues
* explicit acceptance criteria and validation evidence

### `implement`

It should explicitly require:

* implement current issue/task only
* do not expand scope
* update linked issue
* preserve architecture constraints
* prove completion with tests/checks

---

## Suggested commit message

`docs: amend constitution to v1.2.0 for spec-driven incremental agentic delivery`

---
