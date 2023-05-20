import { useNavigation } from "@react-navigation/core";
import Header from "components/Header";
import Routes from "config/Routes";
import { width } from "config/scaleAccordingToDevice";
import React from "react";
import { FlatList, ImageBackground, StyleSheet } from "react-native";
import Ripple from "react-native-material-ripple";
import { View, Assets, Text, Colors } from "react-native-ui-lib";

const MuscleGroup = () => {
  const { navigate } = useNavigation();
  const DATA = [
    {
      icon: Assets.icons.img_mg_chest,
      name: "Chest",
      number: 80,
    },
    {
      icon: Assets.icons.img_mg_biceps,
      name: "Biceps",
      number: 46,
    },
    {
      icon: Assets.icons.img_mg_triceps,
      name: "Triceps",
      number: 72,
    },
  ];
  return (
    <View flex>
      <Header title={"Muscle Group"} back />
      <FlatList
        data={DATA}
        renderItem={({ item, index }) => {
          return (
            <Ripple
              onPress={() => {
                navigate(Routes.ChestExercises);
              }}
            >
              <ImageBackground
                source={item.icon}
                style={{
                  width: width,
                  height: (width / 375) * 226,
                  justifyContent: "flex-end",
                  paddingBottom: 16,
                }}
              >
                <Text H36 white marginL-16>
                  {item.name}
                </Text>
                <View row>
                  <View
                    backgroundColor={Colors.color58}
                    paddingH-8
                    paddingV-4
                    marginL-16
                    style={{
                      borderRadius: 100,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text H10 white>
                      {item.number} EXERCISES
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </Ripple>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default MuscleGroup;

const styles = StyleSheet.create({});
