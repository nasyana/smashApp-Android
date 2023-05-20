import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Header from "components/Header";
import { FONTS } from "config/FoundationConfig";
import Routes from "config/Routes";
import React from "react";
import { View, Text, Button, Assets, Colors } from "react-native-ui-lib";
import Food from "./Food";
import Meals from "./Meals";
import Recipes from "./Recipes";
const Tab = createMaterialTopTabNavigator();
const MyFoodAndRecipe = () => {
  return (
    <View flex>
      <Header title="My Food and Recipes" back noShadow />
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
          name={Routes.MyFoodAndRecipeFood}
          component={Food}
          options={{
            title: "food",
          }}
        />
        <Tab.Screen
          name={Routes.MyFoodAndRecipeRecipes}
          component={Recipes}
          options={{
            title: "recipes",
          }}
        />
        <Tab.Screen
          name={Routes.MyFoodAndRecipeMeals}
          component={Meals}
          options={{
            title: "meals",
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default MyFoodAndRecipe;
