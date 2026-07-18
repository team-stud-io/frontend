import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Modal as RNModal,
  PanResponder,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal } from '../../ui';
import { subjectDetailStyles as styles } from './styles';

export type UploadErrorType = 'format' | 'limit' | 'network';

export type UploadItem = {
  id: string;
  name: string;
  kind: 'image' | 'file';
  uri?: string;
  mimeType?: 'image/jpeg' | 'image/png';
};

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

export function ChipRow({
  options,
  selectedValues,
  onPress,
}: {
  options: string[];
  selectedValues: string[];
  onPress: (option: string) => void;
}) {
  return (
    <View style={styles.chipRow}>
      {options.map(option => {
        const isSelected = selectedValues.includes(option);
        return (
          <Pressable
            key={option}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onPress(option)}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Segmented({
  options,
  selectedIndex,
  onSelect,
}: {
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        return (
          <Pressable
            key={option}
            style={[styles.segmentItem, isSelected && styles.segmentItemSelected]}
            onPress={() => onSelect(index)}
          >
            <Text style={[styles.segmentText, isSelected && styles.segmentTextSelected]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function SliderField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackPageX = useRef(0);
  const didDrag = useRef(false);

  const updateValue = useCallback(
    (nextValue: number) => onChange(clampPercent(nextValue)),
    [onChange]
  );

  const getValueFromPageX = useCallback(
    (pageX: number) => {
      if (trackWidth === 0) return value;
      return ((pageX - trackPageX.current) / trackWidth) * 100;
    },
    [trackWidth, value]
  );

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: event => {
          didDrag.current = false;
          trackPageX.current = event.nativeEvent.pageX - event.nativeEvent.locationX;
          updateValue(getValueFromPageX(event.nativeEvent.pageX));
        },
        onPanResponderMove: (_, gestureState) => {
          if (trackWidth === 0) return;
          if (Math.abs(gestureState.dx) > 1) didDrag.current = true;
          updateValue(getValueFromPageX(gestureState.moveX));
        },
        onPanResponderRelease: (_, gestureState) => {
          if (trackWidth === 0 || didDrag.current) return;
          updateValue(getValueFromPageX(gestureState.moveX));
        },
        onPanResponderTerminate: () => {
          didDrag.current = false;
        },
      }),
    [getValueFromPageX, trackWidth, updateValue]
  );

  return (
    <Field label={label}>
      <View style={styles.sliderValueRow}>
        <View
          style={styles.sliderTouchArea}
          onLayout={handleTrackLayout}
          {...panResponder.panHandlers}
        >
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${value}%` }]} />
            <View
              style={[styles.sliderThumb, { left: `${value}%` }]}
            />
          </View>
        </View>
        <Text style={styles.sliderValue}>{value}%</Text>
      </View>
    </Field>
  );
}

export function UploadField({
  uploads,
  onAdd,
  onRemove,
  onFormatError,
  onNetworkError,
}: {
  uploads: UploadItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onFormatError: () => void;
  onNetworkError: () => void;
}) {
  return (
    <View style={styles.uploadArea}>
      {uploads.length > 0 && (
        <View style={styles.uploadList}>
          {uploads.map(item => (
            <Pressable
              key={item.id}
              style={item.kind === 'image' ? styles.uploadPreview : styles.uploadFile}
              onPress={onFormatError}
            >
              <Text style={item.kind === 'image' ? styles.uploadPreviewText : styles.uploadFileText} numberOfLines={1}>
                {item.kind === 'image' ? '사진' : `📎 ${item.name}`}
              </Text>
              <Pressable style={styles.uploadRemove} onPress={() => onRemove(item.id)}>
                <Text style={styles.uploadRemoveText}>×</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}
      <Pressable style={styles.uploadButton} onPress={onAdd} onLongPress={onNetworkError}>
        <Text style={styles.uploadIcon}>＋</Text>
        <Text style={styles.uploadText}>사진 등록</Text>
      </Pressable>
    </View>
  );
}

export function UploadErrorModal({
  error,
  onCancel,
  onRetry,
}: {
  error: UploadErrorType | null;
  onCancel: () => void;
  onRetry: () => void;
}) {
  if (!error) return null;

  const title =
    error === 'format'
      ? '사진을 업로드할 수 없어요'
      : error === 'limit'
        ? '업로드 개수를 초과했어요'
        : '네트워크 연결이 불안정합니다';
  const message =
    error === 'format'
      ? '10MB 이하의 JPG, PNG,\nPDF 파일만 업로드할 수 있습니다.'
      : error === 'limit'
        ? '사진은 최대 3장까지만\n업로드할 수 있습니다.'
        : '인터넷 연결 상태를 확인하고\n다시 시도해 주세요.';

  return (
    <Modal
      visible
      title={title}
      description={message}
      leftButton="취소"
      rightButton="다시 시도하기"
      onLeftPress={onCancel}
      onRightPress={onRetry}
    />
  );
}

export function ReconnectModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <RNModal visible={visible} animationType="fade">
      <SafeAreaView style={styles.reconnectScreen}>
        <View style={styles.reconnectBody}>
          <Pressable style={styles.reconnectMascot} onPress={onClose}>
            <View style={styles.reconnectEyeRow}>
              <View style={styles.reconnectEye} />
              <View style={styles.reconnectEye} />
            </View>
            <View style={styles.reconnectSmile} />
          </Pressable>
          <Text style={styles.reconnectTitle}>연결중...</Text>
          <Text style={styles.reconnectText}>네트워크를 다시 연결하고 있어요</Text>
          <View style={styles.reconnectSpinner} />
        </View>
      </SafeAreaView>
    </RNModal>
  );
}
