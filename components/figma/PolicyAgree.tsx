import { Pressable, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/colors';
import { styles } from './_shared';

export function PolicyAgree({
  label,
  selected = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.policyAgree}>
      <Ionicons
        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
        size={20}
        color={selected ? Colors['Fill.Primary.Normal'] : Colors['Text.Normal.Assistive']}
      />
      <Text style={styles.body}>{label}</Text>
    </Pressable>
  );
}
