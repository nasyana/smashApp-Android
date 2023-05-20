import React, { memo } from "react";
import Svg, { Path, Text } from "react-native-svg";
import { View, StyleSheet } from "react-native";
import { drawArc } from "./helper";
import Animated from "react-native-reanimated";
import { Colors } from "react-native-ui-lib";
import { AnimatedCircularProgress } from "react-native-circular-progress";
const { PI } = Math;
const { multiply } = Animated;
const AnimatedPath = Animated.createAnimatedComponent(Path);

const Anemometer = memo(
  ({
    data = [{ value: 15 }],
    maxValue = 60,
    width = 133,
    size = 130,
    strokeWidth = 6,
    numberOfSection = 4,
    startAngle = -55,
    endAngle = 235,
    todayActivity,
    smashStore,
    todayTarget
  }) => {
    const center = {
      x: size / 2,
      y: size / 2,
    };


    const score = todayActivity?.score || 0;
    const value = parseInt((score / todayTarget) * 100);

    const { kFormatter } = smashStore
    const radius = (size - strokeWidth) / 2;
    const viewBox = `0 0 ${width} ${width}`;
    const d = drawArc(center.x, center.y, radius, startAngle, endAngle);
    const circumference = radius * 2 * PI;
    const strokeAngle = (endAngle - startAngle) / numberOfSection;
    const strokeLength = (strokeAngle * circumference) / 360 - 1;
    const strokeDasharrayBg = `${strokeLength} 1`;
    const strokeDasharray = `${((endAngle - startAngle) / 360) * circumference
      } ${((endAngle - startAngle) / 360) * circumference}`;
    const totalAngle = (3 * PI) / 2;
    const alpha = (value * totalAngle) / maxValue;
    const currentAngle = alpha - totalAngle;

    const strokeDashoffset = multiply(currentAngle, radius);
    const targetReached = score > todayTarget;
    return (
      <View style={styles.standard}>

        <AnimatedCircularProgress

          size={120}
          width={7}
          lineCap="round"
          prefill={0}
          duration={700}
          rotation={225}
          arcSweepAngle={270}
          fill={(score / todayTarget) * 100 || 0}
          tintColor={Colors.buttonLink}
          backgroundColor="rgba(0,0,0,0.05)"
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999999
          }}
        />

        <Svg width={width} height={width} {...viewBox}>
          {/* <Path
            x={(width - size) / 2}
            y={(width - size) / 2}
            fill="none"
            stroke={Colors.line}
            // strokeDasharray={Colors.line}
            {...{ d, strokeWidth }}
          />
          <AnimatedPath
            x={(width - size) / 2}
            y={(width - size) / 2}
            fill="none"
            stroke={Colors.buttonLink}
            {...{ d, strokeWidth, strokeDasharray, strokeDashoffset }}
          /> */}
          {/* {textAngles()} */}
          {/* <Text
            fill={'blue'}
            fontSize="24"
            x={width / 2}
            y={width / 2 + 64}
            textAnchor="middle"
            >
            {value}1
          </Text> */}
          <Text
            fill={Colors.color28}
            fontSize="36"
            x={width / 2}
            y={width / 2}
            textAnchor="middle"
          >
            {targetReached ? kFormatter(score) : (todayTarget - score) || (todayTarget - score) || 0}
          </Text>
          <Text
            fill={Colors.color6D}
            fontSize="14"
            x={width / 2}
            y={width / 2 + 20}
            textAnchor="middle"
          >
            {targetReached ? 'Points' : 'Points left'}
          </Text>
        </Svg>
      </View>
    );
  }
);

export default Anemometer;

const styles = StyleSheet.create({
  standard: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
