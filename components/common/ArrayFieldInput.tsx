import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ArrayFieldInputProps {
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  placeholder?: string;
  multiline?: boolean;
}

/**
 * 배열 필드 입력 컴포넌트
 */
const ArrayFieldInput: React.FC<ArrayFieldInputProps> = ({
  label,
  items,
  onAdd,
  onUpdate,
  onRemove,
  placeholder = '',
  multiline = false
}) => {
  const [newItem, setNewItem] = useState<string>('');
  
  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim());
      setNewItem('');
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.label}>{label}</Text>
      
      <ScrollView style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <TextInput
              value={item}
              onChangeText={(text) => onUpdate(index, text)}
              style={[
                styles.input, 
                multiline && styles.multilineInput
              ]}
              placeholder={placeholder}
              multiline={multiline}
              numberOfLines={multiline ? 3 : 1}
            />
            <TouchableOpacity
              onPress={() => onRemove(index)}
              style={styles.removeButton}
              accessibilityLabel="항목 삭제"
            >
              <Feather name="trash-2" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.addContainer}>
        <TextInput
          value={newItem}
          onChangeText={setNewItem}
          style={[
            styles.input, 
            styles.addInput,
            multiline && styles.multilineInput
          ]}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity
          onPress={handleAdd}
          style={styles.addButton}
          disabled={!newItem.trim()}
        >
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: 8,
  },
  itemsContainer: {
    maxHeight: 200,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ArrayFieldInput;