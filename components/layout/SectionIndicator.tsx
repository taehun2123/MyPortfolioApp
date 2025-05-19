import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

interface SectionIndicatorProps {
  activeSection: number;
  setActiveSection: (section: number) => void;
}

/**
 * 섹션 인디케이터 컴포넌트
 */
const SectionIndicator: React.FC<SectionIndicatorProps> = ({ 
  activeSection, 
  setActiveSection 
}) => {
  return (
    <View style={styles.container}>
      {[0, 1].map((index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setActiveSection(index)}
          style={[
            styles.indicator,
            activeSection === index && styles.activeIndicator
          ]}
          accessibilityLabel={`섹션 ${index + 1}로 이동`}
          accessibilityRole="button"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -15 }],
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    zIndex: 50,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d1d5db',
  },
  activeIndicator: {
    backgroundColor: '#3b82f6',
  },
});

export default SectionIndicator;