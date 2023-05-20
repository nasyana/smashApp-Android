import { useNavigation } from "@react-navigation/native";
import ItemWorkout from "components/ItemWorkout";
import Routes from "config/Routes";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { View, Assets } from "react-native-ui-lib";
const PlansStock = () => {
  const { navigate } = useNavigation();
  const DATA = [
    {
      title: "General Training",
      img: Assets.icons.GeneralTraining,
      week: 12,
      note: "Beginner",
    },
    {
      title: `Jay Cutler's 8-Week Mass-Building Trainer`,
      img: Assets.icons.GeneralTraining2,
      week: 8,
      note: "Advanced",
    },
    {
      title: "The 7-Day Six-Pack",
      img: Assets.icons.GeneralTraining3,
      week: 1,
      note: "Intermediate",
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
                navigate(Routes.WorkoutPlanPlansStockDetail);
              }}
            />
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default PlansStock;

const styles = StyleSheet.create({});
