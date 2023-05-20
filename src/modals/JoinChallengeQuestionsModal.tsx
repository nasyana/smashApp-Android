import { Modal, ScrollView, Alert, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { height, width } from 'config/scaleAccordingToDevice';
import Box from 'components/Box';
import { View, Text, Colors, TouchableOpacity, Assets } from 'react-native-ui-lib';
import ButtonLinear from 'components/ButtonLinear';
import AnimatedView from 'components/AnimatedView';
import { Vibrate } from 'helpers/HapticsHelpers';
import { durationImages } from 'helpers/generalHelpers';
import SmartImage from 'components/SmartImage/SmartImage';
import { moment } from 'helpers/generalHelpers';;

const JoinChallengeQuestionsModal = (props) => {
   const { smashStore, challengesStore } = props;
   const { challengeToJoin, toggleMeInChallenge, myChallenges } = challengesStore;
   const { completion, currentUser, journeySettings = {}, willExceedQuota, showUpgradeModal, freeQuotas, isPremiumMember } = smashStore;
   const { durations = {} } = journeySettings;
   const [selectedDuration, setSelectedDuration] = useState(null);


   const fullChallenge = () => {

      if(!isPremiumMember && willExceedQuota(myChallenges?.length,'challengesQuota')){
         showUpgradeModal(true)

         return 
      }
      const duration = {
         key: 90,
         text: '90 Day',
         subText: '3 DAY SMASH',
         startDate: moment().format('DDMMYYYY'),
         endDate: moment().add(89, 'days').format('DDMMYYYY'),
         icon: Assets.icons.threeDays,
         color: '#FF7F00'
      };

      onSelectDuration(duration);

   }
   const onSelectDuration = (duration) => {
      Vibrate();

      const days = duration.key;

      toggleMeInChallenge(challengeToJoin, currentUser, false, {
         startDate: duration.startDate,
         endDate: duration.endDate,
         duration: duration.key,
      });

      challengesStore.challengeToJoin = null;

      setTimeout(() => {
         smashStore.simpleCelebrate = {
            name: `You joined ${challengeToJoin.name}!`,
            title: `Challenge Begins!`,
            subtitle: `See how many days in a row you can smash your daily ${challengeToJoin.name} goal! 🔥🔥🔥`,
            buttonText: "Let's go!",
            bottomFn: () =>
               (smashStore.tutorialVideo =
                  smashStore?.settings?.tutorials?.challenges?.firstChallenge),
         };
         // smashStore.checkCameraPermissions(true);
      }, 500);
   };

   const dismiss = () => {
      // itemsToCelebrate.shift();
      Vibrate();
      challengesStore.challengeToJoin = null;
      // dismissCelebration(challengeToJoin);
   };

   const showAlert = (message) => {
      Alert.alert('Oops!', message, [

         { text: 'Got It!', onPress: () => console.log('OK Pressed') },
      ]);
   };

   if (!challengeToJoin) { return null }
   const offColor = '#eee'
   return (
      <View>
         <Modal
            visible={challengeToJoin && !completion ? true : false}
            transparent={true}
            animationType="fade"
            style={{
               flex: 1,
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
               {!selectedDuration ? (
                  <AnimatedView>
                     <Box
                        style={{
                           // height: height / 1.7,
                           width: width - 44,
                           height: height - 32,
                           paddingBottom: 32,
                           paddingTop: 0,
                           alignItems: 'center',
                           justifyContent: 'center',
                           paddingHorizontal: 0,
                        }}>
                        <SmartImage
                           uri={challengeToJoin?.picture?.uri}
                           preview={challengeToJoin?.picture?.preview}
                           style={{
                              width: '100%',
                              height: height / 10,
                              backgroundColor: '#fafafa',
                              marginBottom: 16,
                              borderRadius: 0,
                           }}
                        />
                        <ScrollView>
                           <Text B28 center marginT-16> 
                              Badges Available {willExceedQuota(myChallenges?.length,freeQuotas?.challengesQuota ) && 'will exceed'}
                           </Text>


                           <Text M14 marginB-8 center>
                              See how far you can get!
                           </Text>
                           <Text
                              R12
                              center
                              color97
                              style={{ letterSpacing: 2, marginBottom: 16 }}>
                              {challengeToJoin?.name?.toUpperCase() || ''}
                           </Text>

                           <View
                              row
                              style={{
                                 flexWrap: 'wrap',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                              }}>
                              {Object.values(durations).map((duration, index) => {
                                 const challengeDurationsSmashedHash = currentUser?.challengesSmashed?.[challengeToJoin?.id] || {}

                                 const prevDuration = index > 0 ? durations[index - 1] : false;
                                 const hasPassedThisDuration = challengeDurationsSmashedHash?.[duration.key] || false
                                 const hasPassedPreviousDuration = challengeDurationsSmashedHash?.[prevDuration.key] || false
                                 const allowedToDo = true || 
                                    duration.key <= durations[0].key || hasPassedPreviousDuration

                                 const icon = durationImages[index].icon;
                                 const color = durationImages[index].color;
                                 //duration.key <= currentUser?.completedChallengeDurations?.[challengeToJoin.id]
                                 return (
                                    // <ButtonLinear
                                    //    title={duration.text}
                                    //    subTitle={duration.subText}
                                    //    style={{
                                    //       width: '100%',
                                    //       marginBottom: 0,
                                    //       marginTop: 24,
                                    //       // padding: 10,
                                    //    }}
                                    //    styleText={{ fontSize: 20 }}
                                    //    onPress={() => onSelectDuration(duration)}
                                    // />
                                    <View

                                       key={duration.key + index}
                                       onPress={() =>
                                          allowedToDo
                                             ? onSelectDuration(duration)
                                             : showAlert(
                                                'You need to unlock this challenge by completing the previous challenge level.',
                                             )
                                       }
                                       style={{
                                          width: '40%',
                                          borderWidth: 1.5,
                                          borderColor: allowedToDo && false
                                             ? color
                                             : offColor,
                                          margin: 4,
                                          borderRadius: 4,
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          padding: 24,
                                       }}>
                                       <View style={{
                                          backgroundColor: allowedToDo
                                             ? color
                                             : offColor, width: 50, height: 50, borderRadius: 60
                                       }}>
                                          <Image
                                             source={icon}
                                             style={{
                                                height: 50,
                                                width: 50,
                                                position: 'absolute',

                                             }}
                                          />
                                       </View>
                                       <Text
                                          B18
                                          center
                                          marginV-4
                                          style={{
                                             letterSpacing: 0,
                                             color: allowedToDo
                                                ? color
                                                : offColor,
                                          }}>
                                          {duration.duration} DAYS{hasPassedThisDuration && ' ✅'}
                                       </Text>


                                       <Text center R10 secondaryContent>
                                          {duration?.text?.length > 0 && duration?.text?.toUpperCase()}
                                       </Text>
                                    </View>
                                 );
                              })}
                           </View>

                        </ScrollView>



                        <View style={{ width: width, paddingHorizontal: 16, alignItems: 'center' }}><ButtonLinear full title="Let's Go!" onPress={fullChallenge} marginH-16 style={{ width: width - 98 }} /></View>
                        <TouchableOpacity
                           onPress={dismiss}
                           style={{ marginTop: 8, }}>
                           <Text secondaryContent style={{ color: Colors.red40 }}>Cancel Join Challenge</Text>
                        </TouchableOpacity>
                     </Box>
                  </AnimatedView>
               ) : (
                     <AnimatedView key="tik">
                        <Box
                           style={{
                              height: height / 3,
                              width: width - 32,
                              paddingVertical: 32,
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: 40,
                           }}>
                           <Text H18 center color97>
                              {challengeToJoin?.name || ''}
                           </Text>
                           <Text H3H fheavy center>
                              Great!
                           </Text>
                           {!selectedDuration?.notStarted && (
                              <Text H3H fheavy center smashPink>
                                 {`${selectedDuration.days} days!`}
                              </Text>
                           )}
                           <Text R18 color97 center>
                              {selectedDuration?.notStarted
                                 ? "We'll keep you accountable when your challenge starts"
                                 : `We'll try to keep you accountable for the next ${selectedDuration.days} days!`}
                           </Text>

                           <ButtonLinear
                              title={'LETS GO'}
                              style={{
                                 width: '100%',
                                 marginBottom: 0,
                                 marginTop: 24,
                              }}
                              styleText={{ fontSize: 20 }}
                              onPress={() => {
                                 setSelectedDuration(null);
                                 challengesStore.challengeToJoin = null;
                              }}
                           />
                        </Box>
                     </AnimatedView>
               )}
            </View>
         </Modal>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(JoinChallengeQuestionsModal));
