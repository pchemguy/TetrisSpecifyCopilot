<!--
Sync Impact Report
Version change: 1.2.0 -> 1.3.0
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

# Project Constitution

## Core Principles

### I. Specification And Documentation Are The Source Of Truth

Implementation MUST be derived from explicit project artifacts rather than inferred from habit, preference, or undocumented assumptions. Specifications, plans, tasks, issue descriptions, and governing project documents MUST define:

- what is to be built,
- what is out of scope, and
- what evidence is required for completion.

When implementation, conversation context, and repository documents conflict, the approved project artifacts take precedence unless they are formally amended.

Rationale: this repository exists to support spec-driven and agent-driven development. That workflow fails when requirements are implicit, reconstructed ad hoc, or allowed to drift between artifacts.

### II. Delivery Proceeds In Small, Testable Increments

Work MUST be decomposed into small, reviewable, and independently testable units.

To support that requirement:

- specifications MUST be structured so that user stories or feature slices can be implemented and validated incrementally;
- plans, task lists, and GitHub issues MUST avoid bundling unrelated work; and
- implementation SHOULD prefer the smallest change that produces meaningful progress while preserving repository correctness.

Large or tightly coupled changes require explicit justification in the plan.

Rationale: small increments reduce agent error, simplify review, improve rollback safety, and enable more deterministic progress.

### III. Validation Evidence Is Mandatory

No change is complete without concrete evidence that the intended behavior, constraints, and acceptance conditions have been satisfied.

The required evidence MAY include:

- unit, integration, contract, or end-to-end tests;
- lint, type, schema, or static validation checks;
- snapshot, replay, packaging, or environment verification; or
- manual validation when automation is not the appropriate proof mechanism.

Tasks and implementation plans MUST identify the validation work needed for each change, and reviewers MUST reject changes that claim completion without corresponding evidence.

Rationale: in a spec-driven workflow, validation artifacts are the proof that the specification has been implemented rather than merely attempted.

### IV. Scope, Decisions, And Exceptions Must Be Traceable

Every non-trivial change MUST make its scope boundaries, design decisions, and exceptions explicit.

At minimum:

- specifications MUST distinguish required behavior from assumptions and non-goals;
- plans MUST identify material technical decisions, rejected alternatives when relevant, and any temporary deviations from the preferred approach; and
- exceptions MUST record the impacted principle, the business or technical reason, the owner, and the removal condition.

Rationale: traceability prevents scope creep, reduces hidden complexity, and makes agent-generated changes auditable and reviewable.

### V. Architecture And Environment Constraints Must Be Respected

Implementation MUST preserve the repository's declared architectural boundaries, technology constraints, and development environment rules.

Accordingly:

- Plans and tasks MUST name any platform, runtime, packaging, tooling, shell, or repository constraints that materially affect execution.
- Agents and contributors MUST prefer the simplest approach compatible with the current architecture and supported environment, and MUST not introduce new dependencies, toolchains, or cross-boundary coupling without explicit justification.
- Repository-specific execution guidance takes precedence over contributor convenience defaults when shell, tooling, or environment choices affect correctness or determinism.

Rationale: agentic development is most reliable when architectural seams and execution constraints are explicit, stable, and enforced.

## Spec Kit Workflow Requirements

Specifications MUST define:

- prioritized, independently testable user stories or feature slices;
- functional requirements and explicit out-of-scope boundaries;
- non-functional requirements when relevant to architecture, reliability, UX, packaging, performance, or environment compatibility;
- measurable success criteria; and
- assumptions and dependencies that constrain implementation.

Implementation plans MUST translate the constitutional principles into concrete execution rules, including:

- constitution checks tied to the current feature;
- architectural constraints and approved technology choices;
- validation strategy and required evidence;
- complexity tracking for justified deviations; and
- explicit sequencing that supports incremental implementation.

Task lists MUST be organized to support independent execution and verification. Where applicable, they MUST separate foundational work from user-story work and MUST include the validation, documentation, and integration tasks required to prove completion.

## Agentic Delivery Requirements

Prompts, templates, and issue-generation workflows MUST be written so that coding agents can act with bounded scope, deterministic guidance, and minimal ambiguity.

Tasks and issues MUST therefore be:

- small enough to implement safely in one focused pass;
- explicit about inputs, outputs, constraints, and dependencies; and
- clear about the acceptance checks and validation evidence required for completion.

Repository guidance MUST explicitly define shell selection, environment assumptions, architectural boundaries, and forbidden shortcuts where omission would cause agents to drift from the intended implementation path.

When repository or platform constraints materially affect delivery, the relevant documents, plans, and tasks MUST state those constraints directly rather than assuming they will be inferred during implementation.

## Delivery Workflow

Every feature MUST pass a constitution check during planning and again before final review.

The constitution check MUST confirm that the feature:

- is grounded in an explicit specification;
- is decomposed into small, testable increments;
- defines the evidence required for completion;
- records key decisions, assumptions, and exceptions; and
- respects the repository's architecture and environment constraints.

Reviewers MUST reject changes that are too large to review confidently, lack validation evidence, exceed approved scope without amendment, or violate architectural or environment constraints without a recorded justification.

Implementation SHOULD prefer the narrowest viable change that satisfies the approved specification and acceptance criteria.

## Governance

This constitution is the authoritative decision framework for specifications, plans, tasks, issues, implementation, review, and release readiness in this repository. All delivery artifacts MUST demonstrate compliance with these principles or document an approved exception.

Amendments require:

1. a documented change to this constitution;
2. updates to affected templates, prompts, or workflow guidance; and
3. an explanation of the operational impact on specification, planning, task decomposition, implementation, and review.

Compliance reviews occur during:

- feature specification,
- planning,
- task generation,
- implementation review, and
- pre-release validation.

Versioning policy:

- MAJOR: remove or fundamentally redefine a principle or governance rule in a backward-incompatible way;
- MINOR: add a principle, add a mandatory workflow section, or materially expand constitutional guidance; and
- PATCH: clarify wording, fix ambiguity, or make non-semantic editorial improvements.

Constitutional principles take precedence over feature-level preferences. The order of precedence is:

1. Constitution
2. Approved feature specification
3. Approved implementation plan
4. Approved task or issue definition
5. Local coding preference

**Version**: 1.3.0 | **Ratified**: 2026-04-10 | **Last Amended**: 2026-04-13
