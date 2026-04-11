---
url: https://chatgpt.com/g/g-p-69ca8410ab7c819198782233666b1069-spec-kit/c/69d94e2a-f79c-838c-b016-9c714cc1759e
ide: VS Code
agent: Copilot
framework: Spec Kit
model: GPT-5.4 - High
note: The same model is used for all steps.
shell: Bash
environment: pchemguy/LLM-CLI
agent_local: "true"
agent_approval_mode: selective
---

### `speckit.constitution`

Create principles focused on code quality, testing standards, user experience consistency, and performance requirements. Include governance for how these principles should guide technical decisions and implementation choices.

### `speckit.specify`

#### V1

Create a classic Tetris game with the standard falling block mechanics: random tetromino generation, movement left/right, soft drop, hard drop, rotation, line clearing, scoring, increasing speed by level, next-piece preview, hold piece, pause/resume, game over detection, and restart. Include keyboard controls and a responsive game UI showing the playfield, score, level, lines cleared, next piece, and held piece. Preserve classic gameplay rules and make behavior deterministic where practical. Include sample assets or seed data as needed to demonstrate the full experience.

#### V2

Implement the feature specification based on the updated constitution. I want to build a browser-based classic Tetris game. The game must implement standard tetromino shapes, randomized piece generation, horizontal movement, rotation, soft drop, hard drop, line clearing, scoring, level progression, speed increase, next-piece preview, hold-piece support, pause/resume, restart, and game-over handling. The UI must display the board, active piece, ghost piece, score, level, cleared lines, next piece, and held piece, with keyboard controls suitable for desktop play. Include persistence for best score and provide sample data or configuration so the game can be exercised immediately.

#### V3

Implement the feature specification based on the updated constitution. I want to build a browser-based single-player Tetris game inspired by classic modern implementations. Use a 10x20 visible board, the 7 standard tetrominoes, 7-bag randomization, wall kicks, ghost piece, hold piece, next queue, soft drop, hard drop, line clearing, combo-free classic scoring, level-based gravity increase, pause/resume, restart, and game-over detection when pieces cannot spawn. The UI must show the playfield, score, level, total cleared lines, next queue, held piece, and high score. Support keyboard controls for move, rotate, soft drop, hard drop, hold, pause, and restart. Include a REST API only if needed for storing scores or replay/session data. Include sample configuration and demo data so the game can be run and evaluated immediately.

### `speckit.clarify`

Execute

### `speckit.plan`

#### TypeScript

##### V1

Use a browser-based architecture with HTML5 Canvas for rendering and TypeScript/React for the frontend game UI. Implement the game engine as a deterministic client-side core with no backend required for the base version. Persist high scores and user settings in local storage. Package the app for local development and deployment with Docker.

##### V2

Use a lightweight browser-based architecture with TypeScript and HTML5 Canvas. Keep all game logic on the client side with no backend or database. Store high scores locally in browser storage and package the app for local development with Docker.

#### No Java

**Python**  
Use **FastAPI** if you want a modern REST backend with low ceremony and strong API ergonomics. FastAPI is positioned as a modern, high-performance Python framework for APIs, and its docs emphasize production deployment and Docker-based deployment paths.

**Node.js / TypeScript**  
Use **Express** if you want the simplest, most minimal backend. Express describes itself as a fast, minimalist framework for Node.js, and its starter docs show the very small setup footprint.

Use **NestJS** if you want a more structured, enterprise-style TypeScript backend. NestJS describes itself as a scalable Node.js framework with first-class TypeScript support, modular structure, and OpenAPI integration.

**C# / .NET**  
Use **ASP.NET Core** if you like strongly typed backend development but do not want Java. Microsoft describes ASP.NET Core as a cross-platform, high-performance, open-source framework for modern web apps and services.

For your Tetris case, the cleanest non-Java choices are usually:

- **Frontend-only:** React + TypeScript + Canvas, no backend at all
- **Light backend:** React + TypeScript frontend, **FastAPI** backend, PostgreSQL if you need scores/replays
- **TypeScript full stack:** React frontend, **NestJS** backend, PostgreSQL
- **Minimal Node backend:** React frontend, **Express** backend, PostgreSQL

For a Tetris project, use **React + TypeScript only** unless you specifically need leaderboards, accounts, replays, or analytics. If you do need a backend, **FastAPI** is usually the simplest non-Java replacement, while **NestJS** is the best fit if you want a more structured TypeScript stack.

##### Python

Use FastAPI for the backend, React for the frontend, PostgreSQL for storing scores and game sessions, and Docker Compose for local development and deployment.

##### TypeScript

Use NestJS for the backend, React for the frontend, PostgreSQL for storing scores and game sessions, and Docker Compose for local development and deployment.

##### Extra

Use Express for the backend, React for the frontend, PostgreSQL for storing scores and game sessions, and Docker Compose for local development and deployment.

#### SQLite (local or lightweight backend)

**SQLite is a file-based relational database.**

Use it if you introduce even a minimal backend.

**Typical usage patterns:**

- FastAPI / Node backend → SQLite file
- Electron / desktop wrapper → SQLite embedded
- Local server for development → SQLite

**Best for:**

- Leaderboards (local or small-scale)
- Game sessions / replays
- Structured queries

**Hybrid (recommended in many cases)**

Use:

- **localStorage** → fast client-side state
- **SQLite (backend)** → persistence + analytics

Example split:

- localStorage → current run, settings
- SQLite → scores, sessions, replays

##### V1

Use a browser-based architecture with TypeScript and HTML5 Canvas for rendering. Keep all game logic client-side with no backend. Persist high scores and settings using browser local storage. Package for local development with Docker.

##### V2 

Use a lightweight backend (FastAPI or Node.js) with SQLite for storing scores and game sessions. Implement the frontend in React with HTML5 Canvas. Use Docker Compose for local development.

##### V3

Use a browser-based frontend with TypeScript and HTML5 Canvas for gameplay. Persist user settings and transient state in local storage. Use a lightweight backend with SQLite to store scores, sessions, and replay data. Package with Docker Compose for local development.

#### Local

##### V1

Use a browser-based architecture with TypeScript/React for the frontend UI and HTML5 Canvas for rendering gameplay. Implement the game engine as a deterministic client-side core with no server dependency. Persist user settings and lightweight client state in local storage. Use a client-side SQLite database, running in the browser via WebAssembly and persisted locally in browser storage, to store scores, sessions, and replay data. Keep the application fully local, with no remote backend or external database service required.

##### V2

Create a plan for the spec. Use a browser-based architecture with TypeScript/React for the frontend UI and HTML5 Canvas for rendering gameplay. Implement the game engine as a deterministic client-side core with no backend required. Persist user settings and transient UI state in local storage. Store structured game data such as scores, sessions, and replay records in a client-side SQLite database running in the browser via WebAssembly and persisted locally using browser storage. The application must run entirely on the client with no network service dependency.

### `speckit.checklist`

Execute

### `speckit.tasks`

Execute

### `speckit.analyze`

Execute

#### Analysis and Resolution Workflow (ARW)

##### Protocol

The full ARW protocol involves the following stages:

0. Current state assessment.
1. Analysis of current feature and project-level artifacts, leading to generation of an analysis report including a detailed account of all findings.
2. Preliminary analysis of every identified issue with the goal to determine if user input is required for optimal resolution, leading to generation of clarification form, if user input is deemed necessary. In such a case, agent shall "switch" to interactive mode, presenting the user with each issue that requires clarifications and either suggest options, if possible, or ask for open-ended input. User answers shall be recorded to the clarification form file next to associated questions, completing it.
3. Preparation of a detailed actionable resolution plan, taking into account the completed clarification form, if appropriate, for resolving/fixing all identified issues. The resolution plan must be grounded in governing artifacts and include detailed specific traceability information for each issue.
    - a) Verify that every identified issue recorded to analysis report is covered in the resolution plan and that any user input from the  clarification form is also taken into account.
    - b) If any gaps have been identified, extend the resolution plan to address them and repeat steps a)-b) until no more gaps found in step a).
4. Perform resolution of all identified issues according to the created resolution plan and complete associated resolution report.
5. Committing changes.

The protocol should use

- state awareness at start
- artifact and subspace naming conventions
- lock-file-based recovery provisions
- smart changes committing process

described below.

##### Naming Convention

Each feature (identified as a set of artifacts under a `spec/` feature subdirectory, e.g., `spec/user-auth/`) may include multiple ARW rounds, with each spanning one or multiple runs of the `speckit.analyze` command. Each ARW round is expected to create associated artifacts under a subspace `spec/<feature_name>/analyses/<###>/` directory, where `###` is a three-digit sequential number identifying a particular ARW round. The primary artifacts to be created include:

| Step | Artifact                        | Required | Description                                                                                                                                                |
| ---- | ------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `analysis-report.md`            | Yes      | Detailed analysis account of findings of the analysis performed.                                                                                           |
| 2    | `analysis-QA-form.md`           | No       | Resolution clarification form. This artifact is required, if the agent determines that user input is required for optimal resolution of discovered issues. |
| 3    | `analysis-resolution-plan.md`   | Yes      | Detailed actionable resolution plan to be executed by an agent.                                                                                            |
| 4    | `analysis-resolution-report.md` | Yes      | Detailed resolution report.                                                                                                                                |

A special subspace `CUR` (`spec/<feature_name>/analyses/CUR/`) is used for hosting artifacts of the current analysis. This directory is created at the beginning if agent determines that there is no incomplete ARW round.

##### Lock File Policy

Before creating any artifact, the agent must create a lock file `<artifact_name>.LOCK` (e.g., `analysis-report.LOCK`). The LOCK file is deleted only after the artifact is considered to be completed. The primary artifacts listed in the table in Naming Conventions are created sequentially at subsequent stages. Each artifact should be edited only during its corresponding stage. Once the stage is completed, the associated artifact is complete and the associated `LOCK`  file must be removed before creating the `LOCK` file for the artifact of the subsequent stage. Two `LOCK` files should never exist within `spec/<feature_name>/analyses/CUR/`.

##### State Analysis at Start

At the start of execution of the `speckit.analyze` command, agent must determine whether there is an incomplete ARW round by checking for `spec/<feature_name>/analyses/CUR/` directory.

- If such directory exist, it contains artifacts of an incomplete ARW round. The agent must analyze its contents and decide on which step of the Protocol needs to be executed next. Specifically, the agent should identify which `LOCK` file exist and match its name against the table of the primary artifacts. The associated stage should be considered incomplete and agent should resume it, reading associated incomplete artifact, if available, or starting the stage from scratch otherwise.
- If such directory does not exist, agent must
    - commit any uncommitted changes made to files under `spec/<feature_name>/analyses/`
    - create `spec/<feature_name>/analyses/CUR/` for the new ARW round
        - Note, if `spec/<feature_name>/analyses/` does not exist, it should be silently created.
    - proceed to performing the full Protocol.

##### Committing Completed ARW Round

Once current ARW round is complete, agent must

- make sure that `spec/<feature_name>/analyses/CUR/` contains no remaining `*.LOCK` files 
- determine the next available numbered directory following the last `spec/<feature_name>/analyses/###/` 
- rename `spec/<feature_name>/analyses/CUR/` to the next available numbered directory
- commit changes.

### `speckit.implement`


Execute (**Pass 1**)
Execute (**Pass 2**)
