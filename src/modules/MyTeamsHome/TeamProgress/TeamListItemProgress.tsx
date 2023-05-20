import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Colors, ProgressBar } from 'react-native-ui-lib';
import { AntDesign } from '@expo/vector-icons';
import { moment } from 'helpers/generalHelpers';;
import Firebase from 'config/Firebase';
import {
   getDefaultWeeklyActivity,
   getTeamWeeklyData,
} from 'helpers/teamDataHelpers';
import Box from 'components/Box';
import { width, height } from 'config/scaleAccordingToDevice';
import { daysLeftInWeek, isInFuture } from 'helpers/dateHelpers';
const TeamListItemProgress = inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(
   observer((props) => {
      const [currentTeamWeekly, setCurrentTeamWeekly] = useState({ score: 0 });
      const { navigate } = useNavigation();
      const {
         playerChallenge = {},
         smashStore = {},
         challengesStore = {},
         playerChallengeData = {},
         teamsStore,
         id,
         team,
         weeklyTarget,
      } = props;

      const now = moment();
      const endOfCurrentWeek = moment().endOf('isoWeek');
      const daysLeft = endOfCurrentWeek.diff(now, 'days');
      //////////////////////OLD CODE/////////////////////////////

      const {
         kFormatter,
         checkInfinity,
         ordinal_suffix_of,
         settings,
         numberWithCommas,
         dayLabelsThisWeek,
      } = smashStore;
      const { endOfCurrentWeekKey, weeklyActivityHash, teamWeeklyKey } =
         teamsStore;

      const weeklyActivity = weeklyActivityHash?.[teamWeeklyKey] || {};

      const { selectedTargetLevel, mostRecentTarget } = team;
      const score = team?.scores?.[endOfCurrentWeekKey] || 0;
      const weekTarget = parseInt(mostRecentTarget);
      let progress =
         checkInfinity(score / weekTarget) * 100 > 100
            ? 100
            : checkInfinity(score / weekTarget) * 100;

      const days = dayLabelsThisWeek;

      const targetView = props.smashStore.targetView;

      const [rank, setRank] = useState(0);
      const [challenge, setChallenge] = useState('');
      const [playersAheadOfMe, setUsersAheadOfMe] = useState([]);
      const weeksCompleted = team.targets
         ? Object.keys(team.targets)?.length
         : 1;
      useEffect(() => {
         const endOfCurrentWeekKey = moment()
            .endOf('isoWeek')
            .format('DDMMYYYY');
         const teamWeeklySnapShotUnSubscribe = Firebase.firestore
            .collection('weeklyActivity')
            .doc(`${id}_${endOfCurrentWeekKey}`)
            .onSnapshot((snap: any) => {
               if (snap.exists) {
                  setCurrentTeamWeekly(getTeamWeeklyData(snap.data(), team));
               } else {
                  setCurrentTeamWeekly({});
               }
            });

         return () => {
            if (teamWeeklySnapShotUnSubscribe) {
               teamWeeklySnapShotUnSubscribe();
            }
         };
      }, []);

      const todayView = targetView == 1;

      const color = todayView ? Colors.color40 : Colors.buttonLink;
      const {

      } = weeklyActivity;
      // let progress = hasReachedTarget
      //    ? 100
      //    : (parseInt(selectedScore) / parseInt(selectedTarget)) * 100;

      return (
         <View marginB-8>
            {/* <View row spread paddingH-16 >
               <AntDesign name={'star'} size={14} color={color} />

               <View flex ><Text color6D B14><Text buttonLink>{kFormatter(score) || 0} ({challenge?.unit || 'pts'})</Text></Text></View>
               <View><Text color6D B14> {kFormatter(weekTarget)}</Text></View>
            </View> */}


            <View
               row
               flex
               style={{
                  backgroundColor: '#FFF',
                  // overflow: 'hidden',
                  paddingHorizontal: 16,
                  marginBottom: 0,
                  marginHorizontal: 0,
                  borderRadius: 7,
                  padding: 16,
                  paddingTop: 8,
                  // width: '100%',
               }}>
               <View paddingL-0 flex paddingT-0>
                  <View row centerV spread>

                     {/* <View row paddingR-0 paddingL-8 centerV>
                        <AntDesign
                           name={'calendar'}
                           size={14}
                           color={Colors.buttonLink}
                        />
                        <Text color6D marginL-4 R14>
                           {daysLeftInWeek()} days left
                        </Text>
                     </View> */}
                  </View>
                  <View marginT-0>
                     <View row centerV spread>

                        <Text B16 marginB-8 marginL-8 buttonLink>{kFormatter(score) || 0} ({challenge?.unit || 'pts'})</Text>

                        <Text B16 marginB-8 marginR-8 >{kFormatter(weekTarget) || 0} ({challenge?.unit || 'pts'})</Text>
                     </View>
                     <ProgressBar
                        progress={progress}
                        progressColor={color}
                        style={{ height: 8 }}
                     />

                     {/* <View style={{ paddingHorizontal: 8, height: 24, justifyContent: 'center' }}></View> */}
                     {/* <View row spread paddingB-0 marginH-1 marginT-8>
                        {days?.map((day, index) => {
                           const isFutureOrToday = isInFuture(day);
                           return (
                              <View
                                 style={{
                                    height: 2,
                                    flex: 1,
                                    margin: 2,
                                    borderRadius: 3,
                                    // marginRight: index < 6 ? 4 : 0,
                                    backgroundColor: isFutureOrToday
                                       ? '#eee'
                                       : Colors.smashPink,
                                    marginTop: 2,
                                 }}
                              />
                           );
                        })}
                     </View> */}
                     {/* <Text secondaryContent marginT-8>
                        You're coming {ordinal_suffix_of(rank + 1)}!
                     </Text> */}
                  </View>
               </View>
            </View>
         </View>
      );
   }),
);

export default TeamListItemProgress;
