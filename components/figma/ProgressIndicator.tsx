import { Text, View } from 'react-native';
import { styles } from './_shared';

export function ProgressIndicator({ step = 0, total = 4 }: { step?: number; total?: number }) {
  return (
    <View style={styles.progressIndicator}>
      <Text style={styles.progressIndicatorText}>{step}/{total}</Text>
    </View>
  );
}
