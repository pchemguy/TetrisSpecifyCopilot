import type { Database } from 'sql.js';
import type { SessionRecord } from '../../types/persistence';

export function insertSessionRecord(database: Database, sessionRecord: SessionRecord): void {
  database.run(
    `
      INSERT OR REPLACE INTO sessions (session_id, started_at, ended_at, status, seed, score, level, lines_cleared, duration_ms, best_score_at_end)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      sessionRecord.session_id,
      sessionRecord.started_at,
      sessionRecord.ended_at,
      sessionRecord.status,
      sessionRecord.seed,
      sessionRecord.score,
      sessionRecord.level,
      sessionRecord.lines_cleared,
      sessionRecord.duration_ms,
      sessionRecord.best_score_at_end,
    ],
  );
}

export function listSessionRecords(database: Database): SessionRecord[] {
  const result = database.exec(
    `SELECT session_id, started_at, ended_at, status, seed, score, level, lines_cleared, duration_ms, best_score_at_end FROM sessions ORDER BY started_at ASC`,
  );

  return (result[0]?.values ?? []).map((row) => ({
    session_id: String(row[0]),
    started_at: String(row[1]),
    ended_at: row[2] ? String(row[2]) : null,
    status: row[3] as SessionRecord['status'],
    seed: String(row[4]),
    score: Number(row[5]),
    level: Number(row[6]),
    lines_cleared: Number(row[7]),
    duration_ms: Number(row[8]),
    best_score_at_end: row[9] === null ? null : Number(row[9]),
  }));
}