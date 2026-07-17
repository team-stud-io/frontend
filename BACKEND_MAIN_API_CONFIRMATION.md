# main 브랜치 기준 AI 튜터 API 계약 확인 요청

안녕하세요. 프론트는 백엔드 `main` 브랜치를 실제 연동 기준으로 구현하려고 합니다.
다만 전달받은 **「1순위 - AI 튜터 생성 API 명세서 최종」**과 `main` 구현에 차이가 있어, 아래 항목의 최종 계약을 확인 부탁드립니다.

## 1. `exam-dates`와 별도 과목 생성 API의 역할

- 명세서: `PUT /ai-tutor-sessions/{sessionId}/exam-dates`가 과목 생성과 시험일 저장을 함께 수행
- `main`:
  - [`AiTutorSessionController.java:54`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/session/controller/AiTutorSessionController.java#L54) — `PUT /ai-tutor-sessions/{sessionId}/exam-dates`
  - [`SubjectTutorController.java:44`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/subject/controller/SubjectTutorController.java#L44) — `POST /ai-tutor-sessions/{sessionId}/subjects`
  - [`AiTutorSessionService.java:86`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/session/service/AiTutorSessionService.java#L86) — `setExamDates`
  - [`AiTutorSessionService.java:99`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/session/service/AiTutorSessionService.java#L99) — 과목이 없으면 생성하고, 있으면 시험일 갱신

### 확인 부탁드립니다

프론트는 명세서대로 `exam-dates`만 호출하고 응답의 `subject_tutor_id`를 사용하면 될까요? 별도 과목 생성 API를 먼저 호출해야 하는 경우도 있는지 알려주세요.

## 2. 과목별 저장 API 경로와 메서드

| 기능 | 최종 명세서 | `main` 구현 |
|---|---|---|
| 범위 | `PUT /ai-tutor-sessions/{sessionId}/scope` | [`PUT /subjects/{subjectId}/scope`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/subject/controller/SubjectTutorController.java#L70) |
| 출제 스타일 | `PUT /ai-tutor-sessions/{subjectId}/content-style` | [`PUT /subjects/{subjectId}/content-style`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/subject/controller/SubjectTutorController.java#L76) |
| 자료 | `PUT /ai-tutor-sessions/{subjectId}/materials` | [`PUT /subjects/{subjectId}/materials`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/subject/controller/SubjectTutorController.java#L82) |
| 일정 | `POST /ai-tutor-sessions/{subjectId}/schedule` | [`PUT /subjects/{subjectId}/schedule`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/subject/controller/SubjectTutorController.java#L105) |

### 확인 부탁드립니다

프론트가 `main`의 경로와 메서드를 그대로 사용하면 될까요? 아니면 최종 명세서 기준으로 `main`이 변경될 예정인가요?

## 3. 전략 생성 API

- 명세서 URL: `/ai-tutor-sessions/ai-tutor-sessions/{sessionId}/strategies/generate`
- `main` URL: [`/ai-tutor-sessions/{sessionId}/strategies/generate`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/strategy/controller/StrategyController.java#L25)
- `main` 응답 상태: [`202 Accepted`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/strategy/controller/StrategyController.java#L27)
- `main` 요청 본문: 없음

### 확인 부탁드립니다

`main`의 URL, `202 Accepted`, 빈 요청 본문을 최종 계약으로 보면 될까요? 명세서의 `ai-tutor-sessions` 중복은 오타인지 확인 부탁드립니다.

## 4. 생성 상태값

- 명세서 일부 예시: `WAITING`
- `main`:
  - [`WAITING("대기")`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/strategy/entity/AiStrategyGenerationStatus.java#L9)
  - [`ANALYZING("분석중")`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/strategy/entity/AiStrategyGenerationStatus.java#L10)
  - [`COMPLETED("완료")`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/strategy/entity/AiStrategyGenerationStatus.java#L11)
  - [`FAILED("실패")`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/strategy/entity/AiStrategyGenerationStatus.java#L12)

### 확인 부탁드립니다

실제 API 응답은 한글 표시값만 내려오는지, 영문 enum 값도 내려올 수 있는지 알려주세요.

## 5. 같은 카테고리의 세부 과목 복수 선택 정책

최종 명세서 예시에는 `사회탐구 + 사회·문화`, `수학 + 확률과 통계`처럼 카테고리와 세부 과목명이 함께 들어갑니다.

하지만 `main`의 기존 과목 검색은 [`AiTutorSessionService.java:119`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/session/service/AiTutorSessionService.java#L119)부터 다음 기준으로 동작합니다.

- 같은 `subject_category`인지 확인
- `custom_subject_name`은 `subject_category`가 `직접입력`인 경우에만 식별에 사용
- 일반 카테고리에서는 세부 과목명이 달라도 같은 과목으로 판단될 수 있음

### 확인 부탁드립니다

한 세션 안에서 같은 `subject_category`의 세부 과목을 여러 개 허용하나요? 아니면 카테고리당 하나만 허용하나요?

## 6. 최종 명세서에 없는 `main` API

- 과목 수정·삭제: [`SubjectTutorController.java:56`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/subject/controller/SubjectTutorController.java#L56), [`:63`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/subject/controller/SubjectTutorController.java#L63)
- 이미지 업로드·삭제: [`SubjectTutorController.java:88`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/subject/controller/SubjectTutorController.java#L88), [`:99`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/subject/controller/SubjectTutorController.java#L99)
- 레거시 완료·상태 조회: [`SubjectTutorController.java:111`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/subject/controller/SubjectTutorController.java#L111), [`:117`](https://github.com/team-stud-io/backend/blob/main/src/main/java/com/io/stud/studio/subject/controller/SubjectTutorController.java#L117)

### 확인 부탁드립니다

MVP 프론트에서 사용할 API 범위를 확정 부탁드립니다. 현재 프론트는 세션 단위 `strategies/generate`를 사용하고, `/complete`와 `/generation-status`는 호출하지 않을 계획입니다.

## 프론트의 임시 적용 원칙

백엔드 답변 전까지는 다음과 같이 진행합니다.

- API 경로·HTTP 메서드·상태 코드는 `main` 기준
- 요청·응답 필드와 화면 데이터는 최종 명세서 기준
- 전략 생성은 모든 과목 저장 후 한 번만 호출
- `/complete`, `/generation-status`는 호출하지 않음
- 세부 과목 중복 조합은 정책 확정 전까지 테스트에서 제외

