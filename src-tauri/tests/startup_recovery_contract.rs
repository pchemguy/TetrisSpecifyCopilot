use std::fs;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

use tetris_desktop::commands::load_best_score_state::{
    load_best_score_state_from_storage,
    StartupNoticeCode,
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

#[test]
fn recreates_a_missing_database_and_returns_a_valid_startup_state() {
    let temp_directory = create_temp_directory("recovery-missing");
    let database_path = temp_directory.join("best-score.sqlite3");
    let storage = portable_storage_resolution(database_path.clone());

    let response = load_best_score_state_from_storage(&storage)
        .expect("startup should recreate a missing database");

    assert!(database_path.exists(), "startup should recreate the database file");
    assert_eq!(response.best_score, 0);
    assert!(!response.has_completed_game);
    assert!(!response.show_best_score);
    assert!(response.notice.is_none());

    fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
}

#[test]
fn backup_renames_a_corrupt_database_and_returns_a_reset_notice() {
    let temp_directory = create_temp_directory("recovery-corrupt");
    let database_path = temp_directory.join("best-score.sqlite3");
    let storage = portable_storage_resolution(database_path.clone());

    fs::write(&database_path, b"not-a-valid-sqlite-database")
        .expect("corrupt database fixture should be written");

    let response = load_best_score_state_from_storage(&storage)
        .expect("startup should recover from a corrupt database");

    assert_eq!(response.best_score, 0);
    assert!(!response.has_completed_game);
    assert!(!response.show_best_score);
    assert_eq!(
        response.notice.as_ref().map(|notice| &notice.code),
        Some(&StartupNoticeCode::DatabaseReset),
    );

    let backup_exists = fs::read_dir(&temp_directory)
        .expect("temporary directory should be readable")
        .filter_map(Result::ok)
        .any(|entry| {
            entry
                .file_name()
                .to_string_lossy()
                .starts_with("best-score.sqlite3.corrupt.")
        });

    assert!(backup_exists, "startup should keep a timestamped corrupt-database backup");

    fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
}