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
const SmashItem = ({ item, onPress, selected, smashStore }: Props) => {

    const { settings, kFormatter } = smashStore

    const { actionLevels = {} } = settings;

    const level = item?.level || 0;

    const levelData = actionLevels?.[level] || false;

    const { color = '#333', label = 'nope' } = levelData;
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
                    <Text M18 color={selected ? Colors.buttonLink : Colors.color28}>
                        {item.text}
                    </Text>
                    <View row marginT-8>
                        <Image source={Assets.icons.ic_calories_burn} />
                        <Text R14 color6D marginL-4 marginR-24>
                            {label}
                        </Text>
                        {/* <Image source={Assets.icons.ic_time_16} />
            <Text R14 color6D marginL-4 marginR-24>
              {item.time} mins
            </Text> */}
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
                <View row centerV spread>
                    <Text H18 marginR-16 style={{ color }} >{kFormatter(smashStore.returnActionPointsValue(item))}</Text>
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

export default SmashItem;

const styles = StyleSheet.create({});
