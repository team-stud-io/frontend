import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

export interface IconFlashMProps {
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function IconFlashM({
  color = '#F6C945',
  size = 28,
  style,
  testID,
}: IconFlashMProps) {
  return (
    <View
      testID={testID ?? 'icon-flash-m'}
      style={[styles.root, { width: size, height: size }, style]}
    >
      <Text style={[styles.flash, { color, fontSize: size * 0.86, lineHeight: size }]}>⚡</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flash: {
    textAlign: 'center',
  },
});
