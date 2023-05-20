import { useNavigation } from "@react-navigation/core";
import ButtonLinear from "components/ButtonLinear";
import Header from "components/Header";
import Routes from "config/Routes";
import { bottom, width } from "config/scaleAccordingToDevice";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Assets, Button, Colors, Text, Image } from "react-native-ui-lib";
const WorkoutPlanPlansStockDetail = () => {
  const { navigate } = useNavigation();
  return (
    <View flex backgroundColor={Colors.white}>
      <Header
        title={""}
        back
        noShadow
        btnRight={
          <Button
            iconSource={Assets.icons.ic_share}
            link
            color={Colors.color28}
          />
        }
      />
      <Text marginH-16 marginV-8 M24 color28>
        Jay Cutler's 8-Week{"\n"}Mass-Building Trainer
      </Text>
      <View row paddingH-16 centerV marginB-16>
        <Image source={Assets.icons.ic_time_16_w} tintColor={Colors.color6D} />
        <Text R14 color6D marginL-4>
          8 Weeks
        </Text>
        <Image
          source={Assets.icons.ic_level}
          marginL-24
          tintColor={Colors.color6D}
        />
        <Text R14 color6D marginL-4>
          Advanced
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigate(Routes.PlayVideo);
        }}
      >
        <View width={width} height={(width / 375) * 225} centerV centerH>
          <Image
            source={Assets.icons.GeneralTraining}
            style={{
              ...StyleSheet.absoluteFillObject,
              width: width,
              height: (width / 375) * 225,
            }}
          />
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: Colors.color28,
              opacity: 0.8,
            }}
          />
          <Image source={Assets.icons.ic_play} />
        </View>
      </TouchableOpacity>
      <Text margin-24 color28 R16 style={{ lineHeight: 24 }}>
        Building muscle takes more than physical fortitude. It takes a certain
        mindset and drive to create an elite body. Even if you lift big, you
        won't get big if you don't know how to think big. That's your first
        lesson from Jay Cutler.{"\n\n"}"I always say that the mentality of a
        bodybuilder isn't normal," Jay explains. "Something has to be triggered
        inside you. You always want to push yourself beyond the limits.
        Honestly, you have to be a little crazy. There are some people who have
        the potential to have the best physiques in the world, but they don't
        have the mental capabilities to push themselves."
      </Text>
      <ButtonLinear
        title={"$12 - get this plan"}
        onPress={() => {}}
        style={{
          position: "absolute",
          bottom: bottom,
        }}
      />
    </View>
  );
};

export default WorkoutPlanPlansStockDetail;

const styles = StyleSheet.create({});
