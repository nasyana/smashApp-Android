import { useNavigation } from "@react-navigation/native";
import { FONTS } from "config/FoundationConfig";
import React, { ReactNode, useCallback, useRef, useEffect, useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    Platform,
    Image
} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { View, Colors, Text, Assets, Button, Avatar } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
import AnimatedView from "components/AnimatedView"
import SmartImage from "../../components/SmartImage/SmartImage";
import Header from "../../components/Header";
import HypeUpInput from "../../modules/ChallengeArena/components/HypeUpInput"
import TakePhoto from "../../modules/Smash/TakePhoto"
const HypePost = (props) => {

    const [showCamera, setShowCamera] = useState(false)
    const { challengeId, smashStore } = props;
    const { hypePost } = smashStore;
    const cancel = () => {
        smashStore.hypePost = false;
    }

    const post = () => {
        smashStore.postHypeMessage();
    }
    const openCamera = () => { setShowCamera(true) }

    const dismiss = () => { setShowCamera(false) }

    if (showCamera) {

        return (<TakePhoto dismiss={dismiss} hypePost />)
    }
    return (
        <View flex>
            <Header title="Add Post" btnLeft={<TouchableOpacity onPress={cancel}><Text>Cancel</Text></TouchableOpacity>} btnRight={hypePost?.text ? <TouchableOpacity onPress={post}><Text>Post</Text></TouchableOpacity> : <View><Text style={{ color: '#fff' }}>Post</Text></View>} />
            <HypeUpInput challengeId={challengeId} openCamera={openCamera} />
        </View>
    )
}

export default inject("smashStore", "challengesStore", "challengeArenaStore")(observer(HypePost));
