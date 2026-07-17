import { Pressable, Text } from 'react-native';
import { FigmaIcon, FigmaIconName } from './FigmaIcon';
import { styles } from './_shared';

export function GNBButton({
  label,
  icon,
  selected = false,
  selectedColor,
  defaultColor,
  onPress,
}: {
  label: string;
  icon: FigmaIconName;
  selected?: boolean;
  selectedColor?: string;
  defaultColor?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.gnbButton}>
      <FigmaIcon name={icon} selected={selected} color={selected ? selectedColor ?? '#242628' : defaultColor ?? '#A1A3A5'} />
      <Text style={[styles.gnbLabel, { color: selected ? selectedColor ?? '#242628' : defaultColor ?? '#A1A3A5' }]}>{label}</Text>
    </Pressable>
  );
}
