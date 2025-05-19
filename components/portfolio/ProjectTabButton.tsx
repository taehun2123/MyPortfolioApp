import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ProjectTabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

/**
 * 프로젝트 탭 버튼 컴포넌트
 */
const ProjectTabButton: React.FC<ProjectTabButtonProps> = ({ 
  label, 
  isActive, 
  onPress 
}) => {
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
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeButton: {
    borderBottomColor: '#3b82f6',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#3b82f6',
    fontWeight: '700',
  },
});

export default ProjectTabButton;