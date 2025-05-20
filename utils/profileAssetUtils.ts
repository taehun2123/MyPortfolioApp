// utils/profileAssetUtils.ts
import { ImageSourcePropType } from 'react-native';

// 프로필 이미지 - 단일 이미지만 정의
export const PROFILE_IMAGE = require('../assets/images/profile.jpeg');

/**
 * 프로필 이미지 가져오기
 * @returns 프로필 이미지 소스 객체
 */
export const getProfileImage = (): ImageSourcePropType => {
  return PROFILE_IMAGE;
};