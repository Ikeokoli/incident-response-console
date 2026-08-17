# Contributing

Keep changes narrow and user-observable. Before opening a pull request:

1. Reproduce the current behavior and record the expected outcome.
2. Preserve state ownership, stable identity, keyboard interaction, and focus behavior.
3. Prefer derived values over duplicated state.
4. Clean up requests, listeners, timers, and observers created by effects.
5. Run lint, typecheck, tests, and the production build.
6. Review the diff for generated output, secrets, and unrelated edits.

Do not commit dependency updates as part of an unrelated behavior repair.

