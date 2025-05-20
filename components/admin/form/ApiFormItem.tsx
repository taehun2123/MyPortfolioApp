import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ApiItem } from '../../../types';
import ApiMethodSelector from './ApiMethodSelector';
import FocusableTextInput from './FocusableTextInput';
import FormField from './FormField';

interface ApiFormItemProps {
  api: ApiItem;
  onUpdate: (field: string, value: string) => void;
  onDelete: () => void;
}

/**
 * API 항목 폼 컴포넌트
 */
const ApiFormItem: React.FC<ApiFormItemProps> = ({ api, onUpdate, onDelete }) => {
  return (
    <View style={styles.container}>
      <FormField label="Method">
        <ApiMethodSelector
          currentMethod={api.method}
          onMethodChange={(method) => onUpdate('method', method)}
        />
      </FormField>

      <FormField label="Endpoint">
        <FocusableTextInput
          value={api.endpoint || ''}
          onChangeText={(text) => onUpdate('endpoint', text)}
          placeholder="/api/..."
        />
      </FormField>

      <FormField label="Description">
        <FocusableTextInput
          value={api.description || ''}
          onChangeText={(text) => onUpdate('description', text)}
          placeholder="API 설명"
        />
      </FormField>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={onDelete}
      >
        <Feather name="trash-2" size={16} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    zIndex: 5,
  },
});

export default ApiFormItem;