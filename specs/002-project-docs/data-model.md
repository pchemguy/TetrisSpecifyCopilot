# Data Model: Comprehensive Project Documentation

## Overview

This feature models documentation artifacts as first-class deliverables. The primary
objects are document files, their required sections, command examples, and traceable
implementation references. No runtime application data schema is changed.

## Entities

### Documentation Set

- Purpose: Represents the complete deliverable set for this feature.
- Fields:
  - `version`: semantic version string for doc release iteration
  - `documents`: list of required Document entities
  - `last_verified_at`: ISO timestamp for last full validation pass
- Validation:
  - must contain exactly four required documents
  - all documents must be in `docs/`
- Relationships:
  - has many Document entities

### Document

- Purpose: A single audience-targeted Markdown document.
- Fields:
  - `id`: enum (`user-guide`, `developer-guide`, `reviewer-guide`, `persistence-reference`)
  - `path`: repository-relative path
  - `audience`: enum (`player`, `contributor`, `reviewer`, `maintainer`)
  - `status`: enum (`draft`, `review-ready`, `accepted`)
  - `owner`: role or team label
- Validation:
  - `path` must start with `docs/`
  - document must include all required sections for its `id`
- Relationships:
  - has many Section entities
  - has many Command Example entities
  - has many Implementation Reference entities

### Section

- Purpose: Defines required content blocks in each document.
- Fields:
  - `section_id`: stable identifier (for traceability)
  - `title`: visible heading text
  - `required`: boolean
  - `order`: integer display order
- Validation:
  - required sections cannot be empty
  - section order must remain deterministic per document template
- Relationships:
  - belongs to one Document

### Command Example

- Purpose: Captures executable shell commands shown in docs.
- Fields:
  - `command`: Bash command string
  - `context`: short purpose statement
  - `expected_result`: brief expected outcome
  - `platform_scope`: enum (`bash-all-platforms`)
- Validation:
  - must be valid Bash syntax
  - must correspond to an executable command in repository scripts/tools
  - must include prerequisite note for Windows Git Bash/WSL support in parent document
- Relationships:
  - belongs to one Document

### Implementation Reference

- Purpose: Links documentation claims to concrete source artifacts.
- Fields:
  - `reference_type`: enum (`file-path`, `script`, `test`, `config`)
  - `target_path`: repository-relative path
  - `claim`: statement being substantiated
- Validation:
  - `target_path` must exist in repository
  - claim text must match current behavior of referenced artifact
- Relationships:
  - belongs to one Document

### Terminology Entry

- Purpose: Enforces consistent naming for user-facing terms.
- Fields:
  - `term`: canonical term (e.g., tetromino, hard drop)
  - `definition`: plain-language explanation
  - `source`: origin of truth (UI label, engine concept, existing doc)
- Validation:
  - canonical term must be used consistently across all documents
  - synonyms requiring deviation must be explicitly mapped
- Relationships:
  - shared across all Document entities

## Required Document Section Sets

- `user-guide`: prerequisites, install, launch, controls, scoring, persistence, troubleshooting
- `developer-guide`: setup, script reference, architecture, directory map, data flow (Mermaid + prose), testing strategy, quality expectations
- `reviewer-guide`: linear validation checklist, expected outputs, offline verification steps
- `persistence-reference`: localStorage keys, SQLite tables/columns, seed data invariants, failure/recovery notes

## State Transitions

- Document lifecycle: `draft -> review-ready -> accepted`
- Documentation Set lifecycle: `incomplete -> complete -> verified`

## Consistency Rules

- All four documents must reference identical control names and scoring values.
- Commands listed in reviewer and developer docs must match exactly.
- Any persistence claim must trace to either `src/persistence/` code or existing validated project docs.
