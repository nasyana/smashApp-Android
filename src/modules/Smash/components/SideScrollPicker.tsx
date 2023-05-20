import React, {useRef, useState} from 'react';

import {FONTS} from 'config/FoundationConfig';
import {height} from 'config/scaleAccordingToDevice';
import {Animated, StyleSheet, Platform} from 'react-native';
import {View, Colors, Text} from 'react-native-ui-lib';

const ITEM_HEIGHT = 70;
const MASK_HEIGHT = 77;
const SPACING = (height / 2 - ITEM_HEIGHT) / 2;

const SideScrollPicker = ({unit, setPickerValue, finalColor}) => {
  const [data, setData] = useState(() => {
    let data = [];
    for (let i = 1; i < 101; i++) {
      data.push(i);
    }
    return data;
  });
  const scrollY = useRef(new Animated.Value(0)).current;
  const onScrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text
          style={{
            marginLeft: -230,
            textTransform: 'uppercase',
            transform: [{rotateZ: '0deg'}],
          }}
          white
          R18>
          {unit}
        </Text>
      </View>

      <Animated.FlatList
        bounces={false}
        data={data}
        keyExtractor={(item) => item.toString()}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={'normal'}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const OS = Platform.OS === 'android' ? true : false;
          const additionalComputation = OS ? 1.5 : 1;

          scrollY.setValue(e.nativeEvent.contentOffset.y);

          setPickerValue(
            parseInt(
              e.nativeEvent.contentOffset.y / ITEM_HEIGHT +
                additionalComputation,
            ),
          );
        }}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: onScrollY}}}],
          {
            useNativeDriver: false,
          },
        )}
        renderItem={({item, index}) => {
          const inputRange = [
            (index - 2) * ITEM_HEIGHT,
            (index - 1) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + 1) * ITEM_HEIGHT,
            (index + 2) * ITEM_HEIGHT,
          ];

          const color = scrollY.interpolate({
            inputRange,
            outputRange: [
              finalColor,
              Colors.grey60,
              '#FFFFFF',
              Colors.grey60,
              finalColor,
            ],
          });

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1.1, 1, 1],
            extrapolate: 'clamp',
          });

          const scaleFont = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 56 / 24 / (80 / 70), 1, 1],
            extrapolate: 'clamp',
          });

          const opacity = onScrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 0, 0, 1],
          });

          const zIndex = onScrollY.interpolate({
            inputRange,
            outputRange: [0, 0, 2, 0, 0],
          });

          return (
            <Animated.View
              style={{
                height: ITEM_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                transform: [{scaleY: scale}],
              }}>
              <Animated.Text
                style={{
                  color: color,
                  fontSize: 24,
                  fontFamily: FONTS.light,
                  transform: [{scale: scaleFont}],
                }}>
                {item}
              </Animated.Text>
              {/* <Animated.View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: Colors.line,
                  position: "absolute",
                  bottom: 0,
                  opacity,
                }}
              /> */}
            </Animated.View>
          );
        }}
        contentContainerStyle={{
          paddingVertical: SPACING,
        }}
      />
    </View>
  );
};

export default SideScrollPicker;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '50%',
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: MASK_HEIGHT,
    top: (height / 2 - MASK_HEIGHT) / 2,
    backgroundColor: '#6255D9' || Colors.color58,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
