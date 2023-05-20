import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { View, Text } from "react-native-ui-lib";

interface Props {
  label?: string;
  size: number;
  color: string;
  style?: ViewStyle;
}

const Tag = ({ size, color, label, style }: Props) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 5 || size / 2,
        backgroundColor: color,
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      {!!label && (
        <Text H14 white>
          {label}
        </Text>
      )}
    </View>
  );
};

export default Tag;

const styles = StyleSheet.create({});
