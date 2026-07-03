// stud.io 디자인 토큰 → 실제 색상값
// Figma Dev Mode CSS에서 추출한 정확한 값들

export const Colors = {
  // Primary (청록 계열)
  'Fill.Primary.Normal':    '#66BFCD',   // 활성 버튼 배경
  'Fill.Primary.Assistive': '#E1F3F5',   // 선택된 탭 배경
  'Line.Primary.Normal':    '#66BFCD',   // 선택된 탭 테두리

  // Normal Fill
  'Fill.Normal.Normal':     '#FFFFFF',   // 기본 흰 배경
  'Fill.Normal.Assistive':  '#F5F5F5',   // 보조 배경
  'Fill.Normal.Inactive':   '#D3D5D7',   // 비활성 버튼 배경

  // Line
  'Line.Normal.Normal':     '#ECEEF0',   // 기본 테두리 (얇은)
  'Line.Normal.Strong':     '#D3D5D7',   // 강조 테두리

  // Text
  'Text.Normal.Normal':     '#56585A',   // 선택된 탭 텍스트 / 기본 텍스트
  'Text.Normal.Assistive':  '#A1A3A5',   // 미선택 탭 텍스트 / placeholder
  'Text.Normal.Strong':     '#1A1A1A',   // 제목 텍스트
  'Text.Normal.Subtle':     '#A1A3A5',   // 헬퍼텍스트
  'Text.Normal.Inverse':    '#FFFFFF',   // 버튼 위 흰 텍스트
  'Text.Primary.Strong':    '#66BFCD',   // Primary 강조 텍스트
} as const;