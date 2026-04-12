#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tetris_desktop::commands::load_best_score_state::{
    load_best_score_state as load_best_score_state_command,
    LoadBestScoreStateResponse,
};
use tetris_desktop::commands::submit_game_over_score::{
    submit_game_over_score as submit_game_over_score_command,
    SubmitGameOverScoreRequest,
    SubmitGameOverScoreResponse,
};

#[tauri::command]
fn load_best_score_state() -> Result<LoadBestScoreStateResponse, String> {
    load_best_score_state_command().map_err(|error| error.to_string())
}

#[tauri::command]
fn submit_game_over_score(
    request: SubmitGameOverScoreRequest,
) -> Result<SubmitGameOverScoreResponse, String> {
    submit_game_over_score_command(request).map_err(|error| error.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_best_score_state, submit_game_over_score])
        .run(tauri::generate_context!())
        .expect("failed to run Tauri application");
}