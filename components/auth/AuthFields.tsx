import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../constants/colors';

export function AuthPasswordField({ label, value, placeholder = '비밀번호', helperText, errorMessage, onChangeText, onBlur }: {
  label: string; value: string; placeholder?: string; helperText?: string; errorMessage?: string;
  onChangeText: (value: string) => void; onBlur?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputFrame, focused && styles.focused, !!errorMessage && styles.errorFrame]}>
        <TextInput autoCapitalize="none" autoComplete="password" onBlur={() => { setFocused(false); onBlur?.(); }} onChangeText={onChangeText}
          onFocus={() => setFocused(true)} placeholder={placeholder} placeholderTextColor={Colors['Text.Normal.Assistive']}
          secureTextEntry={!visible} style={styles.input} value={value} />
        <Pressable accessibilityLabel={visible ? '비밀번호 숨기기' : '비밀번호 보기'} onPress={() => setVisible((v) => !v)}>
          <Ionicons name={visible ? 'eye-outline' : 'eye-off-outline'} size={22} color={Colors['Text.Normal.Assistive']} />
        </Pressable>
      </View>
      {!!(errorMessage || helperText) && <View style={styles.helperRow}>
        {!!errorMessage && <Ionicons name="alert-circle-outline" size={14} color="#E52222" />}
        <Text style={[styles.helper, !!errorMessage && styles.errorText]}>{errorMessage ?? helperText}</Text>
      </View>}
    </View>
  );
}

export function ChoiceChips({ label, options, selected, multiple = false, onChange }: {
  label?: string; options: string[]; selected: string[]; multiple?: boolean; onChange: (value: string[]) => void;
}) {
  const toggle = (option: string) => {
    if (!multiple) return onChange([option]);
    onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]);
  };
  return <View style={styles.choiceGroup}>
    {!!label && <Text style={styles.label}>{label}</Text>}
    <View style={styles.chipRow}>{options.map((option) => {
      const active = selected.includes(option);
      return <Pressable key={option} onPress={() => toggle(option)} style={[styles.chip, active && styles.chipActive]}>
        <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
      </Pressable>;
    })}</View>
  </View>;
}

export function SearchSelectField({ label, value, placeholder, options, helperText, onChange }: {
  label: string; value: string; placeholder: string; options: string[]; helperText?: string; onChange: (value: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const filtered = useMemo(() => {
    const query = value.trim();
    if (!focused || !query) return [];
    return options.filter((option) => option.includes(query)).slice(0, 5);
  }, [focused, options, value]);
  return <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputFrame, focused && styles.focused]}>
      <TextInput onBlur={() => setTimeout(() => setFocused(false), 120)} onChangeText={onChange} onFocus={() => setFocused(true)}
        placeholder={placeholder} placeholderTextColor={Colors['Text.Normal.Assistive']} style={styles.input} value={value} />
      {!!value && <Pressable accessibilityLabel="입력 지우기" onPress={() => onChange('')}>
        <Ionicons name="close-circle" size={20} color={Colors['Text.Normal.Assistive']} />
      </Pressable>}
    </View>
    {!!helperText && <Text style={styles.helper}>{helperText}</Text>}
    {filtered.length > 0 && <View style={styles.suggestions}>{filtered.map((option, index) =>
      <Pressable key={option} onPress={() => { onChange(option); setFocused(false); }} style={[styles.suggestion, index === 0 && styles.suggestionActive]}>
        <Text style={styles.suggestionTitle}>{option}</Text>
        {label.includes('학교') && <Text style={styles.suggestionBody}>NEIS 학교 데이터 기반</Text>}
      </Pressable>)}</View>}
  </View>;
}

export function ConsentRow({ label, selected, onPress, showChevron = true }: {
  label: string; selected: boolean; onPress: () => void; showChevron?: boolean;
}) {
  return <Pressable onPress={onPress} style={styles.consentRow}>
    <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={20}
      color={selected ? '#5299A4' : Colors['Text.Normal.Assistive']} />
    <Text style={styles.consentText}>{label}</Text>
    {showChevron && <Ionicons name="chevron-forward" size={20} color={Colors['Text.Normal.Normal']} />}
  </Pressable>;
}

const styles = StyleSheet.create({
  fieldGroup: { width: '100%', gap: 8 },
  label: { color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-Medium', fontSize: 14, lineHeight: 20 },
  inputFrame: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, borderWidth: 1,
    borderRadius: 12, borderColor: Colors['Line.Normal.Strong'], backgroundColor: '#FFFFFF' },
  focused: { borderColor: Colors['Line.Primary.Normal'] }, errorFrame: { borderColor: '#E52222' },
  input: { flex: 1, paddingVertical: 0, color: '#242628', fontFamily: 'Pretendard-Medium', fontSize: 16, lineHeight: 24 },
  helperRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  helper: { color: Colors['Text.Normal.Assistive'], fontFamily: 'Pretendard-Regular', fontSize: 12, lineHeight: 16 },
  errorText: { color: '#E52222' }, choiceGroup: { gap: 8 }, chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 16, borderWidth: 1, borderRadius: 18,
    borderColor: Colors['Line.Normal.Strong'], backgroundColor: '#FFFFFF' },
  chipActive: { borderColor: Colors['Line.Primary.Normal'], backgroundColor: Colors['Fill.Primary.Assistive'] },
  chipText: { color: Colors['Text.Normal.Assistive'], fontFamily: 'Pretendard-Medium', fontSize: 16, lineHeight: 24 },
  chipTextActive: { color: Colors['Text.Normal.Normal'] },
  suggestions: { overflow: 'hidden', marginTop: -8, borderWidth: 1, borderTopWidth: 0, borderColor: Colors['Line.Normal.Strong'],
    borderBottomLeftRadius: 12, borderBottomRightRadius: 12, backgroundColor: '#FFFFFF' },
  suggestion: { gap: 2, paddingHorizontal: 16, paddingVertical: 12 }, suggestionActive: { backgroundColor: Colors['Fill.Primary.Assistive'] },
  suggestionTitle: { color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-SemiBold', fontSize: 16, lineHeight: 24 },
  suggestionBody: { color: Colors['Text.Normal.Assistive'], fontFamily: 'Pretendard-Medium', fontSize: 14, lineHeight: 20 },
  consentRow: { minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: 8 },
  consentText: { flex: 1, color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-Medium', fontSize: 14, lineHeight: 20 },
});
