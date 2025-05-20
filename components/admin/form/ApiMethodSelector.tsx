import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ApiMethodSelectorProps {
  currentMethod: string;
  onMethodChange: (method: string) => void;
}

/**
 * API 메서드 선택기 컴포넌트
 */
const ApiMethodSelector = memo<ApiMethodSelectorProps>(({ currentMethod, onMethodChange }) => {
  const apiMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        {apiMethods.map((method) => (
          <TouchableOpacity
            key={method}
            style={[
              styles.button,
              currentMethod === method && styles.activeButton,
            ]}
            onPress={() => onMethodChange(method)}
          >
            <Text
              style={[
                styles.buttonText,
                currentMethod === method && styles.activeButtonText,
              ]}
            >
              {method}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

ApiMethodSelector.displayName = "ApiMethodSelector";

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    marginBottom: 8,
  },
  activeButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  activeButtonText: {
    color: 'white',
  },
});

export default ApiMethodSelector;