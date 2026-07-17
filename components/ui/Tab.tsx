



import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/colors';

export type TabState = 'Default' | 'Selected' | 'LineX' | 'Inactive';

export interface TabProps {
  label: string;
  state?: TabState;
  onPress?: () => void;
  style?: object;
  testID?: string;
}

export function Tab({
  label,
  state = 'Default',
  onPress,
  style,
  testID,
}: TabProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[
        styles.root,
        state === 'Selected' && styles.rootSelected,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          state === 'Selected' && styles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  root: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
    backgroundColor: Colors['Fill.Normal.Normal'],
  },

  rootSelected: {
    borderWidth: 1,
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },

  label: {
    color: Colors['Text.Normal.Assistive'],
    textAlign: 'center',
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.2,
  },

  labelSelected: {
    color: Colors['Text.Normal.Normal'],
  },
});
