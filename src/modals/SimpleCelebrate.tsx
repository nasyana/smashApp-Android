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
import LinearChartChallengeLast7 from 'components/LinearChartChallengeLast7';
import ChallengeDayTargets from 'components/ChallengeDayTargets';
const SimpleCelebrate = (props) => {
   const { smashStore, challengesStore } = props;

   const {simpleCelebrate } = smashStore;


   const dismiss = () => {
      // itemsToCelebrate.shift();
      Vibrate();
      //   dismissCelebration(simpleCelebrate);
      smashStore.simpleCelebrate = false;
   };

   const runAndDismiss = () => {

      if (simpleCelebrate?.nextFn) {
         simpleCelebrate?.nextFn();
      }

      dismiss();
   };

   // useEffect(() => {
   //    setTimeout(() => {
   //       setLoaded(true);
   //    }, 1000);

   //    return () => {};
   // }, []);

   // if (!loaded || !simpleCelebrate || completion) {
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
      setTimeout(() => {
         simpleCelebrate?.bottomFn();
      }, 700);

      dismiss();
   };

   console.log('render simple celebrate modal');
   return (
      <View>
         <Modal
            visible={simpleCelebrate ? true : false}
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
                        {simpleCelebrate.name}
                     </Text>

                     {/* <EpicBadgeCelebration
                        playerChallenge={getPlayerChallengeData(
                           myChallengesHashFull?.[
                              simpleCelebrate?.playerChallengeId
                           ] || false,
                        )}
                     /> */}


   {simpleCelebrate?.repaired &&  <LottieAnimation
                           autoPlay
                           loop={true}
                           style={{
                              height: 200,
                              zIndex: 0,
                              top: 0,
                              left: 0,
                           }}
                           source={require('../lotties/repair.json')}
                        />}
                     {/* {simpleCelebrate.team && (
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

                     {simpleCelebrate.type == 'personal' && (
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

                     {simpleCelebrate.type == 'teamweek' && (
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
                     <Text B28 center marginT-16 style={{lineHeight: 34}}>
                        {simpleCelebrate.title}
                     </Text>
                     <View paddingH-26>
                     <Text center secondaryContent>
                        {simpleCelebrate.subtitle}
                     </Text>
                     </View>

                     {simpleCelebrate?.repair && !simpleCelebrate?.dayKey &&  <View paddingH-16 paddingT-24><ChallengeDayTargets repair navigation={smashStore.navigation} item={simpleCelebrate.playerChallenge} /></View>}
                     <ButtonLinear
                        title={simpleCelebrate?.button || 'Got it!'}
                        style={{ marginTop: 0 }}
                        colors={
                           simpleCelebrate?.type == 'teamweek'
                              ? [Colors.buttonLink, Colors.buttonLink]
                              : simpleCelebrate?.colors || [
                                   Colors.meToday,
                                   Colors.teamToday,
                                ]
                        }
                        style={{
                           // width: '90%',
                           marginBottom: 0,
                           marginTop: 16,
                        }}
                        full
                        onPress={
                           simpleCelebrate?.nextFn ? runAndDismiss : dismiss
                        }
                     />
                     {simpleCelebrate?.bottomFn && (
                        <ButtonLinear
                           title={
                              simpleCelebrate?.buttonTwoText || 'View Tutorial'
                           }
                           style={{ marginTop: 0 }}
                           bordered
                           colors={
                              simpleCelebrate?.type == 'teamweek'
                                 ? [Colors.buttonLink, Colors.buttonLink]
                                 : simpleCelebrate?.colors || [
                                      Colors.meToday,
                                      Colors.teamToday,
                                   ]
                           }
                           full
                           style={{
                              // width: '90%',
                              marginBottom: 0,
                              marginTop: 8,
                           }}
                           onPress={
                              simpleCelebrate?.bottomFn
                                 ? runAndDismissTwo
                                 : dismiss
                           }
                        />
                     )}
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
)(observer(SimpleCelebrate));
