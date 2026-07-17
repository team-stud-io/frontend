import { Image, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/colors';
import { styles } from './_shared';

export function Photo({ uri, size = 120 }: { uri?: string; size?: number }) {
  if (uri) {
    return <Image source={{ uri }} style={[styles.photo, { width: size, height: size }]} />;
  }
  return (
    <View style={[styles.photo, styles.photoFallback, { width: size, height: size }]}>
      <Ionicons name="image-outline" size={32} color={Colors['Text.Normal.Assistive']} />
    </View>
  );
}
