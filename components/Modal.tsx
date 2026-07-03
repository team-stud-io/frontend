import React from 'react';
import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';

export interface ModalProps {
  visible: boolean;
  title: string;
  description?: string;
  leftButton: string;
  rightButton: string;
  onLeftPress: () => void;
  onRightPress: () => void;
  showDescription?: boolean;
  showIconError?: boolean;
  rightButtonTone?: 'primary' | 'danger';
  placement?: 'center' | 'bottom';
}

export function Modal({
  visible,
  title,
  description,
  leftButton,
  rightButton,
  onLeftPress,
  onRightPress,
  showDescription = true,
  showIconError = true,
  rightButtonTone = 'primary',
  placement = 'center',
}: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onLeftPress}>
      <View style={[styles.overlay, placement === 'bottom' && styles.overlayBottom]}>
        <View style={styles.root}>
          {showIconError && (
            <View style={styles.iconError}>
              <Text style={styles.iconErrorText}>!</Text>
            </View>
          )}

          <View style={styles.labelContainer}>
            <Text style={styles.title}>{title}</Text>
            {showDescription && !!description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>

          <View style={styles.buttonSection}>
            <Pressable style={styles.button} onPress={onLeftPress}>
              <Text style={styles.leftLabel}>{leftButton}</Text>
            </Pressable>
            <View style={styles.separator} />
            <Pressable style={styles.button} onPress={onRightPress}>
              <Text
                style={[
                  styles.rightLabel,
                  rightButtonTone === 'danger' && styles.rightLabelDanger,
                ]}
              >
                {rightButton}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBottom: {
    justifyContent: 'flex-end',
    paddingBottom: 56,
  },
  root: {
    width: 300,
    paddingTop: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Normal'],
    backgroundColor: Colors['Fill.Normal.Normal'],
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 4,
  },
  iconError: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors['Fill.Normal.Inactive'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconErrorText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    fontSize: 28,
    lineHeight: 34,
  },
  labelContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 4,
  },
  title: {
    color: Colors['Text.Normal.Strong'],
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    lineHeight: 28,
  },
  description: {
    color: Colors['Text.Normal.Subtle'],
    textAlign: 'center',
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  buttonSection: {
    flexDirection: 'row',
    height: 54,
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderTopColor: Colors['Line.Normal.Normal'],
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors['Line.Normal.Normal'],
  },
  leftLabel: {
    color: Colors['Text.Normal.Normal'],
    textAlign: 'center',
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  rightLabel: {
    color: Colors['Text.Primary.Strong'],
    textAlign: 'center',
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  rightLabelDanger: {
    color: '#F45B5B',
  },
});
