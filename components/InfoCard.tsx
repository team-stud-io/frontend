import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../constants/colors';

export type InfoCardState = 'Default' | 'Selected';
export type InfoCardStyle = 'Default' | 'Tag';

export interface InfoCardProps {
  title: string;
  description?: string;
  state?: InfoCardState;
  variant?: InfoCardStyle;
  showDescription?: boolean;
  showLeadingIcon?: boolean;
  showTag?: boolean;
  showTextIconButton?: boolean;
  textButtonLabel?: string;
  tagLabel?: string;
  progressLabel?: string;
  progressTone?: 'progress' | 'danger';
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function InfoCard({
  title,
  description,
  state = 'Default',
  variant = 'Default',
  showDescription = true,
  showLeadingIcon = variant === 'Default',
  showTag = variant === 'Tag',
  showTextIconButton = variant === 'Default',
  textButtonLabel = '텍스트 버튼',
  tagLabel,
  progressLabel,
  progressTone = 'progress',
  onPress,
  onLongPress,
  style,
  testID,
}: InfoCardProps) {
  const isSelected = state === 'Selected';
  const isTagVariant = variant === 'Tag';

  return (
    <Pressable
      testID={testID}
      style={[
        styles.root,
        isSelected && styles.rootSelected,
        isTagVariant && styles.rootTag,
        isSelected && isTagVariant && styles.rootTagSelected,
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {showLeadingIcon && <View style={styles.leadingIcon} />}

      <View style={styles.labelContainer}>
        <Text style={styles.title}>{title}</Text>
        {showDescription && !!description && (
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        )}
      </View>

      {showTextIconButton && (
        <View style={styles.textIconButton}>
          <Text style={styles.textButtonLabel}>{textButtonLabel}</Text>
          <Ionicons name="chevron-forward" size={22} color={Colors['Text.Normal.Strong']} />
        </View>
      )}

      {showTag && (
        <View style={styles.tagStack}>
          {!!tagLabel && (
            <View style={styles.statusTag}>
              <Text style={styles.statusTagText}>{tagLabel}</Text>
            </View>
          )}
          {!!progressLabel && (
            <View style={[styles.progressTag, progressTone === 'danger' && styles.progressTagDanger]}>
              <Text
                style={[
                  styles.progressTagText,
                  progressTone === 'danger' && styles.progressTagTextDanger,
                ]}
              >
                {progressLabel}
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 70,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Normal'],
    backgroundColor: Colors['Fill.Normal.Assistive'],
  },
  rootSelected: {
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  rootTag: {
    minHeight: 78,
    backgroundColor: Colors['Fill.Normal.Normal'],
    borderColor: Colors['Line.Normal.Strong'],
  },
  rootTagSelected: {
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  leadingIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D94F88',
  },
  labelContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: Colors['Text.Normal.Strong'],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  description: {
    color: Colors['Text.Normal.Normal'],
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  textIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  textButtonLabel: {
    color: Colors['Text.Normal.Normal'],
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  tagStack: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusTag: {
    paddingHorizontal: 13,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C9E6EA',
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  statusTagText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 13,
    color: Colors['Text.Primary.Strong'],
  },
  progressTag: {
    paddingHorizontal: 13,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0D9B7',
    backgroundColor: '#FFF5E8',
  },
  progressTagText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 13,
    color: '#F68D00',
  },
  progressTagDanger: {
    borderColor: '#F1D1D1',
    backgroundColor: '#FFF0F0',
  },
  progressTagTextDanger: {
    color: '#F45B5B',
  },
});
