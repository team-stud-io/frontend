import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { FigmaIcon, FigmaIconName } from './FigmaIcon';
import { styles } from './_shared';

export interface ListItemProps {
  title: string;
  description?: string;
  state?: 'default' | 'selected' | 'inactive' | 'myPage';
  iconName?: FigmaIconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ListItem({
  title,
  description,
  state = 'default',
  iconName,
  onPress,
  style,
}: ListItemProps) {
  const inactive = state === 'inactive';
  return (
    <Pressable
      onPress={inactive ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, selected: state === 'selected' }}
      style={[
        styles.listItem,
        state === 'selected' && styles.selectedSurface,
        inactive && styles.inactiveSurface,
        style,
      ]}
    >
      {iconName && <FigmaIcon name={iconName} size={24} />}
      <View style={styles.flex}>
        <Text style={[styles.bodyStrong, inactive && styles.assistiveText]} numberOfLines={1}>
          {title}
        </Text>
        {!!description && (
          <Text style={styles.caption} numberOfLines={1}>
            {description}
          </Text>
        )}
      </View>
      <FigmaIcon name="chevron-forward" size={20} />
    </Pressable>
  );
}
