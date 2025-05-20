// components/profile/ProfileSection.tsx 수정본 - 단일 프로필 이미지 사용
import { Profile } from '@/types';
import { getAnimationConfig } from '@/utils/styleUtils';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useProfile } from '../../hooks/useProfile';
import LoadingIndicator from '../common/LoadingIndicator';
import ProfileLink from '../profile/ProfileLink';
import ProfileImage from '../shared/ProfileImage';
import ProfileEditModal from './ProfileEditModal';

interface ProfileSectionProps {
  onNext: () => void;
  isAdmin: boolean;
  onLoginPress: () => void;
  onLogoutPress: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  onNext, 
  isAdmin,
  onLoginPress,
  onLogoutPress 
}) => {
  const { profile, isLoading, updateProfile } = useProfile();
  const [showEditModal, setShowEditModal] = useState(false);
  const [bounceAnimation] = useState(new Animated.Value(0));
  
  // 애니메이션 설정
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnimation, {
          toValue: 1,
          duration: 800,
          ...getAnimationConfig()
        }),
        Animated.timing(bounceAnimation, {
          toValue: 0,
          duration: 800,
          ...getAnimationConfig()
        }),
      ])
    ).start();
  }, [bounceAnimation]);

  const bounceInterpolation = bounceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });
  
  const handleProfileUpdate = async (updatedProfile: Profile) => {
    try {
      const result = await updateProfile(updatedProfile);
      if (result.success) {
        setShowEditModal(false);
      } else {
        alert('프로필 업데이트 실패: ' + result.error);
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };
  
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      {/* 관리자 버튼 */}
      <View style={styles.adminButtonContainer}>
        {isAdmin ? (
          <View style={styles.adminActions}>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => setShowEditModal(true)}
            >
              <Feather name="edit-2" size={18} color="#3b82f6" />
              <Text style={styles.editProfileText}>프로필 수정</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={onLogoutPress}
            >
              <Text style={styles.logoutText}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.adminButton}
            onPress={onLoginPress}
          >
            <Feather name="settings" size={18} color="#4b5563" />
            <Text style={styles.adminText}>관리자</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBorder}>
              {/* 단일 프로필 이미지 컴포넌트 사용 */}
              <ProfileImage style={styles.avatar} />
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{profile.name || '홍길동'}</Text>
            <Text style={styles.title}>{profile.title || '프론트엔드 개발자'}</Text>
            <Text style={styles.bio}>
              {profile.bio || '개발 경험이 풍부한 개발자입니다.'}
            </Text>
            
            <View style={styles.linksContainer}>
              <ProfileLink 
                href={profile.links?.github || '#'} 
                icon={<Feather name="github" size={20} color="#4b5563" />}
                label="GitHub"
              />
              <ProfileLink 
                href={profile.links?.blog || '#'} 
                icon={<Feather name="globe" size={20} color="#4b5563" />}
                label="Blog"
              />
              <ProfileLink 
                href={`mailto:${profile.links?.email || 'email@example.com'}`} 
                icon={<Feather name="mail" size={20} color="#4b5563" />}
                label="Email"
              />
            </View>
            
            <View style={styles.skillsContainer}>
              <Text style={styles.skillsTitle}>기술 스택</Text>
              <View style={styles.skillsWrapper}>
                {(profile.skills || ['React', 'Flutter', 'JavaScript']).map((tech) => (
                  <View key={tech} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{tech}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* 다음으로 넘어가는 화살표 - 애니메이션 적용 */}
      <Animated.View 
        style={[
          styles.nextButtonContainer, 
          { transform: [{ translateY: bounceInterpolation }] }
        ]}
      >
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={onNext}
          accessibilityLabel="포트폴리오 보기"
        >
          <Text style={styles.nextText}>포트폴리오 보기</Text>
          <Feather name="chevron-right" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </Animated.View>
      
      {/* 프로필 수정 모달 */}
      <ProfileEditModal
        profile={profile}
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleProfileUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  adminButtonContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  adminText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4b5563',
  },
  adminActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  editProfileText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#3b82f6',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    fontSize: 14,
    color: '#ef4444',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  profileContainer: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 24,
  },
  avatarBorder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderColor: 'white',
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  name: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 16,
    textAlign: 'center',
  },
  bio: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
    maxWidth: 500,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
  },
  skillsContainer: {
    width: '100%',
    maxWidth: 500,
  },
  skillsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  skillBadge: {
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  skillText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '500',
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 40,
    right: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginRight: 8,
  },
});

export default ProfileSection;