// components/profile/ProfileEditModal.tsx
import React, { useState, useRef } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ArrayFieldInput from '../common/ArrayFieldInput';
import { Profile } from '../../types';

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
  const [formData, setFormData] = useState<Profile>(profile);
  
  // 폼 데이터 변경 핸들러
  const handleChange = (field: keyof Profile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // 링크 필드 변경 핸들러
  const handleLinkChange = (field: keyof Profile['links'], value: string) => {
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        [field]: value
      }
    }));
  };
  
  // 스킬 배열 핸들러
  const handleSkillsChange = (action: 'add' | 'update' | 'remove', index?: number, value?: string) => {
    if (action === 'add' && value) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, value]
      }));
    } else if (action === 'update' && typeof index === 'number' && value) {
      const updatedSkills = [...formData.skills];
      updatedSkills[index] = value;
      setFormData(prev => ({
        ...prev,
        skills: updatedSkills
      }));
    } else if (action === 'remove' && typeof index === 'number') {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index)
      }));
    }
  };
  
  const handleSubmit = () => {
    onSubmit(formData);
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
      }}>
        <View style={styles.modalOverlay}>
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
                  <TextInput
                    value={formData.name}
                    onChangeText={(text) => handleChange('name', text)}
                    style={styles.input}
                    placeholder="이름을 입력하세요"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>직함</Text>
                  <TextInput
                    value={formData.title}
                    onChangeText={(text) => handleChange('title', text)}
                    style={styles.input}
                    placeholder="직함을 입력하세요 (예: 프론트엔드 개발자)"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>자기소개</Text>
                  <TextInput
                    value={formData.bio}
                    onChangeText={(text) => handleChange('bio', text)}
                    style={[styles.input, styles.textArea]}
                    placeholder="간단한 자기소개를 입력하세요"
                    multiline
                    numberOfLines={4}
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>프로필 사진 URL</Text>
                  <TextInput
                    value={formData.profileImage || ''}
                    onChangeText={(text) => handleChange('profileImage', text)}
                    style={styles.input}
                    placeholder="프로필 이미지 URL을 입력하세요"
                  />
                  
                  {formData.profileImage && (
                    <View style={styles.previewContainer}>
                      <Text style={styles.previewLabel}>미리보기</Text>
                      <Image 
                        source={{ uri: formData.profileImage }}
                        style={styles.imagePreview}
                        onError={() => handleChange('profileImage', '')}
                      />
                    </View>
                  )}
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>링크</Text>
                  <View style={styles.linkContainer}>
                    <Text style={styles.subLabel}>GitHub</Text>
                    <TextInput
                      value={formData.links.github}
                      onChangeText={(text) => handleLinkChange('github', text)}
                      style={styles.input}
                      placeholder="GitHub URL을 입력하세요"
                    />
                  </View>
                  
                  <View style={styles.linkContainer}>
                    <Text style={styles.subLabel}>블로그</Text>
                    <TextInput
                      value={formData.links.blog}
                      onChangeText={(text) => handleLinkChange('blog', text)}
                      style={styles.input}
                      placeholder="블로그 URL을 입력하세요"
                    />
                  </View>
                  
                  <View style={styles.linkContainer}>
                    <Text style={styles.subLabel}>이메일</Text>
                    <TextInput
                      value={formData.links.email}
                      onChangeText={(text) => handleLinkChange('email', text)}
                      style={styles.input}
                      placeholder="이메일 주소를 입력하세요"
                      keyboardType="email-address"
                    />
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>기술 스택</Text>
                  <ArrayFieldInput
                    label=""
                    items={formData.skills}
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
                  >
                    <Text style={styles.submitButtonText}>저장</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    ...(Platform.OS === 'web' ? { outlineStyle: 'solid' } : {}),
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  linkContainer: {
    marginBottom: 12,
  },
  previewContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
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