import React, { useEffect, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import SmartImage from 'components/SmartImage/SmartImage';
import Firebase from 'config/Firebase';
import { useNavigation } from '@react-navigation/native';
import Routes from 'config/Routes';
import Box from 'components/Box';
import VotingItem from './components/VotingItem';
import VoteOnTeamChallenge from 'components/VoteOnTeamChallenge';
function VotingDialog(props) {
   const { navigate } = useNavigation();
   const { teamsStore, challengesStore, setIsVoteDialogVisible, team } = props;
   const { voteDocs, currentTeam } = teamsStore;
   const { toggleTeamInChallenge } = challengesStore;
   const { uid } = Firebase.auth.currentUser;
   const notVotedOn = voteDocs.filter(
      (vote: any) =>
         !vote.voteYes.includes(uid) && !vote?.voteNo?.includes(uid),
   );

   const votedOn = voteDocs.filter(
      (vote: any) => vote.voteYes.includes(uid) || vote?.voteNo?.includes(uid),
   );

   const handleVoteYes = async (challengeId) => {
      // alert(challengeId);
      const doc = await Firebase.firestore
         .collection('challenges')
         .doc(challengeId)
         .get();

      if (!doc.exists) return;
      const challenge = doc.data();

      const challengeData = challengesStore.getChallengeData(challenge);
      const alreadyPlaying =
         team?.inChallenge?.[challengeData?.endDateKey]?.includes(challengeId);

      toggleTeamInChallenge(challenge, team, alreadyPlaying);
   };

   const renderItem = (item, index) => {
      // const isUserVotedNo = voteNo.includes(uid);
      return (
         <VoteOnTeamChallenge
            key={item.challengeId}
            item={item}
            challengesStore={challengesStore}
            team={team}
            teamsStore={teamsStore}
         />
         // <VotingItem
         //    key={item.challengeId}
         //    item={item}
         //    challengesStore={challengesStore}
         //    team={team}
         // />
      );
   };

   return (
      <View flex paddingT-10 paddingH-16>
         {/* <Text M24 color28 marginB-10 margin-16>
            Team Voting
         </Text> */}
         <View paddingT-32>
            <Text B24 center>
               Join Challenge?
            </Text>
         </View>
         <ScrollView
            style={{ height: '100%', borderWidth: 0, borderColor: '#333' }}>
            {notVotedOn.length > 0 && (
               <>
                  <View center>
                     <Text text70BO marginL-16 marginR-16 marginB-10>
                        Not yet Voted
                     </Text>
                  </View>
                  {notVotedOn.map(renderItem)}
               </>
            )}
            {votedOn.length > 0 && (
               <>
                  <View center>
                     <Text text70BO marginL-16 marginR-16 marginB-10>
                        Voted
                     </Text>
                  </View>
                  {votedOn.map(renderItem)}
               </>
            )}
         </ScrollView>
      </View>
   );
}

export default inject('teamsStore', 'challengesStore')(observer(VotingDialog));
