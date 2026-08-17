# Architecture

The console is a single React package at the repository root. It uses a deliberately small set of layers:

- `domain` owns incident types and pure filtering, sorting, and summary rules.
- `data` provides local fixtures so every workflow is reproducible without credentials.
- `services` exposes asynchronous repository operations and cancellation support.
- `hooks` own reusable React synchronization and interaction state.
- `components` render semantic, keyboard-operable user interfaces.

Durable incident selection remains separate from the current result set. Visible rows are derived from repository responses, while selection is keyed by stable incident identifiers.

