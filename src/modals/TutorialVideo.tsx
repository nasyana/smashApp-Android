import { Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import DoneDialog from '../nav/DoneDialog';
import { inject, observer } from 'mobx-react';
import UniversalLoader from 'components/UniversalLoader';
import VotingDialog from 'modules/TeamArena/VotingDialog';
import { height, width } from 'config/scaleAccordingToDevice';
import Box from 'components/Box';
import { View, Text, Colors,TouchableOpacity } from 'react-native-ui-lib';
import LottieAnimation from 'components/LottieAnimation';
import ButtonLinear from 'components/ButtonLinear';
import { dismissCelebration } from 'helpers/CelebrationHelpers';
import AnimatedView from 'components/AnimatedView';
import { Vibrate } from 'helpers/HapticsHelpers';
import EpicBadgeCelebration from 'components/EpicBadgeCelebration';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { Video } from 'expo-av';
import SmartVideo from 'components/SmartImage/SmartVideo';
const TutorialVideo = (props) => {
   const { smashStore, challengesStore } = props;

   const { completion, tutorialVideo } = smashStore;


   const dismiss = () => {
      // itemsToCelebrate.shift();
      Vibrate();
      //   dismissCelebration(itemToCelebrate);
      smashStore.tutorialVideo = false;
   };

   const runAndDismiss = () => {
      dismiss();
      if (tutorialVideo?.nextFn) {
         tutorialVideo?.nextFn();
      }
   };

   // useEffect(() => {
   //    setTimeout(() => {
   //       setLoaded(true);
   //    }, 1000);

   //    return () => {};
   // }, []);

   // if (!loaded || !itemToCelebrate || completion) {
   //    return (
   //       <View
   //          style={{
   //             backgroundColor: 'rgba(0,0,0,0.7)',
   //             position: 'absolute',
   //             height,
   //             width,
   //             justifyContent: 'center',
   //             alignItems: 'center',
   //          }}
   //       />
   //    );
   // }
   return (
      <View>
         <Modal
            visible={tutorialVideo && !completion ? true : false}
            transparent={true}
            animationType="fade"
            style={{
               alignItems: 'center',
               justifyContent: 'center',
            }}>
            <View
               style={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  position: 'absolute',
                  height,
                  width,
                  justifyContent: 'center',
                  alignItems: 'center',
               }}>
               <AnimatedView style={{ backgroundColor: 'transparent' }}>
                  {tutorialVideo.showVid ? (
                     <Text center white B18>
                        Sound On! 🔊
                     </Text>
                  ) : (
                     <Text center white B18 style={{ fontSize: 60 }}>
                        ✅
                     </Text>
                  )}
                  <TouchableOpacity
                     style={{
                        paddingVertical: 8,
                        paddingHorizontal: 0,
                        width: tutorialVideo?.showVideo
                           ? width - width / 5
                           : 'auto',
                     }}>
                     <Text center white B22>
                        {tutorialVideo?.title || 'Learn About This Screen'}{' '}
                     </Text>
                  </TouchableOpacity>

                  <View style={{ backgroundColor: '#000' }}>
                     {tutorialVideo.showVid ? (
                        <SmartVideo
                           audio
                           source={{
                              uri: tutorialVideo.video || '',
                           }}
                           uri={tutorialVideo.video}
                           key={tutorialVideo.video}
                           isBackground
                           rate={1.0}
                           volume={1.0}
                           isMuted={false}
                           resizeMode="cover"
                           shouldPlay={true}
                           isLooping={false}
                           useNativeControls={true}
                           style={{
                              width: width - width / 5,
                              height: height - height / 4,
                              top: 0,
                              // background: '#000',
                              left: 0,
                           }}
                        />
                     ) : (
                        <Text B14 white center>
                           {tutorialVideo.text}
                        </Text>
                     )}
                  </View>
               </AnimatedView>

               <TouchableOpacity
                  onPress={() => (smashStore.tutorialVideo = false)}
                  marginT-8
                  style={{
                     backgroundColor: Colors.smashPink,
                     borderRadius: 20,
                     padding: 8,
                     paddingHorizontal: 16,
                     top: tutorialVideo.showVid ? -24 : 16,
                  }}>
                  <Text white B18>
                     Okay, Got it!
                  </Text>
               </TouchableOpacity>
            </View>
         </Modal>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TutorialVideo));
