// hooks/useProfile.ts 개선
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { DEFAULT_PROFILE, Profile, ProfileResponse } from '../types';
import { cleanObjectForFirestore } from '../utils/firebaseHelpers';
import { deleteImageFromStorage, isFirebaseStorageUrl } from '../utils/imageUtils';

/**
 * 프로필 데이터를 관리하는 커스텀 훅
 */
export function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 프로필 데이터 가져오기
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const profileRef = doc(db, 'profile', 'main');
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        // 기본 구조 확인 및 초기화
        const loadedProfile: Profile = {
          name: data.name || DEFAULT_PROFILE.name,
          title: data.title || DEFAULT_PROFILE.title,
          bio: data.bio || DEFAULT_PROFILE.bio,
          profileImage: data.profileImage || '',
          skills: data.skills || DEFAULT_PROFILE.skills,
          links: {
            github: data.links?.github || DEFAULT_PROFILE.links.github,
            blog: data.links?.blog || DEFAULT_PROFILE.links.blog,
            email: data.links?.email || DEFAULT_PROFILE.links.email
          }
        };
        setProfile(loadedProfile);
      } else {
        console.log('프로필 데이터가 없습니다. 기본값을 사용합니다.');
        // 기본 프로필 생성
        await setDoc(profileRef, DEFAULT_PROFILE);
      }
    } catch (err: any) {
      console.error('프로필 데이터 가져오기 오류:', err);
      setError('프로필을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // 프로필 업데이트 (이미지 변경 시 이전 이미지 삭제)
  const updateProfile = async (updatedProfile: Profile): Promise<ProfileResponse> => {
    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }

      // 이전 프로필 이미지와 다른 경우, 이전 이미지 삭제
      if (profile.profileImage && 
          profile.profileImage !== updatedProfile.profileImage && 
          isFirebaseStorageUrl(profile.profileImage)) {
        try {
          await deleteImageFromStorage(profile.profileImage);
        } catch (imgErr) {
          console.error('이전 프로필 이미지 삭제 오류:', imgErr);
          // 이미지 삭제 실패해도 프로필 업데이트는 계속 진행
        }
      }

      // 저장 전 데이터 정리 (빈 필드 제거)
      const cleanedProfile = cleanObjectForFirestore(updatedProfile);
      
      await setDoc(doc(db, 'profile', 'main'), cleanedProfile);
      setProfile(updatedProfile);
      return { success: true, profile: updatedProfile };
    } catch (err: any) {
      console.error('프로필 업데이트 오류:', err);
      setError('프로필 업데이트 중 오류가 발생했습니다.');
      return { success: false, error: err.message };
    }
  };

  // 프로필 새로고침
  const refreshProfile = async (): Promise<void> => {
    await fetchProfile();
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile
  };
}