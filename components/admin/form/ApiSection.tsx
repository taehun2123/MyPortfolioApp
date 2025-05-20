import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ApiItem } from '../../../types';
import ApiFormItem from './ApiFormItem';
import SubSection from './SubSection';

interface ApiSectionProps {
  title: string;
  apis: ApiItem[];
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

/**
 * API 섹션 컴포넌트
 */
const ApiSection: React.FC<ApiSectionProps> = ({ 
  title,
  apis,
  onAdd,
  onUpdate,
  onRemove 
}) => {
  return (
    <SubSection title={title}>
      {apis.map((api, index) => (
        <ApiFormItem
          key={`api-${index}`}
          api={api}
          onUpdate={(field, value) => onUpdate(index, field, value)}
          onDelete={() => onRemove(index)}
        />
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={onAdd}
      >
        <Feather name="plus" size={16} color="#3b82f6" />
        <Text style={styles.addButtonText}>{title} 추가</Text>
      </TouchableOpacity>
    </SubSection>
  );
};

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
});

export default ApiSection;