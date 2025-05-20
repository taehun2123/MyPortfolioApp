import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  isSubmitDisabled?: boolean;
}

/**
 * 폼 액션 버튼 컴포넌트
 */
const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  onSubmit, 
  submitLabel,
  isSubmitDisabled = false
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
      >
        <Text style={styles.cancelButtonText}>취소</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.submitButton,
          isSubmitDisabled && styles.disabledButton
        ]}
        onPress={onSubmit}
        disabled={isSubmitDisabled}
      >
        <Text style={styles.submitButtonText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
});

export default FormActions;