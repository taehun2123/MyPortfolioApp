import React, { useState, useRef, useCallback, memo } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface LoginModalProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string;
  onSubmit: () => void;
  onClose: () => void;
  visible: boolean;
}

/**
 * 로그인 모달 컴포넌트
 */
const LoginModal: React.FC<LoginModalProps> = memo(({
  email,
  setEmail,
  password,
  setPassword,
  error,
  onSubmit,
  onClose,
  visible
}) => {
  // 입력창 참조 생성
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // 모달 외부 클릭 처리
  const handleOverlayPress = useCallback((e: { stopPropagation: () => void; }) => {
    // 이벤트 처리를 여기서 멈춰 내부 컴포넌트로 전파되지 않도록
    e.stopPropagation();
    Keyboard.dismiss();
  }, []);

  // 모달 내부 클릭 처리
  const handleModalPress = useCallback((e: { stopPropagation: () => void; }) => {
    // 이벤트 버블링 방지
    e.stopPropagation();
  }, []);

  // 이메일 입력 처리
  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
  }, [setEmail]);

  // 비밀번호 입력 처리
  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, [setPassword]);

  // 이메일 입력 후 비밀번호 필드로 포커스 이동
  const handleEmailSubmit = useCallback(() => {
    passwordInputRef.current?.focus();
  }, []);

  // 로그인 버튼 활성화 여부
  const isSubmitDisabled = !email.trim() || !password.trim();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={handleModalPress}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContentWrapper}
            >
              <View style={styles.modalContent}>
                <View style={styles.header}>
                  <Text style={styles.title}>관리자 로그인</Text>
                  <TouchableOpacity 
                    onPress={onClose} 
                    style={styles.closeButton}
                    accessibilityLabel="닫기"
                  >
                    <Feather name="x" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>이메일</Text>
                    <TextInput
                      ref={emailInputRef}
                      value={email}
                      onChangeText={handleEmailChange}
                      style={[styles.input, Platform.OS === 'web' && styles.webInput]}
                      placeholder="이메일 주소 입력"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                      onSubmitEditing={handleEmailSubmit}
                      blurOnSubmit={false}
                      autoFocus={visible}
                    />
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>비밀번호</Text>
                    <TextInput
                      ref={passwordInputRef}
                      value={password}
                      onChangeText={handlePasswordChange}
                      style={[styles.input, Platform.OS === 'web' && styles.webInput]}
                      placeholder="비밀번호 입력"
                      secureTextEntry
                      returnKeyType="done"
                      onSubmitEditing={!isSubmitDisabled ? onSubmit : undefined}
                    />
                  </View>
                  
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                  
                  <TouchableOpacity
                    onPress={onSubmit}
                    style={[
                      styles.submitButton,
                      isSubmitDisabled && styles.disabledButton
                    ]}
                    disabled={isSubmitDisabled}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.submitButtonText}>로그인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  modalContentWrapper: {
    width: '90%',
    maxWidth: 400,
  } as ViewStyle,
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  } as ViewStyle,
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  } as TextStyle,
  closeButton: {
    padding: 4,
  } as ViewStyle,
  form: {
    width: '100%',
  } as ViewStyle,
  inputContainer: {
    marginBottom: 16,
  } as ViewStyle,
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 6,
  } as TextStyle,
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  } as TextStyle,
  webInput: {
    outlineStyle: 'none',
    cursor: 'text',
  } as unknown as TextStyle,
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 16,
  } as TextStyle,
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  } as ViewStyle,
  disabledButton: {
    backgroundColor: '#93c5fd',
    opacity: 0.7,
  } as ViewStyle,
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
});

LoginModal.displayName = 'LoginModal';

export default LoginModal;