import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { View, Text, Colors, Assets, Image } from "react-native-ui-lib";

const Nutrtion = () => {
  const DATA = [
    {
      img: Assets.icons.noti1,
      title: "Gary Reyes accepted you invite in “Weider (Chest Special)”",
      time: "Jan 21, 2018",
      seen: true,
    },
    {
      img: Assets.icons.noti2,
      title: "Adelaide Harris accepted you invite in “Abs Home Workout”",
      time: "Jan 21, 2018",
      seen: false,
    },
    {
      img: Assets.icons.noti3,
      title: "Rodney Strickland accepted you invite in “Abs Home Workout”",
      time: "Jan 21, 2018",
      seen: false,
    },
    {
      img: Assets.icons.noti4,
      title: "Christina Smith accepted you invite in “Weider (Chest Special)”",
      time: "Jan 21, 2018",
      seen: false,
    },
    {
      img: Assets.icons.noti5,
      title: "Fannie Hanson accepted you invite in “Weider (Chest Special)”",
      time: "Jan 21, 2018",
      seen: false,
    },
    {
      img: Assets.icons.noti6,
      title: "Evan Jacobs accepted you invite in “Abs Home Workout”",
      time: "Jan 21, 2018",
      seen: false,
    },
  ];
  return (
    <View flex>
      <FlatList
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={{
                marginHorizontal: 16,
                marginBottom: 16,
                borderRadius: 6,
                backgroundColor: Colors.white,
                flexDirection: "row",
                padding: 16,
              }}
            >
              <Image source={item.img} />
              <View marginL-16 flex>
                {!!item.seen ? (
                  <Text H14 color28 marginB-8>
                    {item.title}
                  </Text>
                ) : (
                  <Text R14 color28 marginB-8>
                    {item.title}
                  </Text>
                )}
                <View row centerV>
                  <Image source={Assets.icons.ic_time_16} />
                  <Text R14 color6D marginL-4>
                    {item.time}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        data={DATA}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingTop: 16,
        }}
      />
    </View>
  );
};

export default Nutrtion;
