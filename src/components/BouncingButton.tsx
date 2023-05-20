import React, { useRef } from 'react';
import { Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-ui-lib';

const BouncingButton = ({ children, onPress, style, ...otherProps }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  let pressInTimeout;
  let pressOutTimeout;

  const onPressIn = () => {
    clearTimeout(pressInTimeout);
    pressInTimeout = setTimeout(() => {
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  const onPressOut = () => {
    clearTimeout(pressOutTimeout);
    pressOutTimeout = setTimeout(() => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start(() => onPress());
    }, 100);
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <Animated.View style={[style, animatedStyle]}>
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        {...otherProps}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default BouncingButton;
