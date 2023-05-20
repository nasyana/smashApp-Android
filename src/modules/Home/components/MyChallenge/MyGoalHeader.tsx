import { inject, observer } from 'mobx-react';
import {
   View, Text, ProgressBar, Colors, Assets, Image
} from 'react-native-ui-lib';

import { checkInfinity } from 'helpers/teamDataHelpers';
import { width } from 'config/scaleAccordingToDevice';
import firebaseInstance from 'config/Firebase';
import GoalAvatars from './GoalAvatars';

const MyGoalHeader = ({ smashStore, challengesStore, goalId, goalDocFromNav, playerGoal: _playerGoal = false }) => {
   const uid = firebaseInstance?.auth?.currentUser?.uid;

   const {
      kFormatter,
      stringLimit,
   } = smashStore;
   const { playerGoalsHashByGoalId } = challengesStore;

   const goal = challengesStore?.goals?.find(goal => goal.id == goalId) || goalDocFromNav || {};

   const playerGoal = playerGoalsHashByGoalId?.[goal.id] || {};


   const { targetType = 'points' } = goal


   let playerGoalScore = targetType == 'qty' ? playerGoal?.qty || 0 : playerGoal?.score || 0;

   const contribution = targetType == 'qty' ? goal.contributionQty || 0 : goal.contributionScore || 0;

   const score = goal?.allowOthersToHelp ? contribution : playerGoalScore;

   const progress = checkInfinity(score / goal.target * 100) || 0 // get percentage of goal completed using goal.target and score 

   const roundUpToClosestTenth = progress < 1 ? Math.ceil(progress / 100) : progress// round up to closest percent

   const playingLabel = targetType == 'qty' ? 'Contributing' : 'Participating';

   const challenge = challengesStore?.challengesHash?.[goal.challengeId] || {}
   const size = 40;
   const icon = Assets?.icons?.[challenge?.imageHandle || 'smashappicon']


   return (
      <View>
         <View
            row
            style={{
               marginHorizontal: 0,
               backgroundColor: '#FFF',
               marginBottom: 0,
               paddingLeft: 0,
               borderRadius: 7,
            }}>


            <View center marginT-16 style={{ backgroundColor: challenge.colorStart || '#333', borderRadius: 25, width: size + 5, height: size + 5, marginLeft: 24, marginRight: 0 }}><Image
               source={icon}
               style={{
                  height: size,
                  width: size,
                  borderRadius: 40,

               }}
            /></View>


            <View paddingL-8 flex paddingT-16 centerV>
               <View paddingL-2 paddingR-16 centerV marginB-16>
                  <View spread row paddingR-8>
                     <Text R14 secondaryContent>
                        ({goal.code && 'Code: ' + goal.code})
                     </Text>

                     <View row>
                        {goal?.allowOthersToHelp && <View style={{ backgroundColor: Colors.blue20, borderRadius: 16, paddingHorizontal: 6, paddingTop: 3, marginRight: 4 }}><Text white R10 >TEAM</Text></View>}

                        {goal?.allowPublicToJoin && <View style={{ backgroundColor: Colors.green50, borderRadius: 16, paddingHorizontal: 6, paddingTop: 3 }}><Text white R10 >PUBLIC</Text></View>}
                     </View>
                  </View>
                  <View spread row paddingR-8 centerV>

                     <View row centerV>
                        <Text H18 color28 style={{ fontSize: 18, marginLeft: 0 }}>
                           {stringLimit(goal?.name, 25) || 'loading'}{' '}Goal
                        </Text>

                     </View>

                     <View style={{ backgroundColor: '#eee', paddingHorizontal: 8, borderRadius: 8 }}>
                        <Text M12 secondaryContent >
                           {goal.endDuration} DAYS
                        </Text>
                     </View>

                  </View>
               </View>
               <View style={{ borderBottomWidth: 0.5, width: width - 135, borderColor: '#ddd', marginBottom: 16 }} />
               <View row spread paddingR-24 centerV paddingB-8>
                  <View />
                  <View row centerV>
                     {goal.allowOthersToHelp && <Text M12 marginL-2 secondaryContent >{playingLabel}: {goal?.joined?.length}</Text>}
                     <GoalAvatars goal={goal} />
                  </View>
               </View>
            </View>
         </View>
         <View row paddingH-24 marginB-8 >
            <View row centerV paddingR-8><Text B14>{score}</Text><Text R14>/</Text><Text B14>{kFormatter(goal.target)}</Text></View>
            <View flex>
               <ProgressBar
                  progress={roundUpToClosestTenth}
                  progressColor={goal.colorEnd}
                  style={{ height: 24 }}

               /></View>
         </View>
      </View>
   )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(MyGoalHeader));