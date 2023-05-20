import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Colors, ProgressBar } from 'react-native-ui-lib';
import { AntDesign } from '@expo/vector-icons';
import { moment } from 'helpers/generalHelpers';;
import Firebase from 'config/Firebase'
const TeamProgress = inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(
   observer((props) => {
      const [currentTeamWeekly, setCurrentTeamWeekly] = useState({});
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

      const { score = 0, qty = 0 } = currentTeamWeekly;

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
      } = smashStore;
      const { thisWeekTarget, teamTargets } = teamsStore;

      const { selectedTargetLevel } = team;

      const weekTarget = weeklyTarget || teamTargets?.[1];
      let progress =
         checkInfinity(score / weekTarget) * 100 > 100
            ? 100
            : checkInfinity(score / weekTarget) * 100;

      const days = [];

      const targetView = props.smashStore.targetView;

      const [rank, setRank] = useState(0);
      const [challenge, setChallenge] = useState('');
      const [playersAheadOfMe, setUsersAheadOfMe] = useState([]);

      useEffect(() => {
         const endOfCurrentWeekKey = moment()
            .endOf('isoWeek')
            .format('DDMMYYYY');
         const teamWeeklySnapShotUnSubscribe = Firebase.firestore
            .collection('weeklyActivity')
            .doc(`${id}_${endOfCurrentWeekKey}`)
            .onSnapshot((snap: any) => {
               if (snap.exists) {
                  setCurrentTeamWeekly(snap.data());
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

      const { selectedTarget, selectedScore, todayScore, todayQty } =
         playerChallengeData;

      const todayView = targetView == 1;

      const color = todayView ? Colors.color40 : Colors.buttonLink;

      // let progress = hasReachedTarget
      //    ? 100
      //    : (parseInt(selectedScore) / parseInt(selectedTarget)) * 100;

      return (
         <View>
            <View
               row
               style={{
                  marginHorizontal: 0,
                  backgroundColor: '#FFF',
                  // overflow: 'hidden',
                  marginBottom: 0,
                  paddingLeft: 0,
                  borderRadius: 7,
               }}>
               <View paddingL-0 flex paddingT-16>
                  <View row centerV spread>
                     <View row>
                        <AntDesign name={'star'} size={14} color={color} />

                        <Text color6D marginL-4>
                           {kFormatter(score) || 0} / {kFormatter(weekTarget)} (
                           {challenge?.unit || 'Pts'})
                        </Text>
                     </View>
                     <View row paddingR-20 paddingL-8>
                        <AntDesign
                           name={'calendar'}
                           size={14}
                           color={Colors.buttonLink}
                        />
                        <Text color6D marginL-4>
                           {`${daysLeft} days`}
                        </Text>
                     </View>
                  </View>
                  <View bottom marginT-5>
                     {/* <View row spread paddingB-8>
                        {days?.map((day) => (
                           <View
                              style={{
                                 height: 7,
                                 width: 7,
                                 backgroundColor: '#eee',
                              }}
                           />
                        ))}
                     </View> */}
                     <ProgressBar progress={progress} progressColor={color} />
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

export default TeamProgress;
