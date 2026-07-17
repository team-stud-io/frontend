import { View } from 'react-native';
import { styles } from './_shared';

export function LineElement({ variant = 'divider' }: { variant?: 'cursor' | 'divider' }) {
  return <View style={variant === 'cursor' ? styles.cursor : styles.divider} />;
}
