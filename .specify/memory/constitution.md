<!--
Sync Impact Report
Version change: unversioned template -> 1.0.0
Modified principles:
- [PRINCIPLE_1_NAME] -> I. Code Quality Is a Release Gate
- [PRINCIPLE_2_NAME] -> II. Tests Prove Behavior
- [PRINCIPLE_3_NAME] -> III. User Experience Must Stay Consistent
- [PRINCIPLE_4_NAME] -> IV. Performance Is Budgeted
- [PRINCIPLE_5_NAME] -> V. Technical Decisions Must Be Explicit
Added sections:
- Engineering Decision Rules
- Delivery Workflow & Quality Gates
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ✅ No files found under .specify/templates/commands/
Follow-up TODOs:
- None
-->
# TetrisSpecifyCopilot Constitution

## Core Principles

### I. Code Quality Is a Release Gate
Every production change MUST satisfy repository standards for readability,
formatting, linting, static analysis, and maintainability before merge. Public
interfaces MUST stay explicit, duplication and dead code MUST be removed when
they are touched, and complexity added for short-term convenience MUST be
rejected unless a simpler alternative is documented and ruled out. Rationale:
code quality is the cheapest place to prevent defects and long-term drag.

### II. Tests Prove Behavior
Every behavior change MUST be backed by automated tests at the lowest practical
level, with integration or contract coverage added whenever behavior crosses
component boundaries. Bug fixes MUST begin with a failing test or an equivalent
documented reproduction, and merges MUST not proceed while impacted test suites
are failing. Rationale: implemented behavior is only trustworthy when it is
demonstrated under repeatable execution.

### III. User Experience Must Stay Consistent
User-facing changes MUST preserve consistent terminology, interaction patterns,
error handling, accessibility basics, and visual behavior across the product.
Acceptance criteria MUST define expected loading, empty, success, and failure
states when they are user-visible, and any new UX pattern MUST include a clear
reason it improves on the existing standard. Rationale: consistency reduces
cognitive load and keeps features composable as the product evolves.

### IV. Performance Is Budgeted
Work that can materially affect latency, throughput, rendering smoothness, or
resource usage MUST define measurable performance expectations before
implementation. Implementations MUST stay within those budgets or record an
approved exception with mitigation and follow-up work, and performance-sensitive
changes MUST include evidence from profiling, benchmarking, or production-like
measurement proportional to the risk. Rationale: performance only improves when
teams treat it as an explicit requirement rather than a post-hoc hope.

### V. Technical Decisions Must Be Explicit
Architecture, dependency, and implementation choices MUST be justified against
code quality, testability, UX consistency, and performance expectations. Teams
MUST prefer the simplest solution that satisfies all applicable principles, and
any exception or added complexity MUST document the rejected simpler alternative,
the tradeoff being accepted, and the review approval that allowed it. Rationale:
explicit decisions prevent accidental drift and make future changes cheaper.

## Engineering Decision Rules

- Specifications MUST capture the quality constraints, automated test scope,
	user-visible states, and measurable performance expectations for the work.
- Plans MUST document the simplest viable design, identify affected shared
	patterns, and call out any dependency or architecture choice that needs
	explicit justification.
- Tasks MUST include work for automated validation, UX consistency checks, and
	performance verification whenever those concerns are in scope.
- Pull requests MUST explain how the implementation satisfies each applicable
	principle or link to an approved exception.

## Delivery Workflow & Quality Gates

- Specification review MUST reject work that lacks testable acceptance criteria,
	omits user-visible states, or leaves material performance expectations vague.
- Implementation planning MUST fail the Constitution Check until concrete quality,
	testing, UX, performance, and decision-trace gates are all addressed.
- Code review and CI MUST block merges when required tests, linting, static
	analysis, UX validations, or performance evidence are missing.
- Post-merge follow-up items created by approved exceptions MUST be tracked to
	closure in the same way as functional work.

## Governance

- This constitution is authoritative for specifications, plans, task lists,
	implementation, and review. When a proposal conflicts with a principle, the
	default action is to change the proposal rather than reinterpret the principle.
- Technical decisions MUST record how they satisfy the applicable principles in
	the relevant specification, plan, task list, or pull request. Any exception
	MUST include maintainer approval, the tradeoff being accepted, and a clear
	mitigation or follow-up plan.
- Amendments require a documented change to this file, updates to any impacted
	templates or agent guidance, and approval from repository maintainers.
- Versioning policy follows semantic versioning: MAJOR for removing or
	redefining a principle or governance rule, MINOR for adding a principle or
	materially expanding mandatory guidance, and PATCH for clarifications or other
	non-semantic refinements.
- Compliance review is mandatory for every feature specification, implementation
	plan, task list, and pull request. Unresolved constitution violations block
	approval and release.

**Version**: 1.0.0 | **Ratified**: 2026-04-10 | **Last Amended**: 2026-04-10
