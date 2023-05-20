import { useNavigation } from "@react-navigation/core";
import ButtonLinear from "components/ButtonLinear";
import ItemFood from "components/ItemFood";
import Routes from "config/Routes";
import { bottom, shadow } from "config/scaleAccordingToDevice";
import React from "react";
import { FlatList } from "react-native";
import { View, Colors, Assets } from "react-native-ui-lib";
const Recipes = () => {
  const DATA = [
    {
      img: Assets.icons.bread1,
      num: 867,
      title: "Baguettes & Bagels",
      unit: "food",
    },
    {
      img: Assets.icons.bread2,
      num: 793,
      title: "Crackers",
      unit: "food",
    },
    {
      img: Assets.icons.bread3,
      num: 587,
      title: "Croissants & Pastries",
      unit: "food",
    },
    {
      img: Assets.icons.bread4,
      num: 360,
      title: "Dark Bread",
      unit: "food",
    },
    {
      img: Assets.icons.bread5,
      num: 365,
      title: "Other Bread",
      unit: "food",
    },
    {
      img: Assets.icons.bread6,
      num: 404,
      title: "White Bread",
      unit: "food",
    },
    {
      img: Assets.icons.bread7,
      num: 243,
      title: "Soda bread",
      unit: "food",
    },
    {
      img: Assets.icons.bread8,
      num: 649,
      title: "Biscuits",
      unit: "food",
    },
  ];
  const { navigate } = useNavigation();
  return (
    <View flex backgroundColor={Colors.background}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <View
            marginH-16
            marginB-16
            backgroundColor={Colors.white}
            style={shadow}
          >
            <ItemFood item={item} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: bottom + 80,
        }}
      />
      <ButtonLinear
        title="create a recipe"
        onPress={() => {
          navigate(Routes.CreateMyRecipeStep1);
        }}
        style={{
          position: "absolute",
          bottom: bottom,
        }}
      />
    </View>
  );
};

export default Recipes;
