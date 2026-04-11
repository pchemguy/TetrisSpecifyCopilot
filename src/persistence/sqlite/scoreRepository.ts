import type { Database } from 'sql.js';
import type { ScoreRecord } from '../../types/persistence';

export function insertScoreRecord(database: Database, scoreRecord: ScoreRecord): void {
  database.run(
    `
      INSERT OR REPLACE INTO scores (score_id, session_id, final_score, level_reached, lines_cleared, achieved_at, is_personal_best)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      scoreRecord.score_id,
      scoreRecord.session_id,
      scoreRecord.final_score,
      scoreRecord.level_reached,
      scoreRecord.lines_cleared,
      scoreRecord.achieved_at,
      Number(scoreRecord.is_personal_best),
    ],
  );
}

export function readHighestRecordedScore(database: Database): number {
  const result = database.exec('SELECT MAX(final_score) FROM scores');
  return Number(result[0]?.values[0]?.[0] ?? 0);
}