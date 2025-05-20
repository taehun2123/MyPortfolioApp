import React, { memo, useCallback, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

interface FocusableTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  style?: object;
  [key: string]: any;
}

/**
 * 포커스 가능한 텍스트 입력 컴포넌트
 */
const FocusableTextInput = memo<FocusableTextInputProps>(
  ({ value, onChangeText, style, ...props }) => {
    const inputRef = useRef<TextInput>(null);

    // 입력창 클릭 핸들러
    const handlePress = useCallback(() => {
      inputRef.current?.focus();
    }, []);

    return (
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={{ flex: 1 }}>
          <TextInput
            ref={inputRef}
            value={value || ''}
            onChangeText={onChangeText}
            style={[
              styles.input,
              Platform.OS === "web" && styles.webInput,
              style,
            ]}
            {...props}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

FocusableTextInput.displayName = "FocusableTextInput";

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  webInput: {
    outlineStyle: "solid",
    cursor: "text",
  },
});

export default FocusableTextInput;