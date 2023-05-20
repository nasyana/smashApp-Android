import { useNavigation } from "@react-navigation/native";
import Header from "components/Header";
import Routes from "config/Routes";
import { width } from "config/scaleAccordingToDevice";
import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { View, Colors, Assets, Image, Text } from "react-native-ui-lib";

const widthItem = (width - 48) / 2;
const More = () => {
  const { navigate } = useNavigation();
  const DATA = [
    {
      icon: Assets.icons.ic_upgrade_pro,
      title: "Badges & Awards",
    },
    {
      icon: Assets.icons.ic_my_profile,
      title: "My Profile",
      onPress: () => navigate(Routes.MyProfile),
    },

    {
      icon: Assets.icons.ic_graph,
      title: "Stats",
      onPress: () => navigate(Routes.Graph),
    },
    {
      icon: Assets.icons.ic_watch,
      title: "Apps & Devices",
      onPress: () => navigate(Routes.AppsAndDevices),
    },

    {
      icon: Assets.icons.ic_help,
      title: "Help",
    },
    {
      icon: Assets.icons.ic_settings,
      title: "Preferences",
    },
  ];
  return (
    <View flex backgroundColor={Colors.background}>
      <Header title={"More"} />
      <ScrollView>
        <View flex row style={{ flexWrap: "wrap", paddingTop: 16 }}>
          {DATA.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  width: widthItem,
                  height: (widthItem / 164) * 146,
                  borderRadius: 6,
                  marginLeft: 16,
                  marginBottom: 16,
                  backgroundColor: Colors.white,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={item.onPress}
              >
                <Image source={item.icon} />
                <Text M14 color28 marginT-16>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default More;

const styles = StyleSheet.create({});
