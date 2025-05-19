import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { ApiItem as ApiItemType } from '../../types';
import { getMethodColor } from '../../utils/helpers';

interface ApiItemProps {
  api: ApiItemType;
}

/**
 * API 항목 컴포넌트
 */
const ApiItem: React.FC<ApiItemProps> = ({ api }) => {
  const methodStyles = getMethodColor(api.method);
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.methodBadge, 
        { backgroundColor: methodStyles.backgroundColor }
      ]}>
        <Text style={[styles.methodText, { color: methodStyles.color }]}>
          {api.method}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.endpoint}>{api.endpoint}</Text>
        <Text style={styles.description}>{api.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 8,
  },
  methodBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginRight: 8,
  },
  methodText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  endpoint: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default ApiItem;