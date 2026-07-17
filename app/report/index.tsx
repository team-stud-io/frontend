import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  AiReportLayout,
  ProgressCard,
  ReportStack,
  SubjectProgress,
  SubjectProgressData,
  WeekSummary,
  reportCardStyles as styles,
} from '../../components/ai-report';

const SUBJECTS: SubjectProgressData[] = [
  { name: '국어', value: 55, label: '순항', tone: 'blue' },
  { name: '수학', value: 28, label: '긴급', tone: 'red' },
  { name: '영어', value: 62, label: '순항', tone: 'blue' },
  { name: '확통', value: 40, label: '주의', tone: 'orange' },
  { name: '한국사', value: 70, label: '양호', tone: 'green' },
];

export default function AiReportOverviewScreen() {
  const [updated, setUpdated] = useState(false);

  return (
    <AiReportLayout activeTab="overview">
      <ReportStack>
        <ProgressCard value={34} />

        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>과목별 진행도</Text>
          <Text style={styles.warning}>수학 진행도가 가장 낮아요. 우선순위를 높일게요.</Text>
          <View style={styles.subjectList}>
            {SUBJECTS.map(subject => <SubjectProgress key={subject.name} {...subject} />)}
          </View>
        </View>

        <View style={styles.borderedCard}>
          <View style={styles.iconTitleRow}>
            <Ionicons name="flash" size={22} color="#FFD43B" />
            <Text style={styles.cardTitle}>AI 종합 진단</Text>
          </View>
          <Text style={styles.body}>
            수학 · 미분 적분 파트가 목표 대비 가장 뒤처져 있어요.{`\n`}
            이번 주 수학을 하루에 1시간씩 추가 권장합니다.{`\n`}
            국어 · 영어는 현재 페이스를 유지하면 충분해요!
          </Text>
          <Pressable onPress={() => setUpdated(true)} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              {updated ? '최신 전략 반영 완료' : '전략 업데이트 받기'}
            </Text>
          </Pressable>
        </View>

        <WeekSummary variant="overview" />
      </ReportStack>
    </AiReportLayout>
  );
}
