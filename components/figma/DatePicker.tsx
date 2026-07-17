import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { styles } from './_shared';

export function DatePicker({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.datePicker, style]}>{children}</View>;
}
