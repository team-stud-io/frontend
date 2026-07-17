import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/colors';
import { styles } from './_shared';

export function StudyTypeList({ items }: { items: string[] }) {
  return (
    <View style={styles.card}>
      {items.map((item) => (
        <View key={item} style={styles.row}>
          <Ionicons name="checkmark-circle" size={18} color={Colors['Fill.Primary.Normal']} />
          <Text style={styles.body}>{item}</Text>
        </View>
      ))}
    </View>
  );
}
