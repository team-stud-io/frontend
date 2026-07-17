import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { BottomActionBar } from '../ui';

type Props = {
  children: React.ReactNode;
  title?: string;
  step?: 1 | 2 | 3 | 4 | 5;
  actionLabel?: string;
  actionEnabled?: boolean;
  loading?: boolean;
  onAction?: () => void;
  onBack?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
};

export function AuthScreen({ children, title, step, actionLabel, actionEnabled = true, loading = false, onAction, onBack, contentStyle, scroll = true }: Props) {
  const router = useRouter();
  const body = <View style={[styles.content, contentStyle]}>{children}</View>;
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="뒤로가기" hitSlop={10} onPress={() => onBack ? onBack() : router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#242628" />
          </Pressable>
          {step ? (
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${step * 20}%` }]} /></View>
          ) : <Text style={styles.headerTitle}>{title}</Text>}
          <View style={styles.headerSpacer} />
        </View>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{body}</ScrollView>
        ) : body}
        {actionLabel && onAction && (
          <BottomActionBar>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !actionEnabled || loading }}
              disabled={!actionEnabled || loading}
              onPress={onAction}
              style={[styles.actionButton, (!actionEnabled || loading) && styles.actionButtonDisabled]}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.actionLabel}>{actionLabel}</Text>}
            </Pressable>
          </BottomActionBar>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthDescription({ title, subtitle }: { title: string; subtitle?: string }) {
  return <View style={styles.description}><Text style={styles.title}>{title}</Text>{!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}</View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' }, flex: { flex: 1 },
  header: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 12 },
  backButton: { width: 24, height: 40, justifyContent: 'center' }, headerSpacer: { width: 24 },
  headerTitle: { flex: 1, textAlign: 'center', color: '#242628', fontFamily: 'Pretendard-SemiBold', fontSize: 18, lineHeight: 28 },
  progressTrack: { flex: 1, height: 6, overflow: 'hidden', borderRadius: 4, backgroundColor: '#ECEEF0' },
  progressFill: { height: 6, borderRadius: 4, backgroundColor: '#5299A4' }, scrollContent: { flexGrow: 1 },
  content: { flex: 1, gap: 28, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 },
  description: { gap: 2 }, title: { color: '#242628', fontFamily: 'Pretendard-SemiBold', fontSize: 22, lineHeight: 30 },
  subtitle: { color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-Medium', fontSize: 16, lineHeight: 24 },
  actionButton: { minHeight: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: Colors['Fill.Primary.Normal'] },
  actionButtonDisabled: { backgroundColor: Colors['Fill.Normal.Inactive'] },
  actionLabel: { color: '#FFFFFF', fontFamily: 'Pretendard-SemiBold', fontSize: 18, lineHeight: 28 },
});
