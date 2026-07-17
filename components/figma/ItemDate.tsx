import { Pressable, Text } from 'react-native';
import { styles } from './_shared';

export interface DateItemProps {
  day: string;
  date: string;
  state?: 'default' | 'today' | 'selected' | 'inactive';
  onPress?: () => void;
}

export function ItemDate({ day, date, state = 'default', onPress }: DateItemProps) {
  return (
    <Pressable
      onPress={state === 'inactive' ? undefined : onPress}
      style={[styles.dateItem, state === 'selected' && styles.dateSelected]}
    >
      <Text style={[styles.caption, state === 'selected' && styles.inverseText]}>{day}</Text>
      <Text
        style={[
          styles.bodyStrong,
          state === 'today' && styles.primaryText,
          state === 'selected' && styles.inverseText,
          state === 'inactive' && styles.assistiveText,
        ]}
      >
        {date}
      </Text>
    </Pressable>
  );
}
