import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ArrayFieldInput from '../common/ArrayFieldInput';
import { Project, ApiItem, Screenshot } from '../../types';

interface ProjectFormModalProps {
  visible: boolean;
  project: Project | Omit<Project, 'id'>;
  onSubmit: (project: Project | Omit<Project, 'id'>) => void;
  onClose: () => void;
}

/**
 * 프로젝트 폼 모달 컴포넌트
 */
const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  visible,
  project,
  onSubmit,
  onClose
}) => {
  const [formData, setFormData] = useState<any>(project);
  
  // 폼 데이터 변경 핸들러
  const handleChange = (section: string | null, field: string, value: any) => {
    if (section) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };
  
  // 중첩 객체 필드 변경 핸들러
  const handleNestedChange = (section: string, nestedSection: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [nestedSection]: {
          ...formData[section]?.[nestedSection],
          [field]: value
        }
      }
    });
  };
  
  // 배열 항목 핸들러
  const handleArrayItem = (section: string | null, field: string, action: string, index: number | null, value: string) => {
    const currentArray = section ? formData[section][field] : formData[field];
    let newArray;
    
    if (action === 'add') {
      newArray = [...currentArray, value];
    } else if (action === 'update' && index !== null) {
      newArray = [...currentArray];
      newArray[index] = value;
    } else if (action === 'remove' && index !== null) {
      newArray = currentArray.filter((_: any, i: number) => i !== index);
    } else {
      return;
    }
    
    if (section) {
      handleChange(section, field, newArray);
    } else {
      setFormData({
        ...formData,
        [field]: newArray
      });
    }
  };
  
  // 중첩 배열 항목 핸들러
  const handleNestedArrayItem = (
    section: string, 
    nestedSection: string, 
    field: string, 
    action: string, 
    index: number | null, 
    value: string
  ) => {
    const currentArray = formData[section][nestedSection][field];
    let newArray;
    
    if (action === 'add') {
      newArray = [...currentArray, value];
    } else if (action === 'update' && index !== null) {
      newArray = [...currentArray];
      newArray[index] = value;
    } else if (action === 'remove' && index !== null) {
      newArray = currentArray.filter((_: any, i: number) => i !== index);
    } else {
      return;
    }
    
    handleNestedChange(section, nestedSection, field, newArray);
  };
  
  // API 항목 핸들러
  const handleApiItem = (apiType: 'auth' | 'data', action: string, index: number | null, field?: string, value?: string) => {
    const currentApis = formData.apiDesign[apiType];
    let newApis;
    
    if (action === 'add') {
      newApis = [...currentApis, { method: 'GET', endpoint: '', description: '' }];
    } else if (action === 'update' && index !== null && field && value !== undefined) {
      newApis = currentApis.map((api: ApiItem, i: number) => 
        i === index ? { ...api, [field]: value } : api
      );
    } else if (action === 'remove' && index !== null) {
      newApis = currentApis.filter((_: ApiItem, i: number) => i !== index);
    } else {
      return;
    }
    
    handleChange('apiDesign', apiType, newApis);
  };
  
  // 스크린샷 항목 핸들러
  const handleScreenshotItem = (action: string, index: number | null, field?: string, value?: string) => {
    const currentScreenshots = formData.screenshots;
    let newScreenshots;
    
    if (action === 'add') {
      newScreenshots = [...currentScreenshots, { image: '', description: '' }];
    } else if (action === 'update' && index !== null && field && value !== undefined) {
      newScreenshots = currentScreenshots.map((screenshot: Screenshot, i: number) => 
        i === index ? { ...screenshot, [field]: value } : screenshot
      );
    } else if (action === 'remove' && index !== null) {
      newScreenshots = currentScreenshots.filter((_: Screenshot, i: number) => i !== index);
    } else {
      return;
    }
    
    handleChange(null, 'screenshots', newScreenshots);
  };
  
  // 폼 제출 핸들러
  const handleSubmit = () => {
    onSubmit(formData);
  };
  
  // API 메서드 선택 옵션
  const apiMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContentWrapper}
          >
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>
                  {'id' in project ? '프로젝트 수정' : '새 프로젝트 추가'}
                </Text>
                <TouchableOpacity 
                  onPress={onClose} 
                  style={styles.closeButton}
                  accessibilityLabel="닫기"
                >
                  <Feather name="x" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                {/* 기본 정보 섹션 */}
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>기본 정보</Text>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>프로젝트 제목</Text>
                    <TextInput
                      value={formData.title}
                      onChangeText={(text) => handleChange(null, 'title', text)}
                      style={styles.input}
                      placeholder="프로젝트 제목 입력"
                    />
                  </View>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>프로젝트 설명</Text>
                    <TextInput
                      value={formData.description}
                      onChangeText={(text) => handleChange(null, 'description', text)}
                      style={[styles.input, styles.textArea]}
                      placeholder="프로젝트 설명 입력"
                      multiline
                    />
                  </View>
                </View>
                
                {/* 기술 스택 섹션 */}
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>기술 스택</Text>
                  
                  <ArrayFieldInput
                    label="Field Skill"
                    items={formData.techStack.fieldSkill}
                    onAdd={(value: string) => handleArrayItem('techStack', 'fieldSkill', 'add', null, value)}
                    onUpdate={(index: number | null, value: string) => handleArrayItem('techStack', 'fieldSkill', 'update', index, value)}
                    onRemove={(index: number | null) => handleArrayItem('techStack', 'fieldSkill', 'remove', index, '')}
                    placeholder="예: React, TypeScript 등"
                  />
                  
                  <ArrayFieldInput
                    label="Server/Deployment"
                    items={formData.techStack.server}
                    onAdd={(value: string) => handleArrayItem('techStack', 'server', 'add', null, value)}
                    onUpdate={(index: number | null, value: string) => handleArrayItem('techStack', 'server', 'update', index, value)}
                    onRemove={(index: number | null) => handleArrayItem('techStack', 'server', 'remove', index, '')}
                    placeholder="예: AWS, Docker 등"
                  />
                  
                  <ArrayFieldInput
                    label="OS"
                    items={formData.techStack.os}
                    onAdd={(value: string) => handleArrayItem('techStack', 'os', 'add', null, value)}
                    onUpdate={(index: number | null, value: string) => handleArrayItem('techStack', 'os', 'update', index, value)}
                    onRemove={(index: number | null) => handleArrayItem('techStack', 'os', 'remove', index, '')}
                    placeholder="예: Windows, Linux 등"
                  />
                  
                  <ArrayFieldInput
                    label="Collaboration"
                    items={formData.techStack.collaboration}
                    onAdd={(value: string) => handleArrayItem('techStack', 'collaboration', 'add', null, value)}
                    onUpdate={(index: number | null, value: string) => handleArrayItem('techStack', 'collaboration', 'update', index, value)}
                    onRemove={(index: number | null) => handleArrayItem('techStack', 'collaboration', 'remove', index, '')}
                    placeholder="예: Git, Jira 등"
                  />
                  
                  <ArrayFieldInput
                    label="Tools"
                    items={formData.techStack.tools}
                    onAdd={(value: string) => handleArrayItem('techStack', 'tools', 'add', null, value)}
                    onUpdate={(index: number | null, value: string) => handleArrayItem('techStack', 'tools', 'update', index, value)}
                    onRemove={(index: number | null) => handleArrayItem('techStack', 'tools', 'remove', index, '')}
                    placeholder="예: VSCode, IntelliJ 등"
                  />
                  
                  <ArrayFieldInput
                    label="DB"
                    items={formData.techStack.db}
                    onAdd={(value: string) => handleArrayItem('techStack', 'db', 'add', null, value)}
                    onUpdate={(index: number | null, value: string) => handleArrayItem('techStack', 'db', 'update', index, value)}
                    onRemove={(index: number | null) => handleArrayItem('techStack', 'db', 'remove', index, '')}
                    placeholder="예: MySQL, MongoDB 등"
                  />
                </View>
                
                {/* 기여 섹션 */}
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>기여</Text>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>프로젝트 소개</Text>
                    <TextInput
                      value={formData.contribution.intro}
                      onChangeText={(text) => handleChange('contribution', 'intro', text)}
                      style={[styles.input, styles.textArea]}
                      placeholder="프로젝트 소개 입력"
                      multiline
                    />
                  </View>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>기간</Text>
                    <TextInput
                      value={formData.contribution.period}
                      onChangeText={(text) => handleChange('contribution', 'period', text)}
                      style={styles.input}
                      placeholder="예: 2024.01 ~ 2024.03 (3개월)"
                    />
                  </View>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>인원</Text>
                    <TextInput
                      value={formData.contribution.members}
                      onChangeText={(text) => handleChange('contribution', 'members', text)}
                      style={styles.input}
                      placeholder="예: 프론트엔드 2명, 백엔드 3명"
                    />
                  </View>
                  
                  <ArrayFieldInput
                    label="핵심 기능"
                    items={formData.contribution.keyFeatures}
                    onAdd={(value: string) => handleArrayItem('contribution', 'keyFeatures', 'add', null, value)}
                    onUpdate={(index: number | null, value: string) => handleArrayItem('contribution', 'keyFeatures', 'update', index, value)}
                    onRemove={(index: number | null) => handleArrayItem('contribution', 'keyFeatures', 'remove', index, '')}
                    placeholder="핵심 기능 입력"
                    multiline
                  />
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>팀 성과</Text>
                    <TextInput
                      value={formData.contribution.teamAchievement}
                      onChangeText={(text) => handleChange('contribution', 'teamAchievement', text)}
                      style={[styles.input, styles.textArea]}
                      placeholder="팀이 이룬 성과를 작성하세요"
                      multiline
                    />
                  </View>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>역할 요약</Text>
                    <TextInput
                      value={formData.contribution.role.summary}
                      onChangeText={(text) => handleNestedChange('contribution', 'role', 'summary', text)}
                      style={[styles.input, styles.textArea]}
                      placeholder="담당한 역할에 대한 요약"
                      multiline
                    />
                  </View>
                  
                  <ArrayFieldInput
                    label="역할 세부 내용"
                    items={formData.contribution.role.details}
                    onAdd={(value: string) => handleNestedArrayItem('contribution', 'role', 'details', 'add', null, value)}
                    onUpdate={(index: number | null, value: string) => handleNestedArrayItem('contribution', 'role', 'details', 'update', index, value)}
                    onRemove={(index: number | null) => handleNestedArrayItem('contribution', 'role', 'details', 'remove', index, '')}
                    placeholder="세부 역할 내용 입력"
                    multiline
                  />
                </View>
                
                {/* API 설계 섹션 */}
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>API 설계</Text>
                  
                  {/* 인증 API 섹션 */}
                  <View style={styles.apiSection}>
                    <Text style={styles.subSectionTitle}>인증 관련 API</Text>
                    
                    {formData.apiDesign.auth.map((api: ApiItem, index: number) => (
                      <View key={`auth-api-${index}`} style={styles.apiItem}>
                        <View style={styles.apiMethodContainer}>
                          <Text style={styles.fieldLabel}>Method</Text>
                          <View style={styles.apiMethodButtons}>
                            {apiMethods.map(method => (
                              <TouchableOpacity
                                key={method}
                                style={[
                                  styles.apiMethodButton,
                                  api.method === method && styles.apiMethodButtonActive
                                ]}
                                onPress={() => handleApiItem('auth', 'update', index, 'method', method)}
                              >
                                <Text 
                                  style={[
                                    styles.apiMethodButtonText,
                                    api.method === method && styles.apiMethodButtonTextActive
                                  ]}
                                >
                                  {method}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                        
                        <View style={styles.fieldContainer}>
                          <Text style={styles.fieldLabel}>Endpoint</Text>
                          <TextInput
                            value={api.endpoint}
                            onChangeText={(text) => handleApiItem('auth', 'update', index, 'endpoint', text)}
                            style={styles.input}
                            placeholder="/api/auth/..."
                          />
                        </View>
                        
                        <View style={styles.fieldContainer}>
                          <Text style={styles.fieldLabel}>Description</Text>
                          <TextInput
                            value={api.description}
                            onChangeText={(text) => handleApiItem('auth', 'update', index, 'description', text)}
                            style={styles.input}
                            placeholder="API 설명"
                          />
                        </View>
                        
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleApiItem('auth', 'remove', index)}
                        >
                          <Feather name="trash-2" size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleApiItem('auth', 'add', null)}
                    >
                      <Feather name="plus" size={16} color="#3b82f6" />
                      <Text style={styles.addButtonText}>인증 API 추가</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* 데이터 API 섹션 */}
                  <View style={styles.apiSection}>
                    <Text style={styles.subSectionTitle}>데이터 관련 API</Text>
                    
                    {formData.apiDesign.data.map((api: ApiItem, index: number) => (
                      <View key={`data-api-${index}`} style={styles.apiItem}>
                        <View style={styles.apiMethodContainer}>
                          <Text style={styles.fieldLabel}>Method</Text>
                          <View style={styles.apiMethodButtons}>
                            {apiMethods.map(method => (
                              <TouchableOpacity
                                key={method}
                                style={[
                                  styles.apiMethodButton,
                                  api.method === method && styles.apiMethodButtonActive
                                ]}
                                onPress={() => handleApiItem('data', 'update', index, 'method', method)}
                              >
                                <Text 
                                  style={[
                                    styles.apiMethodButtonText,
                                    api.method === method && styles.apiMethodButtonTextActive
                                  ]}
                                >
                                  {method}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                        
                        <View style={styles.fieldContainer}>
                          <Text style={styles.fieldLabel}>Endpoint</Text>
                          <TextInput
                            value={api.endpoint}
                            onChangeText={(text) => handleApiItem('data', 'update', index, 'endpoint', text)}
                            style={styles.input}
                            placeholder="/api/data/..."
                          />
                        </View>
                        
                        <View style={styles.fieldContainer}>
                          <Text style={styles.fieldLabel}>Description</Text>
                          <TextInput
                            value={api.description}
                            onChangeText={(text) => handleApiItem('data', 'update', index, 'description', text)}
                            style={styles.input}
                            placeholder="API 설명"
                          />
                        </View>
                        
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleApiItem('data', 'remove', index)}
                        >
                          <Feather name="trash-2" size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleApiItem('data', 'add', null)}
                    >
                      <Feather name="plus" size={16} color="#3b82f6" />
                      <Text style={styles.addButtonText}>데이터 API 추가</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* 스크린샷 섹션 */}
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>스크린샷</Text>
                  
                  {formData.screenshots.map((screenshot: Screenshot, index: number) => (
                    <View key={`screenshot-${index}`} style={styles.screenshotItem}>
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>이미지 URL</Text>
                        <TextInput
                          value={screenshot.image}
                          onChangeText={(text) => handleScreenshotItem('update', index, 'image', text)}
                          style={styles.input}
                          placeholder="이미지 URL 입력"
                        />
                      </View>
                      
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>설명</Text>
                        <TextInput
                          value={screenshot.description}
                          onChangeText={(text) => handleScreenshotItem('update', index, 'description', text)}
                          style={styles.input}
                          placeholder="스크린샷 설명"
                        />
                      </View>
                      
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleScreenshotItem('remove', index)}
                      >
                        <Feather name="trash-2" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleScreenshotItem('add', null)}
                  >
                    <Feather name="plus" size={16} color="#3b82f6" />
                    <Text style={styles.addButtonText}>스크린샷 추가</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.formActions}>
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
                    <Text style={styles.submitButtonText}>
                      {'id' in project ? '수정 완료' : '추가하기'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
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
  modalContentWrapper: {
    width: '100%',
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  apiSection: {
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 12,
  },
  apiItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  apiMethodContainer: {
    marginBottom: 12,
  },
  apiMethodButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  apiMethodButton: {
    paddingVertical:.4,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
  },
  apiMethodButtonActive: {
    backgroundColor: '#3b82f6',
  },
  apiMethodButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
  },
  apiMethodButtonTextActive: {
    color: 'white',
  },
  screenshotItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
});

export default ProjectFormModal;