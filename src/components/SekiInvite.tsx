import { useState, useEffect, useRef } from 'react';

import {
    Alert,
    Image,
    PixelRatio
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { View, Text, Colors, Assets, TouchableOpacity } from 'react-native-ui-lib';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import AnimatedView from 'components/AnimatedView';
import SekiInviteHeader from './SekiInviteHeader';
import SekiInviteMainTitle from './SekiInviteMainTitle';
import SekiInviteJoinMe from './SekiInviteJoinMe';
import SekiInviteActivityList from './SekiInviteActivityList';
import * as MediaLibrary from 'expo-media-library';
import SmartImage from 'components/SmartImage/SmartImage';
const ShareSekiInviteModal = ({ challengesStore }) => {
    const ref = useRef();

    const { setGoalToShare, goalToShare, challengesHash } = challengesStore;
    const dismiss = () => {
        setGoalToShare(false)
    }
    const [loading, setLoading] = useState(false);
    console.log('goalToShare?.picture', goalToShare?.picture)
    useEffect(() => {

        setTimeout(() => {
            setLoading(false)
        }, 900);

        return () => {

        }
    }, [])

    const [downloadingAchievement, setDownloadingAchievement] = useState(false);

    const downloadAndShare = async () => {

        setDownloadingAchievement(true);

        setTimeout(async () => {


            const targetPixelCount = 1080; // If you want full HD pictures
            const pixelRatio = PixelRatio.get(); // The pixel ratio of the device
            // pixels * pixelratio = targetPixelCount, so pixels = targetPixelCount / pixelRatio
            const pixels = targetPixelCount / pixelRatio;

            const captureResult = await captureRef(ref, {
                result: 'tmpfile',
                // height: pixels,
                // width: pixels,
                quality: 1,
                format: 'png',
            });





            MediaLibrary.saveToLibraryAsync(captureResult).then((result) => {


                const message = goalToShare?.allowOthersToHelp ? "Share the invite to your social media so your friends can come and help to reach the target as a team!" : "Share the invite to your social media so your friends can join you!";
                Alert.alert('Invite Saved to your Photo Library!', message, [
                    { text: 'Got It!', onPress: () => setDownloadingAchievement(false) },
                ]);

            })


        }, 500);

    }

    const largeGoal = goalToShare?.masterIds?.length > 1;
    // if(loading){

    //     return (
    //         <View flex backgroundColor={Colors.grey10} center style={{paddingHorizontal: width / 7}}>
    //             <Image source={Assets.bg.shareBg} style={{position: 'absolute', width, height}} />

    //             <View padding-40><Text B22 center white>Share to your Insta or FB Story</Text></View>

    // </View>
    //     )
    // }

    // create a rotated View
    // <View style={{transform: [{ rotate: '90deg'}]}} />
    const imageHeight = 200;

    return (
        <View flex center style={{ paddingHorizontal: width / 7 }} ref={ref}>
            <Image source={Assets.bg.shareBg} style={{ position: 'absolute', width, height }} />
            <SmartImage uri={challengesHash?.[goalToShare?.challengeId]?.picture?.uri} preview={challengesHash?.picture?.[goalToShare?.challengeId]?.preview} style={{ position: 'absolute', width, height: imageHeight, top: 0 }} />
            {/* <View style={{position: 'absolute', top: imageHeight / 2, backgroundColor: '#1C1C1C', padding: 4, paddingHorizontal: 8}}>
            <Text grey50 R12 center>{challengesHash?.[goalToShare?.challengeId]?.name?.toUpperCase()} 🚀🚀</Text>
            </View> */}
            <View style={{ width: width + 70, height: 100, transform: [{ rotate: '-5deg' }], position: 'absolute', top: largeGoal ? imageHeight - 50 : imageHeight - 20, backgroundColor: '#1C1C1C', }} />
            
            {loading && <View padding-16><Text B22 center white>Screenshot & Share to your Insta or FB Story to promote your goal.</Text></View>}
            
            {!loading && <AnimatedView>
                <View center>
                    <SekiInviteHeader />
                    <SekiInviteMainTitle />
                    <SekiInviteJoinMe />
                    <SekiInviteActivityList />
                    
                </View>
            </AnimatedView>}
            <View row spread style={{ position: 'absolute', top: 40, left: 0, width }}>
                <View />
                <TouchableOpacity padding-16 onPress={dismiss}><Entypo name="cross" size={40} color="#fff" /></TouchableOpacity>
            </View>

            {!downloadingAchievement && <View marginT-32 center >
                <TouchableOpacity onPress={downloadAndShare} spread center row style={{ padding: 4, paddingHorizontal: 16, borderWidth: 0, borderRadius: 16, margin: 4, backgroundColor: Colors.grey80 }} ><Text B16><AntDesign name="download" size={24} style={{ marginRight: 4, color: '#333' }} /> Download to Share</Text></TouchableOpacity>
            </View>}
            <View style={{position: 'absolute', bottom: 54, backgroundColor: Colors.darkBg}}><Text R14 white>Search Smashapp Challenges on the App Store</Text></View>
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ShareSekiInviteModal));