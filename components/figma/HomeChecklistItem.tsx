import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/colors';
import { styles } from './_shared';

export function HomeChecklistItem({
  title,
  description,
  selected = false,
  onPress,
}: {
  title: string;
  description?: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.homeChecklistItem, selected && styles.selectedSurface]}>
      <Ionicons
        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={selected ? Colors['Fill.Primary.Normal'] : Colors['Text.Normal.Assistive']}
      />
      <View style={styles.flex}>
        <Text style={styles.bodyStrong}>{title}</Text>
        {!!description && <Text style={styles.body}>{description}</Text>}
      </View>
    </Pressable>
  );
}
