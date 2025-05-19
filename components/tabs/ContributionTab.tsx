import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Project } from '../../types';

interface ContributionTabProps {
  project: Project;
}

/**
 * 기여 탭 컴포넌트
 */
const ContributionTab: React.FC<ContributionTabProps> = ({ project }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>소개</Text>
          <Text style={styles.text}>
            {project.contribution?.intro || '프로젝트 소개 정보가 없습니다.'}
          </Text>
        </View>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>기간</Text>
            <Text style={styles.infoValue}>
              {project.contribution?.period || '정보 없음'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>인원</Text>
            <Text style={styles.infoValue}>
              {project.contribution?.members || '정보 없음'}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>핵심 기능</Text>
          {project.contribution?.keyFeatures?.map((feature, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{feature}</Text>
            </View>
          ))}
          {!project.contribution?.keyFeatures?.length && (
            <Text style={styles.emptyText}>등록된 핵심 기능이 없습니다.</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>팀 성과</Text>
          <Text style={styles.text}>
            {project.contribution?.teamAchievement || '팀 성과 정보가 없습니다.'}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지원자의 기여</Text>
          <Text style={styles.subSectionTitle}>역할 요약</Text>
          <Text style={styles.text}>
            {project.contribution?.role?.summary || '역할 요약 정보가 없습니다.'}
          </Text>
          
          <Text style={styles.subSectionTitle}>세부 내용</Text>
          {project.contribution?.role?.details?.map((detail, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{detail}</Text>
            </View>
          ))}
          {!project.contribution?.role?.details?.length && (
            <Text style={styles.emptyText}>등록된 세부 내용이 없습니다.</Text>
          )}
        </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
    marginTop: 12,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 4,
  },
  listBullet: {
    fontSize: 14,
    color: '#4b5563',
    marginRight: 8,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

export default ContributionTab;