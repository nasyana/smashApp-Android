import React from "react";
import { Text, TouchableOpacity } from "react-native";
import styles from "./styles";

/**
 * A unit segment that is inside the segment control
 */
const Segment = ({ title, style, textStyle, onPress }) => (
  <TouchableOpacity
    style={[styles.segment, styles.touchableSegment, style]}
    onPress={onPress}
  >
    <Text style={[styles.defaultText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

Segment.defaultProps = {
  style: {},
};

export default Segment;
