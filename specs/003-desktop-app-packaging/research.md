# Research: Desktop App Packaging

## Decision 1: Use Electron as a thin desktop shell around the existing Vite renderer

- Decision: Package the current React/Vite application inside Electron, using plain Electron entrypoints for the main process and preload script while keeping the existing renderer as the primary product UI.
- Rationale: This is the simplest robust path for Windows-first agentic development because it preserves the existing renderer, works well in Bash/VS Code workflows, and keeps packaging and runtime behavior in one JavaScript/TypeScript toolchain.
- Alternatives considered: A separate native desktop rewrite was rejected because it would discard the current renderer and dramatically expand scope. A browser-only PWA path was rejected because it does not produce the requested packaged desktop app. Heavier wrapper frameworks with different build systems were rejected because they add migration cost without improving the first release requirements.

## Decision 2: Expose desktop capabilities only through `window.desktopApi`

- Decision: Keep Electron main and preload as thin adapters and expose desktop-only features to the renderer through a typed `window.desktopApi` bridge.
- Rationale: This enforces a hard boundary between platform code and product UI, keeps the React tree portable, and allows browser mode to run without bundling Electron dependencies or mocking Node globals everywhere.
- Alternatives considered: Importing `electron` directly in renderer code was rejected because it couples product code to Electron internals and breaks browser-mode independence. Moving gameplay and persistence logic into the main process was rejected because it would make the desktop shell too fat and harder to test.

## Decision 3: Keep `sql.js` ownership in the renderer and swap only the persistence backend per runtime

- Decision: Continue loading and querying `sql.js` in shared renderer/persistence code, but choose the storage backend by runtime: IndexedDB in browser mode and a single file under Electron `userData` in desktop mode.
- Rationale: This preserves the existing persistence schema and repository logic in `src/persistence`, satisfies the user’s architectural rule that Electron adapters stay thin, and avoids running a backend server or moving SQL logic into Electron.
- Alternatives considered: Running SQLite access in the Electron main process was rejected because it would duplicate repository logic or force the renderer through chatty IPC for every query. Keeping desktop best-score persistence in localStorage was rejected because the requested desktop architecture explicitly calls for a file-backed `sql.js` database under `userData`.

## Decision 4: Persist desktop database bytes atomically via temp file plus rename

- Decision: Save the desktop SQLite database by writing exported bytes to a temporary file in the same `userData` directory and then renaming it over the live database file.
- Rationale: Atomic replacement is the simplest robust protection against partial writes from crashes or interrupted saves and fits the thin-adapter main-process design.
- Alternatives considered: Writing directly to the destination file was rejected because it increases corruption risk during interrupted writes. Introducing a background service or external database process was rejected because the feature must remain fully local and offline-capable with no backend.

## Decision 5: Preserve two explicit development modes and a simple packaging workflow

- Decision: Support `npm run dev:web` for pure browser development and `npm run dev` for desktop-shell development, while using Electron Builder to package a portable Windows artifact from the same repository.
- Rationale: Dual runtime support keeps the fast existing browser loop for renderer work and provides a direct desktop validation path for packaging, preload, and file-backed persistence.
- Alternatives considered: Requiring all development to happen inside Electron was rejected because it would slow iteration for renderer-only changes. Maintaining separate repos or separate renderer builds for web and desktop was rejected because it would create unnecessary divergence.

## Decision 6: Add desktop-specific validation without replacing the existing browser regression suite

- Decision: Keep the current browser-oriented Vitest and Playwright coverage, then add desktop contract and smoke validation for the preload bridge, Electron launch, offline behavior, and best-score persistence across relaunch.
- Rationale: The desktop feature changes runtime boundaries and packaging, not the core gameplay rules, so existing browser tests should continue proving gameplay while new desktop tests focus on the new shell and persistence seam.
- Alternatives considered: Replacing browser regression coverage with desktop-only tests was rejected because browser mode remains a supported development path. Manual-only desktop validation was rejected because it would not satisfy the project’s release-gate and agent-friendly workflow requirements.

## Decision 7: Limit first-release persistence guarantees to best score while keeping the SQLite schema extensible

- Decision: The first desktop release will only require restart persistence for best score, while keeping the shared SQLite schema and repository layer structured so broader desktop persistence can be added later without architectural rework.
- Rationale: This honors the clarified feature scope, reduces migration and validation risk for the first release, and still preserves the long-term cross-platform direction.
- Alternatives considered: Requiring full parity for settings, session history, score history, and replay metadata in the first desktop release was rejected because it expands scope beyond the clarified requirement. Persisting nothing in desktop mode was rejected because it would fail the required best-score retention behavior.