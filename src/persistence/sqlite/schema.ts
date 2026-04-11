import type { Database } from 'sql.js';

const SCHEMA_VERSION = 1;

const SCHEMA_STATEMENTS = [
  `
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS sessions (
      session_id TEXT PRIMARY KEY,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      status TEXT NOT NULL,
      seed TEXT NOT NULL,
      score INTEGER NOT NULL,
      level INTEGER NOT NULL,
      lines_cleared INTEGER NOT NULL,
      duration_ms INTEGER NOT NULL,
      best_score_at_end INTEGER
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS scores (
      score_id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      final_score INTEGER NOT NULL,
      level_reached INTEGER NOT NULL,
      lines_cleared INTEGER NOT NULL,
      achieved_at TEXT NOT NULL,
      is_personal_best INTEGER NOT NULL,
      FOREIGN KEY(session_id) REFERENCES sessions(session_id)
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS replays (
      replay_id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      engine_version TEXT NOT NULL,
      seed TEXT NOT NULL,
      tick_count INTEGER NOT NULL,
      checksum TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(session_id) REFERENCES sessions(session_id)
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS replay_events (
      event_id TEXT PRIMARY KEY,
      replay_id TEXT NOT NULL,
      tick INTEGER NOT NULL,
      command TEXT NOT NULL,
      payload_json TEXT,
      FOREIGN KEY(replay_id) REFERENCES replays(replay_id)
    )
  `,
  `CREATE INDEX IF NOT EXISTS idx_scores_session_id ON scores(session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_replays_session_id ON replays(session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_replay_events_replay_id ON replay_events(replay_id)`,
  `CREATE INDEX IF NOT EXISTS idx_replay_events_tick ON replay_events(replay_id, tick)`,
];

export function applySchema(database: Database): void {
  database.run('BEGIN');

  try {
    for (const statement of SCHEMA_STATEMENTS) {
      database.run(statement);
    }

    database.run(
      `
        INSERT INTO app_meta (key, value)
        VALUES ('schema_version', ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `,
      [String(SCHEMA_VERSION)],
    );

    database.run('COMMIT');
  } catch (error) {
    database.run('ROLLBACK');
    throw error;
  }
}

export function readSchemaVersion(database: Database): number {
  const result = database.exec(`SELECT value FROM app_meta WHERE key = 'schema_version' LIMIT 1`);

  if (result.length === 0 || result[0].values.length === 0) {
    return 0;
  }

  return Number(result[0].values[0][0]);
}

export function ensureSchema(database: Database): number {
  applySchema(database);
  return readSchemaVersion(database);
}

export { SCHEMA_VERSION };