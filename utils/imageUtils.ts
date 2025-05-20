import * as ImagePicker from 'expo-image-picker';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Platform } from 'react-native';
import { storage } from '../services/firebase';

/**
 * 이미지 픽커를 열어 이미지 선택
 * @returns 선택된 이미지 정보 또는 null
 */
export const pickImage = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
  try {
    // 권한 요청 (iOS에서만 필요)
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('이미지를 선택하기 위해서는 갤러리 접근 권한이 필요합니다.');
        return null;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0];
    }
    return null;
  } catch (error) {
    console.error('이미지 선택 오류:', error);
    return null;
  }
};

/**
 * 이미지를 Firebase Storage에 업로드
 * @param uri 이미지 URI
 * @param path 저장 경로 (기본값: 'images')
 * @returns 다운로드 URL 또는 null
 */
export const uploadImageToStorage = async (
  uri: string,
  path: string = 'images'
): Promise<string | null> => {
  try {
    // 웹 환경과 네이티브 환경을 구분하여 처리
    let blob: Blob;
    
    if (Platform.OS === 'web') {
      // 웹 환경에서는 CORS 문제를 해결하기 위한 방법 사용
      // 1. URL에서 직접 fetch를 통해 Blob 생성
      try {
        const response = await fetch(uri);
        blob = await response.blob();
      } catch (fetchError) {
        console.error('Fetch 실패, Base64 방식 시도:', fetchError);
        // 2. 대체 방법: Canvas 및 Base64 활용
        return await uploadImageFromCanvas(uri, path);
      }
    } else {
      // 네이티브 환경에서는 기존 방식 사용
      blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.error('XHR error:', e);
          reject(new Error('이미지 데이터 변환 실패'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
    }

    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const storageRef = ref(storage, `${path}/${filename}`);
    
    // Storage에 업로드
    await uploadBytes(storageRef, blob);
    
    // Blob 객체 닫기 (메모리 누수 방지)
    if ('close' in blob) {
      (blob as any).close();
    }

    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return null;
  }
};

/**
 * Canvas를 사용하여 이미지를 Base64로 변환 후 업로드 (웹 환경용)
 * @param uri 이미지 URI
 * @param path 저장 경로
 * @returns 다운로드 URL 또는 null
 */
const uploadImageFromCanvas = async (uri: string, path: string): Promise<string | null> => {
  try {
    // Canvas 생성 및 이미지 로드
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS 이슈 해결을 위해 추가
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas 생성 실패');
    }
    
    // 이미지 로드 대기
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      
      // 캐시 방지를 위한 랜덤 쿼리 파라미터 추가
      if (uri.indexOf('?') === -1) {
        img.src = `${uri}?v=${Math.random()}`;
      } else {
        img.src = `${uri}&v=${Math.random()}`;
      }
    });
    
    // Canvas에 이미지 그리기
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    // Canvas를 Blob으로 변환
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Canvas to Blob 변환 실패'));
        }
      }, 'image/jpeg', 0.8);
    });
    
    // 나머지 업로드 로직
    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const storageRef = ref(storage, `${path}/${filename}`);
    
    await uploadBytes(storageRef, blob);
    
    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Canvas 이미지 업로드 오류:', error);
    return null;
  }
};

/**
 * Firebase Storage에서 이미지 삭제
 * @param url 이미지 URL
 * @returns 삭제 성공 여부
 */
export const deleteImageFromStorage = async (url: string): Promise<boolean> => {
  try {
    // URL에서 Storage 경로 추출
    const storageRef = ref(storage, extractStoragePathFromUrl(url));
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('이미지 삭제 오류:', error);
    return false;
  }
};

/**
 * 다운로드 URL에서 Storage 경로 추출
 * @param url 다운로드 URL
 * @returns Storage 경로
 */
const extractStoragePathFromUrl = (url: string): string => {
  // 기본 URL 형식: https://firebasestorage.googleapis.com/v0/b/[PROJECT_ID].appspot.com/o/[PATH]?alt=media&token=[TOKEN]
  try {
    const decodedUrl = decodeURIComponent(url);
    const pathRegex = /\/o\/(.+?)\?/;
    const match = decodedUrl.match(pathRegex);
    if (match && match[1]) {
      return match[1];
    }
    throw new Error('경로 추출 실패');
  } catch (error) {
    console.error('Storage 경로 추출 오류:', error);
    return '';
  }
};

/**
 * Firebase Storage URL인지 확인
 * @param url 확인할 URL
 * @returns Firebase Storage URL이면 true
 */
export const isFirebaseStorageUrl = (url: string): boolean => {
  return url?.includes('firebasestorage.googleapis.com');
};

/**
 * 이미지 URL인지 확인 (웹 URL, Firebase Storage URL 모두 포함)
 * @param url 확인할 URL
 * @returns 이미지 URL이면 true, 아니면 false
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  
  // Firebase Storage URL 확인
  if (isFirebaseStorageUrl(url)) return true;
  
  // 일반 이미지 URL 확인 (확장자 기반)
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
  return imageExtensions.test(url);
};