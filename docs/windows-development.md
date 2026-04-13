# Windows Development Workflow

## Purpose

This guide defines the supported Windows contributor path for the desktop-packaging feature.

## Supported Environment

- Windows 11
- Git Bash available on `PATH`
- Node.js 22 LTS or newer
- npm 10 or newer

## Shell Rule

If Bash is available, use Bash for repository commands. Do not mix Bash and PowerShell steps in the same workflow.

## Current Workflows

This guide will track the validated commands for both supported runtime paths.

- Browser workflow: `npm run dev:web`
- Desktop workflow: `npm run dev`
- Production validation: `npm run build`

## Current Scope

- Browser mode remains the fast path for renderer-only changes.
- Desktop mode is the validation path for Electron shell, preload bridge, and file-backed persistence work.
- The first desktop release targets a portable Windows artifact.

## Follow-On Documentation

Later tasks will expand this guide with:

- supported command baselines
- troubleshooting notes
- desktop smoke validation steps
- rollback checkpoints for runtime and packaging work
