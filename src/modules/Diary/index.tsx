import { useNavigation } from "@react-navigation/core";
import ButtonIconBadge from "components/ButtonIconBadge";
import ItemWorkOutPlan from "components/ItemWorkOutPlan";
import SegmentedRoundDisplay from "components/SegmentedRoundDisplay";
import { FONTS } from "config/FoundationConfig";
import Routes from "config/Routes";
import { width } from "config/scaleAccordingToDevice";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import {
  Text,
  View,
  Image,
  Assets,
  Button,
  Colors,
  Avatar,
} from "react-native-ui-lib";
import BoxFood from "./components/BoxFood";
import BoxWater from "./components/BoxWater";
import HeaderWithSearch from "../../components/HeaderWithSearch";
import Challenge from "../../components/Challenge";

const DATA = [
  {
    title: "10k Push-Ups",
    duration: 14,
    startDate: '17th Nov',
    type: 'Single Activity Challenge',
    active: true,
    activities: ['Push-ups']
  }, {
    title: "10k Sit-Ups",
    duration: 14,
    startDate: '17th Nov',
    type: 'Single Activity Challenge',
    active: true,
    activities: ['Sit-ups']
  }
];

const Diary = () => {
  const { navigate } = useNavigation();
  return (
    <View flex >

      {/* <Image
        source={Assets.icons.bg_tab}
        style={{ position: "absolute", width: width }}
      /> */}
      <ScrollView>
        <HeaderWithSearch
          placeholder={"Enter a Challenge Code"}
          back={false}
        />
        <FlatList
          data={DATA}
          renderItem={({ item, index }) => (
            <Challenge

              item={item}
              onPress={() => {
                navigate(Routes.ExercireDetail, {
                  addToPlan: index % 2 === 1,
                });
              }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          style={{ paddingTop: 16 }}
          ListFooterComponent={<View height={150} />}
        />
        {/* <ButtonIconBadge source={Assets.icons.ic_notification} label={"2"} />
        <View row paddingL-16>
          <Avatar source={Assets.icons.avatar} size={48} />
          <Text R14 contentW style={{ paddingLeft: 16 }}>
            Hello <Text B14>Joseph Allison</Text>,{"\n"}Things look allright.
          </Text>
        </View> */}
        {/* <View
          marginH-16
          marginT-24
          marginB-16
          row
          style={{
            borderRadius: 6,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
          }}
          backgroundColor={Colors.white}
        >
          <View paddingV-16 paddingL-16 flex>
            <Text R16 color6D>
              Your goal
            </Text>
            <Text M24 color28 marginT-8>
              Gain weight
            </Text>
          </View>
          <View width={1} backgroundColor={Colors.line} />
          <View paddingV-16 paddingL-16 flex>
            <Text R16 color6D>
              Latest weight, Jan 22
            </Text>
            <View row centerV>
              <Text M36 color28 marginR-16>
                74{" "}
                <Text R18 color28>
                  kg
                </Text>
              </Text>

              <Image source={Assets.icons.graph} />
            </View>
          </View>
        </View> */}
        {/* <View
          marginH-16
          marginB-16
          style={{
            borderRadius: 6,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
          }}
          backgroundColor={Colors.white}
        >
          <View
            padding-16
            row
            style={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button iconSource={Assets.icons.btn_back_day} />
            <Text R14 color28>
              TODAY
            </Text>
            <Button iconSource={Assets.icons.btn_next_day} />
          </View>
          <View
            row
            paddingB-24
            style={{
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text M24 color28>
                1317
              </Text>
              <Text R14 color6D>
                Eaten
              </Text>
            </View>
            <View height={133} width={133}>
              <SegmentedRoundDisplay />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  borderWidth: 1,
                  borderRadius: 100,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderColor: Colors.line,
                  bottom: 0,
                  alignSelf: "center",
                }}
                onPress={() => {
                  navigate(Routes.DailyDetail);
                }}
              >
                <Text H10 color6D>
                  Detail
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text M24 color28>
                768
              </Text>
              <Text R14 color6D>
                Burned
              </Text>
            </View>
          </View>
        </View> */}
        {/* <View
          marginH-16
          marginB-16
          style={{
            borderRadius: 6,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
          }}
          backgroundColor={Colors.white}
        >
          <View
            row
            paddingH-16
            paddingV-12
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Text H14 color28 uppercase>
              Workout Plan
            </Text>
            <Button
              iconSource={Assets.icons.ic_add_16}
              label={"ADD PLAN"}
              link
              color={Colors.buttonLink}
              labelStyle={{ fontSize: 14, fontFamily: FONTS.medium }}
              onPress={() => {
                // navigate(Routes.AddNew);
              }}
            />
          </View>
          <View height={1} backgroundColor={Colors.line} />
          <ItemWorkOutPlan />
        </View> */}
        {/* <BoxFood
          title={"BREAKFAST"}
          onPress={() => {
            navigate(Routes.AddFood);
          }}
        />
        <BoxFood
          title={"LUNCH"}
          onPress={() => {
            navigate(Routes.AddFood);
          }}
        />
        <BoxFood
          title={"Dinner"}
          onPress={() => {
            navigate(Routes.AddFood);
          }}
        />
        <BoxFood
          title={"Snack"}
          onPress={() => {
            navigate(Routes.AddFood);
          }}
        /> */}
        {/* <BoxWater title={"water"} /> */}
      </ScrollView>
    </View>
  );
};

export default Diary;

const styles = StyleSheet.create({});
