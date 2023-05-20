import Header from 'components/Header';
import { FONTS } from 'config/FoundationConfig';

import React, { useState, useEffect } from 'react';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { View, Assets, Colors } from 'react-native-ui-lib';
import { ScrollView, FlatList, RefreshControl } from 'react-native';
import UserChallenge from 'modules/Home/components/UserChallenge';
import DailyDetail from 'modules/DailyDetail';
import AnimatedView from 'components/AnimatedView';
import { inject, observer } from 'mobx-react';
import { height, width } from 'config/scaleAccordingToDevice';
import Shimmer from 'components/Shimmer';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';

import { moment } from 'helpers/generalHelpers';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
const UserChallenges = (props) => {
   const { challengesStore } = props;

   const user = props?.route?.params?.user || false;
   const userId = user?.id || false;

   const [refreshing, setRefreshing] = useState(false);
   const [loading, setLoading] = useState(false);
   const [userChallengesList, setUserChallengesList] = useState([]);
   useEffect(() => {
      const uid = firebaseInstance?.auth?.currentUser?.uid;
      const unsubscribeToChallenges = onSnapshot(
         query(
           collection(firestore, 'playerChallenges'),
           where('active', '==', true),
           where('uid', '==', userId),
           where('dailyTargets', '!=', null)
         ),
         (snaps) => {
           if (!snaps.empty) {
             const challengesArray = [];
       
             snaps.forEach((snap) => {
               const playerChallenge = snap.data();
       
               if (!playerChallenge?.id) {
                 return;
               }
       
               challengesArray.push({
                 ...playerChallenge,
                 ...getPlayerChallengeData(snap.data()),
               });
             });
       
             setUserChallengesList(challengesArray);
           }
         }
       );

      return () => {
         if (unsubscribeToChallenges) {
            unsubscribeToChallenges();
         }
      };
   }, [userId]);

   const onRefresh = () => {};
   const onRelease = () => {};

   if (loading) {
      return (
         <View flex>
            <Header title={user.name + ' Challenges'} back noShadow />
            {[1, 2, 3, 4, 5].map((s) => {
               return (
                  <Shimmer
                     style={{
                        height: 120,
                        width: width - 32,
                        marginLeft: 16,
                        marginVertical: 8,
                        borderRadius: 7,
                        opacity: 0.4,
                     }}
                  />
               );
            })}
         </View>
      );
   }
   return (
      <View flex>
         <Header title={user.name + "'s Challenges"} back noShadow />

         <View duration={300} delay={0} style={{ width: '100%' }}>
            <FlatList
               showsVerticalScrollIndicator={false}
               data={[...userChallengesList].filter(
                  (c) => c.challengeType != 'team',
               )}
               refreshControl={
                  <RefreshControl
                     refreshing={refreshing}
                     onRefresh={onRefresh}
                  />
               }
               // ListFooterComponent={
               //    <View>
               //       <View marginB-120 />
               //    </View>
               // }
               onResponderRelease={onRelease}
               renderItem={({ item, index }) => (
                  <UserChallenge
                     playerChallengeId={item.id}
                     index={index}
                     playerChallenge={item}
                     playerChallengeInitial={item}
                     challengeId={item.challengeId}
                     smashStore={props.smashStore}
                  />
               )}
               keyExtractor={(item) => item?.id.toString()}
               style={{ paddingTop: 0 }}
               contentContainerStyle={{ paddingTop: 32, paddingBottom: 100 }}
            />
         </View>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(UserChallenges));
