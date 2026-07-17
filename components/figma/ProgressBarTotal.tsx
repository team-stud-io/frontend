import { View } from 'react-native';
import { styles } from './_shared';

export function ProgressBarTotal({
  value,
  max = 20,
  height = 16,
}: {
  value: number;
  max?: number;
  height?: number;
}) {
  const percent = Math.max(0, Math.min(1, value / max));
  return (
    <View style={[styles.progressTrack, { height, borderRadius: height / 2 }]}>
      <View style={[styles.progressFill, { width: `${percent * 100}%`, borderRadius: height / 2 }]} />
    </View>
  );
}
