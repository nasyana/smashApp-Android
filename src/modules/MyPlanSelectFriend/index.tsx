import ButtonLinear from "components/ButtonLinear";
import HeaderWithSearch from "components/HeaderWithSearch";
import { FONTS } from "config/FoundationConfig";
import { bottom } from "config/scaleAccordingToDevice";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { View, Assets, Colors, Image, Text } from "react-native-ui-lib";
const MyPlanSelectFriend = () => {
  const DATA = [
    {
      img: Assets.icons.fr1,
      name: "Clifford Hall",
      active: false,
    },
    {
      img: Assets.icons.fr2,
      name: "Marion Malone",
      active: true,
    },
    {
      img: Assets.icons.fr3,
      name: "Grace Boyd",
      active: true,
    },
    {
      img: Assets.icons.fr4,
      name: "Mina Warner",
      active: true,
    },
    {
      img: Assets.icons.fr5,
      name: "Dennis Zimmerman",
      active: false,
    },
    {
      img: Assets.icons.fr6,
      name: "Maria May",
      active: false,
    },
    {
      img: Assets.icons.fr7,
      name: "Elnora Ingram",
      active: false,
    },
  ];
  return (
    <View flex>
      <HeaderWithSearch
        title="Invite Friend to Join Workout"
        onPress={() => {}}
        back
        placeholder={"Search Friend"}
      />
      <FlatList
        data={DATA}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{ borderRadius: 6 }}
              marginB-16
              row
              padding-16
              centerV
              backgroundColor={Colors.white}
            >
              <Image source={item.img} />
              <Text
                flex
                marginH-16
                M18
                color={item.active ? Colors.buttonLink : Colors.color28}
              >
                {item.name}
              </Text>
              <Image
                source={
                  item.active
                    ? Assets.icons.ic_checkbox_selected
                    : Assets.icons.ic_checkbox
                }
              />
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 16,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: bottom,
        }}
      >
        <ButtonLinear
          title={"3 friends selected"}
          onPress={() => {}}
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
        <ButtonLinear title={"send invite"} onPress={() => {}} style={{}} />
      </View>
    </View>
  );
};

export default MyPlanSelectFriend;

const styles = StyleSheet.create({});
