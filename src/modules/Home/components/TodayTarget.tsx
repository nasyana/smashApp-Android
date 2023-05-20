import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../../components/SmartImage/SmartImage';
import Box from '../../../components/Box';
import AnimatedView from '../../../components/AnimatedView';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
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
import CircularProgressBar from 'components/CircularProgressBar';
import WeeklyDayTargets from 'components/WeeklyDayTargets';
import Shimmer from 'components/Shimmer';
import RecentChallengeSmashes from 'components/RecentChallengeSmashes';
import SectionHeader from 'components/SectionHeader';
import EpicBadge from 'components/EpicBadge';
import LottieAnimation from 'components/LottieAnimation';
const TodayTeamTargetListItem = ({
   SPACING = 28,
   playerChallenge,
   goToChallengeArena,
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
   } = playerChallenge;

   const overBy =
      selectedTodayScore > selectedTodayTarget
         ? selectedTodayScore - selectedTodayTarget
         : 0;
   const challengeWon = selectedScore > selectedTarget;
   const size = 150;

   const imageSize = 70;

   const smashActivities = () => {
      setMasterIdsToSmash(playerChallenge?.masterIds || false);
   };

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
               marginVertical: SPACING / 2,
               padding: SPACING,
               overflow: 'hidden',
               height: 95,
               borderRadius: 10,
            }}
         />
      );

   const hasColors = playerChallenge?.colorStart && playerChallenge?.colorEnd;
   const hasProgress = todayProgress >= 0 && selectedTodayTarget > 0;
   return (
      <TouchableOpacity onPress={() => setExpandCard((prev) => !prev)}>
         <Box
            style={{
               marginHorizontal: SPACING,
               marginTop: SPACING / 3,
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
                  source={require('../../../lotties/confetti.json')}
               />
            )}

            <View row spread>
               <LinearGradient
                  // Background Linear Gradient
                  start={{ x: 0.1, y: 0.1 }}
                  colors={[
                     // 'transparent',
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

               {!expandCard ? (
                  <View
                     style={{
                        height: imageSize - 20,
                        width: imageSize - 20,
                        borderRadius: 10,
                        // backgroundColor: '#ccc',
                        marginRight: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                     }}>
                     {(!hasProgress || todayProgress > 100) && (
                        <LottieAnimation
                           autoPlay
                           loop={false}
                           style={{
                              // width: 200,
                              height: 120,
                              zIndex: 99999,
                              top: 5,
                              // right: 12,
                              // position: 'absolute',
                           }}
                           source={require('../../../lotties/done-excited.json')}
                        />
                     )}
                     <Text
                        white
                        B18
                        style={{ fontSize: todayProgress < 0 ? 18 : 18 }}>
                        {todayProgress >= 0 ? todayProgress + '%' : '✅'}
                     </Text>
                  </View>
               ) : (
                  <SmartImage
                     uri={playerChallenge?.picture?.uri}
                     preview={playerChallenge?.picture?.preview}
                     style={{
                        height: imageSize - 20,
                        width: imageSize - 20,
                        borderRadius: 5,
                        backgroundColor: '#ccc',
                        marginRight: 8,
                     }}
                  />
               )}

               <View
                  flex
                  centerV
                  marginL-12={!challengeWon}
                  marginL-40={challengeWon}>
                  <View row centerV spread>
                     {playerChallenge?.challengeName && (
                        <Text H18>
                           {stringLimit(playerChallenge?.challengeName, 20)}
                        </Text>
                     )}
                  </View>
                  <View row>
                     <View row centerV marginT-2>
                        {hasProgress && (
                           <Feather
                              name="target"
                              size={14}
                              color={
                                 playerChallenge?.colorStart || Colors.blue50
                              }
                           />
                        )}
                        {!hasProgress && <Text>Challenge Smashed!</Text>}
                        <Text
                           H12
                           color97
                           marginL-7
                           style={{
                              textTransform: 'uppercase',
                              letterSpacing: 0,
                              fontSize: expandCard ? 12 : 14,
                           }}>
                           {hasProgress && (
                              <Text>
                                 {selectedTodayScore} / {selectedTodayTarget}{' '}
                                 {unit}{' '}
                              </Text>
                           )}
                           {/* <Text style={{ color: Colors.green30 }}>
                              {overBy > 0 && '+' + overBy + ' '}
                              {todayProgress > 100
                                 ? '(' + todayProgress + '%)'
                                 : null}
                           </Text> */}
                        </Text>
                     </View>
                  </View>
               </View>
            </View>
            {challengeWon && (
               <View
                  style={{
                     // height: imageSize - 20,
                     // width: imageSize - 20,
                     borderRadius: 5,
                     marginRight: 8,
                     position: 'absolute',
                     left: 16,
                     top: 8,
                  }}>
                  <AnimatedView>
                     <EpicBadge size={90} playerChallenge={playerChallenge} />
                  </AnimatedView>
               </View>
            )}

            {challengeWon && (
               <LottieAnimation
                  autoPlay
                  loop={false}
                  style={{
                     // width: 200,
                     height: 70,
                     zIndex: 99999,
                     top: 0,
                     left: 20,
                     position: 'absolute',
                  }}
                  source={require('../../../lotties/done-excited.json')}
               />
            )}
            {expandCard && (
               <View centerH centerV style={{ paddingTop: SPACING }}>
                  <AnimatedView centerH centerV>
                     <CircularProgressBar
                        fill={todayProgress}
                        overBy={overBy}
                        size={size}
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
                        source={require('../../../lotties/done-excited.json')}
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
                        source={require('../../../lotties/ausleep.json')}
                     />
                  )}

                  {/* <WeeklyDayTargets item={playerChallenge} last7 /> */}

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
                           marginTop: SPACING / 2,
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
                           marginTop: SPACING / 2,
                           width: '100%',
                        }}
                     />
                  )}
               </View>
            )}
            {expandCard && (
               <View style={{ marginTop: 32, width: '100%' }}>
                  <SectionHeader title="Recent Smashes" />

                  <RecentChallengeSmashes
                     challengeId={playerChallenge.challengeId}
                     playerChallenge={playerChallenge}
                     dayKey={todayDateKey}
                  />
               </View>
            )}
         </Box>
      </TouchableOpacity>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TodayTeamTargetListItem));
