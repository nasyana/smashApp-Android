import { Alert, Image, Modal, PixelRatio } from 'react-native';
import { useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { height, width } from 'config/scaleAccordingToDevice';
import Box from 'components/Box';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import LottieAnimation from 'components/LottieAnimation';
import ButtonLinear from 'components/ButtonLinear';
import { dismissCelebration } from 'helpers/CelebrationHelpers';
import AnimatedView from 'components/AnimatedView';
import { Vibrate } from 'helpers/HapticsHelpers';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

import { AntDesign } from '@expo/vector-icons';
import Last7BadgeTargets from 'components/Last7BadgeTargets';
import { durationImages } from 'helpers/generalHelpers';
import { moment } from 'helpers/generalHelpers';

const debug = false;
const debugOngoingStreak = 30
const debugCelebrationDoc = {
   active: true,
   id: `123`,
   name: 'Epic Challenge',
   title: `Congratulations! You smashed Day 30!`,
   subtitle: `Plus you earned a Streak Repair!`,
   type: "challengeStreak",
   uid: '123',
   timestamp: parseInt(Date.now() / 1000),
   streak: 30,
   unlock: true,
   monthKey: moment().format('MMYYYY'),
};

if (debugOngoingStreak === 30) {
   debugCelebrationDoc.title += " Plus You've unlocked Expert Level!";
   debugCelebrationDoc.subtitle += " We've stored your streak repair & your Expert Level badge on your Profile!";
   debugCelebrationDoc.unlock = true;
} else if (debugOngoingStreak === 40) {
   debugCelebrationDoc.title += " Plus You've unlocked Guru Level!";
   debugCelebrationDoc.subtitle += " We've stored your streak repair & your Guru Level badge on your Profile!";
   debugCelebrationDoc.unlock = true;
}


const CelebrateModal = (props) => {

   const ref = useRef();

   const { smashStore, challengesStore } = props;

   const { myCelebrations, itemToCelebrate: _itemToCelebrate } = smashStore;
   // let itemToCelebrate = myCelebrations?.[0] || false;

   const { playerChallengeHashByChallengeId, myChallengesFull } = challengesStore;

   const playerChallenge = debug ? myChallengesFull[6] : playerChallengeHashByChallengeId?.[itemToCelebrate?.challengeId] || false;

   const itemToCelebrate = debug ? debugCelebrationDoc : _itemToCelebrate  || false;
   // if (debug) { itemToCelebrate = debugCelebrationDoc }

   const dismiss = () => {
      // itemsToCelebrate.shift();
      // alert('aa')
      Vibrate();
      dismissCelebration(itemToCelebrate);
      if (myCelebrations.length == 1) {
         smashStore.myCelebrations = []
      }
   };


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


            Alert.alert('Streak Saved!', "You've saved the streak image to your photo library. Share it to motivate your freinds & family!", [
               { text: 'Got It!', onPress: () => setDownloadingAchievement(false) },
            ]);

         })


      }, 500);



   }
   console.log('render CelebrateModal');
   const icon = require('../../assets/images/icon.png')
   const dark = itemToCelebrate.type == 'challengeStreak';
   return (
      <View >




         <Modal
            visible={itemToCelebrate ? true : false}
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
                  <View ref={ref}>
                     <Box

                        style={{
                           // height: height / 1.7,
                           width: width - 32,
                           paddingTop: 32,
                           paddingBottom: 24,
                           alignItems: 'center',
                           justifyContent: 'center',
                           paddingHorizontal: 24,
                           backgroundColor: dark ? Colors.grey80 : '#fff'
                        }}>
                        <Text center B14  >
                           {itemToCelebrate?.name?.toUpperCase()} {itemToCelebrate?.type == 'challengeStreak' && '(' + moment(itemToCelebrate?.monthKey, 'MMYYYY').format('MMM')?.toUpperCase() + ')'}
                        </Text>

                        {itemToCelebrate.team && (
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

                        {/* {itemToCelebrate.type == 'challengeStreak' && (
                           <LottieAnimation
                              autoPlay
                              loop={true}
                              style={{
                                 height: 60,
                                 zIndex: 0,
                                 top: 4,
                                 left: 4,
                                 position: 'absolute',

                              }}
                              source={require('lotties/new/loader.json')}
                           />
                        )} */}



                        {itemToCelebrate.type == 'teamweek' || itemToCelebrate.type == 'challengeStreak' && (
                           <LottieAnimation
                              autoPlay
                              loop={false}
                              style={{
                                 height: 170,
                                 zIndex: 0,
                                 top: itemToCelebrate?.unlock ? 0 : -5,
                                 left: 0,
                              }}
                              source={itemToCelebrate?.unlock ? require('lotties/unlocked.json') : require('lotties/67230-trophy-winner.json')}
                           />
                        )}
                        <Text B24 center marginB-0 >
                           {itemToCelebrate.title}
                        </Text>
                        <Text center secondaryContent >
                           {/* {itemToCelebrate.subtitle} */}

                           {itemToCelebrate?.streak} Day Win Streak!

                        </Text>



                        {downloadingAchievement && <View marginT-0 />}
                        {playerChallenge && dark && <View marginT-16>
                           <Last7BadgeTargets item={playerChallenge} />
                        </View>}

                        {!downloadingAchievement && !dark && <ButtonLinear
                           full
                           title={itemToCelebrate.type == 'challengeStreak' ? (downloadingAchievement || debug) ? '#SMASHAPPCHALLENGES' : 'Back to Challenge' : 'Dismiss'}
                           // style={{ marginTop: 0, marginHorizontal: 0 }}
                           colors={
                              itemToCelebrate?.type == 'teamweek'
                                 ? [Colors.buttonLink, Colors.buttonLink]
                                 : itemToCelebrate?.colors || [
                                    Colors.smashPink,
                                    Colors.buttonLink,
                                 ]
                           }
                           style={{
                              // width: '90%',
                              marginBottom: 0,
                              marginTop: 8,
                              marginHorizontal: 0
                           }}
                           onPress={dismiss}
                        />}

                        {itemToCelebrate.type == 'challengeStreak' && (<View
                           marginH-4
                           centerV
                           backgroundColor={
                              durationImages.find((b) => b.key === itemToCelebrate?.streak).color
                           }
                           style={{
                              zIndex: 0,
                              top: 16 || height / 7,
                              left: 16 || width / 4,
                              position: 'absolute',
                              width: 40,
                              height: 40,
                              borderRadius: 60,
                              justifyContent: 'center',
                              alignItems: 'center',
                           }}>
                           <Image
                              source={
                                 durationImages.find((b) => b.key === itemToCelebrate?.streak)
                                    .icon
                              }
                              style={{
                                 height: 30,
                                 width: 30,
                                 position: 'absolute',
                              }}
                           />
                        </View>)}

                        <View row center style={{ width: '100%', marginTop: 16 }}><Image source={icon} style={{
                           height: 20,
                           width: 20,
                           marginRight: 8,
                           borderRadius: 8,
                        }} /><Text R14>SmashApp Challenges</Text></View>

                        {!downloadingAchievement && <View row spread marginT-16 center style={{ position: 'absolute', top: 0, right: 0 }}>
                           <TouchableOpacity onPress={dismiss} spread center row style={{ padding: 4, paddingHorizontal: 16, borderWidth: 0, borderRadius: 16, margin: 4, backgroundColor: Colors.grey80 }} ><AntDesign name="close" size={25} style={{ marginRight: 4, color: '#333' }} /></TouchableOpacity></View>}



                        {dark && !downloadingAchievement && <View row spread marginT-16 center style={{ position: 'absolute', bottom: 16, right: 4 }}>
                           <TouchableOpacity onPress={downloadAndShare} spread center row style={{ padding: 4, paddingHorizontal: 16, borderWidth: 0, borderRadius: 16, margin: 4, backgroundColor: Colors.grey80 }} ><AntDesign name="download" size={25} style={{ marginRight: 4, color: '#333' }} /></TouchableOpacity>
                        </View>}

                     </Box>
                  </View>
               </AnimatedView>
            </View>
         </Modal>
      </View>
   );
};;

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(CelebrateModal));

