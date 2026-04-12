use std::fs;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

use rusqlite::Connection;
use tetris_desktop::commands::load_best_score_state::load_best_score_state_from_storage;
use tetris_desktop::runtime::storage_path::{StorageMode, StorageResolution};

fn create_temp_directory(name: &str) -> PathBuf {
    let unique_suffix = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("system clock should be after the Unix epoch")
        .as_nanos();
    let directory = std::env::temp_dir().join(format!("tetris-desktop-{name}-{unique_suffix}"));

    fs::create_dir_all(&directory).expect("temporary directory should be created");
    directory
}

fn portable_storage_resolution(database_path: PathBuf) -> StorageResolution {
    StorageResolution {
        mode: StorageMode::PortableAdjacent,
        database_path,
        notice: None,
    }
}

#[test]
fn creates_a_database_and_hides_best_score_on_first_run() {
    let temp_directory = create_temp_directory("first-run");
    let database_path = temp_directory.join("best-score.sqlite3");
    let storage = portable_storage_resolution(database_path.clone());

    let response = load_best_score_state_from_storage(&storage)
        .expect("first-run startup command should succeed");

    assert!(database_path.exists(), "startup should create the database file");
    assert_eq!(response.best_score, 0);
    assert!(!response.has_completed_game);
    assert!(!response.show_best_score);
    assert_eq!(response.storage_mode, StorageMode::PortableAdjacent);
    assert!(response.notice.is_none());

    fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
}

#[test]
fn hydrates_the_existing_saved_best_score() {
    let temp_directory = create_temp_directory("existing-score");
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
            VALUES (1, 4800, 1, '2026-04-12T00:00:00Z');
            ",
        )
        .expect("seed schema should be created");

    let storage = portable_storage_resolution(database_path);
    let response = load_best_score_state_from_storage(&storage)
        .expect("startup command should hydrate the saved best score");

    assert_eq!(response.best_score, 4800);
    assert!(response.has_completed_game);
    assert!(response.show_best_score);
    assert_eq!(response.storage_mode, StorageMode::PortableAdjacent);
    assert!(response.notice.is_none());

    fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
}