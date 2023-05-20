import { width } from "config/scaleAccordingToDevice";
import React from "react";
import SmartImage from "../../../components/SmartImage/SmartImage"
import { FlatList, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { View, Colors, Image, Assets, Text, TouchableOpacity } from "react-native-ui-lib";
import ChallengeLike from "./ChallengeLike";

const CommunityPlayer = (props) => {
    const { item, index, invite, goToProfile, challengeIsSingleActivity, kFormatter } = props;
    const { qty = 0, score = 0 } = item;
    const { user } = item;
    return (
        <View
            row
            style={{
                borderRadius: 6,
                marginHorizontal: 16,
                backgroundColor: "#FFF",
                paddingBottom: 16,
                overflow: "hidden",
                marginBottom: 2,
                backgroundColor: '#fff'
            }}

        >
            <View centerV paddingL-16 paddingT-16>
                <Text>{index + 1}</Text>
            </View>

            <TouchableOpacity paddingT-16 paddingL-16 onPress={() => goToProfile(user)}>
                <SmartImage uri={user?.picture?.uri} preview={user?.picture?.preview} style={{ height: 50, width: 50, borderRadius: 60 }} />
            </TouchableOpacity>

            <View paddingL-16 centerV flex row spread>
                <Text H14 color28 marginT-16 marginB-8>
                    {user?.name || 'anon'}
                </Text>

                <TouchableOpacity style={{ marginRight: 16 }}><AntDesign name="barschart" size={20} /></TouchableOpacity>
            </View>

            <View paddingL-16 flex row spread paddingR-24 centerV>

                <Text buttonLink marginT-16 marginB-8 style={{ fontSize: 35 }}>
                    {challengeIsSingleActivity ? qty : kFormatter(score) || 0}
                </Text>

                <ChallengeLike item={item} />

            </View>
        </View>
    )
}
export default CommunityPlayer