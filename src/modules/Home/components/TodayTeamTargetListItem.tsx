import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { Vibrate } from 'helpers/HapticsHelpers';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/core'
import SectionHeader from 'components/SectionHeader';
import YourTargetTeamTargetToday from './YourTargetTeamTargetToday';
import TeamScrollView from 'components/TeamScrollView';
import { collection, query, where, limit, onSnapshot,doc } from "firebase/firestore";
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import Firebase from 'config/Firebase';
import ConfettiLottie from './TodayTeamTargetListItemComponents/ConfettiLottie';
import Ranking from 'nav/Ranking';
import NumberOfVotesForTeam from 'components/NumberOfVotesForTeam';


const TodayTeamTargetListItem = inject('smashStore',
'challengesStore',
'teamsStore')(observer(({ smashStore, teamId, index, teamsStore, tempTeam }) => {


   const {
      setHomeTabsIndex,
      subscribeToUserStories,
   } = smashStore;

   const {
      todayDateKey,
      setTeamUsersByTeamId,
      setVoteDocsHash,
     
   } = teamsStore;



   // const team = myTeams.find((t) => t.id === teamId) || tempTeam;

   const [team, setTeam] = useState(tempTeam);


   // useEffect(() => {

   //    const {
   
   //       myTeamsHash,
   //    } = teamsStore;
   
   //    setTeam(myTeamsHash[tempTeam.id])
   
   //   return () => {
       
   //   }
   // }, [])
   
   const { navigate } = useNavigation();
   // const [loaded, setLoaded] = useState(true);
   
   // useEffect(() => {

   //    setTimeout(() => {
   //       setLoaded(true);
   //    }, (index + 1) * 500);

   //    return () => {};
   // }, []);

   useEffect(() => {

      // const {subbedToAlready} = teamsStore
console.log('voteDocs hash from todayTeamTargetListItem');
      // if(subbedToAlready?.[`vote_${teamId}`]) return
      const unsub = onSnapshot(doc(firestore, 'votes', teamId), (voteDocSnap) => {
         const voteDoc = voteDocSnap?.data();
         setVoteDocsHash(voteDoc, teamId);
      });

      return () => {if(unsub){unsub()}};
   }, []);

   useEffect(() => {

      console.log('subscribe to user stories from the team');
      team?.joined?.map((uid) => {
         if (!smashStore.subscribedToUsers?.[uid]) {
            subscribeToUserStories(uid, todayDateKey);
            /// Also subscribes to user doc in allUsersHash
         }
      });

      return () => {
         smashStore.unSub?.map((unsub) => {
            unsub();
         });
      };
   }, [team.joined, todayDateKey]);

   // useEffect(() => {
   //    const unsubscribeToPlayers = onSnapshot(
   //       query(
   //         collection(firestore, "users"),
   //         where("teams", "array-contains", team.id),
   //         limit(30)
   //       ),
   //       (snaps) => {
   //         if (!snaps.empty) {
   //           const playersArray = [];
   //           snaps.forEach((snap) => {
   //             if (!snap.exists) return;
   //             const user = snap.data();
   //             playersArray.push(user);
   //           });
       
   //           setTeamUsersByTeamId(team.id, playersArray);
   //         }
   //       }
   //     );

   //    return () => (unsubscribeToPlayers ? unsubscribeToPlayers() : null);
   // }, []);

   



   const goToTeamArenaPre = () => {
      Vibrate();
      setHomeTabsIndex(0);
      goToTeamArena(team);
   };


   const goToTeamArena = (team, initialIndex) => {
      navigate(Routes.TeamArena, { team, initialIndex: 0 || 0 });
   };


   console.log('todayteamlist render');
   
   return (
      <View style={{ borderBottomWidth: 10, paddingVertical: 16, overflow: 'hidden' }}>


         <ConfettiLottie team={team} />
         <SectionHeader
            onPress={goToTeamArenaPre}
            title={team.name}
            afterTitle={
               <Ranking
                  // hideWhenSmashing
                  today
                  loadIndex={index}
                  team={team}
                  // colorStart={team.colorStart}
                  // rank={3}
               />
            }
            style={{ marginLeft: 32, marginTop: 24 }}
            subtitle={
               <View row >
                  <TouchableOpacity row centerV onPress={goToTeamArenaPre}>
                     <Text B12 buttonLink>
                        LEADERBOARD
                     </Text>
                     <AntDesign name="right" color={Colors.buttonLink} />
                  </TouchableOpacity>
               </View>
            }
         />
         {/* {team?.requested?.length > 0 && isUserAdmin() && (
            <View padding-16 style={{ flexWrap: 'wrap' }}>
               <PlayerWantsToJoin
                  team={team}
                  onPressApproveUsers={
                     onPressApproveUsers
                  }></PlayerWantsToJoin>
            </View>
         )} */}
         <TeamScrollView team={team} home />


         <YourTargetTeamTargetToday team={team} />
         <View padding-16 paddingH-24 >
            <NumberOfVotesForTeam team={team} />
         </View>
         {/* <View paddingH-16>

            <WeeklyDayTargets
               {...{ team }}
               color={Colors.blue10}
            />
         </View> */}
      </View>
   );
 
}));

export default React.memo(TodayTeamTargetListItem, (prevProps, nextProps) => {
   // ... Memo comparison logic here ...
 });
// export default inject(
//    'smashStore',
//    'challengesStore',
//    'teamsStore',
// )(observer(TodayTeamTargetListItem));
