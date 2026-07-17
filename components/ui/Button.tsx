import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/colors';

export type ButtonState = 'Default' | 'Inactive' | 'Selected' | 'default' | 'inactive' | 'selected';
export type ButtonSize = 'S' | 'M' | 'L';
export type ButtonVariant = 'default' | 'secondary' | 'iconText';

export interface ButtonProps {
  label: string;
  state?: ButtonState;
  size?: ButtonSize;
  variant?: ButtonVariant;
  iconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Button({
  label,
  state = 'Default',
  size = 'L',
  variant = 'default',
  iconName,
  onPress,
  style,
  testID,
}: ButtonProps) {
  const normalizedState = state.toLowerCase();
  const isInactive = normalizedState === 'inactive';
  const isSelected = normalizedState === 'selected';
  const isSecondary = variant === 'secondary';
  const isIconText = variant === 'iconText';

  return (
    <Pressable
      testID={testID}
      onPress={isInactive ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, selected: isSelected }}
      style={[
        styles.root,
        styles[`size${size}`],
        isSecondary ? styles.secondary : styles.primary,
        isInactive && styles.inactive,
        isSelected && styles.selected,
        isIconText && styles.iconText,
        style,
      ]}
    >
      {isIconText && (
        <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
          <Ionicons
            name={iconName ?? 'checkmark'}
            size={18}
            color={isSelected ? '#FFFFFF' : Colors['Text.Primary.Strong']}
          />
        </View>
      )}
      <Text
        style={[
          styles.label,
          size === 'S' && styles.labelSmall,
          isSecondary && styles.labelSecondary,
          isInactive && styles.labelInactive,
          isIconText && styles.labelIconText,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 16,
    gap: 8,
  },
  sizeL: {
    minHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  sizeM: {
    minHeight: 54,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  sizeS: {
    minHeight: 44,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  primary: {
    backgroundColor: Colors['Fill.Primary.Normal'],
  },
  secondary: {
    borderWidth: 1,
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  inactive: {
    borderWidth: 0,
    backgroundColor: Colors['Fill.Normal.Inactive'],
  },
  selected: {
    borderWidth: 1,
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  iconText: {
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    backgroundColor: Colors['Fill.Normal.Normal'],
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Normal'],
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  iconCircleSelected: {
    backgroundColor: Colors['Fill.Primary.Normal'],
  },
  label: {
    color: Colors['Text.Normal.Inverse'],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
  labelSmall: {
    fontSize: 16,
    lineHeight: 24,
  },
  labelSecondary: {
    color: Colors['Text.Primary.Strong'],
  },
  labelInactive: {
    color: Colors['Text.Normal.Inverse'],
  },
  labelIconText: {
    flex: 1,
    color: Colors['Text.Normal.Strong'],
    textAlign: 'left',
  },
});
