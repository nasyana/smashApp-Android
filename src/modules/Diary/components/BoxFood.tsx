import { useNavigation } from "@react-navigation/core";
import ItemFood from "components/ItemFood";
import { FONTS } from "config/FoundationConfig";
import Routes from "config/Routes";
import React from "react";
import { StyleSheet, TouchableHighlight } from "react-native";
import { View, Text, Button, Assets, Colors, Image } from "react-native-ui-lib";

const BoxFood = ({ title, onPress }) => {
  const { navigate } = useNavigation();
  return (
    <TouchableHighlight
      underlayColor={"rgb(0,0,0)"}
      onPress={() => {
        navigate(Routes.BreakfastDetail);
      }}
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
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: Colors.white,
        overflow: "hidden",
      }}
    >
      <View backgroundColor={Colors.white}>
        <View
          row
          paddingH-16
          paddingV-12
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Text H14 color28 uppercase>
            {title}
          </Text>
          <Button
            iconSource={Assets.icons.ic_add_16}
            label={"ADD FOOD"}
            link
            color={Colors.buttonLink}
            onPress={onPress}
            labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
          />
        </View>
        <View height={1} backgroundColor={Colors.line} />
        <ItemFood />
        <View height={1} backgroundColor={Colors.line} />
        <ItemFood />
        <View height={1} backgroundColor={Colors.line} />
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
    </TouchableHighlight>
  );
};

export default BoxFood;

const styles = StyleSheet.create({});
