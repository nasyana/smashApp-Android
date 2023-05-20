import { useNavigation } from "@react-navigation/core";
import ItemWorkout from "components/ItemWorkout";
import Routes from "config/Routes";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { View, Assets } from "react-native-ui-lib";
const MyPlan = () => {
  const { navigate } = useNavigation();
  const DATA = [
    {
      title: "Weider (Chest Special)",
      img: Assets.icons.myplan1,
      week: 12,
      note: "",
    },
    {
      title: `Abs Home Workout`,
      img: Assets.icons.myplan2,
      week: 8,
      note: "",
    },
    {
      title: "The 7-Day Six-Pack",
      img: Assets.icons.myplan3,
      week: 1,
      note: "",
    },
  ];
  return (
    <View flex>
      <FlatList
        data={DATA}
        renderItem={({ item }) => {
          return (
            <ItemWorkout
              item={item}
              onPress={() => {
                navigate(Routes.MyPlanDetail);
              }}
            />
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default MyPlan;

const styles = StyleSheet.create({});
