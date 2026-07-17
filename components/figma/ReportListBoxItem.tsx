import { Text, View } from 'react-native';
import { styles, tone, toneBg, Tone } from './_shared';

export function ReportListBoxItem({
  title,
  body,
  variant = 'blue',
}: {
  title: string;
  body: string;
  variant?: Extract<Tone, 'blue' | 'red' | 'orange' | 'green'>;
}) {
  return (
    <View style={[styles.reportBoxItem, { backgroundColor: toneBg[variant] }]}>
      <Text style={[styles.bodyStrong, { color: tone[variant] }]}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}
