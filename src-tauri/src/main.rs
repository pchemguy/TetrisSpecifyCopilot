#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tetris_desktop::commands::load_best_score_state::{
    load_best_score_state as load_best_score_state_command,
    LoadBestScoreStateResponse,
};

#[tauri::command]
fn load_best_score_state() -> Result<LoadBestScoreStateResponse, String> {
    load_best_score_state_command().map_err(|error| error.to_string())
}

fn main() {
    tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![load_best_score_state])
        .run(tauri::generate_context!())
        .expect("failed to run Tauri application");
}