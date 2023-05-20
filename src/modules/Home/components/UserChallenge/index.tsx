import { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import {
   View, Text,
   Colors, ProgressBar,
   TouchableOpacity
} from 'react-native-ui-lib';
import Routes from '../../../../config/Routes';
import Firebase from '../../../../config/Firebase';
import { AntDesign } from '@expo/vector-icons';

import {
   daysInChallenge,
   daysLeftInChallenge,
   dayNumberOfChallenge,
} from 'helpers/dateHelpers';
import { challengeDaysSmashed } from 'helpers/generalHelpers';
const MyChallenge = inject(
   'smashStore',
   'challengesStore',
)(
   observer((props: any) => {
      const { navigate } = useNavigation();
      const {
         playerChallenge,
         smashStore,
         index,
         team,
         challengesStore,
      } = props;

      const { myChallengeRankByChallengeId, myPlayerChallengesFullHash } =
         challengesStore;
      const {
         kFormatter,
         checkInfinity,
         stringLimit,
      } = smashStore;

      const days: Array<any> = [];

   
      // const [playerChallenge, setPlayerChallenge] = useState(
      //    playerChallengeInitial,
      // );
      // const [challenge, setChallenge] = useState('');
      const [loaded, setLoaded] = useState(false);
      useEffect(() => {
         const loadTime = (index + 1) * 200;

         setTimeout(() => {
            setLoaded(true);
         }, loadTime + 200);

         return () => {};
      }, []);

      // useEffect(() => {
      //    (async function () {
      //       const unsubscribeToChallenge = await Firebase.firestore
      //          .collection('challenges')
      //          .doc(challengeId)
      //          .onSnapshot((challengeSnap: any) => {
      //             if (challengeSnap.exists) {
      //                const challenge = challengeSnap.data();
      //                setChallenge(challenge);
      //             }
      //          });

      //       const unsubscribeToPlayerChallenge = await Firebase.firestore
      //          .collection('playerChallenges')
      //          .doc(playerChallengeId)
      //          .onSnapshot((challengeSnap: any) => {
      //             if (challengeSnap.exists) {
      //                const pChallenge = challengeSnap.data();

      //                const playerChallengeData =
      //                   getPlayerChallengeData(pChallenge);

      //                console.log(
      //                   'playerChallengeData',
      //                   playerChallengeData.selectedTarget,
      //                );
      //                setPlayerChallenge({
      //                   ...pChallenge,
      //                   ...playerChallengeData,
      //                });
      //                // challengesStore.setPlayerChallengeInHash(pChallenge)
      //             }
      //          });

      //       let pointsToAdd = 5000;

      //       if (unsubscribeToPlayerChallenge) {
      //          unsubscribeToPlayerChallenge();
      //       }

      //       if (unsubscribeToChallenge) {
      //          unsubscribeToChallenge();
      //       }
      //    })();
      // }, []);

      const selectedTarget = kFormatter(playerChallenge?.selectedTarget) || 0;
      const selectedScore = kFormatter(playerChallenge?.selectedScore) || 0;
      const progress = playerChallenge?.progress || 0;

      const isTeam = playerChallenge?.challengeType == 'team';
      // if (targetView == 1) {
      //     score = todayScore;
      //     target = dailyTarget;
      // }

      const color = playerChallenge?.colorStart || '#F62C62';


      // const myRank = myChallengeRankByChallengeId[challengeId] || 1;

      if (!loaded) {
         return null;
      }

      const daysSmashed = challengeDaysSmashed(playerChallenge);
      const dayNumber = dayNumberOfChallenge(playerChallenge);


      // return (<MyChallenge />)
      return (
         <>
            {/* <LinearChartChallenge
               playerChallenge={playerChallenge}
               graphHeight={100}
            /> */}
            {/* <View paddingH-16 row>
               <Text R12 secondaryContent style={{ padding: 8 }}>
                  Consistency: {parseInt(percentSmashed) || 0}%
               </Text>
               <Text R12 secondaryContent style={{ padding: 8 }}>
                  Days Active: {daysSmashed} of {dayNumber}
               </Text>
            </View> */}
            <TouchableOpacity
               // onPress={goToArena}
               marginH-16
               marginB-16
               paddingB-16
               style={{
                  borderRadius: 6,
                  shadowColor: '#ccc',
                  shadowOffset: {
                     height: 1,
                     width: 1,
                  },
                  shadowOpacity: 0.52,
                  shadowRadius: 12.22,
                  elevation: 3,
               }}
               backgroundColor={Colors.white}>
               <View
                  row
                  style={{
                     marginHorizontal: 0,
                     backgroundColor: '#FFF',
                     overflow: 'hidden',
                     marginBottom: 0,
                     paddingLeft: 0,
                     borderRadius: 7,
                  }}>
                  {/* <View marginH-16 marginT-16 style={{ height: badgeSize }}>
                     <EpicBadgeSimpleJourney
                        playerChallenge={playerChallenge}
                        kFormatter={kFormatter}
                        size={badgeSize}
                     />
                  </View> */}
                  <View paddingL-16 flex paddingT-16>
                     <View row spread paddingR-16 centerV marginB-0>
                        <Text H16 color28>
                           {/* {daysInChallenge(playerChallenge)} Day{' '} */}
                           {stringLimit(playerChallenge?.challengeName, 25) ||
                              'loading'}
                        </Text>

                        <Text R12 secondaryContent>
                           {isTeam && '(' + playerChallenge?.user?.name + ')'}
                        </Text>
                     </View>
                     {/* <View row centerV marginT-4>
                <View row>
                    <AntDesign name={'addusergroup'} size={14} color={Colors.color6D} />
                    <Text color6D marginL-4>
                        {numberOfPlayers || 0} Playing
                    </Text>
                </View>
                <View row marginL-8>
                    <AntDesign name={'checksquareo'} size={14} color={Colors.color6D} />
                    <Text color6D marginL-4>
                        {numberOfActivities} Activities
                    </Text>
                </View>
                </View>
                <View height={1} backgroundColor={Colors.line} marginV-10 marginR-20 /> 
            */}
                     {false && <View row centerV spread>
                        <View row>
                           <AntDesign name={'star'} size={14} color={color} />

                           <Text color6D marginL-4>
                              {selectedScore || 0} / {selectedTarget}{' '}
                           </Text>
                        </View>
                        <View row paddingR-20>
                           <AntDesign
                              name={'calendar'}
                              size={14}
                              color={color}
                           />
                           <Text color6D marginL-4>
                              {daysLeftInChallenge(playerChallenge)} days left
                           </Text>
                        </View>
                     </View>}
                     {false && <View paddingR-20 bottom marginT-5>
                        <View row spread paddingB-8>
                           {days?.map(() => (
                              <View
                                 style={{
                                    height: 7,
                                    width: 7,
                                    backgroundColor: '#eee',
                                 }}
                              />
                           ))}
                        </View>
                        <ProgressBar
                           progress={checkInfinity(progress)}
                           progressColor={color}
                        />
                        {/* <Text secondaryContent marginT-8>
                           You're coming {ordinal_suffix_of(myRank)}!
                        </Text> */}
                     </View>}
                  </View>
               </View>

               {false && <View
                  style={{
                     position: 'absolute',
                     bottom: 0,
                     right: 0,
                     padding: 4,
                     backgroundColor: '#ccc',
                     borderBottomRightRadius: 7,
                  }}>
                  <Text flex center R10 white>
                     {/* {durationLabel?.toUpperCase()} */}
                  </Text>
               </View>}
            </TouchableOpacity>
         </>
      );
   }),
);

export default MyChallenge;
