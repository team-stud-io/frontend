import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

export type TagSize = 'S' | 'M';
export type TagVariant =
  | 'Orange'
  | 'Pink'
  | 'Green'
  | 'Blue'
  | 'Cyan'
  | 'Red'
  | 'Purple'
  | 'Primary'
  | 'PrimaryDark'
  | 'White';

export interface TagProps {
  label: string;
  size?: TagSize;
  variant?: TagVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Tag({
  label,
  size = 'M',
  variant = 'Pink',
  style,
  testID,
}: TagProps) {
  const isSmall = size === 'S';

  return (
    <View
      testID={testID ?? 'tag'}
      style={[
        styles.root,
        getRootVariantStyle(variant),
        isSmall && styles.rootSmall,
        variant === 'White' && isSmall && styles.rootWhiteSmall,
        style,
      ]}
    >
      <Text style={[styles.label, getLabelVariantStyle(variant), isSmall && styles.labelSmall]}>
        {label}
      </Text>
    </View>
  );
}

function getRootVariantStyle(variant: TagVariant) {
  if (variant === 'Green') return styles.rootGreen;
  if (variant === 'Blue') return styles.rootBlue;
  if (variant === 'Cyan') return styles.rootCyan;
  if (variant === 'Orange') return styles.rootOrange;
  if (variant === 'Red') return styles.rootRed;
  if (variant === 'Purple') return styles.rootPurple;
  if (variant === 'Primary') return styles.rootPrimary;
  if (variant === 'PrimaryDark') return styles.rootPrimaryDark;
  if (variant === 'White') return styles.rootWhite;
  return styles.rootPink;
}

function getLabelVariantStyle(variant: TagVariant) {
  if (variant === 'Green') return styles.labelGreen;
  if (variant === 'Blue') return styles.labelBlue;
  if (variant === 'Cyan') return styles.labelCyan;
  if (variant === 'Orange') return styles.labelOrange;
  if (variant === 'Red') return styles.labelRed;
  if (variant === 'Purple') return styles.labelPurple;
  if (variant === 'Primary') return styles.labelPrimary;
  if (variant === 'PrimaryDark') return styles.labelPrimaryDark;
  if (variant === 'White') return styles.labelWhite;
  return styles.labelPink;
}

const styles = StyleSheet.create({
  root: {
    minHeight: 28,
    paddingVertical: 2,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
  },
  rootSmall: {
    minHeight: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  rootPink: {
    backgroundColor: '#FFF1F7',
  },
  rootGreen: {
    backgroundColor: '#F4FFE8',
  },
  rootBlue: {
    backgroundColor: '#F2F7FF',
  },
  rootCyan: {
    backgroundColor: '#EEFCFF',
  },
  rootOrange: {
    backgroundColor: '#FFF8EC',
  },
  rootRed: {
    backgroundColor: '#FFF1F1',
  },
  rootPurple: {
    backgroundColor: '#F8F2FF',
  },
  rootPrimary: {
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  rootPrimaryDark: {
    backgroundColor: Colors['Fill.Primary.Normal'],
  },
  rootWhite: {
    backgroundColor: Colors['Fill.Normal.Normal'],
  },
  rootWhiteSmall: {
    width: 42,
    borderColor: Colors['Line.Normal.Normal'],
  },
  label: {
    color: '#F04588',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    lineHeight: 24,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
  },
  labelPink: {
    color: '#F04588',
  },
  labelGreen: {
    color: '#58A51F',
  },
  labelBlue: {
    color: '#3385FF',
  },
  labelCyan: {
    color: '#00AFC7',
  },
  labelOrange: {
    color: '#D89221',
  },
  labelRed: {
    color: '#E35D6A',
  },
  labelPurple: {
    color: '#8A5BD6',
  },
  labelPrimary: {
    color: Colors['Text.Primary.Strong'],
  },
  labelPrimaryDark: {
    color: Colors['Text.Normal.Inverse'],
  },
  labelWhite: {
    color: Colors['Text.Normal.Normal'],
  },
});
