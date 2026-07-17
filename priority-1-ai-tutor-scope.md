# Priority 1: AI Tutor Creation

## Goal

Implement the first-priority AI tutor flow from the Figma/service-planning notes.

Primary user journey:

1. Enter exam information.
2. Add one or more subjects.
3. Fill subject-specific tutor setup tabs.
4. Submit the setup and show AI strategy loading.
5. Show AI learning strategy, D-day plan, and subject strategy screens.

## MVP Scope

### 1. Basic Exam Info

Required inputs:

- Exam type: school exam, mock exam, CSAT
- Semester: first semester, second semester
- Exam period: midterm, final
- Goal text

### 2. Subject Add And Selection

Required behavior:

- `+` button opens subject selection/add UI.
- User enters subject name.
- A subject box/card is created.
- Selecting a subject opens its setup screen.
- Multiple subjects are supported.
- Each subject stores independent tutor setup data.

Supported subject groups:

- Korean
- Math
- English
- Social studies
- Science

### 3. Shared Subject Setup Structure

Each subject uses four tabs:

- Range
- Content style
- Owned materials
- Schedule

Shared behavior:

- Preserve input values when moving between tabs.
- Show current subject as a top tag or tab.
- Previous/Next navigation moves between screens or tabs.
- Disable Next when required fields are missing.
- On the final Schedule tab, Complete submits the AI tutor creation request.
- Optional teacher/student memo is allowed.
- Image uploads support JPG and PNG with an AI auto-analysis notice.

## Subject Setup Details

### Range Tab

Shared fields:

- Exam range text
- Current progress slider, 0-100%
- Target grade
- Previous exam grade
- Confidence level
- Weak areas text, optional

Subject-specific additions:

- Math: unknown/problem-response type
- Social studies: social subject selection
- Science: science subject selection
- English: Lesson/unit based range placeholder

### Content Style Tab

Shared fields:

- Source/material types
- Exam focus
- Essay/written-answer ratio slider, 0-100%
- Overall difficulty

Subject-specific additions:

- Korean/English: supplementary material transformation 여부
- Math: first-priority exam source
- Social studies: memorization vs understanding, map/graph problem frequency
- Science: calculation problem frequency, memorization vs principle understanding

### Owned Materials Tab

Fields:

- Textbook publisher
- Owned material types
- Print count
- Print photo upload, optional
- Previous exam/past paper upload, optional
- Subject-specific range table or evaluation plan upload, optional
- Math workbook name, optional

### Schedule Tab

Fields/behavior:

- Weekly schedule input for Monday-Saturday
- Time-block selection from 09:00 to 01:00
- Tap/drag to activate or deactivate multiple time blocks
- Complete button sends the AI tutor creation request

## AI Strategy Result Scope

### Loading

- Show AI strategy analysis loading screen after tutor creation.
- Copy: "전략 분석 중이에요 / 입력한 정보와 합격 선배 데이터를 함께 분석해서 전략을 짜고 있어요"
- Show character/loading animation.
- Automatically move to result screen when analysis completes.

### AI Learning Strategy Screen

Content:

- Summary cards: total study time, completed items, study streak
- One-line AI diagnosis
- Bullet insights from study pattern analysis
- Subject strategy card list
- Each subject card shows subject name, estimated time, and current progress
- 3-week strategy direction summary
- CTA to open D-day plan
- Save strategy button

### D-day Plan Screen

Content:

- Week tabs: week 1, week 2, week 3
- Study streak banner
- Overall progress bar
- Subject weekly strategy cards
- Urgency badges: urgent, caution, relaxed
- More and start buttons
- CTA to apply the week plan to planner
- Save strategy button

### Subject Strategy Screen

Content:

- Subject tabs
- FAQ accordion
- Weekly review summary
- Weekly insight bullets
- Next-week strategy action list
- Missing/weak area analysis cards
- CTA to apply strategy to planner
- Save strategy button

## Common Policies

- All setup data must drive strategy generation.
- Existing study history should be reflected later: study time, completed items, streak.
- Planner apply action must prevent duplicate application.
- Top back button returns to the previous screen.

## Suggested Implementation Order

1. Build the AI tutor creation form shell.
2. Add basic exam info and subject add/selection.
3. Implement the four setup tabs with state preservation and validation.
4. Add mocked submission and loading state.
5. Build mocked AI strategy result screens.
6. Connect real AI/planner APIs after backend contracts are defined.

## Open Questions

- Which frontend stack should be used for this empty workspace?
- Should the first implementation be a clickable prototype or production code?
- Is Figma access available for exact spacing, colors, and typography?
- What backend API contract should receive the tutor setup payload?
