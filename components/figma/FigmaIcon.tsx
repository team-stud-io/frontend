import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/colors';

export type FigmaIconName =
  | 'delete'
  | 'error'
  | 'visibility'
  | 'invisibility'
  | 'dropdown'
  | 'dropup'
  | 'arrow-left'
  | 'close'
  | 'chevron-forward'
  | 'chevron-back'
  | 'chevron-up'
  | 'chevron-down'
  | 'add-circle'
  | 'send'
  | 'study'
  | 'verified'
  | 'chart-up'
  | 'graduation-cap'
  | 'calendar'
  | 'kebab'
  | 'like'
  | 'dislike'
  | 'check'
  | 'trophy'
  | 'chart-bar'
  | 'flash'
  | 'share'
  | 'book'
  | 'trending-up'
  | 'cancel'
  | 'sound'
  | 'message'
  | 'notifications'
  | 'home'
  | 'ai-report'
  | 'study-room'
  | 'my-page';

export type DotTone = 'Pink' | 'Green' | 'Orange' | 'Red' | 'Blue' | 'Cyan' | 'Default' | 'Teal';

export interface FigmaIconProps {
  name: FigmaIconName;
  size?: number;
  selected?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const iconMap: Record<FigmaIconName, keyof typeof Ionicons.glyphMap> = {
  delete: 'trash-outline',
  error: 'alert-circle',
  visibility: 'eye-outline',
  invisibility: 'eye-off-outline',
  dropdown: 'caret-down-outline',
  dropup: 'caret-up-outline',
  'arrow-left': 'arrow-back-outline',
  close: 'close-outline',
  'chevron-forward': 'chevron-forward-outline',
  'chevron-back': 'chevron-back-outline',
  'chevron-up': 'chevron-up-outline',
  'chevron-down': 'chevron-down-outline',
  'add-circle': 'add-circle-outline',
  send: 'paper-plane-outline',
  study: 'school-outline',
  verified: 'shield-checkmark-outline',
  'chart-up': 'trending-up-outline',
  'graduation-cap': 'school-outline',
  calendar: 'calendar-outline',
  kebab: 'ellipsis-vertical',
  like: 'thumbs-up-outline',
  dislike: 'thumbs-down-outline',
  check: 'checkmark-outline',
  trophy: 'trophy-outline',
  'chart-bar': 'bar-chart-outline',
  flash: 'flash-outline',
  share: 'share-social-outline',
  book: 'book-outline',
  'trending-up': 'trending-up-outline',
  cancel: 'close-circle-outline',
  sound: 'volume-high-outline',
  message: 'chatbubble-ellipses-outline',
  notifications: 'notifications-outline',
  home: 'library-outline',
  'ai-report': 'sparkles',
  'study-room': 'trophy-outline',
  'my-page': 'person-outline',
};

export const dotColors: Record<DotTone, string> = {
  Pink: '#F04588',
  Green: '#58A51F',
  Orange: '#D89221',
  Red: '#E35D6A',
  Blue: '#3385FF',
  Cyan: '#00AFC7',
  Default: Colors['Text.Normal.Assistive'],
  Teal: Colors['Fill.Primary.Normal'],
};

export function FigmaIcon({
  name,
  size = 24,
  selected = false,
  color,
  style,
}: FigmaIconProps) {
  return (
    <View style={style}>
      <Ionicons
        name={iconMap[name]}
        size={size}
        color={color ?? (selected ? Colors['Fill.Primary.Normal'] : Colors['Text.Normal.Normal'])}
      />
    </View>
  );
}
