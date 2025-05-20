import { Feather } from '@expo/vector-icons';
import React, { memo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { deleteImageFromStorage, isFirebaseStorageUrl, pickImage, uploadImageToStorage } from '../../../utils/imageUtils';

interface ImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  placeholder: string;
  folderPath: string;
}

/**
 * 이미지 업로드 컴포넌트
 */
const ImageUpload = memo<ImageUploadProps>(
  ({ imageUrl, onImageChange, placeholder, folderPath }) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleImagePick = async () => {
      try {
        const imageAsset = await pickImage();
        if (!imageAsset) return;
        
        setIsUploading(true);
        
        // 기존 이미지가 Firebase Storage에 있는 경우, 삭제
        if (imageUrl && isFirebaseStorageUrl(imageUrl)) {
          await deleteImageFromStorage(imageUrl);
        }
        
        // 새 이미지 업로드
        const downloadUrl = await uploadImageToStorage(imageAsset.uri, folderPath);
        if (downloadUrl) {
          onImageChange(downloadUrl);
        } else {
          Alert.alert('업로드 실패', '이미지 업로드에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('이미지 업로드 오류:', error);
        Alert.alert('오류', '이미지 처리 중 오류가 발생했습니다.');
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }}
              style={styles.preview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.emptyPreview}>
              <Text>
                <Feather name="image" size={28} color="#9ca3af" />
              </Text>
              <Text style={styles.emptyText}>{placeholder}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleImagePick}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#3b82f6" />
            ) : (
              <>
                <Feather name="upload" size={16} color="#3b82f6" />
                <Text style={styles.buttonText}>이미지 업로드</Text>
              </>
            )}
          </TouchableOpacity>
          
          {imageUrl && (
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton]}
              onPress={() => onImageChange('')}
              disabled={isUploading}
            >
              <Feather name="trash-2" size={16} color="#ef4444" />
              <Text style={[styles.buttonText, styles.deleteButtonText]}>
                이미지 삭제
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

ImageUpload.displayName = "ImageUpload";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 16,
  },
  previewContainer: {
    width: 120,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
  },
  preview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
  },
  emptyPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  deleteButtonText: {
    color: '#ef4444',
  }
});

export default ImageUpload;