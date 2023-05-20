import { Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import DoneDialog from '../nav/DoneDialog';
import { inject, observer } from 'mobx-react';
import UniversalLoader from 'components/UniversalLoader';
import VotingDialog from 'modules/TeamArena/VotingDialog';
import { height, width } from 'config/scaleAccordingToDevice';
import Box from 'components/Box';
import { View, Text, Colors } from 'react-native-ui-lib';
import LottieAnimation from 'components/LottieAnimation';
import ButtonLinear from 'components/ButtonLinear';
import { dismissCelebration } from 'helpers/CelebrationHelpers';
import AnimatedView from 'components/AnimatedView';
import { Vibrate } from 'helpers/HapticsHelpers';
import EpicBadgeCelebration from 'components/EpicBadgeCelebration';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
const UpgradeModal = (props) => {
   const { smashStore, challengesStore } = props;

   const { completion, simpleCelebrate } = smashStore;
   const itemToCelebrate = {title: 'please upgrade', name: 'something', subtitle: 'Upgrade to premium to get a bunch of good stuff. You can upgrade on your profile screen'}

   const dismiss = () => {
      // itemsToCelebrate.shift();
      Vibrate();
      //   dismissCelebration(itemToCelebrate);
      smashStore.showUpgradeModal(false);
   };

   const runAndDismiss = () => {

      

      dismiss();
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

   const runAndDismissTwo = () => {


      dismiss();
   };
   return (
      <View>
         <Modal
            visible={smashStore.upgradeModal ? true : false}
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
                        paddingHorizontal: 24,
                     }}>
                     <Text secondaryContent center>
                        {itemToCelebrate.name}
                     </Text>

                     {/* <EpicBadgeCelebration
                        playerChallenge={getPlayerChallengeData(
                           myChallengesHashFull?.[
                              itemToCelebrate?.playerChallengeId
                           ] || false,
                        )}
                     /> */}

                     {/* {itemToCelebrate.team && (
                        <LottieAnimation
                           autoPlay
                           loop={false}
                           style={{
                              height: 200,
                              zIndex: 0,
                              top: 0,
                              left: 0,
                           }}
                           source={require('lotties/celebration9.json')}
                        />
                     )}

                     {itemToCelebrate.type == 'personal' && (
                        <LottieAnimation
                           autoPlay
                           loop={false}
                           style={{
                              height: 200,
                              zIndex: 0,
                              top: 0,
                              left: 0,
                           }}
                           source={require('lotties/celebration10.json')}
                        />
                     )}

                     {itemToCelebrate.type == 'teamweek' && (
                        <LottieAnimation
                           autoPlay
                           loop={false}
                           style={{
                              height: 200,
                              zIndex: 0,
                              top: 0,
                              left: 0,
                           }}
                           source={require('lotties/new/rocket2.json')}
                        />
                     )} */}
                     <Text B28 center marginB-16>
                        {itemToCelebrate.title}
                     </Text>
                     <Text center secondaryContent>
                        {itemToCelebrate.subtitle}
                     </Text>
                     <ButtonLinear
                        title={'Got it!'}
                        style={{ marginTop: 0 }}
                      
                        style={{
                           // width: '90%',
                           marginBottom: 0,
                           marginTop: 24,
                        }}
                        full
                        onPress={
                          dismiss
                        }
                     />
                
                  </Box>
               </AnimatedView>
            </View>
         </Modal>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(UpgradeModal));
