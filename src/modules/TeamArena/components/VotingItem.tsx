import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native-ui-lib';
import Box from 'components/Box';
import Firebase from 'config/Firebase';
const VotingItem = (props) => {
   const [challenge, setChallenge] = useState(false);
   const { item, challengesStore, team } = props;
   const { voteYes = [], voteNo = [], challengeId } = item;
   const { uid } = Firebase.auth.currentUser;

   const { toggleTeamInChallenge } = challengesStore;

   useEffect(() => {
      console.log('challengeId', challengeId);
      const doc = Firebase.firestore
         .collection('challenges')
         .doc(challengeId)
         .get();
      setChallenge(doc.data());
      return () => {};
   }, []);

   const challengeData = challenge
      ? challengesStore.getChallengeData(challenge)
      : {};
   const alreadyPlaying =
      team?.inChallenge?.[challengeData?.endDateKey]?.includes(challengeId);

   const isUserVotedYes = voteYes.includes(uid);

   const isUserVotedNo = voteNo?.includes(uid);

   const totalVotesNeededToBeginChallenge =
      team?.joined?.length > 1 ? Math.ceil(team?.joined?.length / 2) : 2;

   const votesNeededToBeginChallenge =
      totalVotesNeededToBeginChallenge - voteYes.length;

   return (
      <Box>
         <View marginH-16 marginT-16 row centerV>
            <Text M18 color28 marginR-25>
               {!alreadyPlaying ? 'Join' : 'Joined:'} {item.name}
               {!alreadyPlaying && '?'}
            </Text>
         </View>
         <View marginH-16 row centerV marginB-16>
            <Text color6D>
               You need {votesNeededToBeginChallenge} more vote to join
               Challenge
            </Text>
         </View>
         <View row margin-16 marginT-0>
            <TouchableOpacity
               onPress={
                  isUserVotedYes
                     ? () => null
                     : () =>
                          toggleTeamInChallenge(challenge, team, alreadyPlaying)
               }
               style={{
                  backgroundColor: isUserVotedYes ? '#eee' : '#fff',
                  borderRadius: 100,
                  padding: 8,
               }}>
               <Text B18 style={{ fontSize: 26 }}>
                  👍 {voteYes.length}
               </Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={
                  isUserVotedNo
                     ? () => null
                     : () =>
                          toggleTeamInChallenge(challenge, team, alreadyPlaying)
               }
               style={{
                  backgroundColor: isUserVotedNo ? '#eee' : '#fff',
                  borderRadius: 100,
                  padding: 8,
               }}>
               <Text B18 style={{ fontSize: 26 }}>
                  👎 {voteNo.length}
               </Text>
            </TouchableOpacity>
         </View>
      </Box>
   );
};

export default VotingItem;
