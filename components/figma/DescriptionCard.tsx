import { Text, View } from 'react-native';
import { styles } from './_shared';

export function DescriptionCard({
  title,
  description,
  variant = 'good',
}: {
  title: string;
  description: string;
  variant?: 'good' | 'bad';
}) {
  return (
    <View style={[styles.card, variant === 'good' ? styles.goodCard : styles.badCard]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.body}>{description}</Text>
    </View>
  );
}
