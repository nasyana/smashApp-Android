import { width } from 'config/scaleAccordingToDevice';
import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Colors, Image, Assets, Text, Avatar } from 'react-native-ui-lib';
import Team from './components/Team';
import ColDescription from './components/ColDescription';
import { inject, observer } from 'mobx-react';
import Firebase from '../../config/Firebase';
import { getEndDateKey } from 'helpers/playersDataHelpers';
const CommunityTeamsList = (props) => {
   const [loaded, setLoaded] = useState(true);
   const [players, setPlayers] = useState('');
   const {
      smashStore,
      goToProfile,
      challengeIsSingleActivity,
      challengeData,
      challengesStore,
      team,
      challenge,
      teamsStore,
   } = props;
   const { setInsightsPlayerChallengeDoc, getPlayerChallengeData } =
      challengesStore;

   const renderItem = ({ item, index }) => {
      const { like, invite, kFormatter, toggleFollowUnfollow, currentUser } =
         smashStore;
      const playerChallengeData = getPlayerChallengeData(item);
      return (
         <Team
            playerChallengeData={playerChallengeData}
            item={item}
            community
            index={index}
            {...{
               currentUser,
               challengeData,
               setInsightsPlayerChallengeDoc,
               like,
               invite,
               goToProfile,
               kFormatter,
               challengeIsSingleActivity,
               toggleFollowUnfollow,
               teamsStore,
            }}
         />
      );
   };

   const data = (players || [])?.sort((a, b) => b.score - a.score);
   const endDateKey = getEndDateKey(challenge);
   useEffect(() => {
      const unsubscribeToPlayers = Firebase.firestore
         .collection('playerChallenges')
         .where('active', '==', true)
         .where('endDateKey', '==', endDateKey)
         .where('challengeId', '==', challenge.id)
         // .where('teamId', '==', team.id)
         .orderBy('score', 'desc')
         .limit(30)
         .onSnapshot((snaps) => {
            if (!snaps.empty) {
               const playerChallengesArray = [];

               snaps.forEach((snap) => {
                  const playerChallenge = snap.data();
                  playerChallengesArray.push(playerChallenge);
               });

               setPlayers(playerChallengesArray);
            }
         });

      return () => {
         if (unsubscribeToPlayers) {
            unsubscribeToPlayers();
         }
      };
   }, []);

   return (
      <View flex backgroundColor={Colors.background}>
         <FlatList
            data={data}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.uid}_${item.challengeId}`}
            contentContainerStyle={{}}
            ListHeaderComponent={() => {
               return <ColDescription challenge={challengeData} />;
            }}
         />
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(CommunityTeamsList));
