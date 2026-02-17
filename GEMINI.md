# Local Project Instructions (Gemini CLI)

This file contains instructions and context for the Gemini CLI agent when working on this project.

## Project Overview
- **Fork of:** [ignidash](https://github.com/schelskedevco/ignidash)
- **Primary Tech Stack:** Next.js, Convex, Tailwind CSS, Better Auth.
- **Workflow:** Using `jj` (Jujutsu) for version control with a clear separation between upstream and personal changes.

## Branching Strategy
- `main`: **Mirror only.** Its sole function is to track `upstream/main` (the original repo). Do not commit here.
- `personal`: **Default development branch.** All custom features and configurations live here. It must always be based on the current `main`.
- **PR Workflow:** All new Pull Requests must be directed to the `personal` branch on the remote.

## Custom Changes
- Version control switched to `jj` (colocated with git).
- Added `GEMINI.md` for persistent agent context.
- Documented branching strategy in README.

## Local Conventions
- Use `jj` commands for revision management.
- **Syncing with upstream:**
  1. `jj git fetch --remote upstream`
  2. `jj bookmark set main -r main@upstream`
  3. `jj rebase -b personal -d main`
- **Pushing Changes:**
  - Push your work: `jj git push --bookmark personal`
- Refer to `SELF_HOSTING.md` for setup and deployment details.
