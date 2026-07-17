import { Text, View } from 'react-native';
import { styles, tone, Tone } from './_shared';

export function StudyTypeGraph({
  label,
  value,
  variant = 'primary',
}: {
  label: string;
  value: number;
  variant?: Tone;
}) {
  return (
    <View style={styles.studyTypeGraph}>
      <Text style={styles.caption}>{label}</Text>
      <View style={styles.graphTrack}>
        <View
          style={[
            styles.graphFill,
            { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: tone[variant] },
          ]}
        />
      </View>
    </View>
  );
}
