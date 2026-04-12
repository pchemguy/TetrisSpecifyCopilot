use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};

use rusqlite::Connection;

use crate::errors::AppError;
use crate::persistence::database::{open_best_score_database, read_best_score_state};

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct BestScoreSubmissionResult {
    pub best_score: i64,
    pub has_completed_game: bool,
    pub is_new_best: bool,
}

pub fn submit_game_over_score(
    database_path: &Path,
    final_score: i64,
) -> Result<BestScoreSubmissionResult, AppError> {
    let connection = open_best_score_database(database_path)?;

    submit_game_over_score_with_connection(&connection, final_score)
}

fn submit_game_over_score_with_connection(
    connection: &Connection,
    final_score: i64,
) -> Result<BestScoreSubmissionResult, AppError> {
    let current_state = read_best_score_state(connection)?;
    let is_new_best = final_score > current_state.best_score;

    if is_new_best {
        connection.execute(
            "
            UPDATE best_score_state
            SET best_score = ?1,
                has_completed_game = 1,
                updated_at = ?2
            WHERE id = 1
            ",
            (final_score, current_timestamp()),
        )?;
    } else if !current_state.has_completed_game {
        connection.execute(
            "
            UPDATE best_score_state
            SET has_completed_game = 1
            WHERE id = 1
            ",
            [],
        )?;
    }

    let next_state = read_best_score_state(connection)?;

    Ok(BestScoreSubmissionResult {
        best_score: next_state.best_score,
        has_completed_game: true,
        is_new_best,
    })
}

fn current_timestamp() -> String {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("system clock should be after the Unix epoch")
        .as_nanos()
        .to_string()
}

#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::PathBuf;
    use std::time::{SystemTime, UNIX_EPOCH};

    use rusqlite::Connection;

    use super::submit_game_over_score;

    fn create_temp_directory(name: &str) -> PathBuf {
        let suffix = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("system clock should be after the Unix epoch")
            .as_nanos();
        let directory = std::env::temp_dir().join(format!("tetris-desktop-{name}-{suffix}"));

        fs::create_dir_all(&directory).expect("temporary directory should be created");
        directory
    }

    fn seed_best_score_state(database_path: &PathBuf, best_score: i64, has_completed_game: bool) {
        let connection = Connection::open(database_path).expect("database should open for test seeding");

        connection
            .execute_batch(&format!(
                "
                CREATE TABLE best_score_state (
                    id INTEGER PRIMARY KEY CHECK (id = 1),
                    best_score INTEGER NOT NULL CHECK (best_score >= 0),
                    has_completed_game INTEGER NOT NULL,
                    updated_at TEXT
                );

                INSERT INTO best_score_state (id, best_score, has_completed_game, updated_at)
                VALUES (1, {best_score}, {}, NULL);
                ",
                if has_completed_game { 1 } else { 0 }
            ))
            .expect("seed schema should be created");

        drop(connection);
    }

    #[test]
    fn updates_the_best_score_only_for_strictly_greater_results() {
        let temp_directory = create_temp_directory("repository-greater");
        let database_path = temp_directory.join("best-score.sqlite3");
        seed_best_score_state(&database_path, 3200, true);

        let result = submit_game_over_score(&database_path, 4800)
            .expect("strictly greater score should update the stored best score");

        assert_eq!(result.best_score, 4800);
        assert!(result.is_new_best);
        assert!(result.has_completed_game);

        fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
    }

    #[test]
    fn leaves_equal_or_lower_scores_unchanged() {
        let temp_directory = create_temp_directory("repository-equal-lower");
        let database_path = temp_directory.join("best-score.sqlite3");
        seed_best_score_state(&database_path, 3200, true);

        let equal_result = submit_game_over_score(&database_path, 3200)
            .expect("equal score should not update the stored best score");
        let lower_result = submit_game_over_score(&database_path, 1200)
            .expect("lower score should not update the stored best score");

        assert_eq!(equal_result.best_score, 3200);
        assert!(!equal_result.is_new_best);
        assert_eq!(lower_result.best_score, 3200);
        assert!(!lower_result.is_new_best);

        fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
    }

    #[test]
    fn marks_the_first_completed_zero_score_as_visible_without_creating_a_new_best() {
        let temp_directory = create_temp_directory("repository-first-complete");
        let database_path = temp_directory.join("best-score.sqlite3");
        seed_best_score_state(&database_path, 0, false);

        let result = submit_game_over_score(&database_path, 0)
            .expect("a zero-score completion should still mark the best score as visible");

        assert_eq!(result.best_score, 0);
        assert!(result.has_completed_game);
        assert!(!result.is_new_best);

        fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
    }
}