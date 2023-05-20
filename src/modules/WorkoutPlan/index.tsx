import Header from "components/Header";
import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, Button, Assets, Colors } from "react-native-ui-lib";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MyPlan from "./MyPlan";
import PlansStock from "./PlansStock";
import Routes from "config/Routes";
import { FONTS } from "config/FoundationConfig";
import { useNavigation } from "@react-navigation/core";
const Tab = createMaterialTopTabNavigator();
const WorkoutPlan = () => {
  const { navigate } = useNavigation();
  return (
    <View flex>
      <Header
        title={"Workout Plans"}
        noShadow
        btnRight={
          <Button
            iconSource={Assets.icons.ic_add_plan}
            link
            color={Colors.color28}
            onPress={() => {
              navigate(Routes.AddNewPlan);
            }}
          />
        }
      />
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: {
            fontFamily: FONTS.heavy,
            fontSize: 14,
          },
          activeTintColor: Colors.buttonLink,
          inactiveTintColor: Colors.color6D,
          indicatorStyle: {
            backgroundColor: Colors.buttonLink,
          },
        }}
      >
        <Tab.Screen
          name={Routes.PlansStock}
          component={PlansStock}
          options={{
            title: "Plans Stock",
          }}
        />
        <Tab.Screen
          name={Routes.MyPlan}
          component={MyPlan}
          options={{
            title: "My Plans",
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default WorkoutPlan;

const styles = StyleSheet.create({});
