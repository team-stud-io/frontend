import { Text, View } from 'react-native';
import { styles } from './_shared';
import { ProgressBarTotal } from './ProgressBarTotal';

export function ReportProgressCard({
  title,
  value,
  max = 100,
}: {
  title: string;
  value: number;
  max?: number;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <ProgressBarTotal value={value} max={max} />
    </View>
  );
}
