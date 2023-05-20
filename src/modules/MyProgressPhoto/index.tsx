import ButtonLinear from "components/ButtonLinear";
import Header from "components/Header";
import { bottom, width } from "config/scaleAccordingToDevice";
import React from "react";
import { FlatList, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Colors, Assets, Image } from "react-native-ui-lib";
const MyProgressPhoto = () => {
  const DATA = [
    {
      img: Assets.icons.img_2,
      title: "Chest Week 4",
      time: "Jan 21, 2018",
    },
    {
      img: Assets.icons.img_3,
      title: "Chest Week 4",
      time: "Jan 21, 2018",
    },
    {
      img: Assets.icons.img_4,
      title: "Chest Week 4",
      time: "Jan 21, 2018",
    },
    {
      img: Assets.icons.img_5,
      title: "Chest Week 4",
      time: "Jan 21, 2018",
    },
    {
      img: Assets.icons.img_6,
      title: "Chest Week 4",
      time: "Jan 21, 2018",
    },
    {
      img: Assets.icons.img_7,
      title: "Chest Week 4",
      time: "Jan 21, 2018",
    },
    {
      img: Assets.icons.img_8,
      title: "Chest Week 4",
      time: "Jan 21, 2018",
    },
    {
      img: Assets.icons.img_9,
      title: "Chest Week 4",
      time: "Jan 21, 2018",
    },
    {
      img: Assets.icons.img_10,
      title: "Chest Week 4",
      time: "Jan 21, 2018",
    },
    {
      img: Assets.icons.img_11,
      title: "Chest Week 4",
      time: "Jan 21, 2018",
    },
    {
      img: Assets.icons.img_12,
      title: "Chest Week 4",
      time: "Jan 21, 2018",
    },
    {
      img: Assets.icons.img_13,
      title: "Chest Week 4",
      time: "Jan 21, 2018",
    },
  ];
  return (
    <View flex>
      <Header back title="My Progress Photo" noShadow />
      <FlatList
        data={DATA}
        renderItem={({ item, index }) => {
          return (
            <View width={width / 3} height={width / 3}>
              <Image
                source={item.img}
                style={{
                  width: width / 3,
                  height: width / 3,
                }}
              />
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        ListHeaderComponent={() => {
          let data = {
            img: Assets.icons.img_1,
            title: "Chest Week 4",
            time: "Jan 21, 2018",
          };
          return (
            <ImageBackground
              source={data.img}
              style={{
                width: width,
                height: (width / 375) * 300,
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
                  height: (width / 375) * 300,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
              <Text M24 white marginB-4>
                {data.title}
              </Text>
              <View row centerV>
                <Image source={Assets.icons.ic_time_16_w} />
                <Text R14 white marginL-4 marginR-24>
                  {data.time}
                </Text>
              </View>
            </ImageBackground>
          );
        }}
      />
      <ButtonLinear
        title="add photo"
        style={{
          position: "absolute",
          bottom: bottom,
        }}
        onPress={() => {}}
      />
    </View>
  );
};

export default MyProgressPhoto;
