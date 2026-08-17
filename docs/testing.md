# Testing strategy

The test suite runs entirely against local data in jsdom. It does not require secrets, network services, or machine-specific files.

Run all verification commands with Node.js 20.19.5:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Tests cover pure domain rules, repository cancellation, persistent selection, labelled controls, table identity, drawer focus and notes, summary semantics, and the principal application workflow.

