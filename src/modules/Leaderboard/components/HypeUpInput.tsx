import { useNavigation } from "@react-navigation/native";
import { FONTS } from "config/FoundationConfig";
import React, { ReactNode, useCallback, useRef, useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    Platform,
    Image
} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { View, Colors, Text, Assets, Button, Avatar, LoaderScreen } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
import AnimatedView from "components/AnimatedView";
import SmartImage from "../../../components/SmartImage/SmartImage";
import Header from "../../../components/Header";
import * as ImagePicker from 'expo-image-picker';
const HypeUpInput = (props) => {
    const [picture, setPicture] = useState(false)
    const { navigate } = useNavigation();
    const textRef = useRef(null)
    const { smashStore, challengesStore, challengeId } = props;
    const { capturedPicture, smashEffects, hypePost, imageUploading } = smashStore;
    const { playerChallengeHashByChallengeId } = challengesStore;
    const value = hypePost?.text || '';

    const playerChallenge = challengeId ? playerChallengeHashByChallengeId[challengeId] : false;

    const onChangeText = (value) => {

        if (challengeId) { 

            smashStore.setHypePost({ text: value, challengeIds: [challengeId] || false })
        } else {

            smashStore.setHypePost({ text: value, challengeIds: false })
        }

    }

    const onClearText = () => {
        smashStore.hypePost = { text: '' };
        textRef.current.blur()
    }

    const goToCamera = async () => {

        // navigate('TakePhoto', { hypePost: true });
        props.openCamera()

    }

    const onPressLibrary = async () => {

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: Platform.OS === 'ios' ? false : false,
            aspect: [4, 3],
            durationLimit: 60,
            mediaTypes: Platform.OS === 'ios' ? ImagePicker.MediaTypeOptions.All : ImagePicker.MediaTypeOptions.Images
        });


        const picture = await smashStore.uploadImage(result)
        smashStore.setHypePost({ picture })
    }
    const camContainerStyle = { margin: 16, height: 80, width: 80, backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#eee', alignItems: 'center', justifyContent: 'center' }
    return (
        <View style={{
            borderWidth: 1,
            borderColor: Colors.line,
        }}>

            {playerChallenge ?
                <View><Text color6D center style={{ backgroundColor: '#fafafa', padding: 8 }}>{playerChallenge.challengeName.toUpperCase()}</Text></View>
                :
                <View><Text color6D center style={{ backgroundColor: '#fafafa', padding: 8 }}>Post To Your Followers</Text></View>}
        <TouchableWithoutFeedback
            onPress={() => textRef.current && textRef.current.focus()}
        >
            <View
                // height={74}
                row
                paddingH-16
                paddingV-11
                style={{

                    borderRadius: 4,

                    backgroundColor: Colors.white,
                }}
            >
                    {/* <Image source={Assets.icons.ic_search_16} /> */}


                <TextInput
                    ref={textRef}
                    style={{
                        fontSize: 16,
                        fontFamily: FONTS.heavy,
                        marginLeft: 0,
                        color: Colors.color28,
                        flex: 1,
                        height: 70
                    }}
                        multiline
                    onFocus={() => {
                        smashEffects();

                    }}
                    // onFocus={() => props.toggleFindChallenge(true)}
                    placeholder={props.placeholder || 'Hype up the team...'}
                    placeholderTextColor={Colors.color6D}
                    value={value}
                    onChangeText={onChangeText}
                    underlineColorAndroid={'transparent'}
                />

                <TouchableOpacity
                    onPress={onClearText}
                        style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}
                    ><AntDesign name={'close'} size={20} color={Colors.grey50} />
                </TouchableOpacity>

            </View>
        </TouchableWithoutFeedback>
            {capturedPicture?.uri ?

                <TouchableOpacity onPress={goToCamera}>
                    {/* <Image
        source={{ uri: hypePost?.picture?.uri }}
        style={{ height: 70, width: 70 }}
    /> */}
                    <Image
                        source={{ uri: capturedPicture.uri }}
                        style={{ ...camContainerStyle }}
                    />
                    {/* <SmartImage uri={hypePost.picture?.uri} preview={hypePost.picture?.preview} style={{ ...camContainerStyle }} /> */}
                    {/* {imageUploading && <LoaderScreen color={Colors.buttonLink} overlay />} */}
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={goToCamera} style={{ ...camContainerStyle }}><AntDesign name={'camera'} size={40} color={Colors.grey20} /></TouchableOpacity>
            }
        </View>
    )


}

export default inject("smashStore", "challengesStore", "challengeArenaStore")(observer(HypeUpInput));