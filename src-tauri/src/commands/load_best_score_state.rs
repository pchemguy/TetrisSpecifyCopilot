use serde::Serialize;

use crate::errors::AppError;
use crate::persistence::database::load_or_initialize_best_score_state_with_recovery;
use crate::runtime::storage_path::{
    resolve_storage_path,
    StorageMode,
    StorageNotice,
    StorageResolution,
};

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
    let outcome = load_or_initialize_best_score_state_with_recovery(&storage.database_path)?;
    let notice = if outcome.database_reset {
        Some(StartupNotice {
            code: StartupNoticeCode::DatabaseReset,
            message: "Desktop persistence was reset after recovering from a corrupt database.".into(),
        })
    } else if storage.notice == Some(StorageNotice::StorageFallback) {
        Some(StartupNotice {
            code: StartupNoticeCode::StorageFallback,
            message: "Desktop storage moved to LocalAppData because the app folder was not writable.".into(),
        })
    } else {
        None
    };

    Ok(LoadBestScoreStateResponse {
        best_score: outcome.state.best_score,
        has_completed_game: outcome.state.has_completed_game,
        show_best_score: outcome.state.has_completed_game,
        storage_mode: storage.mode,
        notice,
    })
}

pub fn load_best_score_state() -> Result<LoadBestScoreStateResponse, AppError> {
    let storage = resolve_storage_path()?;

    load_best_score_state_from_storage(&storage)
}