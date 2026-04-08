# Weather App Backlog

This file keeps a simple running log of what we want to build, what we are actively touching, and what we have already finished on our fork.

## How We Use This

- Add feature ideas or fixes to `Ideas`.
- Move an item to `In Progress` when we start coding it.
- Move an item to `Done` when the code is merged into our branch.
- Keep commits focused on one change at a time so git history stays easy to follow.

## Ideas

- `WX-001` Fix the broken starter tests so the repo has a reliable baseline.
- `WX-002` Clean up leftover starter CSS and make the app styling feel more intentional.
- `WX-003` Fix weather icon encoding so condition symbols render correctly.
- `WX-004` Finish the `checkDate` helper and highlight the current day in the forecast.
- `WX-005` Format forecast dates as `Today`, `Tomorrow`, and weekday names instead of raw API dates.
- `WX-006` Add a featured `Today` card above the forecast grid.
- `WX-007` Add weather-based themes so the background and cards change with conditions.
- `WX-008` Add saved cities using `localStorage` for quick repeat searches.
- `WX-009` Add a small weather summary message such as `Take an umbrella` or `Great day for a walk`.
- `WX-010` Show location context from geocoding, such as country or region.
- `WX-011` Add a Celsius/Fahrenheit toggle.
- `WX-012` Add a simple temperature trend visual for the week.
- `WX-013` Improve empty, loading, and error states so the app feels friendlier.

## In Progress

- `WX-014` Set up a lightweight backlog and working rhythm for changes on the fork.

## Done

- `WX-900` Forked the project to `wamballa/weather-app`.
- `WX-901` Pushed the `steve-hack` branch to the fork and linked it to `origin/steve-hack`.
- `WX-902` Verified local pushes go to the fork, not the original repository.

## Testing Track

- `WX-101` Replace template-era tests in `src/App.test.jsx` with app-specific tests.
- `WX-102` Add fetch-mocking tests for empty city validation.
- `WX-103` Add fetch-mocking tests for city not found handling.
- `WX-104` Add fetch-mocking tests for successful forecast rendering.
- `WX-105` Consider extracting API and data-formatting helpers into `src/utils` so they are easier to test in isolation.
- `WX-106` Add one small end-to-end smoke test for the main flow: search city -> results appear.

## Notes

- A simple test harness does make sense here.
- We do not need anything heavy yet because Vitest and Playwright are already installed.
- The best first harness is:
  - a few reliable component tests with mocked API responses
  - one end-to-end smoke test that proves the main search flow works
- That gives us confidence for UI improvements without changing the core tech stack.
