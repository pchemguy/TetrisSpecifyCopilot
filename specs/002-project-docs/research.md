# Research: Comprehensive Project Documentation

## Decision 1: Keep all deliverable docs in docs/ at repository root

- Decision: Publish all four audience-facing documents in `docs/` as `user-guide.md`, `developer-guide.md`, `reviewer-guide.md`, and `persistence-reference.md`.
- Rationale: A single location improves discoverability, avoids mixing deliverables with planning artifacts, and simplifies internal linking.
- Alternatives considered: Splitting docs between `docs/` and `specs/001-classic-tetris/` was rejected due to navigation ambiguity and maintenance overhead. Keeping all deliverables under `specs/` was rejected because that tree is reserved for Spec Kit lifecycle artifacts.

## Decision 2: Author pure Markdown only with no doc site generator

- Decision: Use plain GitHub Flavored Markdown without MkDocs, Docusaurus, or static-site pipelines.
- Rationale: The feature request explicitly asks for pure Markdown, and repository workflows already review Markdown directly in GitHub and VS Code.
- Alternatives considered: Introducing a generated documentation site was rejected as out of scope and unnecessary for current project size.

## Decision 3: Bash-only command examples across all docs

- Decision: Standardize command snippets to Bash syntax only and include a prerequisite note for Windows users requiring Git Bash or WSL.
- Rationale: Repository policy in AGENTS mandates Bash when available; a single shell target prevents command drift.
- Alternatives considered: Dual Bash/PowerShell examples were rejected because they double maintenance and increase contradiction risk.

## Decision 4: Use Mermaid for architecture and flow diagrams

- Decision: Use Mermaid flowcharts inside fenced `mermaid` blocks in the Developer Guide where diagrams are required.
- Rationale: GitHub renders Mermaid natively, preserving pure Markdown while improving readability for data flow explanations.
- Alternatives considered: ASCII diagrams were rejected as harder to maintain; prose-only was rejected because FR-012 requires a clear flow representation.

## Decision 5: Do not introduce a Markdown linter in this feature

- Decision: Keep existing linting scope unchanged (`npm run lint`) and enforce documentation quality through manual broken-link verification in reviewer flow.
- Rationale: Adding Markdown lint infrastructure is orthogonal to this feature and would expand scope beyond requested documentation production.
- Alternatives considered: Adding `markdownlint-cli` and new scripts was rejected to avoid tooling churn and out-of-scope CI changes.

## Decision 6: Treat runtime code as source-of-truth for behavior references

- Decision: Validate controls, scoring, persistence keys, and test commands against existing implementation before finalizing docs.
- Rationale: This prevents aspirational content and satisfies FR-022 accuracy requirements.
- Alternatives considered: Reusing historical documentation text without implementation checks was rejected due to high drift risk.
