use tauri::AppHandle;

use crate::utils::play_sound;

#[tauri::command]
pub fn play_countdown_sound(app: AppHandle) {
    let audio_path = app
        .path_resolver()
        .resolve_resource("resources/solemn.mp3")
        .unwrap();

    play_sound(audio_path);
}

#[tauri::command]
pub fn play_success_sound(app: AppHandle) {
    let audio_path = app
        .path_resolver()
        .resolve_resource("resources/pristine.mp3")
        .unwrap();

    play_sound(audio_path);
}
