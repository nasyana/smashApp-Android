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
   const [loaded, setLoaded] = useState(false);
   const [expandCard, setExpandCard] = useState(false);
   const { unit } = playerChallenge;

   const {
      stringLimit,
      kFormatter,
      checkInfinity,
      setMasterIdsToSmash,
      todayDateKey,
   } = smashStore;
   const {
      todayProgress = 0,
      selectedTodayTarget = 0,
      selectedTodayScore = 0,
      remainingToday = 0,
      selectedTarget = 0,
      selectedScore,
      challengeNotStartedYet,
   } = playerChallenge;

   const overBy =
      selectedTodayScore > selectedTodayTarget
         ? selectedTodayScore - selectedTodayTarget
         : 0;
   const challengeWon = selectedTodayScore > selectedTodayTarget;

   const progress = selectedTodayTarget / selectedTodayScore;
   const size = 150;

   const imageSize = 70;

   const smashActivities = () => {
      setMasterIdsToSmash(playerChallenge?.masterIds || false);
   };

   useEffect(() => {
      setTimeout(() => {
         setLoaded(true);
      }, 500);

      return () => {};
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
   const accentColor = playerChallenge?.colorStart;
   const hasColors = playerChallenge?.colorStart && playerChallenge?.colorEnd;
   const hasProgress = todayProgress >= 0 && selectedTodayTarget > 0;

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

   return (
      <View onPress={() => setExpandCard((prev) => !prev)}>
         <Box
            style={{
               //    marginHorizontal: SPACING,
               //    marginTop: SPACING / 3,
               padding: SPACING,
               overflow: 'hidden',
            }}>
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

            <PercentageBadge
               expandCard={expandCard}
               unit={unit}
               playerChallenge={playerChallenge}
               kFormatter={kFormatter}
               checkInfinity={checkInfinity}
               overBy={overBy}
               challengeWon={challengeWon}
               imageSize={imageSize}
               accentColor={accentColor}
               hasProgress={hasProgress}
               todayProgress={todayProgress}
               remainingToday={remainingToday}
               selectedTodayScore={selectedTodayScore}
               selectedTodayTarget={selectedTodayTarget}
            />

            <View centerH centerV style={{ paddingTop: SPACING }}>
               <AnimatedView centerH centerV>
                  <CircularProgressBar
                     fill={todayProgress}
                     overBy={overBy}
                     size={size}
                     showPercent
                     tintColor={
                        todayProgress >= 100
                           ? playerChallenge?.colorEnd
                           : playerChallenge?.colorStart
                     }
                  />
               </AnimatedView>
               {/* <Text>{todayProgress}</Text> */}
               {todayProgress >= 100 && (
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
                     source={require('lotties/done-excited.json')}
                  />
               )}

               {todayProgress == 0 && (
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
                     source={require('lotties/ausleep.json')}
                  />
               )}

               {parseInt(remainingToday) > 0 ? (
                  <ButtonLinear
                     title={`${kFormatter(
                        remainingToday,
                     )} left for today's goal`}
                     colors={
                        hasColors
                           ? [
                                playerChallenge?.colorStart,
                                playerChallenge?.colorEnd,
                             ]
                           : [Colors.blue10, Colors.blue40]
                     }
                     onPress={smashActivities}
                     style={{
                        marginTop: SPACING,
                        width: '100%',
                     }}
                  />
               ) : (
                  <ButtonLinear
                     title={"Today's Target is SMASHED"}
                     colors={
                        hasColors
                           ? [
                                playerChallenge?.colorStart,
                                playerChallenge?.colorEnd,
                             ]
                           : [Colors.green30, Colors.green50]
                     }
                     onPress={smashActivities}
                     style={{
                        marginTop: SPACING,
                        width: '100%',
                     }}
                  />
               )}
            </View>
         </Box>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TodayChallengeGoal));
