import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { styles } from './_shared';

export function IconButton({
  icon = 'add',
  variant = 'add',
  onPress,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'add' | 'fAB';
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.iconButton, variant === 'fAB' && styles.fab]}>
      <Ionicons name={icon} size={24} color="#FFFFFF" />
    </Pressable>
  );
}
