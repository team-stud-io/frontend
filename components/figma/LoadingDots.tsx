import { View } from 'react-native';
import { styles } from './_shared';

export function LoadingDots({ state = 1 }: { state?: 1 | 2 | 3 }) {
  return (
    <View style={styles.loadingDots}>
      {[1, 2, 3].map((index) => (
        <View key={index} style={[styles.loadingDot, index === state && styles.loadingDotActive]} />
      ))}
    </View>
  );
}
