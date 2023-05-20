import { useNavigation } from "@react-navigation/core";
import Routes from "config/Routes";
import { shadow } from "config/scaleAccordingToDevice";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text, Assets, Image, Colors } from "react-native-ui-lib";

interface Props {
    item: {
        text: string;
        level: number;
        time: number;
        rate: number;
        isActive: boolean;
    };
    onPress: () => void;
    selected: boolean;
}
const WalkthroughSmashItem = ({ activity, onPress, selected, smashStore }: Props) => {



    const color = '#333'
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
                justifyContent: 'space-between',
             }}>
             <View>
                <Text M18 color={selected ? Colors.buttonLink : Colors.color28}>
                   {activity.label}
                </Text>
                <View row marginT-8>
                   <Image source={Assets.icons.ic_calories_burn} />
                   <Text R14 color6D marginL-4 marginR-24>
                      {activity?.level || 1}
                   </Text>
                   {/* <Image source={Assets.icons.ic_time_16} />
            <Text R14 color6D marginL-4 marginR-24>
              {item.time} mins
            </Text> */}
                   {!!activity.rate && (
                      <>
                         <Image source={Assets.icons.ic_calories_burn} />
                         <Text R14 color6D marginL-4>
                            9.2
                         </Text>
                      </>
                   )}
                </View>
             </View>
             <View row centerV spread>
                <Text H18 marginR-16 style={{ color }}>
                   {activity.pointsValue}
                </Text>
                <Image
                   source={
                      selected
                         ? Assets.icons.ic_checkbox_selected
                         : Assets.icons.ic_checkbox
                   }
                />
             </View>
          </View>
       </TouchableOpacity>
    );
};

export default WalkthroughSmashItem;

const styles = StyleSheet.create({});
