import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  style?: object;
}

/**
 * 폼 섹션 컴포넌트
 */
const FormSection: React.FC<FormSectionProps> = ({ title, children, style }) => {
  return (
    <View style={[styles.section, style]}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
});

export default FormSection;