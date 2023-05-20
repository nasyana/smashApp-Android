import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { height } from '../../config/scaleAccordingToDevice';
import { Text, View } from 'react-native-ui-lib';
import TeamChallenge from './components/TeamChallenge';
import { inject, observer } from 'mobx-react';
import Firebase from 'config/Firebase';
import { moment } from 'helpers/generalHelpers';;

const ThisTeamChallenges = ({ team }) => {
   const teamId = team.id;
   const [teamChallenges, setTeamChallenges] = useState<any[]>([]);
   let unsubscribeToTeamChallenges: any;

   // useEffect(() => {
   //    const fetchTeamPlayerChallenges = () => {
   //       if (!teamId) {
   //          return;
   //       }

         
   //       if (unsubscribeToTeamChallenges) {
   //          unsubscribeToTeamChallenges();
   //       }
   //       unsubscribeToTeamChallenges = Firebase.firestore
   //          .collection('playerChallenges')
   //          .where('active', '==', true)
   //          .where('teamId', '==', teamId)
   //          .where('endUnix', '>', moment().unix())
   //          .onSnapshot((snaps: any) => {
   //             let challengesArray: any[] = [];

   //             if (!snaps.empty) {
   //                snaps.forEach((snap) => {
   //                   const playerChallenge = snap.data();

   //                   challengesArray.push(playerChallenge);
   //                });

   //                setTeamChallenges(challengesArray);
   //             }
   //          });
   //    };

   //    fetchTeamPlayerChallenges();

   //    return unsubscribeToTeamChallenges;
   // }, [teamId]);

   return (
      <View>
         <FlatList
            showsVerticalScrollIndicator={false}
            data={teamChallenges}
            // refreshControl={
            //    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            // }
            ListFooterComponent={<View />}
            // onResponderRelease={onRelease}
            renderItem={({ item, index }) => (
               // <Text>{item.id}</Text>
               <TeamChallenge item={item} />
            )}
            // ListHeaderComponent={ListHeaderWrap}
            keyExtractor={(item) => item?.id.toString()}
            style={{
               paddingTop: 0,
               maxHeight: height - 150,
            }}
            ListEmptyComponent={() => (
               <View>
                  <Text H14 color6D center marginB-16>
                     Your team is not in any challenges this month..
                  </Text>
               </View>
            )}
         />
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
)(observer(ThisTeamChallenges));
