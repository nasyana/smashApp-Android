import React, {ReactElement, useEffect, useState} from 'react';
import {inject, observer} from 'mobx-react';

/* styles react-native */
import {
   View,
   Text,
   Colors,
   ProgressBar,
   TouchableOpacity,
} from 'react-native-ui-lib';
import {AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

/* component config */
import Routes from '../../config/Routes';
import Badge from '../../components/Badge';

/* firestore helper */
import {
   getPlayerChallengeData,
   getDaysLeft,
} from 'helpers/playersDataHelpers';
import {
   unsubscribeToChallenge,
   unsubscribeToPlayerChallenge,
   unsubscribeToPlayersAheadOfMe,
} from './fireStore';

const ItemList = inject(
   'smashStore',
   'challengesStore',
)(
   observer((props: any): ReactElement => {
      const {navigate} = useNavigation();
      const {smashStore, challengesStore, playerChallengeId, challengeId} =
         props;
      const {todayDateKey, kFormatter} = smashStore;
      const [playerChallenge, setPlayerChallenge] = useState<any>({});
      const [playersAheadOfMe, setUsersAheadOfMe] = useState<Array<any>>([]);
      const [challenge, setChallenge] = useState<any>({});
      const [rank, setRank] = useState(0);
      const [mounted, setMounted] = useState({
         one: true,
         two: true,
         three: true,
      });

      const days: Array<any> = [];
      const daysLeftWithText = getDaysLeft(challenge, true);
      const playerChallengeData = getPlayerChallengeData(
         playerChallenge,
         1,
         challengesStore,
      );

      const selectedTarget = kFormatter(playerChallengeData?.selectedTarget) || 0;
      const todayProgress = kFormatter(playerChallengeData?.todayProgress) || 0;
      const {timeLeftToday, selectedTodayTarget = 0} = playerChallengeData;
      const todayScore =
         playerChallenge?.targetType == 'qty'
            ? playerChallenge?.daily?.[todayDateKey]?.qty
            : playerChallenge?.daily?.[todayDateKey]?.score || 0;

      const progress = playerChallengeData?.progress || 0;
      const durationLabel = playerChallengeData?.durationLabel || 'monthly';
      const color = Colors.color40;

      const subscribedChallenge = unsubscribeToChallenge(
         challengeId,
         setChallenge,
         setMounted,
      );

      const subscribedPlayer = unsubscribeToPlayerChallenge(
         playerChallengeId,
         setPlayerChallenge,
         setMounted,
      );

      const subscribeAheaedOfme = unsubscribeToPlayersAheadOfMe(
         playerChallenge,
         setRank,
         setUsersAheadOfMe,
         challengesStore,
         setMounted,
      );

      useEffect(() => {
         mounted.one && subscribedChallenge;
         mounted.two && subscribedPlayer;
         mounted.three && subscribeAheaedOfme;

         return () => {
            !mounted.one && subscribedChallenge;
            !mounted.two && subscribedPlayer;
            !mounted.three && subscribeAheaedOfme;
         };
      }, []);

      const goToArena = () => {
         smashStore?.smashEffects();
         challengesStore.setActivePlayerChallengeDocId(playerChallenge);
         navigate(Routes.ChallengeArena, {challenge});
      };

      const checkNumber = (number: number) => {
        return isNaN(number) ? 0 : number
      }

      return (
         <TouchableOpacity
            onPress={goToArena}
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
               <View marginL-16 marginT-16>
                  {/* <Badge
              challenge={challenge}
              kFormatter={smashStore?.kFormatter}
              playerChallengeData={smashStore?.playerChallengeData}
              durationLabel={smashStore?.durationLabel}
            /> */}
               </View>
               <View paddingL-0 flex paddingT-16>
                  <View row spread paddingR-16 centerV marginB-8>
                     <Text H16 color28>
                        {playerChallenge?.challengeName || 'loading'}
                     </Text>
                  </View>

                  <View row centerV spread>
                     <View row>
                        <AntDesign name={'star'} size={14} color={color} />
                        <Text color6D marginL-4>
                           {checkNumber(todayScore)}  / {checkNumber(selectedTodayTarget)}{' '}
                        </Text>
                     </View>

                     <View row paddingR-20>
                        <AntDesign
                           name={'clockcircleo'}
                           size={14}
                           color={color}
                        />
                        <Text color6D marginL-4>
                           {timeLeftToday} h left
                        </Text>
                     </View>
                  </View>

                  <View paddingR-20 bottom marginT-5>
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
                        progress={smashStore?.checkInfinity(todayProgress)}
                        progressColor={color}
                     />

                     {/* <Text secondaryContent marginT-8>
                You're coming {smashStore?.ordinal_suffix_of(rank + 1)}!
              </Text> */}
                  </View>
               </View>
            </View>
            {/* <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            padding: 4,
            backgroundColor: '#ccc',
            borderBottomRightRadius: 7,
          }}>
          <Text flex center R10 white>
            {durationLabel?.toUpperCase()}
          </Text>
        </View> */}
         </TouchableOpacity>
      );
   }),
);

export default ItemList;
