import React, { useState, useRef, useCallback, memo } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ArrayFieldInput from "../common/ArrayFieldInput";
import { Project, ApiItem, Screenshot } from "../../types";

// 포커스 가능한 텍스트 입력 컴포넌트
interface FocusableTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  style?: object;
  [key: string]: any;
}

const FocusableTextInput = memo<FocusableTextInputProps>(
  ({ value, onChangeText, style, ...props }) => {
    const inputRef = useRef<TextInput>(null);

    // 입력창 클릭 핸들러
    const handlePress = useCallback(() => {
      inputRef.current?.focus();
    }, []);

    return (
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={{ flex: 1 }}>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            style={[
              styles.input,
              Platform.OS === "web" && styles.webInput,
              style,
            ]}
            {...props}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

FocusableTextInput.displayName = "FocusableTextInput";

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
  const [formData, setFormData] = useState<any>(project);

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
            ...prevData[section],
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
      setFormData((prevData: { [x: string]: { [x: string]: any; }; }) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [nestedSection]: {
            ...prevData[section]?.[nestedSection],
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
      const currentArray = section ? formData[section][field] : formData[field];
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
      const currentArray = formData[section][nestedSection][field];
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
      const currentApis = formData.apiDesign[apiType];
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
      const currentScreenshots = formData.screenshots;
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

  // 폼 제출 핸들러
  const handleSubmit = useCallback(() => {
    onSubmit(formData);
  }, [formData, onSubmit]);

  // API 메서드 선택 옵션
  const apiMethods = ["GET", "POST", "PUT", "DELETE"];

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
                  <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>기본 정보</Text>

                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>프로젝트 제목</Text>
                      <FocusableTextInput
                        value={formData.title}
                        onChangeText={(text) =>
                          handleChange(null, "title", text)
                        }
                        placeholder="프로젝트 제목 입력"
                      />
                    </View>

                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>프로젝트 설명</Text>
                      <FocusableTextInput
                        value={formData.description}
                        onChangeText={(text) =>
                          handleChange(null, "description", text)
                        }
                        placeholder="프로젝트 설명 입력"
                        multiline
                        style={styles.textArea}
                      />
                    </View>
                  </View>

                  {/* 기술 스택 섹션 */}
                  <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>기술 스택</Text>

                    <ArrayFieldInput
                      label="Field Skill"
                      items={formData.techStack.fieldSkill}
                      onAdd={(value) =>
                        handleArrayItem(
                          "techStack",
                          "fieldSkill",
                          "add",
                          null,
                          value
                        )
                      }
                      onUpdate={(index, value) =>
                        handleArrayItem(
                          "techStack",
                          "fieldSkill",
                          "update",
                          index,
                          value
                        )
                      }
                      onRemove={(index) =>
                        handleArrayItem(
                          "techStack",
                          "fieldSkill",
                          "remove",
                          index,
                          ""
                        )
                      }
                      placeholder="예: React, TypeScript 등"
                    />

                    <ArrayFieldInput
                      label="Server/Deployment"
                      items={formData.techStack.server}
                      onAdd={(value) =>
                        handleArrayItem(
                          "techStack",
                          "server",
                          "add",
                          null,
                          value
                        )
                      }
                      onUpdate={(index, value) =>
                        handleArrayItem(
                          "techStack",
                          "server",
                          "update",
                          index,
                          value
                        )
                      }
                      onRemove={(index) =>
                        handleArrayItem(
                          "techStack",
                          "server",
                          "remove",
                          index,
                          ""
                        )
                      }
                      placeholder="예: AWS, Docker 등"
                    />

                    <ArrayFieldInput
                      label="OS"
                      items={formData.techStack.os}
                      onAdd={(value) =>
                        handleArrayItem("techStack", "os", "add", null, value)
                      }
                      onUpdate={(index, value) =>
                        handleArrayItem(
                          "techStack",
                          "os",
                          "update",
                          index,
                          value
                        )
                      }
                      onRemove={(index) =>
                        handleArrayItem("techStack", "os", "remove", index, "")
                      }
                      placeholder="예: Windows, Linux 등"
                    />

                    <ArrayFieldInput
                      label="Collaboration"
                      items={formData.techStack.collaboration}
                      onAdd={(value) =>
                        handleArrayItem(
                          "techStack",
                          "collaboration",
                          "add",
                          null,
                          value
                        )
                      }
                      onUpdate={(index, value) =>
                        handleArrayItem(
                          "techStack",
                          "collaboration",
                          "update",
                          index,
                          value
                        )
                      }
                      onRemove={(index) =>
                        handleArrayItem(
                          "techStack",
                          "collaboration",
                          "remove",
                          index,
                          ""
                        )
                      }
                      placeholder="예: Git, Jira 등"
                    />

                    <ArrayFieldInput
                      label="Tools"
                      items={formData.techStack.tools}
                      onAdd={(value) =>
                        handleArrayItem(
                          "techStack",
                          "tools",
                          "add",
                          null,
                          value
                        )
                      }
                      onUpdate={(index, value) =>
                        handleArrayItem(
                          "techStack",
                          "tools",
                          "update",
                          index,
                          value
                        )
                      }
                      onRemove={(index) =>
                        handleArrayItem(
                          "techStack",
                          "tools",
                          "remove",
                          index,
                          ""
                        )
                      }
                      placeholder="예: VSCode, IntelliJ 등"
                    />

                    <ArrayFieldInput
                      label="DB"
                      items={formData.techStack.db}
                      onAdd={(value) =>
                        handleArrayItem("techStack", "db", "add", null, value)
                      }
                      onUpdate={(index, value) =>
                        handleArrayItem(
                          "techStack",
                          "db",
                          "update",
                          index,
                          value
                        )
                      }
                      onRemove={(index) =>
                        handleArrayItem("techStack", "db", "remove", index, "")
                      }
                      placeholder="예: MySQL, MongoDB 등"
                    />
                  </View>

                  {/* 기여 섹션 */}
                  <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>기여</Text>

                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>프로젝트 소개</Text>
                      <FocusableTextInput
                        value={formData.contribution.intro}
                        onChangeText={(text) =>
                          handleChange("contribution", "intro", text)
                        }
                        placeholder="프로젝트 소개 입력"
                        multiline
                        style={styles.textArea}
                      />
                    </View>

                    <View style={styles.twoColumnLayout}>
                      <View style={styles.columnField}>
                        <Text style={styles.fieldLabel}>기간</Text>
                        <FocusableTextInput
                          value={formData.contribution.period}
                          onChangeText={(text) =>
                            handleChange("contribution", "period", text)
                          }
                          placeholder="예: 2024.01 ~ 2024.03 (3개월)"
                        />
                      </View>

                      <View style={styles.columnField}>
                        <Text style={styles.fieldLabel}>인원</Text>
                        <FocusableTextInput
                          value={formData.contribution.members}
                          onChangeText={(text) =>
                            handleChange("contribution", "members", text)
                          }
                          placeholder="예: 프론트엔드 2명, 백엔드 3명"
                        />
                      </View>
                    </View>

                    <ArrayFieldInput
                      label="핵심 기능"
                      items={formData.contribution.keyFeatures}
                      onAdd={(value) =>
                        handleArrayItem(
                          "contribution",
                          "keyFeatures",
                          "add",
                          null,
                          value
                        )
                      }
                      onUpdate={(index, value) =>
                        handleArrayItem(
                          "contribution",
                          "keyFeatures",
                          "update",
                          index,
                          value
                        )
                      }
                      onRemove={(index) =>
                        handleArrayItem(
                          "contribution",
                          "keyFeatures",
                          "remove",
                          index,
                          ""
                        )
                      }
                      placeholder="핵심 기능 입력"
                      multiline
                    />

                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>팀 성과</Text>
                      <FocusableTextInput
                        value={formData.contribution.teamAchievement}
                        onChangeText={(text) =>
                          handleChange("contribution", "teamAchievement", text)
                        }
                        placeholder="팀이 이룬 성과를 작성하세요"
                        multiline
                        style={styles.textArea}
                      />
                    </View>

                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>역할 요약</Text>
                      <FocusableTextInput
                        value={formData.contribution.role.summary}
                        onChangeText={(text) =>
                          handleNestedChange(
                            "contribution",
                            "role",
                            "summary",
                            text
                          )
                        }
                        placeholder="담당한 역할에 대한 요약"
                        multiline
                        style={styles.textArea}
                      />
                    </View>

                    <ArrayFieldInput
                      label="역할 세부 내용"
                      items={formData.contribution.role.details}
                      onAdd={(value) =>
                        handleNestedArrayItem(
                          "contribution",
                          "role",
                          "details",
                          "add",
                          null,
                          value
                        )
                      }
                      onUpdate={(index, value) =>
                        handleNestedArrayItem(
                          "contribution",
                          "role",
                          "details",
                          "update",
                          index,
                          value
                        )
                      }
                      onRemove={(index) =>
                        handleNestedArrayItem(
                          "contribution",
                          "role",
                          "details",
                          "remove",
                          index,
                          ""
                        )
                      }
                      placeholder="세부 역할 내용 입력"
                      multiline
                    />
                  </View>

                  {/* 아키텍처 섹션 */}
                  <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>아키텍처</Text>

                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>이미지 URL</Text>
                      <FocusableTextInput
                        value={formData.architecture?.image || ""}
                        onChangeText={(text) =>
                          handleNestedChange("architecture", "image", "", text)
                        }
                        placeholder="아키텍처 이미지 URL 입력"
                      />
                    </View>

                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>설명</Text>
                      <FocusableTextInput
                        value={formData.architecture?.description || ""}
                        onChangeText={(text) =>
                          handleNestedChange(
                            "architecture",
                            "description",
                            "",
                            text
                          )
                        }
                        placeholder="아키텍처 설명 입력"
                      />
                    </View>
                  </View>

                  {/* API 설계 섹션 */}
                  <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>API 설계</Text>

                    <View style={styles.apiSection}>
                      <Text style={styles.subSectionTitle}>인증 관련 API</Text>

                      {formData.apiDesign.auth.map(
                        (api: ApiItem, index: number) => (
                          <View
                            key={`auth-api-${index}`}
                            style={styles.apiItem}
                          >
                            <View style={styles.apiMethodContainer}>
                              <Text style={styles.fieldLabel}>Method</Text>
                              <View style={styles.apiMethodButtons}>
                                {apiMethods.map((method) => (
                                  <TouchableOpacity
                                    key={method}
                                    style={[
                                      styles.apiMethodButton,
                                      api.method === method &&
                                        styles.apiMethodButtonActive,
                                    ]}
                                    onPress={() =>
                                      handleApiItem(
                                        "auth",
                                        "update",
                                        index,
                                        "method",
                                        method
                                      )
                                    }
                                  >
                                    <Text
                                      style={[
                                        styles.apiMethodButtonText,
                                        api.method === method &&
                                          styles.apiMethodButtonTextActive,
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
                              <FocusableTextInput
                                value={api.endpoint}
                                onChangeText={(text) =>
                                  handleApiItem(
                                    "auth",
                                    "update",
                                    index,
                                    "endpoint",
                                    text
                                  )
                                }
                                placeholder="/api/auth/..."
                              />
                            </View>

                            <View style={styles.fieldContainer}>
                              <Text style={styles.fieldLabel}>Description</Text>
                              <FocusableTextInput
                                value={api.description}
                                onChangeText={(text) =>
                                  handleApiItem(
                                    "auth",
                                    "update",
                                    index,
                                    "description",
                                    text
                                  )
                                }
                                placeholder="API 설명"
                              />
                            </View>

                            <TouchableOpacity
                              style={styles.removeButton}
                              onPress={() =>
                                handleApiItem("auth", "remove", index)
                              }
                            >
                              <Feather
                                name="trash-2"
                                size={16}
                                color="#ef4444"
                              />
                            </TouchableOpacity>
                          </View>
                        )
                      )}

                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleApiItem("auth", "add", null)}
                      >
                        <Feather name="plus" size={16} color="#3b82f6" />
                        <Text style={styles.addButtonText}>인증 API 추가</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.apiSection}>
                      <Text style={styles.subSectionTitle}>
                        데이터 관련 API
                      </Text>

                      {formData.apiDesign.data.map(
                        (api: ApiItem, index: number) => (
                          <View
                            key={`data-api-${index}`}
                            style={styles.apiItem}
                          >
                            <View style={styles.apiMethodContainer}>
                              <Text style={styles.fieldLabel}>Method</Text>
                              <View style={styles.apiMethodButtons}>
                                {apiMethods.map((method) => (
                                  <TouchableOpacity
                                    key={method}
                                    style={[
                                      styles.apiMethodButton,
                                      api.method === method &&
                                        styles.apiMethodButtonActive,
                                    ]}
                                    onPress={() =>
                                      handleApiItem(
                                        "data",
                                        "update",
                                        index,
                                        "method",
                                        method
                                      )
                                    }
                                  >
                                    <Text
                                      style={[
                                        styles.apiMethodButtonText,
                                        api.method === method &&
                                          styles.apiMethodButtonTextActive,
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
                              <FocusableTextInput
                                value={api.endpoint}
                                onChangeText={(text) =>
                                  handleApiItem(
                                    "data",
                                    "update",
                                    index,
                                    "endpoint",
                                    text
                                  )
                                }
                                placeholder="/api/data/..."
                              />
                            </View>

                            <View style={styles.fieldContainer}>
                              <Text style={styles.fieldLabel}>Description</Text>
                              <FocusableTextInput
                                value={api.description}
                                onChangeText={(text) =>
                                  handleApiItem(
                                    "data",
                                    "update",
                                    index,
                                    "description",
                                    text
                                  )
                                }
                                placeholder="API 설명"
                              />
                            </View>

                            <TouchableOpacity
                              style={styles.removeButton}
                              onPress={() =>
                                handleApiItem("data", "remove", index)
                              }
                            >
                              <Feather
                                name="trash-2"
                                size={16}
                                color="#ef4444"
                              />
                            </TouchableOpacity>
                          </View>
                        )
                      )}

                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleApiItem("data", "add", null)}
                      >
                        <Feather name="plus" size={16} color="#3b82f6" />
                        <Text style={styles.addButtonText}>
                          데이터 API 추가
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* 스크린샷 섹션 */}
                  <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>스크린샷</Text>

                    {formData.screenshots.map(
                      (screenshot: Screenshot, index: number) => (
                        <View
                          key={`screenshot-${index}`}
                          style={styles.screenshotItem}
                        >
                          <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>이미지 URL</Text>
                            <FocusableTextInput
                              value={screenshot.image || ""}
                              onChangeText={(text) =>
                                handleScreenshotItem(
                                  "update",
                                  index,
                                  "image",
                                  text
                                )
                              }
                              placeholder="이미지 URL 입력"
                            />
                          </View>

                          <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>설명</Text>
                            <FocusableTextInput
                              value={screenshot.description || ""}
                              onChangeText={(text) =>
                                handleScreenshotItem(
                                  "update",
                                  index,
                                  "description",
                                  text
                                )
                              }
                              placeholder="스크린샷 설명"
                            />
                          </View>

                          <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() =>
                              handleScreenshotItem("remove", index)
                            }
                          >
                            <Feather name="trash-2" size={16} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      )
                    )}

                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleScreenshotItem("add", null)}
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
                        {"id" in project ? "수정 완료" : "추가하기"}
                      </Text>
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
  formSection: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 12,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  webInput: {
    outlineStyle: "solid",
    cursor: "text",
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
  apiSection: {
    marginBottom: 20,
  },
  apiItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    position: "relative",
  },
  apiMethodContainer: {
    marginBottom: 12,
  },
  apiMethodButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  apiMethodButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
    marginBottom: 8,
  },
  apiMethodButtonActive: {
    backgroundColor: "#3b82f6",
  },
  apiMethodButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
  },
  apiMethodButtonTextActive: {
    color: "white",
  },
  screenshotItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 8,
    zIndex: 5,
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
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
});

export default memo(ProjectFormModal);
