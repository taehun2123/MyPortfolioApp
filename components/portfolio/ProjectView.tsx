import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Project } from '../../types';
import ApiTab from '../tabs/ApiTab';
import ArchitectureTab from '../tabs/ArchitectureTab';
import ContributionTab from '../tabs/ContributionTab'; // Ensure this file exists or correct the path
import ScreenshotsTab from '../tabs/ScreenshotsTab';
import SummaryTab from '../tabs/SummaryTab'; // Verify the file exists or correct the path
import ProjectTabButton from './ProjectTabButton';

interface ProjectViewProps {
  project: Project;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * 프로젝트 상세 보기 컴포넌트
 */
const ProjectView: React.FC<ProjectViewProps> = ({ 
  project, 
  isAdmin, 
  onEdit, 
  onDelete 
}) => {
  const [activeTab, setActiveTab] = useState<string>('summary');
  
  if (!project) return null;
  
  // 화면 크기에 따른 이미지 크기 계산
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.8;
  const imageHeight = imageWidth * 0.66; // 3:2 비율
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{project.title}</Text>
          
          {/* 관리자 기능 버튼 */}
          {isAdmin && (
            <View style={styles.adminButtons}>
              <TouchableOpacity 
                onPress={onEdit}
                style={styles.iconButton}
                accessibilityLabel="프로젝트 수정"
              >
                <Feather name="edit-2" size={18} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={onDelete}
                style={styles.iconButton}
                accessibilityLabel="프로젝트 삭제"
              >
                <Feather name="trash-2" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <Text style={styles.description}>{project.description}</Text>
        
      </View>
      
      {/* 탭 네비게이션 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        <ProjectTabButton 
          label="기본 정보"
          isActive={activeTab === 'summary'}
          onPress={() => setActiveTab('summary')}
        />
        <ProjectTabButton 
          label="기여"
          isActive={activeTab === 'contribution'}
          onPress={() => setActiveTab('contribution')}
        />
        <ProjectTabButton 
          label="아키텍처"
          isActive={activeTab === 'architecture'}
          onPress={() => setActiveTab('architecture')}
        />
        <ProjectTabButton 
          label="API 설계"
          isActive={activeTab === 'api'}
          onPress={() => setActiveTab('api')}
        />
        <ProjectTabButton 
          label="스크린샷"
          isActive={activeTab === 'screenshots'}
          onPress={() => setActiveTab('screenshots')}
        />
      </ScrollView>
      
      {/* 탭 콘텐츠 */}
      <View style={styles.tabContent}>
        {activeTab === 'summary' && <SummaryTab project={project} />}
        {activeTab === 'contribution' && <ContributionTab project={project} />}
        {activeTab === 'architecture' && <ArchitectureTab project={project} />}
        {activeTab === 'api' && <ApiTab project={project} />}
        {activeTab === 'screenshots' && <ScreenshotsTab project={project} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  adminButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    lineHeight: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    borderRadius: 8,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 16,
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});

export default ProjectView;