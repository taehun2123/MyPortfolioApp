import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * 로딩 인디케이터 컴포넌트
 */
const LoadingIndicator: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator;