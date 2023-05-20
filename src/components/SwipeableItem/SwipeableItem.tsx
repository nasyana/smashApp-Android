import React, { useCallback } from "react";
import { Animated, StyleSheet } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, Assets } from "react-native-ui-lib";
const SwipeableItem = ({ children }) => {
  const renderRightActions = useCallback((progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-300, -160, 0],
      outputRange: [0, 0, 160],
    });
    return (
      <Animated.View
        style={{
          transform: [{ translateX: trans }],
        }}
      >
        <LinearGradient
          colors={["#FF5E3A", "#FF2A68"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linear}
        >
          <RectButton style={styles.btn} onPress={() => {}}>
            <Image source={Assets.icons.ic_delete_wo_plan} marginB-8 />
            <Text R12 white>
              Delete
            </Text>
          </RectButton>

          <RectButton style={styles.btn} onPress={() => {}}>
            <Image source={Assets.icons.ic_active_plan} marginB-8 />
            <Text R12 white>
              Archive
            </Text>
          </RectButton>
        </LinearGradient>
      </Animated.View>
    );
  }, []);
  return (
    <Swipeable renderRightActions={renderRightActions}>{children}</Swipeable>
  );
};

export default SwipeableItem;

const styles = StyleSheet.create({
  linear: {
    flexDirection: "row",
    width: 160,
    height: "100%",
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    flex: 1,
  },
});
