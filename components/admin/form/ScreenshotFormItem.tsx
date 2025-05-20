import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Screenshot } from '../../../types';
import FocusableTextInput from './FocusableTextInput';
import FormField from './FormField';
import ImageUpload from './ImageUpload';

interface ScreenshotFormItemProps {
  screenshot: Screenshot;
  index: number;
  onUpdate: (field: string, value: string) => void;
  onDelete: () => void;
  onImageChange: (url: string) => void;
}

/**
 * 스크린샷 항목 폼 컴포넌트
 */
const ScreenshotFormItem: React.FC<ScreenshotFormItemProps> = ({ 
  screenshot, 
  index,
  onUpdate, 
  onDelete,
  onImageChange
}) => {
  return (
    <View style={styles.container}>
      <FormField label="스크린샷 이미지">
        <ImageUpload
          imageUrl={screenshot.image || ''}
          onImageChange={onImageChange}
          placeholder="스크린샷 이미지를 업로드하세요"
          folderPath="screenshots"
        />
      </FormField>

      <FormField label="설명">
        <FocusableTextInput
          value={screenshot.description || ''}
          onChangeText={(text) => onUpdate('description', text)}
          placeholder="스크린샷 설명"
          multiline
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

export default ScreenshotFormItem;