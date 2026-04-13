---
name: AGENTS.md
---

# Agent Instructions

## Shell Selection (Windows)

- If `bash` is on `PATH` (i.e., `bash --version` succeeds) → **MUST use Bash**
- Otherwise → **use PowerShell**
- Mixing shells is forbidden

## Desktop Boundary Rules

- Keep Electron-owned code in `electron/` or runtime boundary modules under `src/platform/` and `src/persistence/runtime/`.
- Renderer-facing modules under `src/` MUST NOT import `electron`, `node:fs`, or other Node/Electron-only APIs for desktop behavior.
- Desktop-only renderer access MUST flow through a typed `window.desktopApi` bridge exposed by preload.
- Desktop validation must preserve the browser-first fallback path: validate `npm run dev:web` before assuming a regression belongs to Electron.
- Preserve a pure browser workflow alongside desktop work; browser-mode changes must remain runnable without Electron.
