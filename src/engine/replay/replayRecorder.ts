import type { EngineCommandName, GameState } from '../../types/game';
import type { ReplayCaptureState, ReplayEnvelope, ReplayEventRecord } from '../../types/replay';

function createIdentifier(prefix: string, seed: string, suffix: string): string {
  return `${prefix}-${seed}-${suffix}`;
}

function buildChecksum(events: readonly ReplayEventRecord[], tickCount: number): string {
  const source = JSON.stringify({ events, tickCount });
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash) + source.charCodeAt(index);
    hash |= 0;
  }

  return `checksum-${Math.abs(hash)}`;
}

export class ReplayRecorder {
  private captureState: ReplayCaptureState;

  private readonly sessionId: string;

  constructor(sessionId: string, seed: string, startedAtMs = Date.now(), engineVersion = '0.1.0') {
    this.sessionId = sessionId;
    this.captureState = {
      engineVersion,
      seed,
      startedAtMs,
      lastTick: 0,
      events: [],
    };
  }

  record(command: EngineCommandName, tick: number): void {
    const eventId = createIdentifier('event', this.captureState.seed, `${tick}-${this.captureState.events.length}`);
    this.captureState.lastTick = Math.max(this.captureState.lastTick, tick);
    this.captureState.events.push({
      event_id: eventId,
      replay_id: createIdentifier('replay', this.captureState.seed, this.sessionId),
      tick,
      command,
      payload_json: null,
    });
  }

  finalize(state: GameState, createdAt: string): ReplayEnvelope {
    const replayId = createIdentifier('replay', this.captureState.seed, this.sessionId);
    const events = this.captureState.events.map((event) => ({
      ...event,
      replay_id: replayId,
    }));

    return {
      replay: {
        replay_id: replayId,
        session_id: this.sessionId,
        engine_version: this.captureState.engineVersion,
        seed: state.seed,
        tick_count: state.currentTick,
        checksum: buildChecksum(events, state.currentTick),
        created_at: createdAt,
      },
      events,
    };
  }
}