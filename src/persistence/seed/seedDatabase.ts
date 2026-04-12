import type { Database } from 'sql.js';
import { DEFAULT_UI_STATE, DEFAULT_USER_SETTINGS, type SeededPersistenceState } from '../../types/persistence';
import type { ReplayEnvelope } from '../../types/replay';
import { writeSettings } from '../local-storage/settingsStore';
import { writeUIState } from '../local-storage/uiStateStore';
import { DEMO_REPLAY, DEMO_SCORE, DEMO_SESSION, DEMO_UI_STATE, DEMO_USER_SETTINGS } from './demoData';

function readCount(database: Database, tableName: string): number {
  const result = database.exec(`SELECT COUNT(*) AS count FROM ${tableName}`);
  return Number(result[0]?.values[0]?.[0] ?? 0);
}

function insertReplay(database: Database, replayEnvelope: ReplayEnvelope): void {
  database.run(
    `
      INSERT OR IGNORE INTO replays (replay_id, session_id, engine_version, seed, tick_count, checksum, created_at)
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

  for (const event of replayEnvelope.events) {
    database.run(
      `
        INSERT OR IGNORE INTO replay_events (event_id, replay_id, tick, command, payload_json)
        VALUES (?, ?, ?, ?, ?)
      `,
      [event.event_id, event.replay_id, event.tick, event.command, JSON.stringify(event.payload_json)],
    );
  }
}

export function seedLocalPersistence(): void {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return;
  }

  if (!window.localStorage.getItem('tetris.settings.v1')) {
    writeSettings(DEMO_USER_SETTINGS ?? DEFAULT_USER_SETTINGS);
  }

  if (!window.localStorage.getItem('tetris.ui.v1')) {
    writeUIState(DEMO_UI_STATE ?? DEFAULT_UI_STATE);
  }
}

export function seedDatabase(database: Database): SeededPersistenceState {
  const existingSessions = readCount(database, 'sessions');
  const existingScores = readCount(database, 'scores');
  const existingReplays = readCount(database, 'replays');

  database.run('BEGIN');

  try {
    if (existingSessions === 0) {
      database.run(
        `
          INSERT INTO sessions (session_id, started_at, ended_at, status, seed, score, level, lines_cleared, duration_ms, best_score_at_end)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          DEMO_SESSION.session_id,
          DEMO_SESSION.started_at,
          DEMO_SESSION.ended_at,
          DEMO_SESSION.status,
          DEMO_SESSION.seed,
          DEMO_SESSION.score,
          DEMO_SESSION.level,
          DEMO_SESSION.lines_cleared,
          DEMO_SESSION.duration_ms,
          DEMO_SESSION.best_score_at_end,
        ],
      );
    }

    if (existingScores === 0) {
      database.run(
        `
          INSERT INTO scores (score_id, session_id, final_score, level_reached, lines_cleared, achieved_at, is_personal_best)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          DEMO_SCORE.score_id,
          DEMO_SCORE.session_id,
          DEMO_SCORE.final_score,
          DEMO_SCORE.level_reached,
          DEMO_SCORE.lines_cleared,
          DEMO_SCORE.achieved_at,
          Number(DEMO_SCORE.is_personal_best),
        ],
      );
    }

    if (existingReplays === 0) {
      insertReplay(database, DEMO_REPLAY);
    }

    database.run('COMMIT');
  } catch (error) {
    database.run('ROLLBACK');
    throw error;
  }

  return {
    sessionsInserted: existingSessions === 0 ? 1 : 0,
    scoresInserted: existingScores === 0 ? 1 : 0,
    replaysInserted: existingReplays === 0 ? 1 : 0,
  };
}