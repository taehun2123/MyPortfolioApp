// src/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Profile, ProfileResponse, DEFAULT_PROFILE } from '../types';

/**
 * 프로필 데이터를 관리하는 커스텀 훅
 */
export function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 프로필 데이터 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRef = doc(db, 'profile', 'main');
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as Profile);
        } else {
          console.log('프로필 데이터가 없습니다. 기본값을 사용합니다.');
        }
      } catch (err: any) {
        console.error('프로필 데이터 가져오기 오류:', err);
        setError('프로필을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  // 프로필 업데이트
  const updateProfile = async (updatedProfile: Profile): Promise<ProfileResponse> => {
    try {
      await setDoc(doc(db, 'profile', 'main'), updatedProfile);
      setProfile(updatedProfile);
      return { success: true, profile: updatedProfile };
    } catch (err: any) {
      console.error('프로필 업데이트 오류:', err);
      setError('프로필 업데이트 중 오류가 발생했습니다.');
      return { success: false, error: err.message };
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile
  };
}