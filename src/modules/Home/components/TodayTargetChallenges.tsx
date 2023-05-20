import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../../components/SmartImage/SmartImage';
import Box from '../../../components/Box';
import AnimatedView from '../../../components/AnimatedView';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import ButtonLinear from 'components/ButtonLinear';
import { LinearGradient } from 'expo-linear-gradient';

import { width, height } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';
import CircularProgressBar from 'components/CircularProgressBar';
import WeeklyDayTargets from 'components/WeeklyDayTargets';
import Shimmer from 'components/Shimmer';
import RecentChallengeSmashes from 'components/RecentChallengeSmashes';
import SectionHeader from 'components/SectionHeader';
import EpicBadge from 'components/EpicBadge';
import Firebase from 'config/Firebase';
import { dayNumberOfChallenge, daysInChallenge } from 'helpers/dateHelpers';

import { challengeDaysSmashed } from 'helpers/generalHelpers';
import Rank from 'nav/Rank';
const TodayTarget = ({
   SPACING = 28,
   playerChallengeId,
   goToChallengeArena,
   smashStore,
   challengesStore,
}) => {
   const [loaded, setLoaded] = useState(true);
   const [expandCard, setExpandCard] = useState(false);

   const { myPlayerChallengesFullHash = {} } = challengesStore;
   const playerChallenge = playerChallengeId
      ? myPlayerChallengesFullHash?.[playerChallengeId]
      : {};

   const { unit = 'smash' } = playerChallenge;

   const {
      stringLimit,
      kFormatter,
      ordinal_suffix_of,
      setMasterIdsToSmash,
      todayDateKey,
   } = smashStore;

   const { myChallengeRankByChallengeId } = challengesStore;
   const {
      todayProgress = 0,
      selectedTodayTarget = 0,
      selectedTodayScore = 0,
      remainingToday = 0,
   } = playerChallenge;

   const overBy =
      selectedTodayScore > selectedTodayTarget
         ? selectedTodayScore - selectedTodayTarget
         : 0;
   const challengeWon = selectedTodayScore >= selectedTodayTarget;
   const size = 150;

   const imageSize = 70;

   const smashActivities = () => {
      setMasterIdsToSmash(playerChallenge?.masterIds || false);
   };

   const toggleFullView = () => setExpandCard(!expandCard);

   // useEffect(() => {
   //    const { uid } = Firebase.auth.currentUser;

   //    let dailyAvQuery = Firebase.firestore
   //       .collection('playerChallenges')
   //       .where('active', '==', true)
   //       // .where('followers', 'array-contains', uid)
   //       .where('dailyAverage', '>', playerChallenge.dailyAverage)
   //       .where('challengeId', '==', playerChallenge.challengeId);

   //    if (playerChallenge.targetType == 'qty') {
   //       dailyAvQuery = Firebase.firestore
   //          .collection('playerChallenges')
   //          .where('active', '==', true)
   //          // .where('followers', 'array-contains', uid)
   //          .where('dailyAverageQty', '>', playerChallenge.dailyAverageQty)
   //          .where('challengeId', '==', playerChallenge.challengeId);
   //    }
   //    const unsubscribeToPlayersAheadOfMe = dailyAvQuery.onSnapshot((snaps) => {
   //       let peopleAheadOfMe = [];
   //       let usersAheadOfMe = [];

   //       if (!snaps.empty) {
   //          snaps.forEach((snap) => {
   //             peopleAheadOfMe.push({
   //                name: snap.data().user.name,
   //                score: snap.data().score,
   //             });
   //             usersAheadOfMe.push(snap.data());
   //          });

   //          const size = snaps.size;
   //          challengesStore.setplayersAroundMeInChallenges(
   //             peopleAheadOfMe,
   //             playerChallenge.challengeId,
   //          );
   //       }
   //    });

   //    return () => {
   //       if (unsubscribeToPlayersAheadOfMe) {
   //          unsubscribeToPlayersAheadOfMe();
   //       }
   //    };
   // }, []);

   useEffect(() => {
      const { uid } = Firebase.auth.currentUser;
      const { setStreak } = challengesStore;
      const unsubscribeToStreaks = Firebase.firestore
         .collection('challengeStreaks')
         .doc(`${uid}_${playerChallenge.challengeId}`)
         .onSnapshot((snap) => {
            if (snap.exists) {
               const streak = snap.data();
               setStreak(streak);
               alert('asd')
            }
         });

      return () => {
         if (unsubscribeToStreaks) {
            unsubscribeToStreaks();
         }
      };
   }, []);

   const hasColors = playerChallenge?.colorStart && playerChallenge?.colorEnd;
   const hasProgress = todayProgress >= 0 && selectedTodayTarget > 0;
   const myRank =
      myChallengeRankByChallengeId[playerChallenge?.challengeId] || 1;

   const goToThisChallenge = () => goToChallengeArena(playerChallenge);

   if (playerChallenge.challengeNotStartedYet) {
      return null;
   }
   return (
      <TouchableOpacity onPress={goToThisChallenge}>
         <Box
            style={{
               marginHorizontal: SPACING / 2,
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

               {expandCard && false ? (
                  <View
                     style={{
                        height: imageSize - 50,
                        width: imageSize - 50,
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
                              position: 'absolute',
                           }}
                           source={require('../../../lotties/done-excited.json')}
                        />
                     )}
                     <Text
                        white
                        B18
                        style={{ fontSize: todayProgress < 0 ? 18 : 18 }}>
                        {todayProgress >= 0 ? todayProgress + '%' : '✅'}{' '}
                     </Text>
                  </View>
               ) : (
                  <View
                  // style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
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
                     <View
                        style={{
                           position: 'absolute',
                           backgroundColor: playerChallenge.colorEnd,
                           padding: 8,
                           borderRadius: 32,
                           top: -22,
                           left: -18,
                           width: 50,
                           height: 50,
                           alignItems: 'center',
                           justifyContent: 'center',
                        }}>
                        <Text
                           white
                           R10
                           style={{ marginBottom: -5, marginTop: 5 }}>
                           DAY
                        </Text>
                        <Text white B24 marginT-0 paddingT-0>
                           {dayNumberOfChallenge(playerChallenge)}
                        </Text>
                     </View>
                  </View>
               )}
               {/* <Text>{selectedTodayTarget}</Text> */}
               <View flex centerV marginL-16>
                  <View row centerV>
                     {playerChallenge?.challengeName && (
                        <Text H18 marginR-8>
                           {stringLimit(playerChallenge?.challengeName, 20)}
                        </Text>
                     )}
                     <Rank
                        hideWhenSmashing
                        loadIndex={0}
                        playerChallenge={playerChallenge}
                        colorStart={playerChallenge.colorEnd}
                        rank={3}
                     />
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
                              fontSize: expandCard ? 12 : 12,
                           }}>
                           {hasProgress && (
                              <Text>
                                 {selectedTodayScore} / {selectedTodayTarget}{' '}
                                 {unit}
                              </Text>
                           )}
                           {/* <Text style={{ color: Colors.green30 }}>
                              {overBy > 0 && '+' + overBy + ' '}
                              {todayProgress > 100
                                 ? '(' + todayProgress + '%)'
                                 : null}
                           </Text> */}
                        </Text>

                        {/* <FontAwesome5
                           name="check"
                           size={12}
                           color={playerChallenge?.colorStart || Colors.blue50}
                           style={{ marginLeft: 8 }}
                        /> */}
                        {false && (
                           <Text
                              H12
                              color97
                              marginL-7
                              style={{
                                 textTransform: 'uppercase',
                                 letterSpacing: 0,
                                 fontSize: expandCard ? 12 : 14,
                              }}>
                              {/* {dayNumberOfChallenge(playerChallenge)} /
                           {daysInChallenge(playerChallenge)}{' '} */}
                              {challengeDaysSmashed(playerChallenge)} /{' '}
                              {dayNumberOfChallenge(playerChallenge)}
                           </Text>
                        )}
                     </View>
                  </View>
               </View>
               <TouchableOpacity
                  onPress={toggleFullView}
                  style={{
                     width: 40,
                     height: 40,
                     alignItems: 'center',
                     justifyContent: 'center',
                     marginLeft: 16,
                     borderRadius: 16,
                     backgroundColor: '#fafafa',
                  }}>
                  {expandCard && <AntDesign name="down" size={20} />}
                  {!expandCard && <AntDesign name="up" size={20} />}
               </TouchableOpacity>
            </View>
            {/* {challengeWon && (
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
            )} */}

            {challengeWon && (
               <LottieAnimation
                  autoPlay
                  loop={false}
                  style={{
                     // width: 200,
                     height: 70,
                     zIndex: 99999,
                     top: -5,
                     left: 10,
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
                        showPercent={true}
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
                  <Text secondaryContent marginT-16>
                     You're coming {ordinal_suffix_of(myRank)}
                     {myRank == 1
                        ? '! 🥇'
                        : myRank == 2
                        ? '! 🥈'
                        : myRank == 3
                        ? '! 🥉'
                        : ''}
                  </Text>
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
            {expandCard && false && (
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
)(observer(TodayTarget));
