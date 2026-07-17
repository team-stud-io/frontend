import { Text, View } from 'react-native';
import { FigmaIcon, FigmaIconName } from './FigmaIcon';
import { styles, tone, toneBg, Tone } from './_shared';

export function ReportInfoCard({
  title,
  value,
  icon,
  variant = 'primary',
}: {
  title: string;
  value: string;
  icon?: FigmaIconName;
  variant?: Tone;
}) {
  return (
    <View style={[styles.reportInfoCard, { backgroundColor: toneBg[variant] }]}>
      {icon && <FigmaIcon name={icon} selected />}
      <Text style={styles.caption}>{title}</Text>
      <Text style={[styles.cardTitle, { color: tone[variant] }]}>{value}</Text>
    </View>
  );
}
