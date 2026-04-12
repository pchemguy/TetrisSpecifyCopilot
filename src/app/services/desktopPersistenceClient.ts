import { invoke } from '@tauri-apps/api/core';
import {
  DESKTOP_PERSISTENCE_COMMANDS,
  type DesktopPersistenceCommandName,
  type LoadBestScoreStateResponse,
  type SubmitGameOverScoreRequest,
  type SubmitGameOverScoreResponse,
} from '../../types/desktopPersistence';

async function invokeDesktopPersistenceCommand<TResponse>(
  commandName: DesktopPersistenceCommandName,
  payload?: Record<string, unknown>,
): Promise<TResponse> {
  return invoke<TResponse>(commandName, payload);
}

async function loadBestScoreState(): Promise<LoadBestScoreStateResponse> {
  return invokeDesktopPersistenceCommand<LoadBestScoreStateResponse>(
    DESKTOP_PERSISTENCE_COMMANDS.loadBestScoreState,
  );
}

async function submitGameOverScore(
  payload: SubmitGameOverScoreRequest,
): Promise<SubmitGameOverScoreResponse> {
  return invokeDesktopPersistenceCommand<SubmitGameOverScoreResponse>(
    DESKTOP_PERSISTENCE_COMMANDS.submitGameOverScore,
    payload,
  );
}

export const desktopPersistenceClient = {
  loadBestScoreState,
  submitGameOverScore,
} as const;