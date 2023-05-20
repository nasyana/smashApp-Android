import { width } from "config/scaleAccordingToDevice";
import React, { useEffect, useState } from "react";
import SmartImage from "../../../components/SmartImage/SmartImage"
import { FlatList, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { View, Colors, Image, Assets, Text, Avatar, TouchableOpacity } from "react-native-ui-lib";
import ChallengeLike from "./ChallengeLike";
import Firebase from "../../../config/Firebase";

const FollowingUser = (props) => {

    const { item, index, like, invite, goToProfile, challengeIsSingleActivity, kFormatter, showPlayerSmashes } = props;
    const { qty = 0, score = 0 } = item;
    const user = item;

    const [playerDoc, setPlayerDoc] = useState(false);





    useEffect(() => {


        const unsubscribeToPlayerImFollowing = Firebase.firestore.collection('playerChallenges').doc(`${uid}_${challengeId}_${endDateKey}`).onSnapshot((snap) => {

            if (snap.exists) {

                const playerDoc = snap.data();
                setPlayerDoc(playerDoc);

            }

        })


        return () => {

            if (unsubscribeToPlayerImFollowing) { unsubscribeToPlayerImFollowing(); }


        }
    }, [])
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

            <TouchableOpacity paddingT-16 paddingL-16 onPress={() => goToProfile(user)}>
                {/* <Avatar source={Assets.icons.img_latest} /> */}
                <SmartImage uri={user?.picture?.uri} preTouchableOpacity={user?.picture?.preview} style={{ height: 50, width: 50, borderRadius: 60 }} />
            </TouchableOpacity>

            <View paddingL-16 centerV flex row spread >
                <Text H14 color28 marginT-16 marginB-8 >
                    {user?.name || 'anon'}
                </Text>

                <TouchableOpacity style={{ marginRight: 16 }} onPress={() => showPlayerSmashes()}><AntDesign name="barschart" size={20} /></TouchableOpacity>
                {/* <View row centerV>
            <Image source={Assets.icons.ic_time_16} />
            <Text R14 color6D marginL-4>
              {item.duration}
            </Text>

          </View> */}
            </View>
            <View paddingL-16 flex row spread paddingR-24 centerV>
                {/* <Image source={Assets.icons.ic_calories_burn} marginT-8 /> */}

                <Text buttonLink marginT-16 marginB-8 style={{ fontSize: 35 }}>
                    {challengeIsSingleActivity ? qty : kFormatter(score) || 0}
                </Text>

                {playerDoc ? <Text>Already Playing</Text> : <Text>Invite</Text>}
            </View>
        </View >
    )
}
export default FollowingUser