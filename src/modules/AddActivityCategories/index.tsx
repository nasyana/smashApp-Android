import { useNavigation } from "@react-navigation/core";
import Header from "components/Header";
import ItemFoodCategory from "components/ItemFoodCategory";
import Routes from "config/Routes";
import { bottom } from "config/scaleAccordingToDevice";
import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import Ripple from "react-native-material-ripple";
import { View, Text, Colors, Button, Assets } from "react-native-ui-lib";
const AddActivityCategories = () => {
  const { navigate } = useNavigation();
  const DATA = [
    {
      img: Assets.icons.beer,
      num: 7,
      title: "Beer",
    },
    {
      img: Assets.icons.bread,
      num: 12,
      title: "Bread & Bakery",
    },
    {
      img: Assets.icons.eggs,
      num: 23,
      title: "Dairy & Eggs",
    },
    {
      img: Assets.icons.drinks,
      num: 10,
      title: "Drinks",
    },
    {
      img: Assets.icons.fish,
      num: 24,
      title: "Fish & Shellfish",
    },
    {
      img: Assets.icons.cupboard,
      num: 8,
      title: "Food Cupboard",
    },
    {
      img: Assets.icons.cereals,
      num: 10,
      title: "Cereals",
    },
    {
      img: Assets.icons.seafood,
      num: 7,
      title: "Seafood",
    },
  ];
  return (
    <View flex backgroundColor={Colors.background}>
      <Header
        title="Category"
        back
        btnRight={
          <Button
            iconSource={Assets.icons.ic_search}
            link
            color={Colors.color28}
          />
        }
      />
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <View
            style={{
              marginHorizontal: 16,
            }}
          >
            <ItemFoodCategory
              item={item}
              onPress={() => {
                navigate(Routes.AddFoodCategory2);
              }}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: bottom,
        }}
      />
    </View>
  );
};

export default AddActivityCategories;
