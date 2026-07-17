import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { dotColors, DotTone } from './FigmaIcon';

export interface BulletDotProps {
  tone?: Exclude<DotTone, 'Default'>;
  style?: StyleProp<ViewStyle>;
}

export function BulletDot({ tone = 'Pink', style }: BulletDotProps) {
  return <View style={[styles.root, { backgroundColor: dotColors[tone] }, style]} />;
}

const styles = StyleSheet.create({
  root: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
