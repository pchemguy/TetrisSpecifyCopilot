---
url: https://chatgpt.com/g/g-p-69db58392fb48191849a03dcc4483741-tetrisspeckitcopilotreacttypescriptnodejs/c/69dc7f2f-60ac-8386-9cff-d188a454d6d2
---

# Seed Prompt - Packaging Web App

Given tech stack

```
Frontend

* React 19
* React DOM 19
* TypeScript 6

Persistence

* SQLite (client-side)

Build and dev server

* Vite 8
* `@vitejs/plugin-react`

Runtime / architecture

* ESM project (`"type": "module"`)
* Browser app
* Client-side SQLite via `sql.js` rather than a server database 
```

I am looking for a simpl and robust approach to turn this web app into a packaged desktop app with crossplatform compatibility, but present focus on Windows. It must be well suitable for agentic development on Windows/Conda/VS Code/Git Bash/Coding Agents. I tried Tauri, but implementation was pain and even the simplest persistence was not implemented.

---
---

# Electron Packaging Baseline

**Electron + Vite + React + TypeScript + `sql.js`**, with a disciplined architecture that keeps the app mostly a browser app and uses Electron only as a thin desktop shell.

Why this fits your situation:

* **Best Windows ergonomics** for agentic development.
  Electron is JavaScript/TypeScript-first, so agents stay in one ecosystem instead of crossing into Rust tooling, Cargo config, Tauri permissions, and IPC patterns.
* **Minimal architectural disruption**.
  Your app is already a browser app. Electron wraps that model directly.
* **Lowest friction in VS Code / Git Bash / Conda**.
  Node-based tooling is much easier to reason about in this environment than mixed Rust + JS + native toolchain workflows.
* **Persistence can stay simple**.
  If you already use `sql.js`, you can continue using it. On desktop, you can persist the SQLite database file to disk through a tiny Electron preload/main bridge.
* **Cross-platform later is realistic**.
  Electron packaging for Windows/macOS/Linux is mature. Windows-first is especially common.

## Recommendation hierarchy

### 1. Recommended now: Electron

Use this unless you have a hard requirement for tiny binaries or native-Rust integration.

Best match for:

* current web architecture
* agentic coding
* Windows-first delivery
* reducing implementation pain

### 2. Possible alternative: Neutralinojs

This is lighter than Electron and simpler than Tauri in some cases, but it is less mainstream and less battle-tested for richer app workflows. I would only choose it if minimizing bundle size is more important than ecosystem maturity.

### 3. Not recommended for your present focus: Tauri

Tauri is attractive on paper, but if even trivial persistence became painful, that is already telling you the total cost is too high for this project context. For agentic iteration on Windows, that friction matters more than theoretical elegance.

### 4. Not recommended here: Capacitor

Good for hybrid/mobile-style packaging, but for a desktop-first local app it is not the cleanest fit.

---

## The core design choice

You have two viable persistence models under Electron.

### Option A — Keep `sql.js`

This is probably the best transitional move.

How it works:

* renderer loads the DB into memory via `sql.js`
* on startup, Electron main/preload reads a `.sqlite` file from app data directory
* renderer gets the bytes and opens them with `sql.js`
* after writes or at checkpoints, renderer exports DB bytes
* Electron saves bytes back to disk

Advantages:

* keeps your existing app logic almost unchanged
* no server process
* no native SQLite module compilation headaches
* agents can stay focused on TypeScript

Tradeoff:

* full-db export/writeback semantics
* acceptable for small/local desktop apps, settings, scores, sessions, replay data

For your described app, this is likely completely fine.

### Option B — Move to a native SQLite binding later

Examples would be `better-sqlite3` in the Electron main process.

Advantages:

* stronger “real desktop database” model
* direct file-backed DB
* cleaner for larger datasets or more frequent writes

Tradeoff:

* native module concerns
* rebuild/install friction on Windows
* more moving parts for agents

Given your experience and priorities, I would start with **Option A**.

---

## Recommended architecture

Keep strict separation:

### Renderer

* React app
* UI state
* domain logic
* `sql.js` database usage
* no direct Node access

### Preload

Expose a tiny safe API:

* `loadDatabase(): Uint8Array | null`
* `saveDatabase(bytes: Uint8Array): Promise<void>`
* `getAppInfo()`
* maybe `selectExportPath()` later

### Main

* window creation
* app data path management
* file I/O for DB bytes
* packaging concerns

This keeps Electron boring, which is exactly what you want.

---

## Why Electron is better for coding agents

Agents perform better when:

* there is **one dominant language**
* the boundary between UI and desktop shell is obvious
* errors are easy to reproduce locally
* scaffolding/tools are common and well-documented

Electron wins on all four here.

With Tauri, agents often get dragged into:

* Rust setup
* Cargo manifests
* permission config
* IPC command plumbing
* OS-specific path/security quirks
* frontend/backend coordination across two ecosystems

That is manageable for experienced humans, but not ideal when your explicit goal is smooth agentic iteration on Windows.

---

## Suggested stack refinement

I would package the desktop version with:

* **Electron**
* **electron-vite** or plain **Vite + Electron** scripts
* **electron-builder** for Windows packaging
* your existing:
    * React 19
    * React DOM 19
    * TypeScript
    * Vite
    * `sql.js`

If you want the most conservative mainstream route:

* Vite for renderer
* plain Electron entrypoints
* `electron-builder` for packaging

If you want slightly cleaner dev ergonomics:

* `electron-vite`

For agent friendliness, I would lean toward **plain Electron + Vite** unless you specifically want the helper abstraction. Fewer magic layers is often better for autonomous coding.

---

## Practical implementation shape

Project structure could look like this:

```text
project/
  src/
    app/                  # React renderer app
    domain/               # pure app/domain logic
    persistence/          # sql.js wrappers used by renderer
  electron/
    main.ts               # Electron main process
    preload.ts            # secure bridge
  public/
  dist/
  package.json
  vite.config.ts
  tsconfig.json
```

Keep your domain and persistence code independent from Electron where possible.

That gives you:

* browser mode for fast web development
* desktop shell for packaged app
* less lock-in

---

## Persistence pattern I recommend

Use a single database file in the user data directory.

On Windows that would live under Electron’s `app.getPath("userData")`.

Flow:

1. app starts
2. main process checks whether DB file exists
3. preload returns file bytes or null
4. renderer initializes `sql.js`
5. renderer creates schema if needed
6. renderer periodically exports DB
7. preload/main writes bytes atomically

For robustness, save using:

* temp file
* flush/close
* rename to target

That avoids simple corruption cases.

---

## Development workflow on Windows

This setup is usually smooth with:

* Conda shell
* Git Bash
* VS Code
* Node installed normally, or via a version manager outside Conda

My recommendation:

* use **Node outside Conda**
* use Conda only if your project also needs Python tooling

Why:

* Electron and frontend JS tools do not benefit much from Conda
* native module edge cases can get weirder inside Conda-managed Node environments
* simpler shell/toolchain assumptions help agents

A practical Windows setup:

* Git Bash available
* Node LTS installed
* npm or pnpm
* VS Code
* Conda optional, not the source of Node

If you insist on Conda for Node, it can work, but I would not make it the primary packaging/runtime assumption.

---

## Packaging recommendation

For Windows-first packaging:

* build renderer with Vite
* package with **electron-builder**
* target NSIS installer or portable EXE

I would start with:

* **portable EXE** for fast internal testing
* move to **NSIS installer** when ready for user-facing installation

That keeps early iteration simple.

---

## Concerns you may have

### “Electron is heavy”

Yes. But for a local React desktop app, the productivity gain is often worth it, especially under agentic workflows.

### “Will cross-platform still be okay?”

Yes. Electron is one of the most established cross-platform desktop shells. Windows-first does not block Linux/macOS later.

### “Can I stay offline/local-only?”

Yes. Very naturally.

### “Can I preserve browser mode too?”

Yes, and I recommend it. Keep the renderer runnable as a pure web app for faster dev/testing.

---

## Concrete recommendation

I would choose this exact path:

**Electron shell + preload bridge + existing React/Vite app + `sql.js` persisted to a file in Electron userData.**

That gives you:

* low conceptual overhead
* high Windows compatibility
* minimal rewrite from current stack
* good fit for coding agents
* a clear migration path later to native SQLite if needed

## What I would avoid

I would avoid, for now:

* Tauri
* native SQLite bindings unless you truly need them now
* forcing Node/Electron fully through Conda
* mixing too much desktop-specific logic into the renderer

## Decision summary

If your priority order is:

1. simple
2. robust
3. cross-platform
4. Windows-friendly
5. agent-friendly

then **Electron is the right answer**.

---
---

# Minimal Reference Architecture for Electron + Vite + React + `sql.js`

Use this as the baseline.

## Target direction

Keep the app as a normal Vite/React browser app, and add a very thin Electron shell around it.

Do not redesign around Electron. Treat Electron as:

* window bootstrap
* file persistence bridge
* packaging layer

Everything else should stay in TypeScript in your existing app.

---

## Recommended baseline stack

Add:

* `electron`
* `electron-builder`
* optionally `concurrently`
* optionally `wait-on`

Keep:

* React
* React DOM
* TypeScript
* Vite
* `sql.js`

I would avoid extra abstraction layers at first. Plain Electron is easier for agents to reason about.

---

## Project shape

Use a structure like this:

```text
your-app/
  electron/
    main.ts
    preload.ts
  src/
    app/
    domain/
    persistence/
    platform/
  public/
  dist/
  dist-electron/
  package.json
  tsconfig.json
  tsconfig.electron.json
  vite.config.ts
```

Suggested intent:

* `src/domain/`: pure app logic
* `src/persistence/`: `sql.js` DB wrapper, schema init, repository functions
* `src/platform/`: runtime adapters, detect browser vs Electron
* `electron/main.ts`: app window, file paths, save/load
* `electron/preload.ts`: secure bridge

---

## The key architectural rule

Do not let renderer code call Node APIs directly.

Use:

* `contextIsolation: true`
* `nodeIntegration: false`
* preload bridge only

That keeps the desktop shell contained and safer, and gives agents a clean API boundary.

---

## Minimal runtime model

### In browser mode

* DB lives in IndexedDB or localStorage-backed export blob fallback
* useful for fast dev and testing

### In Electron mode

* DB file lives under Electron user data directory
* renderer loads bytes through preload
* renderer uses `sql.js`
* renderer exports bytes after writes
* main process saves bytes to disk

This lets one app support both browser and desktop cleanly.

---

## Minimal Electron main process

`electron/main.ts`

```ts
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

const isDev = !app.isPackaged;

function getDatabasePath(): string {
  return path.join(app.getPath("userData"), "app.sqlite");
}

async function loadDatabaseFile(): Promise<Uint8Array | null> {
  const dbPath = getDatabasePath();
  if (!existsSync(dbPath)) {
    return null;
  }

  const buffer = await fs.readFile(dbPath);
  return new Uint8Array(buffer);
}

async function saveDatabaseFile(data: Uint8Array): Promise<void> {
  const dbPath = getDatabasePath();
  const tempPath = `${dbPath}.tmp`;

  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(tempPath, data);
  await fs.rename(tempPath, dbPath);
}

async function createMainWindow(): Promise<void> {
  const window = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist-electron", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    await window.loadURL("http://localhost:5173");
    window.webContents.openDevTools();
  } else {
    await window.loadFile(path.join(app.getAppPath(), "dist", "index.html"));
  }
}

app.whenReady().then(async () => {
  ipcMain.handle("db:load", async () => {
    return await loadDatabaseFile();
  });

  ipcMain.handle("db:save", async (_event, data: Uint8Array) => {
    await saveDatabaseFile(data);
  });

  await createMainWindow();

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
```

---

## Minimal preload bridge

`electron/preload.ts`

```ts
import { contextBridge, ipcRenderer } from "electron";

export interface DesktopApi {
  loadDatabase: () => Promise<Uint8Array | null>;
  saveDatabase: (data: Uint8Array) => Promise<void>;
  isDesktop: true;
}

const desktopApi: DesktopApi = {
  loadDatabase: async () => {
    const result = await ipcRenderer.invoke("db:load");
    return result as Uint8Array | null;
  },
  saveDatabase: async (data: Uint8Array) => {
    await ipcRenderer.invoke("db:save", data);
  },
  isDesktop: true,
};

contextBridge.exposeInMainWorld("desktopApi", desktopApi);
```

Add a global typing file, for example `src/vite-env.d.ts` or `src/types/global.d.ts`:

```ts
import type { DesktopApi } from "../../electron/preload";

declare global {
  interface Window {
    desktopApi?: DesktopApi;
  }
}

export {};
```

---

## Renderer-side platform adapter

Do not scatter `window.desktopApi` checks all over the app.

Create one adapter.

`src/platform/runtime.ts`

```ts
export function isDesktopRuntime(): boolean {
  return typeof window !== "undefined" && !!window.desktopApi?.isDesktop;
}

export async function loadDatabaseBytes(): Promise<Uint8Array | null> {
  if (!isDesktopRuntime()) {
    return null;
  }
  return await window.desktopApi!.loadDatabase();
}

export async function saveDatabaseBytes(data: Uint8Array): Promise<void> {
  if (!isDesktopRuntime()) {
    return;
  }
  await window.desktopApi!.saveDatabase(data);
}
```

---

## `sql.js` persistence wrapper

`src/persistence/database.ts`

```ts
import initSqlJs, { Database, SqlJsStatic } from "sql.js";
import { loadDatabaseBytes, saveDatabaseBytes } from "../platform/runtime";

let sql: SqlJsStatic | null = null;
let db: Database | null = null;

async function getSql(): Promise<SqlJsStatic> {
  if (sql) {
    return sql;
  }

  sql = await initSqlJs({
    locateFile: (file) => `/node_modules/sql.js/dist/${file}`,
  });

  return sql;
}

export async function openDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  const SQL = await getSql();
  const bytes = await loadDatabaseBytes();

  db = bytes ? new SQL.Database(bytes) : new SQL.Database();
  initializeSchema(db);

  return db;
}

export function initializeSchema(database: Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS scores (
      score_id INTEGER PRIMARY KEY,
      player_name TEXT NOT NULL,
      score_total INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      session_id TEXT PRIMARY KEY,
      started_at TEXT NOT NULL,
      ended_at TEXT
    );

    CREATE TABLE IF NOT EXISTS replays (
      replay_id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      payload_json TEXT NOT NULL
    );
  `);
}

export async function persistDatabase(): Promise<void> {
  if (!db) {
    return;
  }

  const bytes = db.export();
  await saveDatabaseBytes(bytes);
}

export async function transact<T>(fn: (database: Database) => T): Promise<T> {
  const database = await openDatabase();
  database.exec("BEGIN");
  try {
    const result = fn(database);
    database.exec("COMMIT");
    await persistDatabase();
    return result;
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}
```

---

## Important note on `sql.js` asset loading

The `locateFile` path above is often the annoying part.

For robustness, copy the `sql.js` wasm asset into your public or build output explicitly instead of depending on node_modules-relative paths at runtime.

A cleaner approach is:

* place/copy `sql-wasm.wasm` into `public/`
* set `locateFile: () => "/sql-wasm.wasm"`

That is usually much less brittle.

So the better production-safe version is:

```ts
sql = await initSqlJs({
  locateFile: () => "/sql-wasm.wasm",
});
```

Then make sure `public/sql-wasm.wasm` exists.

This is one of the few places where agent instructions should be explicit.

---

## Vite config

Your Vite config can stay mostly normal.

`vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
```

---

## Electron TypeScript config

Create `tsconfig.electron.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist-electron",
    "module": "ESNext",
    "target": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "types": ["node", "electron"],
    "noEmit": false
  },
  "include": ["electron/**/*.ts"]
}
```

You may later decide to bundle Electron code with esbuild/tsup, but plain `tsc` output is enough to start.

---

## `package.json` shape

A practical baseline:

```json
{
  "name": "your-app",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev:web": "vite",
    "build:web": "vite build",
    "build:electron": "tsc -p tsconfig.electron.json",
    "dev:electron": "electron .",
    "dev": "concurrently -k \"vite\" \"wait-on tcp:5173 && tsc -p tsconfig.electron.json && electron .\"",
    "build": "npm run build:web && npm run build:electron",
    "dist:win": "npm run build && electron-builder --win portable",
    "dist:win:nsis": "npm run build && electron-builder --win nsis"
  },
  "build": {
    "appId": "com.example.yourapp",
    "files": [
      "dist/**",
      "dist-electron/**",
      "package.json"
    ],
    "directories": {
      "buildResources": "build"
    }
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "concurrently": "^9.0.0",
    "electron": "^36.0.0",
    "electron-builder": "^25.0.0",
    "typescript": "^5.0.0",
    "vite": "^8.0.0",
    "wait-on": "^8.0.0"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sql.js": "^1.13.0"
  }
}
```

Version numbers here are illustrative. Pin them to what you actually want.

---

## Windows-first workflow

For your environment, I would standardize this:

* Git Bash as shell
* Node LTS installed normally on Windows
* npm or pnpm
* VS Code
* Conda optional for Python-only project utilities, not primary Node runtime

That matters because Electron packaging is smoother when Node is not buried inside Conda.

### Practical rule

Use Conda for:

* Python tooling
* docs automation
* auxiliary scripts

Use native Windows Node for:

* Vite
* Electron
* packaging

That separation reduces weird agent failures.

---

## Suggested agent-facing constraints

Put these into your root `AGENTS.md` or equivalent.

### Environment rules

* On Windows, prefer Git Bash if `bash --version` succeeds.
* Do not mix PowerShell and Bash commands in one workflow.
* Use Node from the standard Windows installation, not Conda-managed Node, unless explicitly required.

### Architecture rules

* Keep React renderer independent of Electron internals.
* Access desktop features only through `window.desktopApi`.
* Do not import `electron` from renderer code.
* Keep persistence schema and repository logic in `src/persistence`.
* Treat Electron main/preload as thin adapters only.

### Persistence rules

* Database format is SQLite via `sql.js`.
* On desktop, persist DB bytes to a file under Electron user data.
* Save atomically via temp file + rename.
* Do not introduce a backend server.

These constraints help agents avoid turning the project into a mixed, tangled desktop app.

---

## What this buys you immediately

Compared with Tauri, this gives you:

* no Rust
* no Cargo
* no Tauri permissions/config maze
* easier local debugging
* easier persistence
* fewer cross-toolchain failures for agents

That is exactly the trade you want.

---

## One thing I would do from day one

Support both runtimes:

* `npm run dev:web` for pure browser dev
* `npm run dev` for desktop shell dev

That way:

* most UI/domain work happens faster in browser mode
* Electron is only used when testing desktop-specific behavior

This is a major quality-of-life improvement for both humans and agents.

---

## Upgrade path later

If later you decide `sql.js` is too limited, migrate persistence behind the same repository interface.

That means:

* today: renderer uses `sql.js`
* later: main process uses `better-sqlite3` and preload exposes repository methods

Do not start there unless you need it. The current goal is simple and robust.

---

## My actual recommendation

Implement in this order:

1. add Electron shell with `main.ts` and `preload.ts`
2. expose `loadDatabase` / `saveDatabase`
3. keep `sql.js`
4. persist exported DB bytes to user data path
5. package Windows portable build first
6. only then add installer generation

This is the lowest-friction path from your current web app to a working desktop app.

---
---

# Phased Implementation Plan Optimized for Small Testable Commits

Below is a phased plan optimized for **small, testable commits** and for **agentic execution on Windows**. The sequencing keeps Electron-specific changes thin, preserves the browser app as the main product, and introduces persistence in narrow slices.

## Outcome target

By the end, you should have:

* the existing React/Vite app still runnable in browser mode
* an Electron desktop shell for Windows
* `sql.js` persistence to a real desktop file
* portable Windows packaging first
* installer packaging second
* clear commit boundaries and rollback points

---

## Guiding constraints

Keep these invariant throughout the implementation:

* renderer remains a browser-style app
* no direct Node/Electron imports in renderer code
* Electron used only for shell and file I/O bridge
* persistence stays on `sql.js` for now
* each commit leaves the project buildable or at least internally coherent
* prefer adding structure before behavior

---

## Phase 0 — Establish baseline and guardrails

### Goal

Freeze the current web app as the known-good baseline before introducing desktop concerns.

### Commit 0.1

**Create desktop packaging design note**

Add a short repo doc, for example:

* `docs/desktop-architecture.md`

Content:

* Electron selected over Tauri
* renderer/main/preload separation
* `sql.js` retained
* browser mode remains supported
* desktop persistence is file-backed via Electron bridge

### Test

* no functional change
* doc reviewed for architecture clarity

### Commit 0.2

**Add agent/dev rules for desktop boundary**

Update `AGENTS.md` or equivalent with explicit rules:

* no `electron` imports in `src/`
* desktop access only through preload bridge
* Node runtime should be standard Windows Node, not Conda-managed Node unless explicitly required
* Git Bash preferred if available
* browser mode must continue to work

### Test

* no functional change
* constraints made explicit for future agent work

This phase is valuable because it prevents later architectural drift.

---

## Phase 1 — Prepare the project for dual runtime

### Goal

Introduce runtime abstraction before Electron exists.

### Commit 1.1

**Add platform/runtime adapter skeleton**

Create something like:

* `src/platform/runtime.ts`

Initial behavior:

* exports `isDesktopRuntime(): boolean`
* always returns `false` for now, or checks for an as-yet-undefined bridge
* exports no-op `loadDatabaseBytes()` / `saveDatabaseBytes()` placeholders

Example intent:

* establish the boundary now
* do not yet wire Electron

### Test

* browser app still builds and runs
* no behavior change

### Commit 1.2

**Refactor persistence entrypoint to use adapter boundary**

If persistence code already touches storage assumptions directly, move those assumptions behind `src/platform/runtime.ts`.

Even if desktop behavior is still stubbed, refactor to establish:

* one place where persistence loads initial DB bytes
* one place where persistence saves exported DB bytes

### Test

* browser app still runs
* no regression in existing persistence behavior

This is the first meaningful “architecture-only” phase. It makes Electron integration much easier.

---

## Phase 2 — Add Electron shell with no persistence

### Goal

Launch the existing app in an Electron window, but do nothing else yet.

### Commit 2.1

**Add Electron dependencies and config**

Add:

* `electron`
* `electron-builder`
* optionally `concurrently`
* optionally `wait-on`

Add:

* `electron/main.ts`
* `electron/preload.ts`
* `tsconfig.electron.json`
* package scripts for web and desktop dev/build

Do not implement bridge functionality yet beyond a simple marker.

### Test

* `npm run dev:web` still works
* TypeScript config for Electron compiles

### Commit 2.2

**Create minimal Electron main window**

Implement:

* BrowserWindow creation
* load Vite dev server in dev
* load built `dist/index.html` in production
* preload path configured
* `contextIsolation: true`
* `nodeIntegration: false`

### Test

* desktop window launches
* React app renders inside Electron
* browser mode still works

### Commit 2.3

**Expose minimal desktop marker via preload**

Preload exports only:

* `isDesktop: true`

Renderer runtime adapter now detects desktop via `window.desktopApi?.isDesktop`

### Test

* browser mode reports non-desktop
* Electron mode reports desktop
* no persistence yet

This phase is a major milestone: the app runs as desktop without introducing file I/O complexity.

---

## Phase 3 — Add typed preload boundary

### Goal

Make the desktop API explicit and typed before introducing database file behavior.

### Commit 3.1

**Add global typing for preload API**

Add:

* `src/types/global.d.ts` or equivalent

Type only the current preload surface:

* `isDesktop`
* placeholder signatures for `loadDatabase` / `saveDatabase`

Even if not implemented yet, define the contract now.

### Test

* TypeScript passes
* renderer consumes typed `window.desktopApi`

### Commit 3.2

**Add no-op IPC handlers for DB load/save**

In main:

* register `ipcMain.handle("db:load", ...)`
* register `ipcMain.handle("db:save", ...)`

Initially:

* `db:load` returns `null`
* `db:save` resolves without writing

In preload:

* expose `loadDatabase()` and `saveDatabase()`

### Test

* Electron app starts
* renderer can call bridge without crashing
* browser mode unaffected

This is a very good commit boundary because the IPC plumbing exists before real file persistence.

---

## Phase 4 — Introduce real desktop file persistence

### Goal

Persist `sql.js` DB bytes to disk through Electron, with minimal scope.

### Commit 4.1

**Implement userData database path and file load**

In main:

* compute DB file path under `app.getPath("userData")`
* implement `db:load` to read existing file and return bytes
* return `null` if file does not exist

Do not implement save yet.

### Test

* existing Electron app still starts
* calling `loadDatabase()` returns `null` on clean install
* no crash if file missing

### Commit 4.2

**Implement atomic database save**

In main:

* implement `db:save`
* save to temp file first
* rename temp file to final DB path

### Test

* save call creates file under userData
* repeated saves overwrite cleanly
* browser mode unaffected

### Commit 4.3

**Wire renderer `sql.js` open flow to desktop byte load**

In renderer persistence layer:

* initialize `sql.js`
* if desktop bytes exist, open DB from bytes
* else create empty DB
* initialize schema after open

### Test

* Electron mode starts with empty DB on first run
* existing DB can be reopened on next run
* browser mode still builds and runs

### Commit 4.4

**Persist DB after write operations**

After mutating operations:

* export DB bytes
* call `saveDatabaseBytes()`

Do not over-optimize yet. Simple save-after-transaction is fine.

### Test

* create/update some persistent record
* close app
* reopen app
* confirm record still exists

This is the first fully end-to-end persistence milestone.

---

## Phase 5 — Stabilize persistence semantics

### Goal

Make save behavior robust enough for real use before packaging.

### Commit 5.1

**Centralize persistence through transaction helper**

Add a helper like:

* `transact(fn)`
* `BEGIN`
* run mutation
* `COMMIT`
* export and save
* `ROLLBACK` on failure

### Test

* successful mutation persists
* thrown error does not commit mutation
* DB remains readable afterward

### Commit 5.2

**Add schema bootstrap/versioning marker**

Add:

* schema init function
* maybe `PRAGMA user_version` or a simple metadata table

### Test

* fresh DB initializes correctly
* reopening does not re-break schema
* schema bootstrap is idempotent

### Commit 5.3

**Handle graceful startup with corrupt or unreadable DB**

Choose a policy:

* fail fast with clear message, or
* back up corrupt file and create new DB

For small/local apps, a pragmatic policy is:

* if open fails, rename existing file to `.corrupt.TIMESTAMP`
* create a fresh DB
* surface a warning in desktop logs or UI

### Test

* simulate invalid DB bytes
* confirm app fails predictably or recovers predictably according to chosen policy

This phase makes persistence operationally trustworthy.

---

## Phase 6 — Preserve browser mode cleanly

### Goal

Ensure Electron additions did not accidentally make the web app second-class.

### Commit 6.1

**Implement browser fallback persistence path**

For browser mode, pick one consistent fallback:

* IndexedDB-backed DB bytes, or
* localStorage-backed exported blob for MVP simplicity

For small apps, localStorage may be acceptable initially, but IndexedDB is better if DB size may grow.

### Test

* browser mode still persists across reloads
* Electron mode still uses file-backed persistence

### Commit 6.2

**Separate platform-specific behavior from domain logic**

Do a cleanup pass:

* renderer domain code should not care whether storage is browser or desktop
* storage and runtime concerns confined to platform/persistence modules

### Test

* smoke test both browser and Electron modes
* no renderer imports from Electron packages

This phase preserves long-term maintainability.

---

## Phase 7 — Windows developer ergonomics

### Goal

Make the project friendly for Windows + Git Bash + agents.

### Commit 7.1

**Normalize dev scripts for Windows-safe usage**

Ensure scripts work under:

* Git Bash
* VS Code integrated terminal
* standard Node install on Windows

Avoid shell-specific script assumptions where possible.

### Test

* `npm run dev:web`
* `npm run dev`
* `npm run build`

### Commit 7.2

**Add Windows-focused developer setup doc**

Add something like:

* `docs/windows-development.md`

Content:

* Node installation expectation
* Git Bash usage
* Conda role limited to Python tooling if present
* Electron packaging notes
* common failure points

### Test

* documentation reviewed
* no functional change

### Commit 7.3

**Add smoke-check script or checklist**

Add a simple scripted or documented validation:

* app opens in browser
* app opens in Electron
* persistence survives restart
* build artifacts produced

### Test

* run smoke checks locally

This is especially useful for future agent sessions.

---

## Phase 8 — Packaging for Windows portable build

### Goal

Produce a working Windows artifact with minimal installer complexity.

### Commit 8.1

**Add electron-builder config for portable Windows**

Configure:

* `appId`
* `files`
* output naming
* Windows portable target

### Test

* build command produces portable EXE
* app launches
* persistence path works in packaged build

### Commit 8.2

**Fix packaged asset resolution**

This is often where issues appear:

* preload path
* renderer asset paths
* `sql-wasm.wasm` path
* app icon/resource locations

### Test

* packaged portable build starts
* `sql.js` wasm resolves correctly
* persistence works after restart

This phase should end with a usable internal distribution artifact.

---

## Phase 9 — Installer packaging

### Goal

Add installer only after portable build is stable.

### Commit 9.1

**Add NSIS installer target**

Configure:

* NSIS target
* basic metadata
* install/uninstall flow

### Test

* installer runs on Windows
* installed app launches
* persistence stored in user data location
* uninstall behavior acceptable

Installer work should stay separate because it is operationally different from app functionality.

---

## Phase 10 — Hardening and cleanup

### Goal

Reduce future maintenance friction.

### Commit 10.1

**Audit for direct Electron leakage into renderer**

Search for:

* `import "electron"` in `src/`
* `window.require`
* Node globals in renderer

### Test

* none found outside preload/main

### Commit 10.2

**Document desktop architecture and persistence lifecycle**

Update docs with:

* startup sequence
* save sequence
* file locations
* browser vs desktop differences
* corruption policy

### Test

* doc clarity review

### Commit 10.3

**Optional: add lightweight automated smoke test strategy**

Possibilities:

* unit tests for persistence wrapper
* minimal integration smoke around app startup
* manual checklist if automation is not worth it yet

### Test

* at least one repeatable smoke process exists

---

## Suggested commit sequence summary

A compact version:

1. docs: add desktop architecture decision
2. docs: add agent/dev boundary rules
3. refactor: add runtime adapter skeleton
4. refactor: route persistence through runtime adapter
5. build: add Electron dependencies and TS config
6. feat: launch app in Electron window
7. feat: expose preload desktop marker
8. chore: add typed preload API globals
9. feat: add no-op DB IPC handlers
10. feat: implement desktop DB file load
11. feat: implement atomic desktop DB save
12. feat: open `sql.js` database from desktop bytes
13. feat: persist DB after writes
14. refactor: centralize DB transaction + save flow
15. feat: add schema bootstrap/versioning
16. feat: define corrupt DB handling policy
17. feat: implement browser fallback persistence path
18. refactor: isolate platform-specific code
19. chore: normalize Windows dev scripts
20. docs: add Windows development guide
21. build: add portable Windows packaging
22. fix: resolve packaged wasm/assets
23. build: add NSIS installer
24. docs: finalize desktop persistence/runtime docs

---

## Recommended issue granularity

If you want to map this to GitHub issues, I would keep them small:

* desktop architecture doc and guardrails
* runtime adapter extraction
* Electron shell bootstrap
* preload API typing
* DB IPC plumbing
* desktop DB file load/save
* renderer `sql.js` integration
* persistence transaction flow
* browser fallback persistence
* Windows dev ergonomics
* portable packaging
* installer packaging
* hardening/docs

That issue size is much better for agents than one large “desktop support” issue.

---

## Acceptance checkpoints

Use these as phase gates.

### Gate A — shell only

* browser app works
* Electron window opens app
* no persistence required yet

### Gate B — persistence works in dev

* write data in Electron
* restart app
* data survives

### Gate C — browser mode preserved

* browser mode still runs and persists via fallback path
* no Electron leakage into renderer

### Gate D — Windows artifact works

* portable EXE launches
* persistence survives restart in packaged app

### Gate E — installer works

* install/uninstall flow acceptable
* app functions after installation

---

## My implementation advice

The most important sequencing decision is this:

**get Electron window working first, then wire the preload API, then wire real file persistence, then package.**

Do not jump directly from web app to packaged persistence. That creates too many simultaneous failure points.
