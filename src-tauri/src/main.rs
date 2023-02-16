#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod utils;

use commands::{play_countdown_sound, play_success_sound};

use tauri::{
    ActivationPolicy, App, AppHandle, GlobalWindowEvent, Manager, SystemTray, SystemTrayEvent,
    WindowEvent,
};

use tauri_plugin_positioner::{Position, WindowExt};

fn handle_system_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    tauri_plugin_positioner::on_tray_event(app, &event);
    if let SystemTrayEvent::LeftClick { .. } = event {
        let window = app.get_window("main").unwrap();
        let _ = window.move_window(Position::TrayBottomCenter);

        if window.is_visible().unwrap() {
            window.hide().unwrap();
            window.emit("window:hidden", false).unwrap();
        } else {
            window.show().unwrap();
            window.set_focus().unwrap();
        }
    }
}

fn handle_setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let win = app.get_window("main").expect("window not found");

    let _ = win.set_always_on_top(true);
    app.set_activation_policy(ActivationPolicy::Accessory);

    Ok(())
}

fn handle_window_event(event: GlobalWindowEvent) {
    let event_type = event.event();

    if let WindowEvent::Focused(false) = event_type {
        event.window().hide().unwrap();
        event.window().emit("window:hidden", true).unwrap();
    }
}

use tauri_plugin_autostart::MacosLauncher;

fn main() {
    let tray = SystemTray::new();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            play_countdown_sound,
            play_success_sound
        ])
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .system_tray(tray)
        .on_system_tray_event(handle_system_tray_event)
        .setup(handle_setup)
        .on_window_event(handle_window_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
