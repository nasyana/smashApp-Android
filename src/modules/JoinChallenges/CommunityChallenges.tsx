import { width } from "config/scaleAccordingToDevice";
import React from "react";
import { FlatList, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Colors, Image, Assets, Text } from "react-native-ui-lib";
import Challenge from "components/Challenge/components/Challenge";

const CommunityChallenges = (props) => {
  const DATA = [
    {
      img: Assets.icons.img_nu,
      title: `Design Your Diet To Fight Chronic Inflammation`,
      time: "Jan 30, 2018",
      type: "Nutrition",
    },
    {
      img: Assets.icons.img_nu1,
      title: `The Ultimate Kris Gethin Muscle-Building Meal Plan`,
      time: "Jan 30, 2018",
      type: "Nutrition",
    },
    {
      img: Assets.icons.img_nu2,
      title: `Your Expert Guide To Chia Seeds`,
      time: "Jan 30, 2018",
      type: "Nutrition",
    },
    {
      img: Assets.icons.img_nu3,
      title: `Podcast Episode 33: The Science of Physique…`,
      time: "Jan 30, 2018",
      type: "Nutrition",
    },
  ];
  return (
    <View flex backgroundColor={Colors.background}>
      <FlatList
        data={props?.challenges || DATA}
        renderItem={({ item, index }) => {
          return (

            <Challenge item={item} />

          );
        }}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{}}
        ListHeaderComponent={() => {
          return (
            <ImageBackground
              source={Assets.icons.img_latest4}
              style={{
                width: width,
                height: (width / 575) * 225,
                marginBottom: 16,
                justifyContent: "flex-end",
                paddingBottom: 16,
                paddingHorizontal: 16,
              }}
            >
              <LinearGradient
                colors={["rgba(0,0,0,.1)", "#000"]}
                style={{
                  opacity: 0.5,
                  position: "absolute",
                  width: width,
                  height: (width / 375) * 225,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
              <Text H18 white marginB-16>
                Lifestyle Challenges
              </Text>
              <View row>
                <Image source={Assets.icons.ic_time_16_w} />
                <Text R14 white marginL-4 marginR-24>
                  Jan 30, 2018
                </Text>
                <Image source={Assets.icons.ic_level} />
                <Text R14 white marginL-4 marginR-24>
                  Beginner
                </Text>
              </View>
            </ImageBackground>
          );
        }}
      />
    </View>
  );
};

export default CommunityChallenges;
