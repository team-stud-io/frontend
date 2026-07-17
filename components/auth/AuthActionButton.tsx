import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';

type AuthActionButtonVariant = 'kakao' | 'secondary' | 'outline';

interface AuthActionButtonProps {
  label: string;
  variant: AuthActionButtonVariant;
  icon?: ImageSourcePropType;
  onPress?: () => void;
  testID?: string;
}

export function AuthActionButton({
  icon,
  label,
  onPress,
  testID,
  variant,
}: AuthActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && onPress && styles.pressed,
      ]}
    >
      <View style={styles.labelRow}>
        {icon && <Image source={icon} resizeMode="contain" style={styles.icon} />}
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  kakao: {
    backgroundColor: '#FEE500',
  },
  secondary: {
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: '#F6F8FA',
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: Colors['Fill.Normal.Normal'],
  },
  pressed: {
    opacity: 0.72,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    width: 23,
    height: 23,
  },
  label: {
    color: '#242628',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    lineHeight: 28,
  },
});
