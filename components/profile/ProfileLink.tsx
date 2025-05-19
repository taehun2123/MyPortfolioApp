import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ProfileLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

/**
 * 프로필 링크 컴포넌트
 */
const ProfileLink: React.FC<ProfileLinkProps> = ({ href, icon, label }) => {
  const handlePress = async () => {
    // URL이 유효한지 확인
    const isValidUrl = href && href !== '#';
    
    if (isValidUrl) {
      // 이메일 링크인 경우
      if (href.startsWith('mailto:')) {
        await Linking.openURL(href);
      } 
      // 일반 URL인 경우
      else {
        const canOpen = await Linking.canOpenURL(href);
        if (canOpen) {
          await Linking.openURL(href);
        }
      }
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  label: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4b5563',
  },
});

export default ProfileLink;