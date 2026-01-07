---
description: Run all pre-deployment quality checks (lint, format, build, tests)
allowed-tools: Bash(npm run lint:*), Bash(npm run format:check:*), Bash(npm run build:*), Bash(npm run test:*)
---

# Pre-deploy Checks

Run all quality checks before deploying:

1. Run ESLint: `npm run lint`
2. Run Prettier check: `npm run format:check`
3. Run build: `npm run build`
4. Run Playwright E2E tests: `npm run test`

If any check fails, fix the issues before proceeding.
Report a summary of results at the end.
