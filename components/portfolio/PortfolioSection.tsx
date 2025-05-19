import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Animated,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ProjectView from './ProjectView';
import ProjectFormModal from '../admin/ProjectFormModal';
import LoadingIndicator from '../common/LoadingIndicator';
import { useProjects } from '../../hooks/useProjects';
import { Project, EMPTY_PROJECT } from '../../types';

interface PortfolioSectionProps {
  isAdmin: boolean;
}

/**
 * 포트폴리오 섹션 컴포넌트
 */
const PortfolioSection: React.FC<PortfolioSectionProps> = ({ isAdmin }) => {
  const { projects, isLoading, addProject, updateProject, deleteProject } = useProjects();
  const [activeProject, setActiveProject] = useState<number>(0);
  const [showProjectForm, setShowProjectForm] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const flatListRef = useRef<FlatList>(null);
  const dotPosition = useRef(new Animated.Value(0)).current;
  
  // 화면 크기
  const { width: screenWidth } = Dimensions.get('window');
  
  // 활성 프로젝트 인덱스가 범위를 벗어나지 않도록 조정
  useEffect(() => {
    if (projects.length > 0 && activeProject >= projects.length) {
      setActiveProject(Math.max(0, projects.length - 1));
    }
  }, [projects, activeProject]);
  
  // 프로젝트 변경시 애니메이션 처리
  useEffect(() => {
    Animated.spring(dotPosition, {
      toValue: activeProject * 16, // 인디케이터 간격 (dot size + margin)
      useNativeDriver: true,
      friction: 8,
    }).start();
    
    // FlatList 스크롤
    flatListRef.current?.scrollToIndex({
      index: activeProject,
      animated: true,
    });
  }, [activeProject, dotPosition]);
  
  // 스크롤 이벤트 처리
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: dotPosition } } }],
    { useNativeDriver: false }
  );
  
  // 스크롤 종료 이벤트 처리
  const handleScrollEnd = (e: any) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const pageNum = Math.floor(contentOffset.x / layoutMeasurement.width);
    setActiveProject(pageNum);
  };
  
  // 프로젝트 추가 핸들러
  const handleAddProject = async (newProject: Omit<Project, 'id'>) => {
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
    if (confirm('정말 이 프로젝트를 삭제하시겠습니까?')) {
      await deleteProject(projectId);
    }
  };
  
  // 프로젝트 편집 시작 핸들러
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
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
              if ('id' in project) {
                handleUpdateProject(project as Project);
              } else {
                handleAddProject(project as Omit<Project, 'id'>);
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
      {/* 프로젝트 폼 모달 */}
      {showProjectForm && (
        <ProjectFormModal
          visible={showProjectForm}
          project={editingProject ? editingProject : EMPTY_PROJECT}
          onSubmit={(project) => {
            if ('id' in project) {
              handleUpdateProject(project as Project);
            } else {
              handleAddProject(project as Omit<Project, 'id'>);
            }
          }}
          onClose={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
        />
      )}
      
      {/* 프로젝트 슬라이더 */}
      <FlatList
        ref={flatListRef}
        data={projects}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: screenWidth }]}>
            <ProjectView 
              project={item}
              isAdmin={isAdmin}
              onEdit={() => handleEditProject(item)}
              onDelete={() => handleDeleteProject(item.id)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
      />
      
      {/* 프로젝트 인디케이터 */}
      <View style={styles.indicatorContainer}>
        <View style={styles.dotsContainer}>
          {projects.map((_, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.dot}
              onPress={() => setActiveProject(index)}
              accessibilityLabel={`프로젝트 ${index + 1}`}
            />
          ))}
          <Animated.View 
            style={[
              styles.activeDot,
              { transform: [{ translateX: dotPosition }] }
            ]} 
          />
        </View>
        
        {/* 관리자일 경우 프로젝트 추가 버튼 */}
        {isAdmin && (
          <TouchableOpacity
            style={styles.addDotButton}
            onPress={() => {
              setEditingProject(null);
              setShowProjectForm(true);
            }}
            accessibilityLabel="프로젝트 추가"
          >
            <Feather name="plus" size={14} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* 프로젝트 네비게이션 버튼 */}
      <View style={styles.navButtons}>
        <TouchableOpacity 
          style={[
            styles.navButton,
            activeProject === 0 && styles.disabledNavButton
          ]}
          onPress={() => setActiveProject(prev => Math.max(prev - 1, 0))}
          disabled={activeProject === 0}
          accessibilityLabel="이전 프로젝트"
        >
          <Feather 
            name="chevron-left" 
            size={24} 
            color={activeProject === 0 ? '#d1d5db' : '#3b82f6'} 
          />
        </TouchableOpacity>
        
        <Text style={styles.pageIndicator}>
          {activeProject + 1} / {projects.length}
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.navButton,
            activeProject === projects.length - 1 && styles.disabledNavButton
          ]}
          onPress={() => setActiveProject(prev => Math.min(prev + 1, projects.length - 1))}
          disabled={activeProject === projects.length - 1}
          accessibilityLabel="다음 프로젝트"
        >
          <Feather 
            name="chevron-right" 
            size={24} 
            color={activeProject === projects.length - 1 ? '#d1d5db' : '#3b82f6'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'relative',
    height: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  activeDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginHorizontal: 4,
  },
  addDotButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
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
    fontWeight: '500',
    color: '#4b5563',
  },
});

export default PortfolioSection;