import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../ui';
import { resultStyles as styles } from './resultStyles';

interface ResultStateScreenProps {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}

export function ResultStateScreen({
  actionLabel,
  body,
  onAction,
  title,
}: ResultStateScreenProps) {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingCopy}>
        <Text style={styles.loadingTitle}>{title}</Text>
        <Text style={styles.loadingText}>{body}</Text>
      </View>
      <View style={{ width: '100%', maxWidth: 335 }}>
        <Button label={actionLabel} state="Default" onPress={onAction} />
      </View>
    </View>
  );
}
