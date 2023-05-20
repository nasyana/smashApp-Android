import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Firebase from 'config/Firebase';
import styles from './style';
import SmartImage from 'components/SmartImage/SmartImage';

const listArr = [
   {
      image: 'https://i.pinimg.com/originals/2b/91/8c/2b918c72bec18e23b935a29f48b2a123.jpg',
      name: 'Jasmin Smith',
      thumb: 0,
   },
   {
      image: 'https://i.pinimg.com/236x/ce/02/c6/ce02c6ca32d8744bed7e25eab4650e29.jpg',
      name: 'Benjamin Cruz',
      thumb: 1,
   },
   {
      image: 'https://i.pinimg.com/originals/2b/91/8c/2b918c72bec18e23b935a29f48b2a123.jpg',
      name: 'Samantha Sy',
      thumb: 0,
   },
   {
      image: 'https://i.pinimg.com/236x/ce/02/c6/ce02c6ca32d8744bed7e25eab4650e29.jpg',
      name: 'Merlyn',
      thumb: 1,
   },
   {
      image: 'https://i.pinimg.com/originals/2b/91/8c/2b918c72bec18e23b935a29f48b2a123.jpg',
      name: 'Curt Florence',
      thumb: 1,
   },
   {
      image: 'https://i.pinimg.com/originals/2b/91/8c/2b918c72bec18e23b935a29f48b2a123.jpg',
      name: 'Jasmin Smith',
      thumb: 0,
   },
   {
      image: 'https://i.pinimg.com/236x/ce/02/c6/ce02c6ca32d8744bed7e25eab4650e29.jpg',
      name: 'Benjamin Cruz',
      thumb: 1,
   },
   {
      image: 'https://i.pinimg.com/originals/2b/91/8c/2b918c72bec18e23b935a29f48b2a123.jpg',
      name: 'Jasmin Smith',
      thumb: 0,
   },
   {
      image: 'https://i.pinimg.com/236x/ce/02/c6/ce02c6ca32d8744bed7e25eab4650e29.jpg',
      name: 'Benjamin Cruz',
      thumb: 1,
   },
];

const VoteOnTeamChallenge = (props) => {
   const [challenge, setChallenge] = useState(false);
   const { item, challengesStore, team, teamsStore } = props;
   const { teamUsersByTeamId } = teamsStore;
   const { voteYes = [], voteNo = [], challengeId } = item;
   const { uid } = Firebase.auth.currentUser;
   const playersList = teamUsersByTeamId ? teamUsersByTeamId[team.id] : [];
   const { toggleTeamInChallenge } = challengesStore;
   useEffect(() => {
      const doc = Firebase.firestore
         .collection('challenges')
         .doc(challengeId)
         .get();
      setChallenge(doc.data());
      return () => {};
   }, [challengeId]);

   const challengeData = challenge
      ? challengesStore.getChallengeData(challenge)
      : {};
   const alreadyPlaying =
      team?.inChallenge?.[challengeData?.endDateKey]?.includes(challengeId) ||
      false;
   // console.log(
   //    '\n ---------------------------------------------------------- \n',
   // );
   // console.log(`VoteOnTeamChallenge >  alreadyPlaying: ${alreadyPlaying}; challengeId: ${challengeId};
   //  team: ${JSON.stringify(team.inChallenge)}; challengeData: ${JSON.stringify(
   //    challengeData,
   // )}`);

   const name = challenge?.name;
   const isUserVotedYes = voteYes.includes(uid);

   const isUserVotedNo = voteNo?.includes(uid);

   const totalVotesNeededToBeginChallenge =
      team?.joined?.length > 1 ? Math.ceil(team?.joined?.length / 2) : 2;

   const votesNeededToBeginChallenge =
      totalVotesNeededToBeginChallenge - voteYes.length;

   const renderItem = ({ item, index }) => {
      if (notVoted) {
         return;
      }
      const playerVotedYes = voteYes.includes(item?.uid);

      const playerVotedNo = voteNo?.includes(item?.uid);

      const notVoted = !playerVotedNo && !playerVotedYes;

      return (
         <View style={styles.renderItemViewStyle} key={index}>
            <SmartImage
               style={styles.itemProfileViewStyle}
               //  source={{ uri: item.image }}
               uri={item?.picture?.uri}
               preview={item?.picture?.preview}
            />
            <Text style={styles.nameTextStyle}>{item.name}</Text>
            {!notVoted && (
               <View
                  style={[
                     styles.itemThumbViewStyle,
                     {
                        backgroundColor: playerVotedNo ? 'red' : 'green',
                     },
                  ]}>
                  <FontAwesome
                     name={playerVotedYes ? 'thumbs-up' : 'thumbs-down'}
                     size={18}
                     color="#fff"
                  />
               </View>
            )}
         </View>
      );
   };
   return (
      <View style={styles.container}>
         <View style={styles.cardViewStyle}>
            <View style={styles.cardHearderStyle}>
               <Text style={styles.cardHeaderTextStyle}>{name}</Text>
            </View>
            <View style={styles.thumbViewStyle}>
               <TouchableOpacity
                  onPress={
                     isUserVotedYes
                        ? () => null
                        : () =>
                             toggleTeamInChallenge(
                                challenge,
                                team,
                                alreadyPlaying,
                             )
                  }
                  style={[
                     styles.thumbsButtonStyle,
                     { backgroundColor: 'green' },
                  ]}>
                  <FontAwesome name="thumbs-up" size={20} color="#fff" />
                  <Text style={styles.countTextStyle}>{voteYes.length}</Text>
               </TouchableOpacity>
               <TouchableOpacity
                  onPress={
                     isUserVotedNo
                        ? () => null
                        : () =>
                             toggleTeamInChallenge(
                                challenge,
                                team,
                                alreadyPlaying,
                             )
                  }
                  style={[
                     styles.thumbsButtonStyle,
                     { backgroundColor: 'red' },
                  ]}>
                  <FontAwesome name="thumbs-down" size={20} color="#fff" />
                  <Text style={styles.countTextStyle}>{voteNo.length}</Text>
               </TouchableOpacity>
            </View>
            <View style={styles.epicVoteViewStyle}>
               <Text style={styles.epicVoteTextStyle}>
                  YOU NEED 1 MORE VOTE TO FOR EPIC {'\n'} TEAM TO JOIN {name}
               </Text>
            </View>
            <View style={styles.seprateStyle} />
            <FlatList
               showsVerticalScrollIndicator={false}
               data={playersList}
               style={{ marginBottom: 20 }}
               scrollEnabled={false}
               //  contentContainerStyle={{ marginTop: 18.5 }}
               renderItem={(items) => renderItem(items)}
               keyExtractor={(item, index) => index.toString()}
            />
         </View>
      </View>
   );
};;
export default VoteOnTeamChallenge;
