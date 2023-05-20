import { inject, observer } from 'mobx-react';
import Box from '../../../../components/Box';
import { View, Text, TouchableOpacity, Image, Assets } from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import Activities from 'components/Challenge/Activities';
import { hexToRgbA } from 'helpers/generalHelpers';
import Rank from 'nav/Rank';
import Routes from 'config/Routes'
import Streak from './Streak';
import PlayerChallengeGradientProgress from './PlayerChallengeGradientProgress';
import { useNavigation } from '@react-navigation/native';
import {getPlayerChallengeData} from 'helpers/playersDataHelpers';
import LostStreakQuestion from './LostStreakQuestion';
const TodayTargetChallengesListItem = ({
   SPACING = 28,
   playerChallengeId,
   smashStore,
   initialPC,
   incomplete,
   challengesStore
}) => {

   const { navigate } = useNavigation();
   const playerChallenge = getPlayerChallengeData(initialPC);

   const {
      stringLimit,
      todayDateKey
   } = smashStore;
   const selectedLevel = playerChallenge?.selectedLevel || 1;
   const dailyTargets = playerChallenge?.dailyTargets || {};
   const selectedIndex = selectedLevel ? parseInt(selectedLevel) - 1 : 0;
   let selectedTodayTarget = dailyTargets?.[selectedIndex] || 0;
   const selectedTodayScore = playerChallenge?.targetType == 'points' ? playerChallenge?.daily?.[todayDateKey]?.score || 0 : (playerChallenge?.daily?.[todayDateKey]?.qty || 0);
   const todayProgress = Math.round(
      selectedTodayScore > 0
         ? (selectedTodayScore / selectedTodayTarget) * 100
         : 0,
   );

   const challengeWon = false;
   const imageSize = 70;

   const hasProgress = todayProgress >= 0 && selectedTodayTarget > 0;

   const goToChallengeArena = () => {
      navigate(Routes.ChallengeArena, { playerChallenge: initialPC });
   };
   const todayTargetSmashed = todayProgress >= 100;
   const backgroundColor = todayTargetSmashed ? hexToRgbA(playerChallenge.colorStart, 0.5) : '#fff';
   const challengeNameColor = '#000'
   const size = 40;
   const icon = Assets?.icons?.[playerChallenge?.imageHandle || 'smashappicon']

   const doesPlayerChallengeExistInplayerChallengesWhereStreakLost = (playerChallenge)=>{

      const playerChallengesWhereStreakLost = challengesStore?.playerChallengesWhereStreakLost || [];
      const streakLost = playerChallengesWhereStreakLost?.find((pc)=>pc?.id == playerChallenge?.id);
      return streakLost;

   }

   console.log('render todayTargetChallengesListItem', playerChallenge?.challengeName);
   return (
      <View >
         {doesPlayerChallengeExistInplayerChallengesWhereStreakLost(playerChallenge) && <LostStreakQuestion playerChallenge={playerChallenge} />}
         <Box
            style={{
               marginHorizontal: SPACING / 2,
               marginTop: 4,
               padding: 16,
               paddingVertical: 24,
               paddingLeft: 8,
               backgroundColor: backgroundColor

            }}>
            <View row spread centerV>
               <View center style={{ backgroundColor: playerChallenge.colorStart, borderRadius: 25, width: size + 5, height: size + 5, marginLeft: 16, marginRight: 4 }}><Image
                  source={icon}
                  style={{
                     height: size,
                     width: size,
                     borderRadius: 40,

                  }}
               /></View>
               {!challengeWon && <LinearGradient
                  start={{ x: 0.1, y: 0.1 }}
                  colors={[
                     'transparent',
                     'transparent',
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
               />}
               <View flex centerV marginL-8>
                  <View row centerV onPress={goToChallengeArena}>
                     {playerChallenge?.challengeName && (
                        <TouchableOpacity onPress={goToChallengeArena}><Text H18 marginR-8 style={{ fontSize: 20, color: challengeNameColor }}>
                           {stringLimit(playerChallenge?.challengeName, 15)}
                           {/* {playerChallenge?.imageHandle} */}
                        </Text></TouchableOpacity>
                     )}
                     <Rank
                        hideWhenSmashing
                        loadIndex={0}
                        playerChallenge={playerChallenge}
                        colorStart={playerChallenge.colorEnd}
                        rank={3}
                     />
                  </View>
                  <View row style={{ flexWrap: 'wrap' }} centerV marginT-0>
                     <View row centerV marginR-8 marginT-2>
                        {!hasProgress && <Text >Challenge Smashed!</Text>}
                     </View>
                  </View>
                  <Streak {...{ playerChallengeId, playerChallenge }} invertColor={todayProgress >= 100} />
               </View>


               <PlayerChallengeGradientProgress {...{ playerChallenge }} goToThisChallenge={goToChallengeArena} incomplete={incomplete} />


            </View>
            <View marginT-16 marginT-8={todayProgress >= 100} marginH-16 paddingT-16 style={{ borderTopColor: '#eee', borderTopWidth: 1 }}>
               <Activities invertColor={todayProgress >= 100} masterIds={playerChallenge.masterIds} notPressable={false} todayTargetSmashed={todayTargetSmashed} />
            </View>
         </Box>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TodayTargetChallengesListItem));
