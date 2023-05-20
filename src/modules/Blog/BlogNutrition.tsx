import { width } from "config/scaleAccordingToDevice";
import React from "react";
import { FlatList, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Colors, Image, Assets, Text } from "react-native-ui-lib";

const BlogNutrition = () => {
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
        data={DATA}
        renderItem={({ item, index }) => {
          return (
            <View
              row
              style={{
                borderRadius: 6,
                marginHorizontal: 16,
                backgroundColor: "#FFF",
                height: 100,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <Image source={item.img} />
              <View paddingL-16 flex>
                <Text H14 color28 marginT-16 marginB-8>
                  {item.title}
                </Text>
                <View row centerV>
                  <Image source={Assets.icons.ic_time_16} />
                  <Text R14 color6D marginL-4>
                    {item.time}
                  </Text>
                  <Image
                    source={Assets.icons.ic_level}
                    tintColor={Colors.color6D}
                    marginL-16
                  />
                  <Text R14 color6D marginL-4>
                    {item.type}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{}}
        ListHeaderComponent={() => {
          return (
            <ImageBackground
              source={Assets.icons.img_nu4}
              style={{
                width: width,
                height: (width / 375) * 225,
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
                Design Your Diet To Fight Chronic Inflammation
              </Text>
              <View row>
                <Image source={Assets.icons.ic_time_16_w} />
                <Text R14 white marginL-4 marginR-24>
                  Jan 30, 2018
                </Text>
                <Image source={Assets.icons.ic_level} />
                <Text R14 white marginL-4 marginR-24>
                  Nutrition
                </Text>
              </View>
            </ImageBackground>
          );
        }}
      />
    </View>
  );
};

export default BlogNutrition;
