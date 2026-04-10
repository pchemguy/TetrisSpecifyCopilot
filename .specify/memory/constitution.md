<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template principle 1 -> I. Code Quality Is a Release Gate
- Template principle 2 -> II. Tests Prove Behavior
- Template principle 3 -> III. User Experience Consistency Is a Product Requirement
- Template principle 4 -> IV. Performance Budgets Are Non-Negotiable
- Template principle 5 -> V. Technical Decisions Must Be Explicit
Added sections:
- Implementation Standards
- Decision & Review Workflow
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ⚠ .specify/templates/commands/*.md (directory not present; no updates applied)
Follow-up TODOs:
- None
-->
# TetrisSpecifyCopilot Constitution

## Core Principles

### I. Code Quality Is a Release Gate
All production changes MUST satisfy the repository's formatting, linting, static
analysis, and review standards before merge. Code MUST optimize for clarity,
cohesion, explicit naming, and bounded complexity over cleverness. Defects,
shortcuts, or TODOs that materially affect delivered scope MUST be fixed before
release or tracked explicitly in the governing spec, plan, or tasks.

Rationale: consistent code quality reduces regressions, preserves maintainability,
and keeps future change cost predictable.

### II. Tests Prove Behavior
Every behavior change MUST include automated tests at the lowest useful level,
with integration or contract coverage added whenever user journeys, interfaces,
or cross-boundary behavior changes. Bug fixes MUST begin with a failing test or a
reproducible test artifact. Required tests MUST pass before merge, and any gap in
coverage MUST be justified in writing in the plan or pull request.

Rationale: tests are executable proof that the system works now and continues to
work as the codebase evolves.

### III. User Experience Consistency Is a Product Requirement
User-facing changes MUST reuse established interaction patterns, terminology,
visual conventions, and accessibility baselines unless the specification
explicitly approves a new pattern. New patterns MUST document why existing
patterns are insufficient, what migration impact they create, and where the new
pattern becomes the standard.

Rationale: consistent user experience reduces cognitive load, improves trust, and
prevents fragmented product behavior.

### IV. Performance Budgets Are Non-Negotiable
Each feature MUST define measurable performance expectations for its primary user
journey, such as latency, throughput, rendering smoothness, memory use, or cost.
Implementation choices MUST remain within those budgets or record an approved,
time-bounded exception with mitigation. Regressions against agreed budgets block
release until resolved or explicitly accepted by maintainers.

Rationale: performance failures are user-visible defects and must be treated as
first-class requirements rather than cleanup work.

### V. Technical Decisions Must Be Explicit
Plans, architecture-impacting changes, and major pull requests MUST record the
technical decisions that shaped the solution, the alternatives considered, and
the tradeoffs against these principles. Teams MUST prefer the simplest approach
that satisfies code quality, testing, user experience consistency, and
performance requirements.

Rationale: explicit decisions improve team alignment, reduce rework, and make it
possible to revisit tradeoffs with evidence instead of assumptions.

## Implementation Standards

- Specifications MUST capture applicable non-functional requirements for user
	experience consistency and performance alongside functional scope.
- Implementation plans MUST include a Constitution Check covering quality gates,
	test strategy, reused or newly introduced UX patterns, performance budgets, and
	the decision record for significant design choices.
- Task lists MUST include work for automated testing, UX verification, and
	performance validation whenever the delivered behavior changes or introduces new
	user-facing flows.
- Exceptions to any principle MUST identify the violated principle, an owner,
	mitigation, expiry date, and follow-up work needed to remove the exception.

## Decision & Review Workflow

- When principles compete, teams MUST choose the option that protects user-facing
	correctness and consistency first, then optimize within the documented
	performance budget, and record the tradeoff.
- New frameworks, architectural layers, caching strategies, asynchronous flows,
	or interface patterns MUST only be introduced when the plan explains why
	simpler existing approaches are insufficient.
- Code review MUST verify that the implementation meets all applicable quality,
	testing, UX, performance, and decision-traceability expectations before merge.
- Release readiness MUST be judged against evidence: passing quality gates,
	passing tests, UX validation results, and performance measurements.

## Governance

- This constitution governs technical decisions and implementation choices across
	the repository. When local practices conflict with it, this document takes
	precedence unless a documented exception is approved.
- Amendments require the proposed text change, a summary of affected templates and
	guidance files, maintainer approval, and synchronized artifact updates in the
	same change.
- Versioning policy follows semantic versioning: MAJOR for removed or materially
	redefined principles, MINOR for new principles or materially expanded guidance,
	and PATCH for clarifications or wording-only refinements.
- Compliance review is mandatory at planning, task generation, code review, and
	release readiness checkpoints. Each checkpoint MUST confirm alignment with code
	quality, testing, UX consistency, performance budgets, and explicit decision
	records.
- Exceptions are temporary by default. Expired exceptions are invalid and block
	further implementation work until renewed or resolved.

**Version**: 1.0.0 | **Ratified**: 2026-04-10 | **Last Amended**: 2026-04-10
