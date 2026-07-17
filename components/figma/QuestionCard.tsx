import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { styles } from './_shared';

export function QuestionCard({
  question,
  answer,
  style,
}: {
  question: string;
  answer?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.cardTitle}>{question}</Text>
      {!!answer && <Text style={styles.body}>{answer}</Text>}
    </View>
  );
}
