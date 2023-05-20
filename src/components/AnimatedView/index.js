import React, { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { View } from 'react-native-ui-lib';

const easing = Easing.inOut(Easing.ease);

function AnimatedView(props) {
  const { rebounce, bounce = true, animationSize = 10, fade, loop = false } = props;
  const animatedOpacity = useSharedValue(0);
  const animatedScale = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value,
    transform: [
      {
        scale: fade ? 1 : animatedScale.value,
      },
    ],
  }));

  useEffect(() => {
    animatedOpacity.value = withTiming(1, { easing }); // Updated to use 1 as the target value for opacity
    animatedScale.value = withSpring(1, {
      easing,
      overshootClamping: !bounce,
    });
  }, [bounce,rebounce]);

  // if (!loaded) { return null }
  return (
    <Animated.View style={animatedStyle}>
      <View {...props} />
    </Animated.View>
  );
}

export default AnimatedView;
