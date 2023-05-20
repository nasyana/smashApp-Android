import Header from "components/Header";
import ItemTracking from "components/ItemTracking";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { View, Text, Assets } from "react-native-ui-lib";

const AutoTracking = () => {
  const DATA = [
    {
      icon: Assets.icons.img_logo_google,
      name: "Google Fit",
      company: "Google LLC",
      isConnect: false,
    },
    {
      icon: Assets.icons.img_logo_healthkit,
      name: "Healthkit",
      company: "Apple Inc",
      isConnect: true,
    },
    {
      icon: Assets.icons.img_logo_runkeeper,
      name: "Runkeeper",
      company: "FitnessKeeper, Inc. ",
      isConnect: true,
    },
    {
      icon: Assets.icons.img_logo_connect,
      name: "Connect Mobile",
      company: "Garmin Ltd",
      isConnect: false,
    },
    {
      icon: Assets.icons.img_logo_fitbit,
      name: "Fitbit",
      company: "Fitbit, Inc",
      isConnect: false,
    },
  ];
  return (
    <View flex>
      <Header title={"Auto Tracking"} back />
      <FlatList
        data={DATA}
        renderItem={({ item, index }) => {
          return <ItemTracking item={item} />;
        }}
        keyExtractor={(item, index) => index.toString()}
        style={{ paddingTop: 16 }}
      />
    </View>
  );
};

export default AutoTracking;

const styles = StyleSheet.create({});
