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
import LottieAnimation from 'components/LottieAnimation';
import CircularProgressBar from 'components/CircularProgressBar';
import WeeklyDayTargets from 'components/WeeklyDayTargets';
import Shimmer from 'components/Shimmer';
const TodayTarget = ({
   SPACING = 28,
   dayTarget = 0,
   dayScore = 0,

   progress = 0,
   smashStore,
   playerChallenge = {},
}) => {
   const [loaded, setLoaded] = useState(false);
   const [expandCard, setExpandCard] = useState(true);

   const { stringLimit, kFormatter, checkInfinity, setMasterIdsToSmash } =
      smashStore;
   const remainingInDay = dayScore < dayTarget ? dayTarget - dayScore : 0;
   const todayProgress = progress;

   const overBy = dayScore > dayTarget ? dayScore - dayTarget : 0;

   const size = 150;

   const imageSize = 70;

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
            {todayProgress >= 100 && (
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
                           {dayScore} / {dayTarget} {unit}{' '}
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
