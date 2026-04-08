# Weather App Backlog

This file keeps a simple running log of what we want to build, what we are actively touching, and what we have already finished on our fork.

## How We Use This

- Add feature ideas or fixes to `Ideas`.
- Move an item to `In Progress` when we start coding it.
- Move an item to `Done` when the code is merged into our branch.
- Keep commits focused on one change at a time so git history stays easy to follow.

## Ideas

- `WX-007` Add weather-based themes so the background and cards change with conditions.
- `WX-008` Add saved cities using `localStorage` for quick repeat searches.
- `WX-009` Add a small weather summary message such as `Take an umbrella` or `Great day for a walk`.
- `WX-010` Show location context from geocoding, such as country or region.
- `WX-011` Add a Celsius/Fahrenheit toggle.
- `WX-012` Add a simple temperature trend visual for the week.
- `WX-013` Improve empty, loading, and error states so the app feels friendlier.

## In Progress

- None right now.

## Done

- `WX-006` Added a featured `Today` card above the weekly forecast grid.
- `WX-005` Replaced raw forecast dates with `Today`, `Tomorrow`, and weekday labels.
- `WX-004` Finished the date helper and now only highlights the current day in the forecast.
- `WX-003` Replaced garbled weather icon text with safe Unicode escapes and fixed the temperature degree symbol.
- `WX-001` Replaced the broken starter tests with app-specific baseline tests.
- `WX-002` Removed leftover starter CSS from `src/index.css` so app styling is easier to control.
- `WX-014` Set up a lightweight backlog and working rhythm for changes on the fork.
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
