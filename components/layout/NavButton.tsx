import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface NavButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

/**
 * 네비게이션 버튼 컴포넌트
 */
const NavButton: React.FC<NavButtonProps> = ({ label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isActive && styles.activeButton
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text 
        style={[
          styles.label,
          isActive && styles.activeLabel
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeLabel: {
    fontWeight: '700',
    color: '#3b82f6',
  },
});

export default NavButton;