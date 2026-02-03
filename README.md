# PrismShell <img src="docs/logo.png" align="right" width="120" height="120">

A modern, colorful, UI/UX-focused terminal application replacing PuTTY.

## Project Structure

- `src-ui/`: React + TypeScript frontend (Vite)
- `src-core/`: Rust backend (Tauri)
- `themes/`: Theme definitions files
- `plugins/`: Future extension system

## Setup

> **Note**: This project was initialized offline. You must install dependencies before running.

1. **Install Frontend Dependencies**:
   ```bash
   cd src-ui
   npm install
   ```

2. **Run Development Server**:
   ```bash
   # From the root directory (using Tauri CLI if installed globally)
   tauri dev

   # OR via npm script in src-ui if configured to call tauri
   # But typically you run tauri dev from the project root if tauri-cli is installed
   cargo tauri dev
   ```

## Development

- **Frontend**: Edit `src-ui/src/App.tsx` for UI changes.
- **Backend**: Edit `src-core/src/main.rs` for Rust logic.

## Features (Planned)

- SSH v2 Support
- Session Management
- Themes (JSON based)
