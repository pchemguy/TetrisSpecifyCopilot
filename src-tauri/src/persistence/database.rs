use std::fs;
use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};

use rusqlite::Connection;

use crate::errors::AppError;

const INITIAL_ROW_IDENTIFIER: i64 = 1;

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct BestScoreState {
    pub best_score: i64,
    pub has_completed_game: bool,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct LoadBestScoreStateOutcome {
    pub state: BestScoreState,
    pub database_reset: bool,
}

pub fn load_or_initialize_best_score_state(database_path: &Path) -> Result<BestScoreState, AppError> {
    let outcome = load_or_initialize_best_score_state_with_recovery(database_path)?;

    Ok(outcome.state)
}

pub fn load_or_initialize_best_score_state_with_recovery(
    database_path: &Path,
) -> Result<LoadBestScoreStateOutcome, AppError> {
    match attempt_load_best_score_state(database_path) {
        Ok(state) => Ok(LoadBestScoreStateOutcome {
            state,
            database_reset: false,
        }),
        Err(AppError::Sqlite(_)) => recover_corrupt_database(database_path),
        Err(error) => Err(error),
    }
}

fn recover_corrupt_database(database_path: &Path) -> Result<LoadBestScoreStateOutcome, AppError> {
    if database_path.exists() {
        let backup_path = corrupt_backup_path(database_path);
        fs::rename(database_path, backup_path)?;
    }

    let connection = open_best_score_database(database_path)?;
    let state = read_best_score_state(&connection)?;

    Ok(LoadBestScoreStateOutcome {
        state,
        database_reset: true,
    })
}

pub fn open_best_score_database(database_path: &Path) -> Result<Connection, AppError> {
    ensure_parent_directory(database_path)?;

    let connection = Connection::open(database_path)?;
    initialize_schema(&connection)?;
    ensure_single_row(&connection)?;

    Ok(connection)
}

fn ensure_parent_directory(database_path: &Path) -> Result<(), AppError> {
    if let Some(parent_directory) = database_path.parent() {
        fs::create_dir_all(parent_directory)?;
    }

    Ok(())
}

fn initialize_schema(connection: &Connection) -> Result<(), AppError> {
    connection.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS best_score_state (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            best_score INTEGER NOT NULL CHECK (best_score >= 0),
            has_completed_game INTEGER NOT NULL,
            updated_at TEXT
        );
        ",
    )?;

    Ok(())
}

fn ensure_single_row(connection: &Connection) -> Result<(), AppError> {
    connection.execute(
        "
        INSERT INTO best_score_state (id, best_score, has_completed_game, updated_at)
        SELECT 1, 0, 0, NULL
        WHERE NOT EXISTS (
            SELECT 1
            FROM best_score_state
            WHERE id = ?1
        )
        ",
        [INITIAL_ROW_IDENTIFIER],
    )?;

    Ok(())
}

pub fn read_best_score_state(connection: &Connection) -> Result<BestScoreState, AppError> {
    connection
        .query_row(
            "
            SELECT best_score, has_completed_game
            FROM best_score_state
            WHERE id = ?1
            ",
            [INITIAL_ROW_IDENTIFIER],
            |row| {
                Ok(BestScoreState {
                    best_score: row.get(0)?,
                    has_completed_game: row.get::<_, bool>(1)?,
                })
            },
        )
        .map_err(AppError::from)
}

fn corrupt_backup_path(database_path: &Path) -> std::path::PathBuf {
    let file_name = database_path
        .file_name()
        .expect("database path should include a file name")
        .to_string_lossy();
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("system clock should be after the Unix epoch")
        .as_nanos();

    database_path.with_file_name(format!("{file_name}.corrupt.{timestamp}"))
}

#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::PathBuf;
    use std::time::{SystemTime, UNIX_EPOCH};

    use rusqlite::Connection;

    use super::load_or_initialize_best_score_state;

    fn create_temp_directory(name: &str) -> PathBuf {
        let suffix = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("system clock should be after the Unix epoch")
            .as_nanos();
        let directory = std::env::temp_dir().join(format!("tetris-desktop-{name}-{suffix}"));

        fs::create_dir_all(&directory).expect("temporary directory should be created");
        directory
    }

    #[test]
    fn initializes_the_single_best_score_row_on_first_load() {
        let temp_directory = create_temp_directory("bootstrap-first-run");
        let database_path = temp_directory.join("best-score.sqlite3");

        let state = load_or_initialize_best_score_state(&database_path)
            .expect("first-run database bootstrap should succeed");

        assert!(database_path.exists(), "database file should be created");
        assert_eq!(state.best_score, 0);
        assert!(!state.has_completed_game);

        fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
    }

    #[test]
    fn preserves_the_existing_best_score_row_when_present() {
        let temp_directory = create_temp_directory("bootstrap-existing");
        let database_path = temp_directory.join("best-score.sqlite3");
        let connection = Connection::open(&database_path).expect("database should open for test seeding");

        connection
            .execute_batch(
                "
                CREATE TABLE best_score_state (
                    id INTEGER PRIMARY KEY CHECK (id = 1),
                    best_score INTEGER NOT NULL CHECK (best_score >= 0),
                    has_completed_game INTEGER NOT NULL,
                    updated_at TEXT
                );

                INSERT INTO best_score_state (id, best_score, has_completed_game, updated_at)
                VALUES (1, 2400, 1, '2026-04-12T00:00:00Z');
                ",
            )
            .expect("seed schema should be created");

        let state = load_or_initialize_best_score_state(&database_path)
            .expect("existing best score should be preserved");

        assert_eq!(state.best_score, 2400);
        assert!(state.has_completed_game);

        drop(connection);
        fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
    }
}

fn attempt_load_best_score_state(database_path: &Path) -> Result<BestScoreState, AppError> {
    let connection = open_best_score_database(database_path)?;

    read_best_score_state(&connection)
}