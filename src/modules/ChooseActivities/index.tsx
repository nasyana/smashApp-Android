import { useNavigation } from "@react-navigation/native";
import ButtonLinear from "components/ButtonLinear";
import HeaderWithSearch from "components/HeaderWithSearch";
import Activity from "components/Activity";
import { FONTS } from "config/FoundationConfig";
import Routes from "config/Routes";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { View, Button, Colors, Assets } from "react-native-ui-lib";

const ChooseActivities = () => {
  const DATA = [
    {
      title: "Dumbbell Bench Press",
      calories_burn: 220,
      time: 15,
      rate: 9.2,
      isActive: false,
    },
    {
      title: "Dumbbell Flyes",
      calories_burn: 220,
      time: 15,
      rate: 9,
      isActive: true,
    },
    {
      title: "Incline Dumbbell Press",
      calories_burn: 220,
      time: 15,
      rate: 0,
      isActive: false,
    },
    {
      title: "Decline Dumbbell Flyes",
      calories_burn: 220,
      time: 15,
      rate: 9.5,
      isActive: true,
    },
    {
      title: "Incline Dumbbell Press Reverse...",
      calories_burn: 220,
      time: 15,
      rate: 9.1,
      isActive: false,
    },
    {
      title: "Decline Dumbbell Bench Press",
      calories_burn: 220,
      time: 15,
      rate: 9.8,
      isActive: true,
    },
  ];
  const { navigate } = useNavigation();
  return (
    <View flex backgroundColor={Colors.background}>
      <HeaderWithSearch title="Choose Activities" back />
      <FlatList
        data={DATA}
        renderItem={({ item, index }) => <Activity item={item} />}
        keyExtractor={(item, index) => index.toString()}
        style={{ paddingTop: 16 }}
        ListFooterComponent={<View height={150} />}
      />
      <View
        style={{
          position: "absolute",
          bottom: getBottomSpace() ? getBottomSpace() + 8 : 16,
        }}
      >
        <ButtonLinear
          title={"3 activities selected"}
          onPress={() => { }}
          style={{
            width: "auto",
            alignSelf: "center",
            marginBottom: 16,
            paddingHorizontal: 0,
            height: 32,
            borderRadius: 100,
            backgroundColor: "red",
          }}
          styleText={{
            fontSize: 12,
            fontFamily: FONTS.heavy,
          }}
          colors={[Colors.color58, Colors.colorC6]}
        />
        <ButtonLinear
          title={"Add to Challenge"}
          onPress={() => {
            navigate(Routes.AddExercire);
          }}
          style={{}}
        />
      </View>
    </View>
  );
};

export default ChooseActivities;

const styles = StyleSheet.create({});
