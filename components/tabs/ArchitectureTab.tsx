import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Project } from '../../types';

interface ArchitectureTabProps {
  project: Project;
}

/**
 * 아키텍처 탭 컴포넌트
 */
const ArchitectureTab: React.FC<ArchitectureTabProps> = ({ project }) => {
  // 화면 너비에 맞춘 이미지 크기 계산
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth - 40; // 패딩 고려
  const imageHeight = (imageWidth * 9) / 16; // 16:9 비율 유지
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>아키텍처</Text>
        
        {project.architecture?.image ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: project.architecture.image }}
              style={[styles.image, { width: imageWidth, height: imageHeight }]}
              resizeMode="contain"
            />
            <Text style={styles.caption}>
              {project.architecture.description || '프로젝트 아키텍처 다이어그램'}
            </Text>
          </View>
        ) : (
          <View style={[styles.placeholderImage, { width: imageWidth, height: imageHeight }]}>
            <Text style={styles.placeholderText}>아키텍처 이미지가 없습니다.</Text>
          </View>
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
  imageContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    backgroundColor: '#f3f4f6',
  },
  caption: {
    fontSize: 12,
    color: '#6b7280',
    padding: 8,
    backgroundColor: '#f9fafb',
  },
  placeholderImage: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

export default ArchitectureTab;