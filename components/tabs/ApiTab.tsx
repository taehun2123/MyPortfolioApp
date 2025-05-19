import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ApiItem from '../portfolio/ApiItem';
import { Project } from '../../types';

interface ApiTabProps {
  project: Project;
}

/**
 * API 설계 탭 컴포넌트
 */
const ApiTab: React.FC<ApiTabProps> = ({ project }) => {
  const hasAuthApi = project.apiDesign?.auth?.length > 0;
  const hasDataApi = project.apiDesign?.data?.length > 0;
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>API 설계 구조</Text>
        
        {hasAuthApi && (
          <View style={styles.apiSection}>
            <Text style={styles.sectionTitle}>인증 관련 API</Text>
            {project.apiDesign.auth.map((api, index) => (
              <ApiItem key={index} api={api} />
            ))}
          </View>
        )}
        
        {hasDataApi && (
          <View style={styles.apiSection}>
            <Text style={styles.sectionTitle}>데이터 관련 API</Text>
            {project.apiDesign.data.map((api, index) => (
              <ApiItem key={index} api={api} />
            ))}
          </View>
        )}
        
        {!hasAuthApi && !hasDataApi && (
          <Text style={styles.emptyText}>등록된 API 설계 정보가 없습니다.</Text>
        )}
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  apiSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    paddingVertical: 20,
    textAlign: 'center',
  },
});

export default ApiTab;