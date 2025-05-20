import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SubSectionProps {
  title: string;
  children: ReactNode;
  style?: object;
}

/**
 * 폼 하위 섹션 컴포넌트
 */
const SubSection: React.FC<SubSectionProps> = ({ title, children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
});

export default SubSection;