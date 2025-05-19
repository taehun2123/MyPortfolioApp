import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  FlatList 
} from 'react-native';
import { Project } from '../../types';

interface ScreenshotsTabProps {
  project: Project;
}

/**
 * 스크린샷 탭 컴포넌트
 */
const ScreenshotsTab: React.FC<ScreenshotsTabProps> = ({ project }) => {
  // 화면 너비에 맞춘 이미지 크기 계산
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = (screenWidth - 40) / 2; // 2열 그리드, 패딩 고려
  const imageHeight = (imageWidth * 3) / 4; // 4:3 비율
  
  const hasScreenshots = project.screenshots?.length > 0;
  
  const renderScreenshotItem = ({ item, index }: { item: any; index: number }) => (
    <View style={[
      styles.screenshotContainer,
      { width: imageWidth }
    ]}>
      {item.image ? (
        <Image 
          source={{ uri: item.image }}
          style={[styles.screenshot, { height: imageHeight }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholderImage, { height: imageHeight }]}>
          <Text style={styles.placeholderText}>이미지 없음</Text>
        </View>
      )}
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          {item.description || `스크린샷 ${index + 1}`}
        </Text>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>서비스 스크린샷</Text>
      
      {hasScreenshots ? (
        <FlatList
          data={project.screenshots}
          renderItem={renderScreenshotItem}
          keyExtractor={(_, index) => `screenshot-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.emptyText}>등록된 스크린샷이 없습니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  screenshotContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  screenshot: {
    width: '100%',
    backgroundColor: '#f3f4f6',
  },
  captionContainer: {
    backgroundColor: '#f9fafb',
    padding: 8,
  },
  caption: {
    fontSize: 12,
    color: '#4b5563',
  },
  placeholderImage: {
    backgroundColor: '#f3f4f6',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    paddingVertical: 20,
    textAlign: 'center',
  },
});

export default ScreenshotsTab;