import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  FlatList,
  PanResponder
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ProjectView from "./ProjectView";
import ProjectFormModal from "../admin/ProjectFormModal";
import LoadingIndicator from "../common/LoadingIndicator";
import { useProjects } from "../../hooks/useProjects";
import { Project, EMPTY_PROJECT } from "../../types";

export interface PortfolioSectionProps {
  isAdmin: boolean;
  onBackToProfile?: () => void;
}

/**
 * 포트폴리오 섹션 컴포넌트
 */
const PortfolioSection: React.FC<PortfolioSectionProps> = ({ isAdmin, onBackToProfile }) => {
  const { projects, isLoading, addProject, updateProject, deleteProject } =
    useProjects();
  const [activeProject, setActiveProject] = useState<number>(0);
  const [showProjectForm, setShowProjectForm] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // 화면 크기
  const { width: screenWidth } = Dimensions.get("window");
  
  // 스크롤 관련 값
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // 활성 프로젝트 인덱스가 범위를 벗어나지 않도록 조정
  useEffect(() => {
    if (projects.length > 0 && activeProject >= projects.length) {
      setActiveProject(Math.max(0, projects.length - 1));
    }
  }, [projects, activeProject]);

  // activeProject 변경 시 해당 위치로 스크롤
  useEffect(() => {
    if (scrollViewRef.current && projects.length > 0) {
      scrollViewRef.current.scrollTo({
        x: activeProject * screenWidth,
        animated: true
      });
    }
  }, [activeProject, screenWidth]);

  // 스크롤 이벤트 처리
  const handleScroll = (e: { nativeEvent: { contentOffset: any; layoutMeasurement: any; }; }) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const pageNum = Math.round(contentOffset.x / layoutMeasurement.width);
    if (pageNum !== activeProject) {
      setActiveProject(pageNum);
    }
  };
  

  // 스크롤 종료 시 페이지 설정
  const handleScrollEnd = (e: any) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const pageNum = Math.floor(contentOffset.x / layoutMeasurement.width);
    if (pageNum !== activeProject) {
      setActiveProject(pageNum);
    }
  };

  // 프로젝트 추가 핸들러
  const handleAddProject = async (newProject: Omit<Project, "id">) => {
    const result = await addProject(newProject);

    if (result.success) {
      setShowProjectForm(false);
      setEditingProject(null);
      // 새 프로젝트로 스크롤
      if (projects.length > 0) {
        setActiveProject(projects.length);
      }
    }
  };

  // 프로젝트 수정 핸들러
  const handleUpdateProject = async (updatedProject: Project) => {
    const result = await updateProject(updatedProject);

    if (result.success) {
      setShowProjectForm(false);
      setEditingProject(null);
    }
  };

  // 프로젝트 삭제 핸들러
  const handleDeleteProject = async (projectId: string) => {
    if (confirm("정말 이 프로젝트를 삭제하시겠습니까?")) {
      await deleteProject(projectId);
    }
  };

  // 프로젝트 편집 시작 핸들러
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  // 다음 프로젝트로 이동
  const goToNextProject = () => {
    if (activeProject < projects.length - 1) {
      setActiveProject(activeProject + 1);
    }
  };

  // 이전 프로젝트로 이동
  const goToPrevProject = () => {
    if (activeProject > 0) {
      setActiveProject(activeProject - 1);
    }
  };

  // 페이지 인디케이터 렌더링
  const renderPagination = () => {
    return (
      <View style={styles.paginationStyle}>
        {projects.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              activeProject === index && styles.activeDot
            ]}
            onPress={() => setActiveProject(index)}
          />
        ))}
      </View>
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (projects.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>등록된 프로젝트가 없습니다.</Text>
        {isAdmin && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowProjectForm(true)}
          >
            <Text style={styles.addButtonText}>프로젝트 추가</Text>
          </TouchableOpacity>
        )}
        {showProjectForm && (
          <ProjectFormModal
            visible={showProjectForm}
            project={editingProject ? editingProject : EMPTY_PROJECT}
            onSubmit={(project) => {
              if ("id" in project) {
                handleUpdateProject(project as Project);
              } else {
                handleAddProject(project as Omit<Project, "id">);
              }
            }}
            onClose={() => {
              setShowProjectForm(false);
              setEditingProject(null);
            }}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 프로필로 돌아가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={onBackToProfile}>
        <Feather name="chevron-left" size={24} color="#3b82f6" />
        <Text style={styles.backButtonText}>프로필</Text>
      </TouchableOpacity>
      
      {/* 프로젝트 폼 모달 */}
      {showProjectForm && (
        <ProjectFormModal
          visible={showProjectForm}
          project={editingProject ? editingProject : EMPTY_PROJECT}
          onSubmit={(project) => {
            if ("id" in project) {
              handleUpdateProject(project as Project);
            } else {
              handleAddProject(project as Omit<Project, "id">);
            }
          }}
          onClose={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
        />
      )}

      {/* 프로젝트 슬라이더 - CSS 스와이퍼 스타일 구현 */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        style={styles.scrollContainer}
      >
        {projects.map((project) => (
          <View key={project.id} style={[styles.slide, { width: screenWidth }]}>
            <ProjectView
              project={project}
              isAdmin={isAdmin}
              onEdit={() => handleEditProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          </View>
        ))}
      </Animated.ScrollView>

      {/* 페이지 인디케이터 */}
      {renderPagination()}

      {/* 관리자일 경우 프로젝트 추가 버튼 - 하단에 고정 */}
      {isAdmin && projects.length > 0 && (
        <TouchableOpacity
          style={styles.floatingAddButton}
          onPress={() => {
            setEditingProject(null);
            setShowProjectForm(true);
          }}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  paginationStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 70, // 내비게이션 버튼 위쪽 공간 확보
    left: 0,
    right: 0,
  },
  dot: {
    backgroundColor: "#d1d5db",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#3b82f6",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  floatingAddButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledNavButton: {
    opacity: 0.5,
  },
  pageIndicator: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
  },
});

export default PortfolioSection;