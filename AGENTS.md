# Stud.io Implementation Rules

## Sources of truth

- Functional behavior must follow `C:\Users\ksd16\Downloads\스터디오 기능명세서 v1.1.xlsx`.
- Visual layout and component styling must follow the Figma file `Qum4pYMkhuSktQ0JMttoaw` and the node URLs supplied for each task.
- Apply requirements in this order: the user's latest instruction, the functional specification, the referenced Figma node, then existing local conventions.
- Before implementing a screen, locate its rows in the specification and account for function description, input conditions, exception handling, and notes. Do not implement only the visible happy path.

## App-wide behavior

- Preserve entered state when moving backward and forward unless the specification explicitly requires reset.
- Required selections and fields must gate progression. Disabled, loading, empty, error, and retry states must follow the specification.
- Fixed bottom controls and navigation must use the device's actual bottom safe-area inset exactly once. Devices without a bottom inset must not receive artificial spacing.
- Reuse the components and tokens under `components/` and `constants/` before introducing screen-local equivalents.
- Keep navigation behavior explicit and register every new Expo Router screen in `app/_layout.tsx`.
- User-visible Korean text must remain valid UTF-8. Do not introduce mojibake or retain corrupted placeholder text in newly implemented UI.

## Data continuity

- AI tutor inputs (exam, date, subjects, ranges, content, study style, schedule) are the source for generated plans and report progress.
- Planner completion, completion-rate changes, and daily reflections must update downstream progress and reports.
- Weekly review and next-week strategy are weekly data; date-based views refresh at the documented boundary once policy is finalized.
- Avoid duplicate application when a generated strategy is reflected in the planner.

## AI report

- Route: `/ai-report`. The bottom navigation order is Home, AI Report, Study Room, My.
- The header shows the tutor character, exam D-day, and a report share action.
- Tabs are Overview, Weakness Analysis, and Weekly Review. Changing tabs resets scroll to the top.
- Overview includes total progress, subject progress/status, the lowest-priority warning, AI diagnosis, strategy refresh, weekly statistics, and seven-day activity.
- Weakness Analysis includes data-derived weakness cards, severity badges, and numbered remediation actions. A severity badge opens the subject's detailed strategy.
- Weekly Review includes the streak banner, weekly statistics and insights, strengths, weaknesses, and numbered next-week actions.
- Reports update from planner completion/reflection data and AI tutor scope/goal data rather than remaining hard-coded once the data layer is connected.

## Verification

- For implementation work, run TypeScript and targeted ESLint checks. The user performs final visual acceptance unless they request otherwise.
