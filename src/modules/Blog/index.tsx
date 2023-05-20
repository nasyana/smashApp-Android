import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Header from "components/Header";
import { FONTS } from "config/FoundationConfig";
import Routes from "config/Routes";
import React from "react";
import { StyleSheet } from "react-native";
import { View, Colors } from "react-native-ui-lib";
import BlogLastet from "./BlogLastet";
import BlogNutrition from "./BlogNutrition";
import BlogWorkout from "./BlogWorkout";
const Tab = createMaterialTopTabNavigator();
const Blog = () => {
  return (
    <View flex>
      <Header title="Blog" back noShadow />
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
          name={Routes.BlogLastet}
          component={BlogLastet}
          options={{
            title: "latest",
          }}
        />
        <Tab.Screen
          name={Routes.BlogNutrition}
          component={BlogNutrition}
          options={{
            title: "nutrition",
          }}
        />
        <Tab.Screen
          name={Routes.BlogWorkout}
          component={BlogWorkout}
          options={{
            title: "workout",
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default Blog;

const styles = StyleSheet.create({});
