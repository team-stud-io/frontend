import React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BOTTOM_ACTION_CONTENT_HEIGHT = 72;

type BottomActionBarProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function BottomActionBar({ children, style }: BottomActionBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.root, style, { paddingBottom: bottom }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
});
