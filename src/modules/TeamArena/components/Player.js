import { width } from "config/scaleAccordingToDevice";
import React from "react";
import SmartImage from "../../../components/SmartImage/SmartImage"
import { FlatList, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { View, Colors, Image, Assets, Text, Avatar, TouchableOpacity } from "react-native-ui-lib";
import ChallengeLike from "./ChallengeLike";
import { useNavigation } from "@react-navigation/core";
import Routes from "config/Routes";
const Player = (props) => {
    const { navigate } = useNavigation();
    const { item, index, challengeData, playerChallengeData, challengesStore, goToProfile, currentUserFollowing, kFormatter, currentUserId, currentUser, community } = props;
    const { qty = 0, score = 0 } = item;
    const { user } = item;

    const fullUser = { ...user, uid: item.uid }
    const selectedGradient = playerChallengeData?.selectedGradient || ['#eee', '#333']
    const displayUnit = challengeData?.targetType == 'qty' ? qty : score;


    const iAmFollowing = !community || currentUserFollowing?.includes(item.uid) || item.uid == currentUserId
    const pressInsights = () => {

        if (!iAmFollowing || !item) { return }
        challengesStore?.setInsightsPlayerChallengeDoc(item)
    }

    const onPressUser = () => {
        goToProfile(fullUser)
    }

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
            }}
        // onPress={() => goToProfile(user)}
        >
            <View centerV paddingL-16 paddingT-16>
                <Text>{index + 1}</Text>
            </View>

            <TouchableOpacity paddingT-16 paddingL-16 onPress={onPressUser}>
                <LinearGradient start={{ x: 0.6, y: 0.1 }} colors={selectedGradient} style={{ width: 55, height: 55, borderRadius: 27.5, alignItems: "center", justifyContent: "center" }}>
                {/* <Avatar source={Assets.icons.img_latest} /> */}
                    <SmartImage uri={user?.picture?.uri} preTouchableOpacity={user?.picture?.preview} style={{ height: 50, width: 50, borderRadius: 60, borderWidth: 2, borderColor: '#fff' }} />
                </LinearGradient>
            </TouchableOpacity>

            <View paddingL-16 centerV flex row spread >
                <Text H14 color28 marginT-16 marginB-8 onPress={onPressUser}>
                    {user?.name || 'anon'}
                </Text>

                {!community && <TouchableOpacity style={{ marginRight: 16 }} onPress={pressInsights}><AntDesign name="barschart" size={20} color={iAmFollowing ? '#333' : '#eee'} /></TouchableOpacity>}

            </View>
            <View paddingL-16 flex row spread paddingR-24 centerV>

                <Text buttonLink marginT-16 marginB-8 style={{ fontSize: 35 }} onPress={pressInsights}>
                    {kFormatter(displayUnit) || 0}
                </Text>

                <ChallengeLike item={item} />
            </View>
        </View >
    )
}
export default Player