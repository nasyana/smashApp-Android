import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { View, Text, Assets, Colors, Button, Image } from "react-native-ui-lib";
interface Props {
  style?: ViewStyle;
  title: string;
  onClose?: () => void;
}
const BoxWater = ({ title, style, onClose }: Props) => {
  return (
    <View
      marginH-16
      marginB-16
      style={{
        borderRadius: 6,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        ...style,
      }}
      backgroundColor={Colors.white}
    >
      <View
        row
        paddingH-16
        paddingV-12
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Text H14 color28 uppercase>
          {title}
        </Text>
        {onClose && (
          <Button
            iconSource={Assets.icons.ic_delete_day}
            link
            color={Colors.buttonLink}
            onPress={onClose}
          />
        )}
      </View>
      <View height={1} backgroundColor={Colors.line} row />
      <View row paddingV-16 paddingH-12>
        <Image source={Assets.icons.ic_glass_full} marginH-4 />
        <Image source={Assets.icons.ic_glass_plus} marginH-4 />
        <Image source={Assets.icons.ic_glass_empty} marginH-4 />
        <Image source={Assets.icons.ic_glass_empty} marginH-4 />
        <Image source={Assets.icons.ic_glass_empty} marginH-4 />
        <Image source={Assets.icons.ic_glass_empty} marginH-4 />
      </View>
      <View height={1} backgroundColor={Colors.line} row />
      <View
        paddingT-16
        paddingB-12
        paddingH-16
        row
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <View row style={{ alignItems: "center" }}>
          <Text M24 color28 marginR-8>
            842 Cal
          </Text>
          <Image source={Assets.icons.ic_nutrition_info} />
        </View>
        <Text R14 color6D>
          Recommended 615 - 820 cal
        </Text>
      </View>
    </View>
  );
};

export default BoxWater;

const styles = StyleSheet.create({});
