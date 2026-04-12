use serde::{Deserialize, Serialize};

use crate::errors::AppError;
use crate::persistence::best_score_repository::submit_game_over_score as submit_game_over_score_to_database;
use crate::runtime::storage_path::{resolve_storage_path, StorageResolution};

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubmitGameOverScoreRequest {
    pub final_score: i64,
    pub completed_reason: String,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubmitGameOverScoreResponse {
    pub best_score: i64,
    pub has_completed_game: bool,
    pub is_new_best: bool,
    pub show_congratulations: bool,
    pub show_best_score: bool,
}

pub fn submit_game_over_score_from_storage(
    storage: &StorageResolution,
    request: SubmitGameOverScoreRequest,
) -> Result<SubmitGameOverScoreResponse, AppError> {
    if request.completed_reason != "game_over" {
        return Err(AppError::InvalidCompletedReason(request.completed_reason));
    }

    let result = submit_game_over_score_to_database(&storage.database_path, request.final_score)?;

    Ok(SubmitGameOverScoreResponse {
        best_score: result.best_score,
        has_completed_game: result.has_completed_game,
        is_new_best: result.is_new_best,
        show_congratulations: result.is_new_best,
        show_best_score: result.has_completed_game,
    })
}

pub fn submit_game_over_score(
    request: SubmitGameOverScoreRequest,
) -> Result<SubmitGameOverScoreResponse, AppError> {
    let storage = resolve_storage_path()?;

    submit_game_over_score_from_storage(&storage, request)
}