import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import {
  AiReportLayout,
  NumberedAction,
  NumberedList,
  ReportStack,
  ReportTone,
  WeaknessItem,
  reportCardStyles as styles,
} from '../../components/ai-report';

interface WeaknessData {
  subject: string;
  course: string;
  title: string;
  tag: string;
  tone: ReportTone;
}

const WEAKNESSES: WeaknessData[] = [
  {
    subject: '수학',
    course: '수학 [미분 · 적분]',
    title: '합성함수 미분에서 3일 연속 실수 반복.\n개념보다 적용이 흔들리는 상태예요.',
    tag: '긴급 보완 필요',
    tone: 'red',
  },
  {
    subject: '국어',
    course: '국어 [비문학 추론]',
    title: '완료도는 높지만 난이도를 올릴 표시가 낮아요.\n추론 문제에서 막히고 있어요.',
    tag: '보완 권장',
    tone: 'orange',
  },
  {
    subject: '영어',
    course: '영어 [어법 문제]',
    title: '복습 ON이 반복되는 유형이에요.\n특정 어법 포인트에 정리가 필요해요.',
    tag: '꾸준히 보완 중',
    tone: 'blue',
  },
  {
    subject: '과목',
    course: '과목 [문제 이름]',
    title: '본문 내용입니다. 본문 내용입니다.\n본문 내용입니다.',
    tag: '보완 권장',
    tone: 'green',
  },
];

const ACTIONS: NumberedAction[] = [
  { title: '수학 : 합성함수 미분 집중 3일 블록', body: '이번 주 수 · 목 · 금 오전 첫 블록에 배치할게요' },
  { title: '국어 비문학 추론 : 유형별 정리', body: '주 2회, 지문 3개씩 집중 훈련 권장' },
  { title: '영어 어법 노트 정리', body: '복습 ON 항목들로 어법 오답 노트 만들기' },
  { title: '확통 : 조건부확률 개념 재정리', body: '완료도 0~30% 이상 지속 중. 이번 주 안에 시작 필요' },
];

export default function AiReportWeaknessScreen() {
  const router = useRouter();

  return (
    <AiReportLayout activeTab="weakness">
      <ReportStack>
        <View style={styles.borderedCard}>
          <Text style={styles.cardTitle}>지금 부족한 건</Text>
          <Text style={styles.helper}>AI가 회고 · 완료도 데이터를 분석했어요</Text>
          <View style={styles.weaknessList}>
            {WEAKNESSES.map(item => (
              <WeaknessItem
                key={item.course}
                {...item}
                onPress={() => router.push({ pathname: '/tutor/subject-detail', params: { subject: item.subject } })}
              />
            ))}
          </View>
        </View>
        <NumberedList title="앞으로 채워야 할 것" subtitle="AI 추천 보완 액션" items={ACTIONS} />
      </ReportStack>
    </AiReportLayout>
  );
}
