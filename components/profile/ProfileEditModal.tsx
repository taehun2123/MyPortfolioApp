import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Profile } from '../../types';
import { deleteImageFromStorage, isFirebaseStorageUrl, pickImage, uploadImageToStorage } from '../../utils/imageUtils';
import ArrayFieldInput from '../common/ArrayFieldInput';

// 포커스 가능한 텍스트 입력 컴포넌트 추가
interface FocusableInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean; 
  numberOfLines?: number;
  style?: any;
  keyboardType?: any;
}

const FocusableInput: React.FC<FocusableInputProps> = ({
  value,
  onChangeText,
  placeholder,
  multiline,
  numberOfLines,
  style,
  keyboardType
}) => {
  const inputRef = useRef<TextInput>(null);
  
  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
      <View style={{ flex: 1 }}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, style]}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

interface ProfileEditModalProps {
  profile: Profile;
  visible: boolean;
  onClose: () => void;
  onSubmit: (updatedProfile: Profile) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ 
  profile, 
  visible, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<Profile>(profile || {
    name: '',
    title: '',
    bio: '',
    profileImage: '',
    skills: [],
    links: { github: '', blog: '', email: '' }
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // 폼 데이터 변경 핸들러
  const handleChange = (field: keyof Profile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // 링크 필드 변경 핸들러
  const handleLinkChange = (field: keyof Profile['links'], value: string) => {
    setFormData(prev => ({
      ...prev,
      links: {
        ...(prev.links || {}),
        [field]: value
      }
    }));
  };
  
  // 스킬 배열 핸들러
  const handleSkillsChange = (action: 'add' | 'update' | 'remove', index?: number, value?: string) => {
    if (action === 'add' && value) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), value]
      }));
    } else if (action === 'update' && typeof index === 'number' && value) {
      const updatedSkills = [...(formData.skills || [])];
      updatedSkills[index] = value;
      setFormData(prev => ({
        ...prev,
        skills: updatedSkills
      }));
    } else if (action === 'remove' && typeof index === 'number') {
      setFormData(prev => ({
        ...prev,
        skills: (prev.skills || []).filter((_, i) => i !== index)
      }));
    }
  };
  
  // 이미지 선택 및 업로드 핸들러
  const handleImagePick = async () => {
    try {
      const imageAsset = await pickImage();
      if (!imageAsset) return;
      
      setIsUploading(true);
      
      // 기존 이미지가 Firebase Storage에 있는 경우, 삭제
      if (formData.profileImage && isFirebaseStorageUrl(formData.profileImage)) {
        await deleteImageFromStorage(formData.profileImage);
      }
      
      // 새 이미지 업로드
      const downloadUrl = await uploadImageToStorage(imageAsset.uri, 'profiles');
      if (downloadUrl) {
        handleChange('profileImage', downloadUrl);
      } else {
        Alert.alert('업로드 실패', '이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      Alert.alert('오류', '이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // 폼 제출 핸들러
  const handleSubmit = () => {
    // 필수 필드 확인 및 기본값 설정
    const finalData: Profile = {
      name: formData.name || '',
      title: formData.title || '',
      bio: formData.bio || '',
      skills: formData.skills || [],
      profileImage: formData.profileImage || '',
      links: {
        github: formData.links?.github || '',
        blog: formData.links?.blog || '',
        email: formData.links?.email || ''
      }
    };
    
    onSubmit(finalData);
  };
  
  // 키보드 바깥 터치 핸들러
  const handleOutsidePress = () => {
    Keyboard.dismiss();
  };
  
  // 모달 내부 터치 핸들러
  const handleModalPress = (e: any) => {
    // 이벤트 버블링 중지
    e.stopPropagation();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={handleModalPress}>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>프로필 수정</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Feather name="x" size={24} color="#4b5563" />
                </TouchableOpacity>
              </View>
              
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
              >
                <ScrollView 
                  style={styles.scrollContainer}
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>이름</Text>
                    <FocusableInput
                      value={formData.name}
                      onChangeText={(text) => handleChange('name', text)}
                      placeholder="이름을 입력하세요"
                    />
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>직함</Text>
                    <FocusableInput
                      value={formData.title}
                      onChangeText={(text) => handleChange('title', text)}
                      placeholder="직함을 입력하세요 (예: 프론트엔드 개발자)"
                    />
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>자기소개</Text>
                    <FocusableInput
                      value={formData.bio}
                      onChangeText={(text) => handleChange('bio', text)}
                      style={styles.textArea}
                      placeholder="간단한 자기소개를 입력하세요"
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>프로필 사진</Text>
                    
                    <View style={styles.imageUploadContainer}>
                      <View style={styles.previewContainer}>
                        {formData.profileImage ? (
                          <Image 
                            source={{ uri: formData.profileImage }}
                            style={styles.imagePreview}
                            onError={() => handleChange('profileImage', '')}
                          />
                        ) : (
                          <View style={styles.emptyImagePreview}>
                            <Text>
                              <Feather name="user" size={40} color="#9ca3af" />
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.imageButtonsContainer}>
                        <TouchableOpacity 
                          style={styles.imageButton}
                          onPress={handleImagePick}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <ActivityIndicator size="small" color="#3b82f6" />
                          ) : (
                            <View style={styles.buttonContent}>
                              <Feather name="upload" size={16} color="#3b82f6" />
                              <Text style={styles.imageButtonText}>이미지 업로드</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                        
                        {formData.profileImage && (
                          <TouchableOpacity 
                            style={[styles.imageButton, styles.deleteButton]}
                            onPress={() => handleChange('profileImage', '')}
                            disabled={isUploading}
                          >
                            <View style={styles.buttonContent}>
                              <Feather name="trash-2" size={16} color="#ef4444" />
                              <Text style={[styles.imageButtonText, styles.deleteButtonText]}>이미지 삭제</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>링크</Text>
                    <View style={styles.linkContainer}>
                      <Text style={styles.subLabel}>GitHub</Text>
                      <FocusableInput
                        value={formData.links?.github || ''}
                        onChangeText={(text) => handleLinkChange('github', text)}
                        placeholder="GitHub URL을 입력하세요"
                      />
                    </View>
                    
                    <View style={styles.linkContainer}>
                      <Text style={styles.subLabel}>블로그</Text>
                      <FocusableInput
                        value={formData.links?.blog || ''}
                        onChangeText={(text) => handleLinkChange('blog', text)}
                        placeholder="블로그 URL을 입력하세요"
                      />
                    </View>
                    
                    <View style={styles.linkContainer}>
                      <Text style={styles.subLabel}>이메일</Text>
                      <FocusableInput
                        value={formData.links?.email || ''}
                        onChangeText={(text) => handleLinkChange('email', text)}
                        placeholder="이메일 주소를 입력하세요"
                        keyboardType="email-address"
                      />
                    </View>
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>기술 스택</Text>
                    <ArrayFieldInput
                      label=""
                      items={formData.skills || []}
                      onAdd={(value) => handleSkillsChange('add', undefined, value)}
                      onUpdate={(index, value) => handleSkillsChange('update', index, value)}
                      onRemove={(index) => handleSkillsChange('remove', index)}
                      placeholder="기술 스택을 입력하세요 (예: React)"
                    />
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={onClose}
                    >
                      <Text style={styles.cancelButtonText}>취소</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.submitButton}
                      onPress={handleSubmit}
                      disabled={isUploading}
                    >
                      <Text style={styles.submitButtonText}>저장</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    // shadow* 속성을 boxShadow로 대체
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.25)'
    } : {
      // 네이티브 환경에서는 기존 shadow 속성 유지
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    ...Platform.select({
      web: { 
        // outline 속성 수정
        outlineWidth: 0,
        outlineStyle: 'solid',
        cursor: 'text' 
      },
    }),
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  linkContainer: {
    marginBottom: 12,
  },
  imageUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  previewContainer: {
    marginRight: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
  },
  emptyImagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  imageButtonsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    marginBottom: 0,
  },
  deleteButtonText: {
    color: '#ef4444',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default ProfileEditModal;