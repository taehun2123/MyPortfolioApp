import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

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
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const newItemRef = useRef<TextInput>(null);
  
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
      {label ? <Text style={styles.label}>{label}</Text> : null}
      
      <ScrollView style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Pressable style={styles.inputWrapper} onPress={() => {
              if (inputRefs.current[index]) {
                inputRefs.current[index]?.focus();
              }
            }}>
              <TextInput
                ref={el => { inputRefs.current[index] = el; }}
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
            </Pressable>
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
        <Pressable style={styles.inputWrapper} onPress={() => {
          if (newItemRef.current) {
            newItemRef.current.focus();
          }
        }}>
          <TextInput
            ref={newItemRef}
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
        </Pressable>
        <TouchableOpacity
          onPress={handleAdd}
          style={[
            styles.addButton,
            !newItem.trim() && styles.disabledButton
          ]}
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
  inputWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { 
      // outline 속성 대신 웹 호환 속성 사용
      outlineWidth: 0,  
      outlineStyle: 'solid'
    } : {}),
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
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
    opacity: 0.7,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ArrayFieldInput;