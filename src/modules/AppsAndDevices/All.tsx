import ItemTracking from "components/ItemTracking";
import React from "react";
import { FlatList } from "react-native";
import { Assets, View, Colors } from "react-native-ui-lib";
const All = () => {
  const DATA = [
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
  ];
  return (
    <View flex backgroundColor={Colors.background}>
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

export default All;
