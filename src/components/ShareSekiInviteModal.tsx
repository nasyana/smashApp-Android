import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { View, Modal } from 'react-native-ui-lib';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import SekiInvite from './SekiInvite';

const ShareSekiInviteModal = ({ challengesStore }) => {
  const { goalToShare } = challengesStore;

  const translateY = useSharedValue(0);

  const onDismiss = () => {
    challengesStore.setGoalToShare(false);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (_) => {
      if (translateY.value > 150) {
        translateY.value = withTiming(height, {}, () => {
          runOnJS(onDismiss)();
        });
      } else {
        translateY.value = withTiming(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View>
      <Modal
        visible={goalToShare?.id ? true : false}
        animationType={'slide'}
        transparent={true}
        onRequestClose={() => {}}>
        {/* <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.container, animatedStyle]}> */}
            <SekiInvite goal={goalToShare} />
          {/* </Animated.View>
        </PanGestureHandler> */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default inject('smashStore', 'challengesStore', 'teamsStore')(
  observer(ShareSekiInviteModal),
);
