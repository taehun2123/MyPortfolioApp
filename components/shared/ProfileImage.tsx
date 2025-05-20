import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { getProfileImage } from '../../utils/profileAssetUtils';

interface ProfileImageProps {
  style?: any;
}

/**
 * 프로필 이미지 컴포넌트
 * 고정된 이미지를 assets 폴더에서 불러와 표시합니다.
 */
const ProfileImage: React.FC<ProfileImageProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={getProfileImage()}
        style={[styles.image, style]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ProfileImage;