import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  style?: object;
}

/**
 * 폼 필드 컴포넌트
 */
const FormField: React.FC<FormFieldProps> = ({ label, children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 6,
  },
});

export default FormField;
