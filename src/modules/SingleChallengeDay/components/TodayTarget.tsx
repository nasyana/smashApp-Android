import { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../../components/SmartImage/SmartImage';
import Box from '../../../components/Box';
import AnimatedView from '../../../components/AnimatedView';
import { View, Text, Colors } from 'react-native-ui-lib';
import { Feather } from '@expo/vector-icons';
import ButtonLinear from 'components/ButtonLinear';
import { LinearGradient } from 'expo-linear-gradient';
import { getPlayerChallengeData, getPlayerChallengeDayData } from 'helpers/playersDataHelpers';
import { width } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';
import CircularProgressBar from 'components/CircularProgressBar';
import Shimmer from 'components/Shimmer';
import { collection, doc, onSnapshot } from "firebase/firestore";
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
const TodayTarget = ({
   SPACING = 28,
   dayKey = false,
   smashStore,
   playerChallenge = {},
   challengesStore
}) => {
   const [loaded, setLoaded] = useState(false);
   const [expandCard, setExpandCard] = useState(true);
   
   const [playerChallengeDay, setPlayerChallengeDay] = useState(getPlayerChallengeDayData(playerChallenge, dayKey));

 
   useEffect(() => {
      const unsubscribe = onSnapshot(doc(collection(firestore, "playerChallenges"), playerChallenge.id), (doc) => {
        if (doc.exists()) {

         console.log('yep got doc')
          setPlayerChallengeDay(getPlayerChallengeDayData(doc.data(), dayKey));
        } else {
          setPlayerChallengeDay(null);
        }
      });
  
      return () => unsubscribe();
    }, [playerChallenge.id,dayKey]);
   
   const { stringLimit, kFormatter} = smashStore;

      const {selectedDayScore = 0, selectedDayTarget = 0, selectedDayProgress} = playerChallengeDay;


   const remainingInDay = selectedDayScore < selectedDayTarget ? selectedDayTarget - selectedDayScore : 0;

const {myChallengesHashByChallengeId} = challengesStore;
   const overBy = selectedDayScore > selectedDayTarget ? selectedDayScore - selectedDayTarget : 0;
   const playerChallengeData = myChallengesHashByChallengeId?.[playerChallenge.challengeId] ? getPlayerChallengeData(myChallengesHashByChallengeId?.[playerChallenge.challengeId], dayKey) : null;

   // alert(JSON.stringify(playerChallengeData.progress))
   const size = 150;

   const imageSize = 70;
   
   const {daily = {}} = playerChallengeData;





      const day = daily?.[dayKey] || {};

      const repaired = day?.repaired || false;

const progress = selectedDayProgress
   


   console.log('playerChallengeDay today', playerChallengeDay)
   
   const { unit = 'smashes' } = playerChallenge;

   useEffect(() => {
      setTimeout(() => {
         setLoaded(true);
      }, 700);

      return () => {};
   }, []);

   if (!loaded)
      return (
         <Shimmer
            style={{
               marginHorizontal: SPACING,
               marginVertical: SPACING,
               padding: SPACING,
               overflow: 'hidden',
               height: 340,
               borderRadius: 10,
            }}
         />
      );

   const hasColors = playerChallenge?.colorStart && playerChallenge?.colorEnd;

   return (
      <View onPress={() => setExpandCard((prev) => !!prev)}>
         <Box
            style={{
               marginHorizontal: SPACING,
               marginVertical: SPACING / 2,
               padding: SPACING,
               overflow: 'hidden',
            }}>
            {selectedDayProgress >= 100 && (
               <LottieAnimation
                  autoPlay
                  loop={true}
                  style={{
                     height: width,
                     zIndex: 0,
                     top: 0,
                     left: 0,
                     position: 'absolute',
                  }}
                  source={require('../../../lotties/confetti.json')}
               />
            )}
            <View row spread>
               <LinearGradient
                  // Background Linear Gradient
                  start={{ x: 0.1, y: 0.1 }}
                  colors={[
                     'transparent',
                     playerChallenge?.colorStart || '#F62C62',
                     playerChallenge?.colorStart || '#F62C62',
                     playerChallenge?.colorEnd || '#F55A39',
                     playerChallenge?.colorEnd || '#F55A39',
                  ]}
                  style={{
                     height: imageSize - 10,
                     width: imageSize - 10,
                     borderRadius: imageSize / 2,
                     borderRadius: 10,
                     position: 'absolute',
                     opacity: 0.75,
                     left: -5.5,
                     top: -5.5,
                  }}
               />
               <SmartImage
                  uri={playerChallenge?.picture?.uri}
                  preview={playerChallenge?.picture?.preview}
                  style={{
                     height: imageSize - 20,
                     width: imageSize - 20,
                     borderRadius: 10,
                     backgroundColor: '#ccc',
                     marginRight: 8,
                  }}
               />
               <View flex centerV marginL-12>
                  <View row centerV spread>
                     {playerChallenge?.challengeName && (
                        <Text H18>
                           {stringLimit(playerChallenge?.challengeName, 20)}
                        </Text>
                     )}
                  </View>
                  <View row>
                     <View row centerV marginT-2>
                        <Feather
                           name="target"
                           size={14}
                           color={playerChallenge?.colorStart || Colors.blue50}
                        />
                        <Text
                           H12
                           color97
                           marginL-7
                           style={{
                              textTransform: 'uppercase',
                              letterSpacing: 0,
                           }}>
                           {selectedDayScore} / {selectedDayTarget} {unit}{' '}
                           <Text style={{ color: Colors.green30 }}>
                              {overBy > 0 && '(+' + overBy + ')'}
                           </Text>
                        </Text>
                     </View>
                     {/* <View row centerV marginT-2 marginL-8>
                        <Feather name="check" size={14} color={Colors.blue50} />
                        <Text
                           H12
                           color97
                           marginL-7
                           style={{
                              textTransform: 'uppercase',
                              letterSpacing: 0,
                           }}>
                           {dayScore} {unit}
                        </Text>
                     </View> */}
                  </View>
               </View>
            </View>

            {expandCard && (
               <View centerH centerV style={{ paddingTop: SPACING }}>
                  <AnimatedView centerH centerV>
                     <CircularProgressBar
                        fill={selectedDayProgress}
                        overBy={overBy}
                        size={size}
                        showPercent
                        tintColor={
                           selectedDayProgress >= 100
                              ? playerChallenge?.colorEnd
                              : playerChallenge?.colorStart
                        }
                     />
                  </AnimatedView>
                  {/* <Text>{selectedDayProgress}</Text> */}
                  {repaired ? <LottieAnimation
                        autoPlay
                        loop={false}
                        style={{
                           // width: 200,
                           height: 90,
                           zIndex: 99999,
                           top: 5,
                           right: 12,
                           position: 'absolute',
                        }}
                        source={require('../../../lotties/repair.json')}
                     /> : selectedDayProgress >= 100 && (
                     <LottieAnimation
                        autoPlay
                        loop={false}
                        style={{
                           // width: 200,
                           height: 120,
                           zIndex: 99999,
                           top: 5,
                           right: 12,
                           position: 'absolute',
                        }}
                        source={require('../../../lotties/done-excited.json')}
                     />
                  )}

                  {selectedDayProgress == 0 && (
                     <LottieAnimation
                        autoPlay
                        loop={true}
                        style={{
                           // width: 200,
                           height: 130,
                           zIndex: 99999,
                           top: 10,
                           // right: 12,
                           position: 'absolute',
                        }}
                        source={require('../../../lotties/ausleep.json')}
                     />
                  )}
                  {parseInt(remainingInDay) > 0 ? (
                     <ButtonLinear
                        title={`${kFormatter(
                           remainingInDay,
                        )} more needed for Day Goal`}
                        colors={
                           hasColors
                              ? [
                                   playerChallenge?.colorStart,
                                   playerChallenge?.colorEnd,
                                ]
                              : [Colors.blue10, Colors.blue40]
                        }
                        // onPress={smashActivities}
                        style={{
                           marginTop: SPACING,
                           width: '100%',
                        }}
                     />
                  ) : (
                     <ButtonLinear
                        title={'Day Target SMASHED'}
                        colors={
                           hasColors
                              ? [
                                   playerChallenge?.colorStart,
                                   playerChallenge?.colorEnd,
                                ]
                              : [Colors.green30, Colors.green50]
                        }
                        // onPress={smashActivities}
                        style={{
                           marginTop: SPACING,
                           width: '100%',
                        }}
                     />
                  )}
                  {/* <WeeklyDayTargets item={playerChallenge} last7 /> */}
               </View>
            )}
         </Box>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(TodayTarget));
