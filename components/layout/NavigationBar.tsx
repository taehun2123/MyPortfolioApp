import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import NavButton from '../layout/NavButton';

interface NavigationBarProps {
  activeSection: number;
  setActiveSection: (section: number) => void;
  isAdmin: boolean;
  onLoginPress: () => void;
  onLogoutPress: () => void;
}

/**
 * 네비게이션 바 컴포넌트
 */
const NavigationBar: React.FC<NavigationBarProps> = ({
  activeSection,
  setActiveSection,
  isAdmin,
  onLoginPress,
  onLogoutPress
}) => {
  return (
    <View style={styles.container}>
      <NavButton 
        label="PROFILE"
        isActive={activeSection === 0}
        onPress={() => setActiveSection(0)}
      />
      <NavButton 
        label="PORTFOLIO"
        isActive={activeSection === 1}
        onPress={() => setActiveSection(1)}
      />
      
      {/* 관리자 기능 버튼 */}
      {isAdmin ? (
        <TouchableOpacity 
          onPress={onLogoutPress}
          style={styles.logoutButton}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={onLoginPress}
          style={styles.adminButton}
          activeOpacity={0.7}
        >
          <Text style={styles.adminText}>관리자</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  adminButton: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  adminText: {
    fontSize: 12,
    color: '#64748b',
  },
  logoutButton: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  logoutText: {
    fontSize: 12,
    color: '#ef4444',
  },
});

export default NavigationBar;