import { Text, View } from 'react-native';
import { styles } from './_shared';

export function StudyTypeScore({ score, label }: { score: number; label: string }) {
  return (
    <View style={styles.studyTypeScore}>
      <Text style={styles.scoreText}>{score}</Text>
      <Text style={styles.caption}>{label}</Text>
    </View>
  );
}
