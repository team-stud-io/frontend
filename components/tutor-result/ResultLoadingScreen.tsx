import React from 'react';
import { Text, View } from 'react-native';
import { resultStyles } from './resultStyles';

const styles = resultStyles;

export function ResultLoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.character}>
        <View style={styles.characterHead}>
          <View style={styles.eyeRow}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
          <View style={styles.smile} />
        </View>
        <View style={styles.characterBody} />
        <View style={styles.shadow} />
      </View>
      <View style={styles.loadingCopy}>
        <Text style={styles.loadingTitle}>전략 분석 중이에요</Text>
        <Text style={styles.loadingText}>입력한 정보와 합격 선배 데이터를 함께</Text>
        <Text style={styles.loadingText}>분석해서 전략을 짜고 있어요</Text>
      </View>
      <View style={styles.spinner} />
    </View>
  );
}

