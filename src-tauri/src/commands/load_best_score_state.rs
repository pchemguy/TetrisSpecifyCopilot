use serde::Serialize;

use crate::errors::AppError;
use crate::persistence::database::load_or_initialize_best_score_state;
use crate::runtime::storage_path::{resolve_storage_path, StorageMode, StorageResolution};

#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum StartupNoticeCode {
    StorageFallback,
    DatabaseReset,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
pub struct StartupNotice {
    pub code: StartupNoticeCode,
    pub message: String,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LoadBestScoreStateResponse {
    pub best_score: i64,
    pub has_completed_game: bool,
    pub show_best_score: bool,
    pub storage_mode: StorageMode,
    pub notice: Option<StartupNotice>,
}

pub fn load_best_score_state_from_storage(
    storage: &StorageResolution,
) -> Result<LoadBestScoreStateResponse, AppError> {
    let best_score_state = load_or_initialize_best_score_state(&storage.database_path)?;

    Ok(LoadBestScoreStateResponse {
        best_score: best_score_state.best_score,
        has_completed_game: best_score_state.has_completed_game,
        show_best_score: best_score_state.has_completed_game,
        storage_mode: storage.mode,
        notice: None,
    })
}

#[tauri::command]
pub fn load_best_score_state() -> Result<LoadBestScoreStateResponse, String> {
    let storage = resolve_storage_path().map_err(|error| error.to_string())?;

    load_best_score_state_from_storage(&storage).map_err(|error| error.to_string())
}