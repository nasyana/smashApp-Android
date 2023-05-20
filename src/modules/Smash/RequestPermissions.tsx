import React, { useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';

import {
   StyleSheet,
   TouchableOpacity,
   TouchableWithoutFeedback,
   PanResponder,
   Dimensions,
   Platform,
   Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Camera } from 'expo-camera';
import { Assets, Image, Colors, View, Text } from 'react-native-ui-lib';
import { Feather as Icon } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { LinearGradient } from 'expo-linear-gradient';
import FlashIcon from './components/FlashIcon';
import Routes from 'config/Routes';
import FinalScreen from './FinalScreen';
import Header from 'components/Header';
import AnimatedView from 'components/AnimatedView';
import { width, height } from 'config/scaleAccordingToDevice';
/* component camera */
import Box from 'components/Box';
import ButtonLinear from 'components/ButtonLinear';
import CameraRatio from './CameraWithRatio';
import { scale } from 'helpers/scale';
import TakeVideoHype from './TakeVideoHype';
import { FONTS } from 'config/FoundationConfig';
import NoPermissions from './NoPermissions';
import Firebase from 'config/Firebase';
const RequestPermissions = (props) => {
   const {
      setHasPermission,
      setHasAudioPermission,
      smashStore,
      hasPermission,
      hasAudioPermission,
   } = props;
   const { currentUser, simpleCelebrate } = smashStore;

   const [reqPermissions, setReqPermissions] = useState(false);
   const [fullCameraStatus, setFullCameraStatus] = useState(false);
   const [fullCameraAudioStatus, setFullCameraAudioStatus] = useState(false);
   const fetchPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setFullCameraStatus(status);
      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');
      setFullCameraAudioStatus(audioStatus?.status);

      if (audioStatus.status === 'granted' && status === 'granted') {
         smashStore.gotPermissions = true;
      }
   };

   // useEffect(() => {
   //    fetchPermissions();

   //    return () => {};
   // }, []);

   //    useEffect(() => {
   //       if (currentUser?.inChallenge) {
   //          fetchPermissions();
   //       }
   //    }, [currentUser?.inChallenge]);
   // console.warn(fullCameraAudioStatus);

   if (
      (fullCameraStatus == 'denied' || fullCameraAudioStatus == 'denied') &&
      !simpleCelebrate
   ) {
      return (
         <NoPermissions
            setHasPermission={setHasPermission}
            setHasAudioPermission={setHasAudioPermission}
         />
      );
   }

   return (
      <Modal
         visible={!fullCameraStatus || !fullCameraAudioStatus}
         transparent={true}
         animationType="fade"
         style={{
            alignItems: 'center',
            justifyContent: 'center',
         }}>
         <View
            style={{
               backgroundColor: 'rgba(0,0,0,0.7)',
               position: 'absolute',
               height,
               width,
               justifyContent: 'center',
               alignItems: 'center',
            }}>
            <AnimatedView>
               <Box
                  style={{
                     // height: height / 1.7,
                     width: width - 32,
                     paddingVertical: 32,
                     alignItems: 'center',
                     justifyContent: 'center',
                     paddingHorizontal: 40,
                  }}>
                  {/* <EpicBadgeCelebration
                        playerChallenge={getPlayerChallengeData(
                           myChallengesHashFull?.[
                              itemToCelebrate?.playerChallengeId
                           ] || false,
                        )}
                     /> */}

                  <Text B24 center marginB-16>
                     Welcome to SmashApp! Let us help you play...
                  </Text>
                  <Text secondaryContent center marginB-16>
                     We need some permissions!
                  </Text>
                  <Text center secondaryContent marginB-16>
                     On the next step you will need to allow SmashApp to use
                     your camera and audio to record videos and take photos when
                     you smash activities...
                  </Text>

                  <ButtonLinear
                     title={"Yep! Let's go"}
                     style={{ marginTop: 0 }}
                     colors={[Colors.buttonLink, Colors.buttonLink]}
                     style={{
                        width: '90%',
                        marginBottom: 0,
                        marginTop: 24,
                     }}
                     onPress={fetchPermissions}
                  />
               </Box>
            </AnimatedView>
         </View>
      </Modal>
   );
};;;

export default inject(
   'smashStore',
   'challengesStore',
)(observer(RequestPermissions));
