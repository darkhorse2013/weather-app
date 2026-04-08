# Weather App Backlog

This file keeps a simple running log of what we want to build, what we are actively touching, and what we have already finished on our fork.

## How We Use This

- Add feature ideas or fixes to `Ideas`.
- Move an item to `In Progress` when we start coding it.
- Move an item to `Done` when the code is merged into our branch.
- Keep commits focused on one change at a time so git history stays easy to follow.
- Add a backlog entry for every shipped improvement so the audit trail stays complete.

## Ideas

- `WX-011` Add a Celsius/Fahrenheit toggle.
- `WX-013` Improve empty, loading, and error states so the app feels friendlier.

## In Progress

- None right now.

## Done

- `WX-047` Rebalanced the CNC palette toward darker neutral panel interiors with red used more as an accent for readability.
- `WX-046` Added a faint CNC command-screen silhouette and extra corner HUD detail behind the main interface.
- `WX-045` Added stronger CNC divider rails and corner accents to tie the sections together more like a tactical HUD.
- `WX-043` Added a CNC button shimmer sweep and stronger active glow so the command controls feel more animated.
- `WX-044` Deepened the CNC weather panels with stronger embossed edges, inset framing, and a more raised card treatment.
- `WX-042` Limited the title status indicator so `ONLINE` only appears when the CNC theme is active.
- `WX-041` Upgraded CNC typography and active control states so the theme reads more like a tactical game interface.
- `WX-040` Added CNC HUD textures and ambient red overlay details behind the interface panels.
- `WX-039` Added a CNC title plate, status strip, and tactical section framing around the main weather panels.
- `WX-038` Reshaped the CNC panels, search controls, and chips with sharper angular frames and stronger red panel styling.
- `WX-037` Reduced the CNC title sizing and spacing so the app heading stays compact on narrower cards.
- `WX-036` Tightened the CNC heading and made the search controls hold a single row more reliably on medium-narrow screens.
- `WX-035` Replaced the options modal with a direct CNC theme toggle and kept the search controls on one compact row until narrow mobile widths.
- `WX-034` Kept the search input, search button, and options button aligned on one row on larger screens.
- `WX-031` Added an options button and modal shell to hold future theme controls.
- `WX-030` Kept saved city chips in place when selected and highlighted the active city instead of reordering the list.
- `WX-029` Rounded displayed temperatures to whole numbers across the weather cards.
- `WX-028` Removed the extra card kickers so the hero and forecast cards feel cleaner.
- `WX-027` Updated the smaller forecast cards to match the visual hierarchy of the hero card more closely.
- `WX-026` Slowed the weekly temperature trend animation so the chart motion reads more clearly.
- `WX-025` Cleared the search input back to the placeholder after a successful search.
- `WX-024` Animated the weekly temperature trend when it enters view.
- `WX-023` Fixed the forecast card scroll-reveal logic so off-screen cards reliably appear when they enter view.
- `WX-022` Replaced the immediate forecast-card stagger with scroll-into-view reveals.
- `WX-021` Added a staggered reveal animation to the forecast cards after search results load.
- `WX-020` Added gentle weather-aware motion to the featured forecast icon.
- `WX-019` Added a subtle fade-and-rise entrance animation to the featured weather card.
- `WX-018` Moved the city prompt into placeholder text so the search input starts cleaner.
- `WX-017` Removed the welcome subtitle to give the app header a cleaner start.
- `WX-016` Removed the extra top gap so the weather card sits flush with the page.
- `WX-015` Added remove buttons to saved city chips so saved searches can be pruned easily.
- `WX-010` Added geocoded location context so results show town and country in the title.
- `WX-012` Added a simple weekly temperature trend visual to the forecast results.
- `WX-009` Added a rule-based weather summary message to the featured forecast card.
- `WX-008` Added saved cities with `localStorage` for quick repeat searches.
- `WX-007` Added weather-based themes so the page and featured forecast card react to conditions.
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
