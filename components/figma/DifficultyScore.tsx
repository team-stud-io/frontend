import { Text, View } from 'react-native';
import { styles } from './_shared';

export function DifficultyScore({ score }: { score: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <View style={styles.difficultyScore}>
      <Text style={styles.bodyStrong}>Lv.{score}</Text>
    </View>
  );
}
