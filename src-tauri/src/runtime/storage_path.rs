use std::fs::{self, OpenOptions};
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};

use serde::Serialize;

use crate::errors::AppError;

const DATABASE_FILE_NAME: &str = "best-score.sqlite3";
const LOCAL_APP_DATA_DIRECTORY_NAME: &str = "Classic Browser Tetris";

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum StorageMode {
    PortableAdjacent,
    LocalappdataFallback,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum StorageNotice {
    StorageFallback,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct StorageResolution {
    pub mode: StorageMode,
    pub database_path: PathBuf,
    pub notice: Option<StorageNotice>,
}

pub fn resolve_storage_path() -> Result<StorageResolution, AppError> {
    let executable_path = std::env::current_exe()?;
    let local_app_data = std::env::var_os("LOCALAPPDATA")
        .map(PathBuf::from)
        .ok_or(AppError::MissingLocalAppData)?;

    resolve_storage_path_from(&executable_path, &local_app_data)
}

pub fn resolve_storage_path_from(
    executable_path: &Path,
    local_app_data: &Path,
) -> Result<StorageResolution, AppError> {
    let executable_directory = executable_path
        .parent()
        .ok_or(AppError::MissingExecutableDirectory)?;

    if is_directory_writable(executable_directory)? {
        return Ok(StorageResolution {
            mode: StorageMode::PortableAdjacent,
            database_path: executable_directory.join(DATABASE_FILE_NAME),
            notice: None,
        });
    }

    let fallback_directory = local_app_data.join(LOCAL_APP_DATA_DIRECTORY_NAME);
    fs::create_dir_all(&fallback_directory)?;

    Ok(StorageResolution {
        mode: StorageMode::LocalappdataFallback,
        database_path: fallback_directory.join(DATABASE_FILE_NAME),
        notice: Some(StorageNotice::StorageFallback),
    })
}

fn is_directory_writable(directory: &Path) -> Result<bool, AppError> {
    if !directory.exists() {
        return Ok(false);
    }

    let probe_path = directory.join(format!(
        ".tetris-write-probe-{}",
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("system clock should be after the Unix epoch")
            .as_nanos()
    ));

    match OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&probe_path)
    {
        Ok(file) => {
            drop(file);
            fs::remove_file(probe_path)?;
            Ok(true)
        }
        Err(error) if error.kind() == std::io::ErrorKind::PermissionDenied => Ok(false),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok(false),
        Err(error) => Err(AppError::Io(error)),
    }
}

#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::PathBuf;
    use std::time::{SystemTime, UNIX_EPOCH};

    use super::{resolve_storage_path_from, StorageMode, StorageNotice};

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
    fn uses_portable_adjacent_storage_when_the_executable_directory_is_writable() {
        let temp_directory = create_temp_directory("portable-storage");
        let executable_path = temp_directory.join("ClassicBrowserTetris.exe");
        let local_app_data = temp_directory.join("localappdata");

        let resolution = resolve_storage_path_from(&executable_path, &local_app_data)
            .expect("portable path resolution should succeed");

        assert_eq!(resolution.mode, StorageMode::PortableAdjacent);
        assert_eq!(resolution.database_path, temp_directory.join("best-score.sqlite3"));
        assert!(resolution.notice.is_none());

        fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
    }

    #[test]
    fn falls_back_to_local_app_data_when_the_executable_directory_is_not_writable() {
        let temp_directory = create_temp_directory("fallback-storage");
        let executable_path = temp_directory.join("missing").join("ClassicBrowserTetris.exe");
        let local_app_data = temp_directory.join("localappdata");

        let resolution = resolve_storage_path_from(&executable_path, &local_app_data)
            .expect("fallback path resolution should succeed");

        assert_eq!(resolution.mode, StorageMode::LocalappdataFallback);
        assert_eq!(
            resolution.database_path,
            local_app_data
                .join("Classic Browser Tetris")
                .join("best-score.sqlite3"),
        );
        assert_eq!(resolution.notice, Some(StorageNotice::StorageFallback));

        fs::remove_dir_all(temp_directory).expect("temporary directory should be removed");
    }
}