import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/colors';
import { styles } from './_shared';

export function DifficultyLevel({
  selected = false,
  onPress,
}: {
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.difficultyLevel, selected && styles.difficultySelected]}>
      <Ionicons name="star" size={18} color={selected ? '#FFFFFF' : Colors['Text.Normal.Assistive']} />
    </Pressable>
  );
}
