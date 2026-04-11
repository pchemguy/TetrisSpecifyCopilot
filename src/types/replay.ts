import type { EngineCommandName } from './game';

export type ReplayPayload = Record<string, unknown> | null;

export interface ReplayRecord {
  replay_id: string;
  session_id: string;
  engine_version: string;
  seed: string;
  tick_count: number;
  checksum: string;
  created_at: string;
}

export interface ReplayEventRecord {
  event_id: string;
  replay_id: string;
  tick: number;
  command: EngineCommandName;
  payload_json: ReplayPayload;
}

export interface ReplayEnvelope {
  replay: ReplayRecord;
  events: readonly ReplayEventRecord[];
}

export interface ReplayCaptureState {
  engineVersion: string;
  seed: string;
  startedAtMs: number;
  lastTick: number;
  events: ReplayEventRecord[];
}

export interface ReplayVerificationResult {
  sessionId: string;
  checksum: string;
  isDeterministic: boolean;
  mismatchReason?: string;
}