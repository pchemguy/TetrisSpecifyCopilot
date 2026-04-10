<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles:
- Code Quality Release Gate -> I. Code Quality Is A Release Gate
- Tests Prove Behavior -> II. Tests Prove Behavior
- UX Consistency -> III. UX Consistency Is A Product Requirement
- Performance Budgets -> IV. Performance Budgets Are Defined Up Front
- Explicit Technical Decisions -> V. Technical Decisions Must Be Traceable
Added sections:
- Implementation Standards
- Delivery Workflow
Removed sections:
- None
Templates requiring updates:
- ✅ updated: .specify/templates/plan-template.md
- ✅ updated: .specify/templates/spec-template.md
- ✅ updated: .specify/templates/tasks-template.md
- ✅ no template command files present: .specify/templates/commands/*.md
- ✅ reviewed, no update required: docs/SPEC_KIT.md
Follow-up TODOs:
- None
-->

# TetrisSpecifyCopilot Constitution

## Core Principles

### I. Code Quality Is A Release Gate
Every change MUST meet the repository's agreed quality bar before merge or release.
Production code MUST be readable, intentionally named, small enough to review,
and free of known lint, type, and static-analysis violations that the toolchain can
detect. Refactors that reduce duplication, simplify control flow, or improve
maintainability MUST accompany feature work when existing code would otherwise make
the new change harder to verify or operate. Rationale: quality defects compound
quickly; treating quality as optional pushes risk downstream into support,
performance tuning, and future feature delivery.

### II. Tests Prove Behavior
Changes MUST include tests that demonstrate the intended behavior at the lowest
useful level and at every changed boundary that can fail independently. New logic
MUST have unit coverage, contract changes MUST have contract coverage, and critical
user journeys MUST have integration or end-to-end coverage. A change is incomplete
until the relevant tests fail before implementation or defect reproduction and pass
after the fix. Rationale: test evidence is the project's primary safeguard against
regressions and undocumented assumptions.

### III. UX Consistency Is A Product Requirement
User-facing changes MUST preserve or deliberately improve the established interaction
model, terminology, visual language, accessibility, and error handling patterns.
Specifications MUST define the expected user journey, empty states, validation
feedback, and recovery behavior for errors. Any intentional deviation from existing
patterns MUST be explicitly justified in the plan and reviewed as a product-level
decision, not a local implementation shortcut. Rationale: inconsistent experiences
create user confusion even when the code is technically correct.

### IV. Performance Budgets Are Defined Up Front
Features MUST declare measurable performance expectations before implementation and
validate them before completion. Each plan MUST record the relevant latency,
throughput, startup, render, memory, or cost budgets for the affected workflow,
along with the method used to verify them. Work that risks missing a budget MUST
include mitigation or staged delivery steps before approval. Rationale: performance
is easiest to preserve when treated as a design input instead of a cleanup task.

### V. Technical Decisions Must Be Traceable
Architectural and implementation choices MUST be justified in writing when they add
complexity, introduce dependencies, alter public contracts, or trade one principle
against another. Plans and reviews MUST name the decision, the constraint that drove
it, the simpler alternatives considered, and the reason those alternatives were
rejected. Temporary exceptions MUST include an owner and a removal condition.
Rationale: explicit decisions make tradeoffs reviewable and prevent accidental
architecture drift.

## Implementation Standards

Specifications MUST include functional requirements, explicit non-functional
requirements for quality, UX, and performance, measurable success criteria, and the
assumptions that constrain implementation choices.

Implementation plans MUST translate the constitution into concrete gates covering:

- code quality checks and maintainability expectations
- required unit, integration, contract, or end-to-end tests
- UX consistency, accessibility, and error-state review criteria
- performance budgets, measurement approach, and rollback or mitigation planning
- decision records for architectural or implementation tradeoffs

Task lists MUST include the work needed to satisfy those gates. Test creation,
quality tooling, UX validation, and performance verification are mandatory work
items whenever the feature touches those concerns; they are not optional polish.

## Delivery Workflow

Every feature MUST pass a constitution check during planning and again before final
review. If a principle cannot be met, the exception MUST be documented in the plan's
complexity or risk tracking section with the impacted principle, business reason,
owner, and expiration condition.

Reviewers MUST reject changes that lack sufficient test evidence, omit measurable
performance targets, introduce unexplained UX inconsistency, or add complexity
without a recorded decision. Implementation choices SHOULD prefer the simplest
approach that satisfies the requirements and the stated budgets. When principles
conflict, teams MUST resolve the conflict explicitly in favor of the option with the
clearest user value and lowest long-term operational cost.

## Governance

This constitution is the authoritative decision framework for specifications, plans,
tasks, code review, and release readiness in this repository. All delivery artifacts
MUST demonstrate compliance with these principles or document an approved exception.

Amendments require: (1) a documented change to this constitution, (2) updates to any
affected templates or guidance files, and (3) an explanation of the operational
impact on planning, implementation, and review. Compliance reviews occur at feature
planning, pull request review, and pre-release validation.

Versioning policy:

- MAJOR: remove or redefine a principle or governance rule in a backward-incompatible way
- MINOR: add a principle, add a mandatory section, or materially expand guidance
- PATCH: clarify wording, fix ambiguity, or make non-semantic editorial improvements

Technical decisions and implementation choices MUST be evaluated against this order
of precedence: constitutional principles first, approved feature specification
second, implementation plan third, and local coding preference last.

**Version**: 1.1.0 | **Ratified**: 2026-04-10 | **Last Amended**: 2026-04-10
