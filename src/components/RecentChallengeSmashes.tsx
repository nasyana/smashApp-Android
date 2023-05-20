import { View, Text } from 'react-native-ui-lib';
import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import Firebase from 'config/Firebase';
import { TouchableOpacity } from 'react-native';
import { unixToFromNow } from 'helpers/generalHelpers';
import Tag from 'components/Tag';
import { useNavigation } from '@react-navigation/native';
import Routes from 'config/Routes';
const RecentChallengeSmashes = (props) => {
   const { navigate } = useNavigation();
   const { challengeId, playerChallenge, smashStore } = props;
   const [posts, setPosts] = useState([]);
   const goToTimeline = () => {
      smashStore.smashEffects();
      navigate(Routes.Timeline, {
         uid: smashStore.currentUser?.uid,
         challengeId: playerChallenge.challengeId,
      });
   };
   let smashes = [];
   useEffect(() => {
      let query = Firebase.firestore
         .collection('posts')
         .where('challengeIds', 'array-contains', challengeId)
         .orderBy('timestamp', 'desc')
         .limit(4);

      if (props.dayKey) {
         query = Firebase.firestore
            .collection('posts')
            .where('challengeIds', 'array-contains', challengeId)
            .where('dayKey', '==', props.dayKey)
            .orderBy('timestamp', 'desc')
            // .limit(4);
      }
      let unsub = query.onSnapshot(async (snaps) => {
         if (!snaps.empty) {
            snaps.forEach((snap) => {
               const post = snap.data();

               smashes.push(post);
            });

            setPosts(smashes);
         }
      });

      return () => {
         if (unsub) {
            unsub();
         }
      };
   }, []);

   if (posts?.length == 0) {
      return <Text secondaryContent>Hmmm..🤔🤔 No smashes lately...</Text>;
   }
   return (
      <TouchableOpacity onPress={goToTimeline}>
         {posts.map((post) => (
            <View
               key={post.id}
               row
               spread
               style={{
                  paddingBottom: 8,
                  borderBottomWidth: 1,
                  borderColor: '#eee',
                  marginBottom: 8,
               }}>
               <View row>
                  <Tag
                     label={post.multiplier}
                     color={playerChallenge.colorStart}
                     style={{ marginRight: 8 }}
                     size={25}
                  />
                  <Text R14>{post.activityName}</Text>
               </View>
               <Text secondaryContent>{unixToFromNow(post.timestamp)}</Text>
            </View>
         ))}
      </TouchableOpacity>
   );
};
export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(RecentChallengeSmashes));
