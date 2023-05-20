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

const RequestPermissions = (props) => {
   const { setHasPermission, setHasAudioPermission, smashStore } = props;
   const { currentUser } = smashStore;

   //    useEffect(() => {
   //       if (currentUser?.inChallenge) {
   //          fetchPermissions();
   //       }
   //    }, [currentUser?.inChallenge]);

   return (
      <Modal
         visible={true}
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
                  <Text secondaryContent center>
                     Something went wrong!
                  </Text>

                  <Text B24 center marginB-16>
                     Oh no!
                  </Text>
                  <Text center secondaryContent>
                     Okay, you'll need to delete and reinstall your SmashApp,
                     then allow Photos and Audio from your phone so you can add
                     photos and videos to your challenges and teams. This can
                     happen sometimes if you accidentally press "Don't Allow".
                     Go ahead and re-install the app.
                  </Text>
                  {/* <ButtonLinear
                     title={'Delete and Re-install'}
                     style={{ marginTop: 0 }}
                     colors={[Colors.buttonLink, Colors.buttonLink]}
                     style={{
                        width: '90%',
                        marginBottom: 0,
                        marginTop: 24,
                     }}
                     onPress={fetchPermissions}
                  /> */}
               </Box>
            </AnimatedView>
         </View>
      </Modal>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
)(observer(RequestPermissions));
