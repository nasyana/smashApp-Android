import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { Badge, Colors, Image } from "react-native-ui-lib";
interface Props {
  style?: ViewStyle;
  label?: string;
  source?: any;
  onPress?: () => void;
  hasNotifications?: boolean
}
const ButtonIconBadge = ({ source, label, style, onPress, hasNotifications }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 32,
        height: 32,
        justifyContent: "flex-end",
        alignSelf: "flex-end",
        marginRight: 10,
        ...style,
      }}
    >
      <Image source={source} />
      {hasNotifications && <Badge
        // size="small"
        label={label}
        backgroundColor={Colors.white}
        labelStyle={{ color: Colors.buttonLink }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
      />}
    </TouchableOpacity>
  );
};

export default ButtonIconBadge;

const styles = StyleSheet.create({});
