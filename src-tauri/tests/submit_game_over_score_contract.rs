use std::fs;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

use rusqlite::Connection;
use tetris_desktop::commands::submit_game_over_score::{
    submit_game_over_score_from_storage,
    SubmitGameOverScoreRequest,
};
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

fn seed_best_score_state(database_path: &PathBuf, best_score: i64) -> Connection {
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
            VALUES (1, {best_score}, 1, '2026-04-12T00:00:00Z');
            "
        ))
        .expect("seed schema should be created");

    connection
}

#[test]
fn persists_a_strictly_greater_game_over_score_as_the_new_best() {
    let temp_directory = create_temp_directory("submit-greater");
    let database_path = temp_directory.join("best-score.sqlite3");
    let connection = seed_best_score_state(&database_path, 3200);
    drop(connection);
    let storage = portable_storage_resolution(database_path);

    let response = submit_game_over_score_from_storage(
        &storage,
        SubmitGameOverScoreRequest {
            final_score: 4800,
            completed_reason: "game_over".into(),
        },
    )
    .expect("strictly greater score should succeed");

    assert_eq!(response.best_score, 4800);
    assert!(response.has_completed_game);
    assert!(response.is_new_best);
    assert!(response.show_congratulations);
    assert!(response.show_best_score);

    fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
}

#[test]
fn leaves_the_stored_best_score_unchanged_for_an_equal_game_over_score() {
    let temp_directory = create_temp_directory("submit-equal");
    let database_path = temp_directory.join("best-score.sqlite3");
    let connection = seed_best_score_state(&database_path, 3200);
    drop(connection);
    let storage = portable_storage_resolution(database_path);

    let response = submit_game_over_score_from_storage(
        &storage,
        SubmitGameOverScoreRequest {
            final_score: 3200,
            completed_reason: "game_over".into(),
        },
    )
    .expect("equal score should succeed without updating the best score");

    assert_eq!(response.best_score, 3200);
    assert!(response.has_completed_game);
    assert!(!response.is_new_best);
    assert!(!response.show_congratulations);
    assert!(response.show_best_score);

    fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
}

#[test]
fn leaves_the_stored_best_score_unchanged_for_a_lower_game_over_score() {
    let temp_directory = create_temp_directory("submit-lower");
    let database_path = temp_directory.join("best-score.sqlite3");
    let connection = seed_best_score_state(&database_path, 3200);
    drop(connection);
    let storage = portable_storage_resolution(database_path);

    let response = submit_game_over_score_from_storage(
        &storage,
        SubmitGameOverScoreRequest {
            final_score: 1200,
            completed_reason: "game_over".into(),
        },
    )
    .expect("lower score should succeed without updating the best score");

    assert_eq!(response.best_score, 3200);
    assert!(response.has_completed_game);
    assert!(!response.is_new_best);
    assert!(!response.show_congratulations);
    assert!(response.show_best_score);

    fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
}