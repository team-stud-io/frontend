import { Text, View } from 'react-native';
import { styles } from './_shared';

export function CharacterBubble({ text }: { text: string }) {
  return (
    <View style={styles.characterBubble}>
      <Text style={styles.bodyStrong}>{text}</Text>
    </View>
  );
}
