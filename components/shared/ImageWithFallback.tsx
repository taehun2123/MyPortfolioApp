import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ImageProps, StyleSheet, Text, View } from 'react-native';

interface ImageWithFallbackProps extends ImageProps {
  fallbackText?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallbackText = '이미지를 불러올 수 없습니다',
  style,
  resizeMode = 'cover', // resizeMode를 props로 전달
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={[styles.container, style]}>
      {!hasError ? (
        <Image
          {...props}
          style={[styles.image, style]}
          // style에서 resizeMode 제거하고 props로 전달
          resizeMode={resizeMode}
          onError={() => setHasError(true)}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />
      ) : (
        <View style={[styles.fallbackContainer, style]}>
          <Feather name="image" size={24} color="#9ca3af" />
          <Text style={styles.fallbackText}>{fallbackText}</Text>
        </View>
      )}
      {isLoading && !hasError && (
        <View style={[styles.loadingContainer, style]}>
          {/* 로딩 인디케이터 */}
          <Text style={styles.loadingText}>이미지 로딩 중...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
    // resizeMode: 'cover', // 이 부분 제거
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  fallbackText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 244, 246, 0.7)',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default ImageWithFallback;