import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

export interface TimeCellProps {
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function TimeCell({ selected = false, onPress, style, testID }: TimeCellProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[styles.root, selected && styles.selected, style]}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    height: 30,
    borderRadius: 4,
    backgroundColor: Colors['Fill.Normal.Assistive'],
  },
  selected: {
    backgroundColor: Colors['Fill.Primary.Normal'],
  },
});
