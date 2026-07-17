import { Text, View } from 'react-native';
import { styles } from './_shared';

export function FAQItem({
  question,
  answer,
  selected = false,
}: {
  question: string;
  answer?: string;
  selected?: boolean;
}) {
  return (
    <View style={[styles.faqItem, selected && styles.selectedSurface]}>
      <Text style={styles.bodyStrong}>{question}</Text>
      {selected && !!answer && <Text style={styles.body}>{answer}</Text>}
    </View>
  );
}
