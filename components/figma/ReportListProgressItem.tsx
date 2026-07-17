import { Text, View } from 'react-native';
import { styles, tone, Tone } from './_shared';

export function ReportListProgressItem({
  label,
  value,
  variant = 'blue',
}: {
  label: string;
  value: number;
  variant?: Extract<Tone, 'blue' | 'red' | 'orange' | 'green'>;
}) {
  return (
    <View style={styles.reportProgressItem}>
      <Text style={styles.bodyStrong}>{label}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${value}%`, backgroundColor: tone[variant] }]} />
      </View>
    </View>
  );
}
