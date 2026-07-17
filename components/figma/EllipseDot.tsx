import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { dotColors, DotTone } from './FigmaIcon';

export interface EllipseDotProps {
  tone?: DotTone;
  style?: StyleProp<ViewStyle>;
}

export function EllipseDot({ tone = 'Default', style }: EllipseDotProps) {
  return <View style={[styles.root, { backgroundColor: dotColors[tone] }, style]} />;
}

const styles = StyleSheet.create({
  root: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
