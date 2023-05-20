import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Header from "components/Header";
import { FONTS } from "config/FoundationConfig";
import Routes from "config/Routes";
import React from "react";
import { Assets, Button, Colors, Text, Image, View } from "react-native-ui-lib";
import All from "./All";
import Connected from "./Connected";
const Tab = createMaterialTopTabNavigator();
const AppsAndDevices = () => {
  return (
    <View flex>
      <Header title={"Apps & Devices"} back noShadow />
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
          name={Routes.AppsAndDeviceConnected}
          component={Connected}
          options={{
            title: "Connected (2)",
          }}
        />
        <Tab.Screen
          name={Routes.AppsAndDeviceAll}
          component={All}
          options={{
            title: "all",
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default AppsAndDevices;
