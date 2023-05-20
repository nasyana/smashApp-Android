import { useNavigation } from "@react-navigation/core";
import Box from "components/Box";
import HeaderWithSearch from "components/HeaderWithSearch";
import Routes from "config/Routes";
import { width } from "config/scaleAccordingToDevice";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { View, Assets, Colors, Text, Image, Button } from "react-native-ui-lib";
const widthItem = (width - 48) / 2;
const AddFood = () => {
  const { navigate } = useNavigation();
  const DATA = [
    {
      icon: Assets.icons.ic_barcode_scan,
      title: "Barcode Scan",
    },
    {
      icon: Assets.icons.ic_food_category,
      title: "Food Category",
      onPress: () => navigate(Routes.AddFoodCategory),
    },
    {
      icon: Assets.icons.ic_my_food,
      title: "My Food and Recipes",
      onPress: () => navigate(Routes.MyFoodAndRecipe),
    },
    {
      icon: Assets.icons.ic_create_food,
      title: "Create New Food",
      onPress: () => navigate(Routes.CreateMyFoodStep1),
    },
  ];
  return (
    <View flex backgroundColor={Colors.background}>
      <HeaderWithSearch
        placeholder={"Search foods or brand..."}
        title={"Lunch"}
        back
      />
      <ScrollView>
        <View
          row
          paddingT-16
          style={{
            flexWrap: "wrap",
          }}
        >
          {DATA.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  width: widthItem,
                  height: (widthItem / 164) * 146,
                  borderRadius: 6,
                  marginLeft: 16,
                  marginBottom: 16,
                  backgroundColor: Colors.white,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={item.onPress}
              >
                <Image source={item.icon} />
                <Text M14 color28 marginT-16>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Box>
          <View
            row
            paddingH-16
            paddingV-12
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Text H14 color28 uppercase>
              OTHERS
            </Text>
          </View>
          <View height={1} backgroundColor={Colors.line} />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
            }}
            onPress={() => {
              navigate(Routes.AddFoodRecent);
            }}
          >
            <Image source={Assets.icons.ic_recent_food} />
            <Text M16 color28 marginL-16>
              Recent
            </Text>
          </TouchableOpacity>
          <View height={1} backgroundColor={Colors.line} />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
            }}
            onPress={() => {
              navigate(Routes.AddFoodFrequent);
            }}
          >
            <Image source={Assets.icons.ic_frequent_food} />
            <Text M16 color28 marginL-16>
              Frequent
            </Text>
          </TouchableOpacity>
          <View height={1} backgroundColor={Colors.line} />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
            }}
            onPress={() => {
              navigate(Routes.AddFoodSimpleCalorie);
            }}
          >
            <Image source={Assets.icons.ic_simple_calories} />
            <Text M16 color28 marginL-16>
              Simple Calories
            </Text>
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </View>
  );
};

export default AddFood;

const styles = StyleSheet.create({});
