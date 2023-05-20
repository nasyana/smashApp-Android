import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from 'components/SmartImage/SmartImage';
import Box from 'components/Box';
import AnimatedView from 'components/AnimatedView';
import {
   View,
   Text,
   Colors,
   TouchableOpacity,
   ProgressBar,
} from 'react-native-ui-lib';
import { AntDesign, Feather } from '@expo/vector-icons';
import ButtonLinear from 'components/ButtonLinear';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { GradientCircularProgress } from 'react-native-circular-gradient-progress';
import Animated from 'react-native-reanimated';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { moment } from 'helpers/generalHelpers';;
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core';
import { width } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';
import CircularProgressBar from 'components/CircularProgressBar';
import WeeklyDayTargets from 'components/WeeklyDayTargets';
import Shimmer from 'components/Shimmer';
import RecentChallengeSmashes from 'components/RecentChallengeSmashes';
import SectionHeader from 'components/SectionHeader';
import EpicBadge from 'components/EpicBadge';

function PercentageBadge(props) {
   const {
      playerChallenge,
      todayProgress,
      remainingToday,
      selectedTodayScore,
      selectedTodayTarget,
   } = props;
   return (
      <AnimatedView row spread>
         <LinearGradient // Background Linear Gradient
            start={{
               x: 0.1,
               y: 0.1,
            }}
            colors={[
               // 'transparent',
               playerChallenge?.colorStart || '#F62C62',
               playerChallenge?.colorStart || '#F62C62',
               playerChallenge?.colorEnd || '#F55A39',
               playerChallenge?.colorEnd || '#F55A39',
            ]}
            style={{
               height: props.imageSize - 10,
               width: props.imageSize - 10,
               borderRadius: props.imageSize / 2,
               borderRadius: 10,
               position: 'absolute',
               opacity: 0.75,
               left: -5.5,
               top: -5.5,
            }}
         />

         <View
            style={{
               height: props.imageSize - 20,
               width: props.imageSize - 20,
               borderRadius: 10,
               // backgroundColor: '#ccc',
               marginRight: 8,
               alignItems: 'center',
               justifyContent: 'center',
            }}>
            {(!props.hasProgress || todayProgress > 100) && (
               <LottieAnimation
                  autoPlay
                  loop={false}
                  style={{
                     // width: 200,
                     height: 120,
                     zIndex: 99999,
                     top: 5, // right: 12,
                     // position: 'absolute',
                  }}
                  source={require('lotties/done-excited.json')}
               />
            )}
            <Text
               white
               B18
               style={{
                  fontSize: todayProgress < 0 ? 18 : 18,
               }}>
               {todayProgress >= 0 ? todayProgress + '%' : '✅'}
            </Text>
         </View>

         <View
            flex
            centerV
            marginL-12={!props.challengeWon}
            marginL-40={props.challengeWon}>
            <View row centerV spread>
               {parseInt(remainingToday) > 0 ? (
                  <Text H16>
                     {`${props.kFormatter(
                        remainingToday,
                     )} left for today's goal`}{' '}
                  </Text>
               ) : (
                  <Text H16>Today's Target is SMASHED</Text>
               )}
            </View>
            {/* <View marginV-8>
               <ProgressBar
                  progress={props.checkInfinity(todayProgress)}
                  progressColor={props.accentColor}
               />
            </View> */}
            <View row>
               <View row centerV marginT-2>
                  {props.hasProgress && (
                     <Feather
                        name="target"
                        size={14}
                        color={playerChallenge?.colorStart || Colors.blue50}
                     />
                  )}
                  {!props.hasProgress && <Text>Challenge Smashed!</Text>}
                  {/* {challengeNotStartedYet && <Text>Not Started</Text>} */}
                  <Text
                     H14
                     color97
                     marginL-7
                     style={{
                        textTransform: 'uppercase',
                        letterSpacing: 0,
                        fontSize: props.expandCard ? 14 : 14,
                     }}>
                     {props.hasProgress && (
                        <Text>
                           {selectedTodayScore} / {selectedTodayTarget}{' '}
                           {props.unit}{' '}
                        </Text>
                     )}
                     <Text
                        style={{
                           color: Colors.green30,
                        }}>
                        {props.overBy > 0 && '+' + props.overBy + ' '}
                        {todayProgress > 100
                           ? '(' + todayProgress + '%)'
                           : null}
                     </Text>
                  </Text>
               </View>
            </View>
         </View>
      </AnimatedView>
   );
}

const TodayChallengeGoal = ({
   SPACING = 24,
   playerChallenge = {},
   smashStore,
}) => {
   const [loaded, setLoaded] = useState(true);
   const { unit = 'Points' } = playerChallenge;
   
   const playerChallengeData = getPlayerChallengeData(playerChallenge);

   const {
      kFormatter,
      setMasterIdsToSmash
   } = smashStore;
   const {
      todayProgress = 0,
      selectedTodayTarget = 0,
      selectedTodayScore = 0,
      challengeNotStartedYet,
   } = playerChallengeData;


   const challengeWon = selectedTodayScore > selectedTodayTarget;


  
   useEffect(() => {
      setTimeout(() => {
         setLoaded(true);
      }, 500);

      return () => { };
   }, []);

   if (!loaded)
      return (
         <Shimmer
            style={{
               marginHorizontal: SPACING,
               marginVertical: SPACING / 2,
               padding: SPACING,
               overflow: 'hidden',
               height: 95,
               borderRadius: 10,
            }}
         />
      );
      
   if (challengeNotStartedYet) {
      return (
         <View onPress={() => setExpandCard((prev) => !prev)}>
            <Box
               style={{
                  //    marginHorizontal: SPACING,
                  //    marginTop: SPACING / 3,
                  padding: SPACING,
                  overflow: 'hidden',
               }}>
               <Text secondaryContent>Challenge Not Started Yet</Text>
            </Box>
         </View>
      );
   }
   const circleSize = 110

   return (

      <Box
         style={{ width: (width / 2) - 32, marginRight: 0 }}
      >
         {challengeWon && (
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
               source={require('lotties/confetti.json')}
            />
         )}



         <View centerH style={{ padding: 16, paddingBottom: 24 }} flex>
            <Text B12 marginB-16>GOAL TODAY</Text>
            {todayProgress < 100 && <AnimatedView centerH centerV>

               <View>
                  <GradientCircularProgress
                     progress={todayProgress}
                     emptyColor={Colors.grey70}
                     size={circleSize}
                     withSnail
                     strokeWidth={7}
                     startColor={playerChallenge.colorStart}
                     middleColor={playerChallenge.colorEnd}
                     startColor={playerChallenge.colorStart}


                  />

                  <View center style={{ position: 'absolute', height: circleSize, width: circleSize }}>
                     <Text B18 style={{ fontSize: 16 }}>{kFormatter(selectedTodayScore)}/{kFormatter(selectedTodayTarget)}</Text>
                     <Text R10 secondaryContent>{unit && unit?.toUpperCase() || 'POINTS'}</Text></View>
               </View>

            </AnimatedView>}

            {todayProgress >= 100 && (
               <View><LottieAnimation
                  autoPlay
                  loop={false}
                  style={{
                     // width: 200,
                     height: 122,
                     zIndex: 99999,
                     marginTop: -7

                  }}
                  source={require('lotties/celebration1.json')}
               />
                  <View center style={{ marginTop: -16 }} >
                     <Text B18>{selectedTodayScore}/{selectedTodayTarget}</Text>
                     <Text R10 secondaryContent>{unit && unit?.toUpperCase() || 'POINTS'}</Text></View>
               </View>
            )}

            {todayProgress == 0 && false && (
               <LottieAnimation
                  autoPlay
                  loop={true}
                  style={{
                     // width: 200,
                     height: 100,
                     zIndex: 99999,
                     bottom: -5,
                     // right: 12,
                     position: 'absolute',
                  }}
                  source={require('lotties/ausleep.json')}
               />
            )}


         </View>
      </Box >

   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TodayChallengeGoal));
