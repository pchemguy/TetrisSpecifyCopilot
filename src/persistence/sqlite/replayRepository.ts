import type { Database } from 'sql.js';
import type { ReplayEnvelope, ReplayRecord } from '../../types/replay';

export function insertReplayEnvelope(database: Database, replayEnvelope: ReplayEnvelope): void {
  database.run(
    `
      INSERT OR REPLACE INTO replays (replay_id, session_id, engine_version, seed, tick_count, checksum, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      replayEnvelope.replay.replay_id,
      replayEnvelope.replay.session_id,
      replayEnvelope.replay.engine_version,
      replayEnvelope.replay.seed,
      replayEnvelope.replay.tick_count,
      replayEnvelope.replay.checksum,
      replayEnvelope.replay.created_at,
    ],
  );

  replayEnvelope.events.forEach((event) => {
    database.run(
      `
        INSERT OR REPLACE INTO replay_events (event_id, replay_id, tick, command, payload_json)
        VALUES (?, ?, ?, ?, ?)
      `,
      [event.event_id, event.replay_id, event.tick, event.command, JSON.stringify(event.payload_json)],
    );
  });
}

export function listReplayRecords(database: Database): ReplayRecord[] {
  const result = database.exec(
    `SELECT replay_id, session_id, engine_version, seed, tick_count, checksum, created_at FROM replays ORDER BY created_at ASC`,
  );

  return (result[0]?.values ?? []).map((row) => ({
    replay_id: String(row[0]),
    session_id: String(row[1]),
    engine_version: String(row[2]),
    seed: String(row[3]),
    tick_count: Number(row[4]),
    checksum: String(row[5]),
    created_at: String(row[6]),
  }));
}