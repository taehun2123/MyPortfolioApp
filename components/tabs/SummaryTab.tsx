import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TechStackItem from '../layout/TechStackItem';
import { Project } from '../../types';

interface SummaryTabProps {
  project: Project;
}

/**
 * 기본 정보 탭 컴포넌트
 */
const SummaryTab: React.FC<SummaryTabProps> = ({ project }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <TechStackItem 
          title="Field Skill" 
          items={project.techStack?.fieldSkill || []} 
          icon={<Feather name="code" size={16} color="#4b5563" />} 
        />
        <TechStackItem 
          title="Server/Deployment" 
          items={project.techStack?.server || []} 
          icon={<Feather name="server" size={16} color="#4b5563" />} 
        />
        <TechStackItem 
          title="OS" 
          items={project.techStack?.os || []} 
          icon={<Feather name="monitor" size={16} color="#4b5563" />} 
        />
        <TechStackItem 
          title="Collaboration" 
          items={project.techStack?.collaboration || []} 
          icon={<Feather name="users" size={16} color="#4b5563" />} 
        />
        <TechStackItem 
          title="Tools" 
          items={project.techStack?.tools || []} 
          icon={<Feather name="tool" size={16} color="#4b5563" />} 
        />
        <TechStackItem 
          title="DB" 
          items={project.techStack?.db || []} 
          icon={<Feather name="database" size={16} color="#4b5563" />} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 8,
  },
});

export default SummaryTab;