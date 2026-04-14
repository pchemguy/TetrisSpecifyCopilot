# Packaging Guide

## Overview

This repository packages the shared React + Vite renderer as a Windows-first Electron desktop app.

## Packaging Stack

- shell: Electron
- packager: `electron-builder`
- renderer build output: `dist/`
- Electron build output: `dist-electron/`
- packaging output: `release/`

## Supported Artifact

The current reviewable artifact is a portable Windows executable.

Primary outputs:

- `release/Tetris Specify Copilot-0.1.0-portable.exe`
- `release/win-unpacked/Tetris Specify Copilot.exe`

Installer flows, upgrade channels, and code signing are out of scope for the current feature.

## Packaging Commands

Build all production assets:

```bash
npm run build
```

Create the portable Windows artifact:

```bash
npm run dist:win
```

## Current Package Configuration

The package configuration lives in `package.json` and currently:

- sets `main` to `dist-electron/electron/main.js`
- packages `dist/**/*`, `dist-electron/**/*`, and `package.json`
- writes packaging output to `release/`
- targets Windows portable x64 output

## Validation Checklist

1. Run `npm run build`.
2. Run `npm run dist:win`.
3. Confirm `release/win-unpacked/Tetris Specify Copilot.exe` exists.
4. Confirm `release/Tetris Specify Copilot-0.1.0-portable.exe` exists.
5. Launch the unpacked executable and confirm the game board becomes visible.

## Runtime Notes

- `dist/` must exist before file-based Electron launch can resolve renderer assets.
- `dist-electron/` must exist before Electron can resolve `main` and `preload` outputs.
- desktop persistence uses the local app data directory and is not bundled into the artifact itself.
- browser and desktop persistence remain separate in the first release.

## Troubleshooting

### `dist:win` Is Missing

Confirm the current branch includes the Electron packaging workflow and that `package.json` defines `dist:win`.

### Packaging Fails After Renderer Changes

Run these commands separately to isolate the break:

```bash
npm run build:renderer
npm run build:electron
```

### The Packaged App Cannot Find Assets

Confirm both `dist/` and `dist-electron/` were regenerated immediately before packaging.
