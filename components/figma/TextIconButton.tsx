import { Pressable, Text } from 'react-native';
import { FigmaIcon } from './FigmaIcon';
import { styles } from './_shared';

export function TextIconButton({
  label,
  variant = 'default',
  onPress,
}: {
  label: string;
  variant?: 'default' | 'secondary';
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.textIconButton}>
      <Text style={[styles.bodyStrong, variant === 'secondary' && styles.primaryText]}>{label}</Text>
      <FigmaIcon name="chevron-forward" size={20} selected={variant === 'secondary'} />
    </Pressable>
  );
}
