import type { EngineCommand } from '../../types/game';

export function createPauseToggleCommand(issuedAtMs: number): EngineCommand {
  return {
    type: 'pause_toggle',
    issuedAtMs,
    source: 'keyboard',
  };
}

export function createRestartCommand(issuedAtMs: number): EngineCommand {
  return {
    type: 'restart',
    issuedAtMs,
    source: 'keyboard',
  };
}