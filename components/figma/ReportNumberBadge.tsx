import { Text, View } from 'react-native';
import { styles, tone, Tone } from './_shared';

export function ReportNumberBadge({
  number,
  variant = 'primary',
}: {
  number: number;
  variant?: Extract<Tone, 'primary' | 'blue' | 'red' | 'orange' | 'green'>;
}) {
  return (
    <View style={[styles.numberBadge, { backgroundColor: tone[variant] }]}>
      <Text style={styles.numberBadgeText}>{number}</Text>
    </View>
  );
}
