---
url: https://chatgpt.com/g/g-p-69ca8410ab7c819198782233666b1069-spec-kit/c/69d94e2a-f79c-838c-b016-9c714cc1759e
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

Use a browser-based architecture with TypeScript/React for the frontend UI and HTML5 Canvas for rendering gameplay. Implement the game engine as a deterministic client-side core with no backend required. Persist user settings and transient UI state in local storage. Store structured game data such as scores, sessions, and replay records in a client-side SQLite database running in the browser via WebAssembly and persisted locally using browser storage. The application must run entirely on the client with no network service dependency.

### `speckit.tasks`

Execute

### `speckit.analyze`

Execute

### `speckit.implement`


Execute (**Pass 1**)
Execute (**Pass 2**)
