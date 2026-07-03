import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../constants/colors';

export interface SwipeActionsProps {
  onEditPress?: () => void;
  onDeletePress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function SwipeActions({
  onEditPress,
  onDeletePress,
  style,
  testID,
}: SwipeActionsProps) {
  return (
    <View testID={testID} style={[styles.root, style]}>
      <Pressable style={styles.editButton} onPress={onEditPress}>
        <Text style={styles.editLabel}>수정</Text>
      </Pressable>
      <View style={styles.divider} />
      <Pressable style={styles.deleteButton} onPress={onDeletePress}>
        <Text style={styles.deleteLabel}>삭제</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: 78,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    overflow: 'hidden',
  },
  editButton: {
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors['Fill.Normal.Assistive'],
  },
  deleteButton: {
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors['Line.Normal.Strong'],
  },
  editLabel: {
    color: Colors['Text.Normal.Normal'],
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  deleteLabel: {
    color: '#F45B5B',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
});
