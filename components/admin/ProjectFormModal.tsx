import { Feather } from "@expo/vector-icons";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { ApiItem, Project, Screenshot } from "../../types";
import { deleteImageFromStorage, isFirebaseStorageUrl } from "../../utils/imageUtils";
import ArrayFieldInput from "../common/ArrayFieldInput";

// 폼 컴포넌트 임포트
import ApiSection from "./form/ApiSection";
import FocusableTextInput from "./form/FocusableTextInput";
import FormActions from "./form/FormActions";
import FormField from "./form/FormField";
import FormSection from "./form/FormSection";
import ImageUpload from "./form/ImageUpload";
import ScreenshotFormItem from "./form/ScreenshotFormItem";

interface ProjectFormModalProps {
  visible: boolean;
  project: Project | Omit<Project, "id">;
  onSubmit: (project: Project | Omit<Project, "id">) => void;
  onClose: () => void;
}

/**
 * 프로젝트 폼 모달 컴포넌트
 */
const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  visible,
  project,
  onSubmit,
  onClose,
}) => {
  // 초기화 함수 - 프로젝트 객체 구조 확인 및 기본값 설정
  const initializeProject = useCallback((projectData: Project | Omit<Project, "id">) => {
    return {
      ...(projectData || {}),
      title: projectData.title || '',
      description: projectData.description || '',
      techStack: {
        fieldSkill: projectData.techStack?.fieldSkill || [],
        server: projectData.techStack?.server || [],
        os: projectData.techStack?.os || [],
        collaboration: projectData.techStack?.collaboration || [],
        tools: projectData.techStack?.tools || [],
        db: projectData.techStack?.db || []
      },
      contribution: {
        intro: projectData.contribution?.intro || '',
        period: projectData.contribution?.period || '',
        members: projectData.contribution?.members || '',
        keyFeatures: projectData.contribution?.keyFeatures || [],
        teamAchievement: projectData.contribution?.teamAchievement || '',
        role: {
          summary: projectData.contribution?.role?.summary || '',
          details: projectData.contribution?.role?.details || []
        }
      },
      apiDesign: {
        auth: projectData.apiDesign?.auth || [],
        data: projectData.apiDesign?.data || []
      },
      screenshots: projectData.screenshots || [],
      architecture: {
        image: projectData.architecture?.image || '',
        description: projectData.architecture?.description || ''
      }
    };
  }, []);

  const [formData, setFormData] = useState<any>(initializeProject(project));
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);

  // 모달이 열릴 때마다 폼 데이터 초기화
  useEffect(() => {
    if (visible) {
      setFormData(initializeProject(project));
    }
  }, [visible, project, initializeProject]);

  // 모달 내부 클릭 처리
  const handleModalPress = useCallback((e: { stopPropagation: () => void; }) => {
    // 모달 내부 클릭 시 키보드 숨기지 않음
    e.stopPropagation();
  }, []);

  // 폼 데이터 변경 핸들러
  const handleChange = useCallback(
    (section: string | null, field: string, value: any) => {
      if (section) {
        setFormData((prevData: { [x: string]: any; }) => ({
          ...prevData,
          [section]: {
            ...(prevData[section] || {}),
            [field]: value,
          },
        }));
      } else {
        setFormData((prevData: any) => ({
          ...prevData,
          [field]: value,
        }));
      }
    },
    []
  );

  // 중첩 객체 필드 변경 핸들러
  const handleNestedChange = useCallback(
    (section: string, nestedSection: string, field: string, value: any) => {
      setFormData((prevData: { [x: string]: any; }) => ({
        ...prevData,
        [section]: {
          ...(prevData[section] || {}),
          [nestedSection]: {
            ...((prevData[section] || {})[nestedSection] || {}),
            [field]: value,
          },
        },
      }));
    },
    []
  );

  // 배열 항목 핸들러
  const handleArrayItem = useCallback(
    (
      section: string | null,
      field: string,
      action: string,
      index: number | null,
      value: string
    ) => {
      const currentArray = section 
        ? (formData[section]?.[field] || []) 
        : (formData[field] || []);
      let newArray;

      if (action === "add") {
        newArray = [...currentArray, value];
      } else if (action === "update" && index !== null) {
        newArray = [...currentArray];
        newArray[index] = value;
      } else if (action === "remove" && index !== null) {
        newArray = currentArray.filter((_: any, i: number) => i !== index);
      } else {
        return;
      }

      if (section) {
        handleChange(section, field, newArray);
      } else {
        setFormData((prevData: any) => ({
          ...prevData,
          [field]: newArray,
        }));
      }
    },
    [formData, handleChange]
  );

  // 중첩 배열 항목 핸들러
  const handleNestedArrayItem = useCallback(
    (
      section: string,
      nestedSection: string,
      field: string,
      action: string,
      index: number | null,
      value: string
    ) => {
      const currentArray = formData[section]?.[nestedSection]?.[field] || [];
      let newArray;

      if (action === "add") {
        newArray = [...currentArray, value];
      } else if (action === "update" && index !== null) {
        newArray = [...currentArray];
        newArray[index] = value;
      } else if (action === "remove" && index !== null) {
        newArray = currentArray.filter((_: any, i: number) => i !== index);
      } else {
        return;
      }

      handleNestedChange(section, nestedSection, field, newArray);
    },
    [formData, handleNestedChange]
  );

  // API 항목 핸들러
  const handleApiItem = useCallback(
    (
      apiType: "auth" | "data",
      action: string,
      index: number | null,
      field?: string,
      value?: string
    ) => {
      const currentApis = formData.apiDesign?.[apiType] || [];
      let newApis;

      if (action === "add") {
        newApis = [
          ...currentApis,
          { method: "GET", endpoint: "", description: "" },
        ];
      } else if (
        action === "update" &&
        index !== null &&
        field &&
        value !== undefined
      ) {
        newApis = currentApis.map((api: ApiItem, i: number) =>
          i === index ? { ...api, [field]: value } : api
        );
      } else if (action === "remove" && index !== null) {
        newApis = currentApis.filter((_: ApiItem, i: number) => i !== index);
      } else {
        return;
      }

      handleChange("apiDesign", apiType, newApis);
    },
    [formData.apiDesign, handleChange]
  );

  // 스크린샷 항목 핸들러
  const handleScreenshotItem = useCallback(
    (action: string, index: number | null, field?: string, value?: string) => {
      const currentScreenshots = formData.screenshots || [];
      let newScreenshots;

      if (action === "add") {
        newScreenshots = [
          ...currentScreenshots,
          { image: "", description: "" },
        ];
      } else if (
        action === "update" &&
        index !== null &&
        field &&
        value !== undefined
      ) {
        newScreenshots = currentScreenshots.map(
          (screenshot: Screenshot, i: number) =>
            i === index ? { ...screenshot, [field]: value } : screenshot
        );
      } else if (action === "remove" && index !== null) {
        // 삭제할 스크린샷 이미지가 Firebase Storage에 있으면 삭제
        const screenshotToDelete = currentScreenshots[index];
        if (screenshotToDelete?.image && isFirebaseStorageUrl(screenshotToDelete.image)) {
          deleteImageFromStorage(screenshotToDelete.image)
            .catch(err => console.error('스크린샷 이미지 삭제 실패:', err));
        }
        
        newScreenshots = currentScreenshots.filter(
          (_: Screenshot, i: number) => i !== index
        );
      } else {
        return;
      }

      handleChange(null, "screenshots", newScreenshots);
    },
    [formData.screenshots, handleChange]
  );

  // 아키텍처 이미지 변경 핸들러
  const handleArchitectureImageChange = useCallback((url: string) => {
    handleChange("architecture", "image", url);
  }, [handleChange]);

  // 스크린샷 이미지 변경 핸들러
  const handleScreenshotImageChange = useCallback((index: number, url: string) => {
    handleScreenshotItem("update", index, "image", url);
  }, [handleScreenshotItem]);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(() => {
    if (uploadingImages) {
      Alert.alert('이미지 업로드 중', '이미지 업로드가 완료될 때까지 기다려주세요.');
      return;
    }
    
    // ID가 있으면 해당 ID 보존
    const finalFormData = "id" in project ? { ...formData, id: project.id } : formData;
    onSubmit(finalFormData);
  }, [formData, onSubmit, uploadingImages, project]);

  // 콘솔에 로그 출력 (디버깅용)
  console.log('[ProjectFormModal] Rendering with formData:', formData);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={handleModalPress}>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>
                  {"id" in project ? "프로젝트 수정" : "새 프로젝트 추가"}
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <Feather name="x" size={24} color="#4b5563" />
                </TouchableOpacity>
              </View>

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
              >
                <ScrollView
                  style={styles.formScrollContainer}
                  contentContainerStyle={styles.formScrollContent}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={true}
                >
                  {/* 기본 정보 섹션 */}
                  <FormSection title="기본 정보">
                    <FormField label="프로젝트 제목">
                      <FocusableTextInput
                        value={formData.title}
                        onChangeText={(text) => handleChange(null, "title", text)}
                        placeholder="프로젝트 제목 입력"
                      />
                    </FormField>

                    <FormField label="프로젝트 설명">
                      <FocusableTextInput
                        value={formData.description}
                        onChangeText={(text) => handleChange(null, "description", text)}
                        placeholder="프로젝트 설명 입력"
                        multiline
                        style={styles.textArea}
                      />
                    </FormField>
                  </FormSection>

                  {/* 기술 스택 섹션 */}
                  <FormSection title="기술 스택">
                    <ArrayFieldInput
                      label="Field Skill"
                      items={formData.techStack?.fieldSkill || []}
                      onAdd={(value) => handleArrayItem("techStack", "fieldSkill", "add", null, value)}
                      onUpdate={(index, value) => handleArrayItem("techStack", "fieldSkill", "update", index, value)}
                      onRemove={(index) => handleArrayItem("techStack", "fieldSkill", "remove", index, "")}
                      placeholder="예: React, TypeScript 등"
                    />

                    <ArrayFieldInput
                      label="Server/Deployment"
                      items={formData.techStack?.server || []}
                      onAdd={(value) => handleArrayItem("techStack", "server", "add", null, value)}
                      onUpdate={(index, value) => handleArrayItem("techStack", "server", "update", index, value)}
                      onRemove={(index) => handleArrayItem("techStack", "server", "remove", index, "")}
                      placeholder="예: AWS, Docker 등"
                    />

                    <ArrayFieldInput
                      label="OS"
                      items={formData.techStack?.os || []}
                      onAdd={(value) => handleArrayItem("techStack", "os", "add", null, value)}
                      onUpdate={(index, value) => handleArrayItem("techStack", "os", "update", index, value)}
                      onRemove={(index) => handleArrayItem("techStack", "os", "remove", index, "")}
                      placeholder="예: Windows, Linux 등"
                    />

                    <ArrayFieldInput
                      label="Collaboration"
                      items={formData.techStack?.collaboration || []}
                      onAdd={(value) => handleArrayItem("techStack", "collaboration", "add", null, value)}
                      onUpdate={(index, value) => handleArrayItem("techStack", "collaboration", "update", index, value)}
                      onRemove={(index) => handleArrayItem("techStack", "collaboration", "remove", index, "")}
                      placeholder="예: Git, Jira 등"
                    />

                    <ArrayFieldInput
                      label="Tools"
                      items={formData.techStack?.tools || []}
                      onAdd={(value) => handleArrayItem("techStack", "tools", "add", null, value)}
                      onUpdate={(index, value) => handleArrayItem("techStack", "tools", "update", index, value)}
                      onRemove={(index) => handleArrayItem("techStack", "tools", "remove", index, "")}
                      placeholder="예: VSCode, IntelliJ 등"
                    />

                    <ArrayFieldInput
                      label="DB"
                      items={formData.techStack?.db || []}
                      onAdd={(value) => handleArrayItem("techStack", "db", "add", null, value)}
                      onUpdate={(index, value) => handleArrayItem("techStack", "db", "update", index, value)}
                      onRemove={(index) => handleArrayItem("techStack", "db", "remove", index, "")}
                      placeholder="예: MySQL, MongoDB 등"
                    />
                  </FormSection>

                  {/* 기여 섹션 */}
                  <FormSection title="기여">
                    <FormField label="프로젝트 소개">
                      <FocusableTextInput
                        value={formData.contribution?.intro || ''}
                        onChangeText={(text) => handleChange("contribution", "intro", text)}
                        placeholder="프로젝트 소개 입력"
                        multiline
                        style={styles.textArea}
                      />
                    </FormField>

                    <View style={styles.twoColumnLayout}>
                      <FormField label="기간" style={styles.columnField}>
                        <FocusableTextInput
                          value={formData.contribution?.period || ''}
                          onChangeText={(text) => handleChange("contribution", "period", text)}
                          placeholder="예: 2024.01 ~ 2024.03 (3개월)"
                        />
                      </FormField>

                      <FormField label="인원" style={styles.columnField}>
                        <FocusableTextInput
                          value={formData.contribution?.members || ''}
                          onChangeText={(text) => handleChange("contribution", "members", text)}
                          placeholder="예: 프론트엔드 2명, 백엔드 3명"
                        />
                      </FormField>
                    </View>

                    <ArrayFieldInput
                      label="핵심 기능"
                      items={formData.contribution?.keyFeatures || []}
                      onAdd={(value) => handleArrayItem("contribution", "keyFeatures", "add", null, value)}
                      onUpdate={(index, value) => handleArrayItem("contribution", "keyFeatures", "update", index, value)}
                      onRemove={(index) => handleArrayItem("contribution", "keyFeatures", "remove", index, "")}
                      placeholder="핵심 기능 입력"
                      multiline
                    />

                    <FormField label="팀 성과">
                      <FocusableTextInput
                        value={formData.contribution?.teamAchievement || ''}
                        onChangeText={(text) => handleChange("contribution", "teamAchievement", text)}
                        placeholder="팀이 이룬 성과를 작성하세요"
                        multiline
                        style={styles.textArea}
                      />
                    </FormField>

                    <FormField label="역할 요약">
                      <FocusableTextInput
                        value={formData.contribution?.role?.summary || ''}
                        onChangeText={(text) => handleNestedChange("contribution", "role", "summary", text)}
                        placeholder="담당한 역할에 대한 요약"
                        multiline
                        style={styles.textArea}
                      />
                    </FormField>

                    <ArrayFieldInput
                      label="역할 세부 내용"
                      items={formData.contribution?.role?.details || []}
                      onAdd={(value) => handleNestedArrayItem("contribution", "role", "details", "add", null, value)}
                      onUpdate={(index, value) => handleNestedArrayItem("contribution", "role", "details", "update", index, value)}
                      onRemove={(index) => handleNestedArrayItem("contribution", "role", "details", "remove", index, "")}
                      placeholder="세부 역할 내용 입력"
                      multiline
                    />
                  </FormSection>

                  {/* 아키텍처 섹션 */}
                  <FormSection title="아키텍처">
                    <FormField label="아키텍처 이미지">
                      <ImageUpload
                        imageUrl={formData.architecture?.image || ''}
                        onImageChange={handleArchitectureImageChange}
                        placeholder="아키텍처 이미지를 업로드하세요"
                        folderPath="architectures"
                      />
                    </FormField>

                    <FormField label="설명">
                      <FocusableTextInput
                        value={formData.architecture?.description || ''}
                        onChangeText={(text) => handleChange("architecture", "description", text)}
                        placeholder="아키텍처 설명 입력"
                        multiline
                        style={styles.textArea}
                      />
                    </FormField>
                  </FormSection>

                  {/* API 설계 섹션 */}
                  <FormSection title="API 설계">
                    <ApiSection
                      title="인증 관련 API"
                      apis={formData.apiDesign?.auth || []}
                      onAdd={() => handleApiItem("auth", "add", null)}
                      onUpdate={(index, field, value) => handleApiItem("auth", "update", index, field, value)}
                      onRemove={(index) => handleApiItem("auth", "remove", index)}
                    />

                    <ApiSection
                      title="데이터 관련 API"
                      apis={formData.apiDesign?.data || []}
                      onAdd={() => handleApiItem("data", "add", null)}
                      onUpdate={(index, field, value) => handleApiItem("data", "update", index, field, value)}
                      onRemove={(index) => handleApiItem("data", "remove", index)}
                    />
                  </FormSection>

                  {/* 스크린샷 섹션 */}
                  <FormSection title="스크린샷">
                    {(formData.screenshots || []).map((screenshot: Screenshot, index: number) => (
                      <ScreenshotFormItem
                        key={`screenshot-${index}`}
                        screenshot={screenshot}
                        index={index}
                        onUpdate={(field, value) => handleScreenshotItem("update", index, field, value)}
                        onDelete={() => handleScreenshotItem("remove", index)}
                        onImageChange={(url) => handleScreenshotImageChange(index, url)}
                      />
                    ))}

                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleScreenshotItem("add", null)}
                    >
                      <Feather name="plus" size={16} color="#3b82f6" />
                      <Text style={styles.addButtonText}>스크린샷 추가</Text>
                    </TouchableOpacity>
                  </FormSection>

                  <FormActions
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                    submitLabel={"id" in project ? "수정 완료" : "추가하기"}
                    isSubmitDisabled={uploadingImages}
                  />
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 600,
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "white",
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  formScrollContainer: {
    flex: 1,
  },
  formScrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  twoColumnLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  columnField: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
});

export default memo(ProjectFormModal);