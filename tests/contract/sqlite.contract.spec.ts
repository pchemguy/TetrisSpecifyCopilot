import { describe, expect, it } from 'vitest';
import initSqlJs from 'sql.js/dist/sql-asm.js';
import { insertReplayEnvelope, listReplayRecords } from '../../src/persistence/sqlite/replayRepository';
import { insertScoreRecord, readHighestRecordedScore } from '../../src/persistence/sqlite/scoreRepository';
import { insertSessionRecord, listSessionRecords } from '../../src/persistence/sqlite/sessionRepository';
import { ensureSchema } from '../../src/persistence/sqlite/schema';

describe('sqlite persistence contract', () => {
  it('creates the required schema and supports session, score, and replay writes', async () => {
    const sqlJs = await initSqlJs();
    const database = new sqlJs.Database();
    ensureSchema(database);

    insertSessionRecord(database, {
      session_id: 'session-contract-001',
      started_at: '2026-04-11T00:00:00.000Z',
      ended_at: '2026-04-11T00:02:00.000Z',
      status: 'game_over',
      seed: 'contract-seed',
      score: 3200,
      level: 3,
      lines_cleared: 14,
      duration_ms: 120000,
      best_score_at_end: 3200,
    });

    insertScoreRecord(database, {
      score_id: 'score-contract-001',
      session_id: 'session-contract-001',
      final_score: 3200,
      level_reached: 3,
      lines_cleared: 14,
      achieved_at: '2026-04-11T00:02:00.000Z',
      is_personal_best: true,
    });

    insertReplayEnvelope(database, {
      replay: {
        replay_id: 'replay-contract-001',
        session_id: 'session-contract-001',
        engine_version: '0.1.0',
        seed: 'contract-seed',
        tick_count: 200,
        checksum: 'checksum-contract-001',
        created_at: '2026-04-11T00:02:00.000Z',
      },
      events: [
        {
          event_id: 'event-contract-001',
          replay_id: 'replay-contract-001',
          tick: 10,
          command: 'move_left',
          payload_json: null,
        },
      ],
    });

    expect(listSessionRecords(database)).toHaveLength(1);
    expect(readHighestRecordedScore(database)).toBe(3200);
    expect(listReplayRecords(database)).toHaveLength(1);
  });
});