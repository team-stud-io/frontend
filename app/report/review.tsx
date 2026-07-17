import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import {
  AiReportLayout,
  FeedbackCard,
  NumberedAction,
  NumberedList,
  ReportStack,
  WeekSummary,
  reportCardStyles as styles,
} from '../../components/ai-report';

const NEXT_ACTIONS: NumberedAction[] = [
  {
    title: '수학 오전 집중 시간 확보',
    body: '집중이 잘 되는 오전 9-11시에 수학을 배치해요.\n미분 · 적분 집중 3일로 시작해요.',
  },
  { title: '확통 이번 주 안에 재시작', body: '조건부확률부터 짧게 시작해요.' },
  { title: '주말 목표 시간 현실적으로 조정', body: '이번 주말 목표 60%로 낮추고 달성 경험을 먼저 쌓아요.' },
];

export default function AiReportReviewScreen() {
  return (
    <AiReportLayout activeTab="review">
      <ReportStack>
        <View style={styles.borderedCard}>
          <View style={styles.iconTitleRow}>
            <Ionicons name="trophy" size={22} color="#F6B500" />
            <Text style={styles.cardTitle}>4일 연속 학습 완료!</Text>
          </View>
          <Text style={styles.body}>
            이번주도 잘 버텼어요. 수학만 조금 더 잡으면{`\n`}
            다음 주는 훨씬 나아질거예요!
          </Text>
        </View>

        <WeekSummary variant="review" />
        <FeedbackCard
          icon="thumbs-up-outline"
          title="잘한 것"
          tone="green"
          items={['영어 어법 복습 4일 연속 유지', '목요일 집중 시간 최장 달성', '국어 페이스 꾸준히 유지']}
        />
        <FeedbackCard
          icon="thumbs-down-outline"
          title="아쉬운 것"
          tone="red"
          items={['수학 공부량 부족', '확통 아직 시작 못 함', '주말 학습량 목표 미달']}
        />
        <NumberedList title="다음 주 전략" items={NEXT_ACTIONS} />
      </ReportStack>
    </AiReportLayout>
  );
}
