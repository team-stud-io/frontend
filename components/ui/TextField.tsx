import React, { useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/colors';

export type TextFieldState = 'default' | 'focused' | 'enteringQuery' | 'entered' | 'error';
export type TextFieldSize = 'S' | 'M';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  state?: TextFieldState;
  size?: TextFieldSize;
  showClearButton?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: TextInputProps['style'];
  onClear?: () => void;
}

export function TextField({
  label,
  helperText,
  errorMessage,
  state = 'default',
  size = 'S',
  value,
  multiline,
  showClearButton = true,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  onChangeText,
  onClear,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const currentState: TextFieldState = errorMessage ? 'error' : focused ? 'focused' : state;
  const hasValue = typeof value === 'string' && value.length > 0;
  const isLarge = size === 'M';

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.field,
          isLarge && styles.fieldLarge,
          multiline && styles.fieldMultiline,
          currentState === 'focused' && styles.fieldFocused,
          currentState === 'error' && styles.fieldError,
        ]}
      >
        <TextInput
          {...inputProps}
          value={value}
          multiline={multiline}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={Colors['Text.Normal.Assistive']}
          style={[styles.input, isLarge && styles.inputLarge, multiline && styles.inputMultiline, inputStyle]}
        />
        {showClearButton && hasValue && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="clear text"
            onPress={handleClear}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={Colors['Text.Normal.Assistive']} />
          </Pressable>
        )}
      </View>
      {!!(errorMessage || helperText) && (
        <Text style={[styles.helper, currentState === 'error' && styles.helperError]}>
          {errorMessage ?? helperText}
        </Text>
      )}
    </View>
  );
}

export function ErrorMessageStack({ message }: { message: string }) {
  return (
    <View style={styles.errorStack}>
      <Ionicons name="alert-circle" size={16} color="#F45B5B" />
      <Text style={styles.errorStackText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  label: {
    color: Colors['Text.Normal.Strong'],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
  field: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Normal'],
    backgroundColor: Colors['Fill.Normal.Normal'],
    paddingHorizontal: 16,
  },
  fieldLarge: {
    minHeight: 80,
    alignItems: 'flex-start',
    paddingTop: 14,
  },
  fieldMultiline: {
    minHeight: 120,
  },
  fieldFocused: {
    borderColor: Colors['Line.Primary.Normal'],
  },
  fieldError: {
    borderColor: '#F45B5B',
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: Colors['Text.Normal.Strong'],
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  inputLarge: {
    minHeight: 48,
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  clearButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helper: {
    color: Colors['Text.Normal.Subtle'],
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  helperError: {
    color: '#F45B5B',
  },
  errorStack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorStackText: {
    color: '#F45B5B',
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 16,
  },
});
