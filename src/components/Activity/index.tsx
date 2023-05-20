import { useNavigation } from "@react-navigation/core";
import Routes from "config/Routes";
import { shadow } from "config/scaleAccordingToDevice";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text, Assets, Image, Colors } from "react-native-ui-lib";

interface Props {
  item: {
    title: string;
    calories_burn: number;
    time: number;
    rate: number;
    isActive: boolean;
  };
  onPress: () => void;
}
const ItemSearchExercire = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        padding-16
        row
        backgroundColor={Colors.white}
        margin-16
        marginT-0
        centerV
        style={{
          ...shadow,
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text M18 color={item.isActive ? Colors.buttonLink : Colors.color28}>
            {item.title}
          </Text>
          <View row marginT-8>
            <Image source={Assets.icons.ic_calories_burn} />
            <Text R14 color6D marginL-4 marginR-24>
              {item.calories_burn} cal
            </Text>
            <Image source={Assets.icons.ic_time_16} />
            <Text R14 color6D marginL-4 marginR-24>
              {item.time} mins
            </Text>
            {!!item.rate && (
              <>
                <Image source={Assets.icons.ic_calories_burn} />
                <Text R14 color6D marginL-4>
                  9.2
                </Text>
              </>
            )}
          </View>
        </View>
        <Image
          source={
            item.isActive
              ? Assets.icons.ic_checkbox_selected
              : Assets.icons.ic_checkbox
          }
        />
      </View>
    </TouchableOpacity>
  );
};

export default ItemSearchExercire;

const styles = StyleSheet.create({});
