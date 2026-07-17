


import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal } from './Modal';
import { Colors } from '../../constants/colors';



interface InputFieldProps {
  onSubmit: (subjectName: string) => void;
  onCancel: () => void;
  maxLength?: number;
}

export function InputField({ onSubmit, onCancel, maxLength = 10 }: InputFieldProps) {
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 80);
    const secondFocusTimer = setTimeout(() => inputRef.current?.focus(), 220);

    return () => {
      clearTimeout(focusTimer);
      clearTimeout(secondFocusTimer);
    };
  }, []);

  const handleSend = () => {
    if (text.trim().length === 0) return;
    onSubmit(text.trim());
    setText('');
  };

  return (
    <>

      <View style={styles.inputSheet}>
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="과목명과목명"
            placeholderTextColor={Colors['Text.Normal.Assistive']}
            value={text}
            onChangeText={setText}
            autoFocus
            showSoftInputOnFocus
            maxLength={maxLength}
            returnKeyType="done"
            onSubmitEditing={handleSend}
          />
          <View style={styles.trailing}>
            <Pressable
              style={[
                styles.sendButton,
                text.trim().length === 0 && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
            >
              <Ionicons name="paper-plane" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.wordCount}>{text.length}/{maxLength}</Text>
            <Ionicons name="eye" size={28} color={Colors['Fill.Normal.Inactive']} />
            <Pressable
              style={styles.closeButton}
              onPress={() => {
                if (text.trim().length > 0) setShowConfirmModal(true);
                else onCancel();
              }}
            >
              <Ionicons name="close" size={26} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>

      <Modal
        visible={showConfirmModal}
        title="입력을 중단하시겠습니까?"
        description="중단하시면 입력된 정보는 초기화됩니다."
        leftButton="취소"
        rightButton="확인"
        onLeftPress={() => setShowConfirmModal(false)}
        onRightPress={() => {
          setShowConfirmModal(false);
          onCancel();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({

  inputSheet: {
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 28,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: 66,
    paddingLeft: 18,
    paddingRight: 14,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Normal.Normal'],
  },
  input: {
    flex: 1,
    fontFamily: 'Pretendard-Medium',
    fontSize: 22,
    color: Colors['Text.Normal.Normal'],
    paddingVertical: 0,
  },


  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: Colors['Fill.Primary.Normal'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors['Fill.Normal.Inactive'],
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wordCount: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    color: Colors['Text.Normal.Assistive'],
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors['Fill.Normal.Inactive'],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
