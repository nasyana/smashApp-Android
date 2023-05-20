import { FONTS } from "config/FoundationConfig";
import { height } from "config/scaleAccordingToDevice";
import React, { useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { View, Colors, Text } from "react-native-ui-lib";
const ITEM_HEIGHT = 70;
const MASK_HEIGHT = 77;
const SPACING = (height - ITEM_HEIGHT) / 2;
const ScrollPicker = ({ unit }) => {
  const [data, setData] = useState(() => {
    let data = [];
    for (let i = 0; i < 101; i++) {
      data.push(i);
    }
    return data;
  });
  const scrollY = useRef(new Animated.Value(0)).current;
  const onScrollY = useRef(new Animated.Value(0)).current;
  return (
    <View flex>
      <View style={styles.container}>
        <Text marginL-80 white R18>
          {unit}
        </Text>
      </View>
      <Animated.FlatList
        bounces={false}
        data={data}
        keyExtractor={(item) => item.toString()}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={"normal"}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: onScrollY } } }],
          {
            useNativeDriver: false,
          }
        )}
        renderItem={({ item, index }) => {
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
              "#6D819C",
              "#6D819C",
              "#FFFFFF",
              "#6D819C",
              "#6D819C",
            ],
          });
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1.1, 1, 1],
            extrapolate: "clamp",
          });
          const scaleFont = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 36 / 24 / (80 / 70), 1, 1],
            extrapolate: "clamp",
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
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                transform: [{ scaleY: scale }],
              }}
            >
              <Animated.Text
                style={{
                  color: color,
                  fontSize: 24,
                  fontFamily: FONTS.medium,
                  transform: [{ scale: scaleFont }],
                }}
              >
                {item}
              </Animated.Text>
              <Animated.View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: Colors.line,
                  position: "absolute",
                  bottom: 0,
                  opacity,
                }}
              />
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

export default ScrollPicker;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: MASK_HEIGHT,
    top: (height - MASK_HEIGHT) / 2,
    backgroundColor: Colors.color58,
    justifyContent: "center",
    alignItems: "center",
  },
});
