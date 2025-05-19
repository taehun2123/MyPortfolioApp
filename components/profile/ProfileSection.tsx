import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ProfileLink from './ProfileLink';
import LoadingIndicator from '../common/LoadingIndicator';
import { useProfile } from '../../hooks/useProfile';

interface ProfileSectionProps {
  onNext: () => void;
}

/**
 * 프로필 섹션 컴포넌트
 */
const ProfileSection: React.FC<ProfileSectionProps> = ({ onNext }) => {
  const { profile, isLoading } = useProfile();
  
  if (isLoading) {
    return <LoadingIndicator />;
  }
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.profileContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{profile.name || '홍길동'}</Text>
          <Text style={styles.title}>{profile.title || '프론트엔드 개발자'}</Text>
          <Text style={styles.bio}>
            {profile.bio || '개발 경험이 풍부한 프론트엔드 개발자입니다.'}
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
        
        <View style={styles.avatarContainer}>
          <View style={styles.avatarBorder}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/320' }} // 실제 프로필 이미지로 교체 필요
              style={styles.avatar}
            />
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.nextButton}
        onPress={onNext}
        accessibilityLabel="다음 섹션으로"
      >
        <Feather name="chevron-down" size={32} color="#3b82f6" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 40,
  },
  name: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 24,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  skillsContainer: {
    marginBottom: 24,
  },
  skillsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
    borderWidth: 3,
    borderColor: 'white',
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    padding: 12,
  },
});

export default ProfileSection;