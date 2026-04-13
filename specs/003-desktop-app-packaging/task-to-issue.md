# Task to Issue Mapping: Desktop App Packaging

## Metadata

- Repository: `pchemguy/TetrisSpecifyCopilot`
- Milestone: `003 Desktop App Packaging`
- Shared labels applied to all issues:
  - `spec:003-desktop-app-packaging`
  - `milestone: desktop-packaging`
- Additional labels applied by issue type:
  - phase labels: `phase: setup`, `phase: foundation`, `phase: polish`
  - story labels: `story: us1`, `story: us2`, `story: us3`, `story: us4`, `story: us5`
  - type labels: `type: documentation`, `type: tooling`, `type: app-shell`, `type: implementation`, `type: refactor`, `type: testing`, `type: validation`

## Mapping Table

| Task | Task Title | GitHub Issue |
| --- | --- | --- |
| T001 | Create the desktop architecture decision note in docs/desktop-architecture.md | [#149](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/149) |
| T002 | Update desktop boundary and Windows shell rules in AGENTS.md | [#150](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/150) |
| T003 | Create the Windows developer workflow guide skeleton in docs/windows-development.md | [#151](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/151) |
| T004 | Add shared Electron dependencies and script scaffolding in package.json | [#152](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/152) |
| T005 | Add Electron TypeScript build configuration in tsconfig.electron.json and tsconfig.json | [#153](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/153) |
| T006 | Create Electron shell scaffolds in electron/main.ts and electron/preload.ts | [#154](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/154) |
| T007 | Add typed runtime detection and global desktop API declarations in src/platform/runtime.ts and src/types/global.d.ts | [#155](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/155) |
| T008 | Create runtime-specific persistence adapter skeletons in src/persistence/runtime/browserAdapter.ts and src/persistence/runtime/desktopAdapter.ts | [#156](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/156) |
| T009 | Refactor shared SQLite bootstrap to consume runtime-selected byte loaders and savers in src/persistence/sqlite/database.ts and src/app/providers/PersistenceProvider.tsx | [#157](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/157) |
| T010 | Capture shared packaging, persistence, and rollback guardrails in docs/desktop-architecture.md and specs/003-desktop-app-packaging/quickstart.md | [#158](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/158) |
| T011 | Add preload contract coverage for desktop runtime info and app version metadata in tests/contract/desktop-api.contract.spec.ts | [#159](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/159) |
| T012 | Add renderer integration coverage for desktop runtime detection in tests/integration/app/desktop-runtime.spec.tsx | [#160](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/160) |
| T013 | Add Electron launch and offline shell smoke coverage in tests/e2e/desktop-shell.spec.ts | [#161](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/161) |
| T014 | Implement BrowserWindow creation, secure webPreferences, and dev/prod renderer loading in electron/main.ts | [#162](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/162) |
| T015 | Implement the preload runtime-info bridge with platform and app version metadata in electron/preload.ts and src/platform/runtime.ts | [#163](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/163) |
| T016 | Wire desktop development and production build commands in package.json, vite.config.ts, and tsconfig.electron.json | [#164](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/164) |
| T017 | Configure portable Windows packaging with electron-builder in package.json | [#165](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/165) |
| T018 | Fix packaged renderer, preload, and static asset resolution in electron/main.ts, src/persistence/sqlite/database.ts, and vite.config.ts | [#166](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/166) |
| T019 | Validate packaged desktop launch behavior, build/version identification, and the launch lifecycle in docs/desktop-architecture.md and docs/windows-development.md | [#167](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/167) |
| T054 | Measure and record packaged desktop startup time to the usable main UI against the 5-second budget in docs/desktop-architecture.md and specs/003-desktop-app-packaging/quickstart.md | [#168](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/168) |
| T020 | Add unit coverage for desktop file load/save, atomic replace, stale temp cleanup, and interrupted-save recovery in tests/unit/persistence/desktopFileStore.spec.ts | [#169](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/169) |
| T021 | Add renderer integration coverage for best-score hydration, bridge-unavailable fallback warnings, and persistence-disabled launch behavior in tests/integration/app/desktop-persistence.spec.tsx | [#170](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/170) |
| T022 | Extend desktop restart persistence validation in tests/e2e/session-persistence.spec.ts | [#171](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/171) |
| T023 | Implement `db:load` and `db:save` IPC handlers with `userData` path resolution, temp-file cleanup, and last-committed-file preference in electron/main.ts | [#172](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/172) |
| T024 | Implement typed database byte bridging in electron/preload.ts and src/types/global.d.ts | [#173](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/173) |
| T025 | Implement the desktop runtime adapter for loading and saving database bytes in src/persistence/runtime/desktopAdapter.ts and src/platform/runtime.ts | [#174](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/174) |
| T026 | Add desktop best-score persistence and schema bootstrap helpers in src/persistence/sqlite/database.ts and src/persistence/sqlite/schema.ts | [#175](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/175) |
| T027 | Persist desktop database exports after best-score mutations in src/app/providers/PersistenceProvider.tsx and src/persistence/sqlite/database.ts | [#176](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/176) |
| T028 | Surface missing or invalid desktop best-score recovery through existing warning UI in src/app/providers/PersistenceProvider.tsx and src/components/overlays/PersistenceWarning.tsx | [#177](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/177) |
| T029 | Handle unreadable or corrupt desktop database bytes plus permission, locked-file, and disk-space write failures with deterministic recovery in electron/main.ts and src/types/persistence.ts | [#178](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/178) |
| T055 | Add integration coverage proving desktop mode does not import, merge, or overwrite browser persistence in tests/integration/app/desktop-persistence-isolation.spec.tsx | [#179](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/179) |
| T056 | Enforce browser/desktop persistence separation in src/persistence/runtime/browserAdapter.ts, src/persistence/runtime/desktopAdapter.ts, and src/platform/runtime.ts | [#180](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/180) |
| T057 | Measure and record desktop best-score hydration fallback time and save latency against the 250 ms budgets in docs/desktop-architecture.md and specs/003-desktop-app-packaging/quickstart.md | [#181](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/181) |
| T030 | Add unit coverage for runtime selection, absent desktop bridge behavior, and incomplete desktop bridge fallback in tests/unit/platform/runtime.spec.ts | [#182](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/182) |
| T031 | Add browser-mode integration coverage for persistence bootstrap in tests/integration/app/browser-runtime.spec.tsx | [#183](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/183) |
| T032 | Extend browser regression coverage for `dev:web` behavior in tests/e2e/core-gameplay.spec.ts and tests/e2e/session-persistence.spec.ts | [#184](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/184) |
| T033 | Implement the browser runtime adapter for localStorage and IndexedDB-backed SQLite in src/persistence/runtime/browserAdapter.ts and src/platform/runtime.ts | [#185](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/185) |
| T034 | Add the pure browser workflow command as `npm run dev:web` in package.json and keep browser server settings explicit in vite.config.ts | [#186](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/186) |
| T035 | Remove Electron assumptions from shared renderer bootstrap in src/app/providers/PersistenceProvider.tsx and src/persistence/sqlite/database.ts | [#187](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/187) |
| T036 | Isolate runtime-specific behavior behind platform modules in src/platform/runtime.ts, src/platform/browser/, and src/platform/desktop/ | [#188](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/188) |
| T037 | Validate browser-mode continuity and update the dual-runtime workflow notes in docs/desktop-architecture.md and docs/windows-development.md | [#189](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/189) |
| T038 | Add unit coverage for Windows-safe path and command helper behavior in tests/unit/platform/windowsRuntime.spec.ts | [#190](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/190) |
| T039 | Add a contributor smoke validation checklist for Windows workflows in docs/windows-development.md | [#191](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/191) |
| T040 | Normalize Windows-safe desktop and browser scripts in package.json | [#192](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/192) |
| T041 | Document the supported Node, Git Bash, and troubleshooting workflow in docs/windows-development.md | [#193](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/193) |
| T042 | Add a repeatable desktop smoke workflow and rollback checkpoints in docs/windows-development.md and specs/003-desktop-app-packaging/quickstart.md | [#194](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/194) |
| T043 | Update architecture and agent guardrails for preload-only desktop access in docs/desktop-architecture.md and AGENTS.md | [#195](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/195) |
| T044 | Verify the Windows contributor workflow end to end and record the final command set in docs/windows-development.md | [#196](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/196) |
| T045 | Add unit coverage for platform-neutral runtime info and path helpers in tests/unit/platform/runtimeInfo.spec.ts | [#197](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/197) |
| T046 | Extend preload contract coverage for platform and version metadata in tests/contract/desktop-api.contract.spec.ts | [#198](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/198) |
| T047 | Keep platform branching isolated to shell/runtime boundaries in electron/main.ts and src/platform/runtime.ts | [#199](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/199) |
| T048 | Keep packaging configuration extensible beyond Windows-only assumptions in package.json and docs/desktop-architecture.md | [#200](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/200) |
| T049 | Document current Windows-first limits and future extension points in docs/desktop-architecture.md and docs/windows-development.md | [#201](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/201) |
| T050 | Run a desktop boundary audit to confirm there are no direct Electron imports under src/ and record the result in docs/desktop-architecture.md | [#202](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/202) |
| T051 | Re-run the requirement-quality checks in specs/003-desktop-app-packaging/checklists/requirements.md and specs/003-desktop-app-packaging/checklists/desktop.md and close any findings in specs/003-desktop-app-packaging/spec.md or docs/desktop-architecture.md | [#203](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/203) |
| T052 | Execute the full validation pass from specs/003-desktop-app-packaging/quickstart.md, including `npm run dev:web`, `npm run dev`, `npm run build`, desktop restart persistence, bridge-unavailable fallback behavior, atomic-save recovery, write-failure handling, and portable packaging output validation | [#204](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/204) |
| T053 | Finalize desktop runtime and persistence lifecycle documentation in docs/desktop-architecture.md and docs/windows-development.md | [#205](https://github.com/pchemguy/TetrisSpecifyCopilot/issues/205) |