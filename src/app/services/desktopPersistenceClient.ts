import { invoke, type InvokeArgs } from '@tauri-apps/api/core';
import {
  DESKTOP_PERSISTENCE_COMMANDS,
  type DesktopPersistenceCommandName,
  type LoadBestScoreStateResponse,
  type SubmitGameOverScoreRequest,
  type SubmitGameOverScoreResponse,
} from '../../types/desktopPersistence';

async function invokeDesktopPersistenceCommand<
  TResponse,
  TPayload extends object | undefined = undefined,
>(
  commandName: DesktopPersistenceCommandName,
  payload?: TPayload,
): Promise<TResponse> {
  return invoke<TResponse>(commandName, payload as InvokeArgs | undefined);
}

async function loadBestScoreState(): Promise<LoadBestScoreStateResponse> {
  return invokeDesktopPersistenceCommand<LoadBestScoreStateResponse>(
    DESKTOP_PERSISTENCE_COMMANDS.loadBestScoreState,
  );
}

async function submitGameOverScore(
  payload: SubmitGameOverScoreRequest,
): Promise<SubmitGameOverScoreResponse> {
  return invokeDesktopPersistenceCommand<
    SubmitGameOverScoreResponse,
    SubmitGameOverScoreRequest
  >(
    DESKTOP_PERSISTENCE_COMMANDS.submitGameOverScore,
    payload,
  );
}

export const desktopPersistenceClient = {
  loadBestScoreState,
  submitGameOverScore,
} as const;