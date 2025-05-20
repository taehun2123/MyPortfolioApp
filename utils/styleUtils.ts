// utils/styleUtils.ts - 크로스 플랫폼 스타일 유틸리티
import { Platform } from 'react-native';

/**
 * 웹 환경과 네이티브 환경 모두에서 사용 가능한 그림자 스타일
 * @param elevation 그림자 강도 (0-24)
 * @param color 그림자 색상 (기본값: '#000')
 * @returns 플랫폼에 맞는 그림자 스타일 객체
 */
export const crossPlatformShadow = (elevation: number = 2, color: string = '#000') => {
  const opacity = 0.14 + (elevation * 0.01);
  const radius = elevation * 0.5;
  const spread = elevation * 0.3;
  
  return Platform.OS === 'web'
    ? {
        boxShadow: `0px ${elevation * 0.5}px ${elevation}px ${spread}px rgba(${color === '#000' ? '0, 0, 0' : '0, 0, 0'}, ${opacity})`
      }
    : {
        shadowColor: color,
        shadowOffset: { width: 0, height: elevation * 0.5 },
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: elevation,
      };
};

/**
 * 웹 환경에서 사용할 수 있는 그림자 스타일
 * @param elevation 그림자 강도 (0-24)
 * @param color 그림자 색상 (기본값: '#000')
 * @returns 웹 환경의 그림자 스타일 객체
 */
export const webShadow = (elevation: number = 2, color: string = '#000') => {
  if (Platform.OS !== 'web') return {};
  
  const opacity = 0.14 + (elevation * 0.01);
  const radius = elevation * 0.5;
  const spread = elevation * 0.3;
  
  return {
    boxShadow: `0px ${elevation * 0.5}px ${elevation}px ${spread}px rgba(${color === '#000' ? '0, 0, 0' : '0, 0, 0'}, ${opacity})`
  };
};

/**
 * 네이티브 환경에서 사용할 수 있는 그림자 스타일
 * @param elevation 그림자 강도 (0-24)
 * @param color 그림자 색상 (기본값: '#000')
 * @returns 네이티브 환경의 그림자 스타일 객체
 */
export const nativeShadow = (elevation: number = 2, color: string = '#000') => {
  if (Platform.OS === 'web') return {};
  
  const opacity = 0.14 + (elevation * 0.01);
  const radius = elevation * 0.5;
  
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: elevation * 0.5 },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: elevation,
  };
};

/**
 * 웹 환경에서 input 요소의 outline 스타일 제거
 */
export const webInputStyle = Platform.OS === 'web' 
  ? { 
      outlineWidth: 0,
      outlineStyle: 'none',
      cursor: 'text'
    } 
  : {};

/**
 * 기기 플랫폼에 따라 적절한 애니메이션 설정 반환
 * @param options 기본 애니메이션 옵션
 * @returns 플랫폼에 맞게 수정된 애니메이션 옵션
 */
export const getAnimationConfig = (options = {}) => {
  // 웹 환경에서는 useNativeDriver를 false로 설정
  return {
    ...options,
    useNativeDriver: Platform.OS !== 'web'
  };
};

export default {
  crossPlatformShadow,
  webShadow,
  nativeShadow,
  webInputStyle,
  getAnimationConfig
};