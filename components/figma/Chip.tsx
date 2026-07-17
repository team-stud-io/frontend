import { Text, View } from 'react-native';
import { styles } from './_shared';

export function Chip({
  label,
  variant = 'primary',
}: {
  label: string;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <View style={[styles.chip, variant === 'secondary' && styles.chipSecondary]}>
      <Text style={[styles.chipText, variant === 'secondary' && styles.body]}>{label}</Text>
    </View>
  );
}
