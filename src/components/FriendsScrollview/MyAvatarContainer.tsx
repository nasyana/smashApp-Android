import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/core';
import {
   Text,
   TouchableOpacity,
} from 'react-native-ui-lib'; //eslint-disable-line
import SmartImage from 'components/SmartImage/SmartImage';
import { inject, observer } from 'mobx-react';
import Routes from 'config/Routes';
import { unixToFromNow } from 'helpers/generalHelpers';
import Icons from './Icons';
import TodayQty from './TodayQty';
import TodayScore from './TodayScore';
import TeamsStore from 'stores/teamsStore';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import firebaseInstance from 'config/Firebase';
import moment, { isMoment } from 'moment';
const firestore = firebaseInstance.firestore;
const AvatarContainer = (props) => {
   const navigation = useNavigation();

   const { navigate = ()=>null } = navigation;
   const {
      playerId,
      smashStore,
      me = false,
      player: _player,
      index,
      teamsStore
   } = props;

  
const today = new Date();
const day = today.getDate().toString().padStart(2, '0');
const month = (today.getMonth() + 1).toString().padStart(2, '0'); // add 1 because months are zero-indexed
const year = today.getFullYear().toString();
const todayDateKey = `${day}${month}${year}`;

const [player, setPlayer] = useState(_player);


useEffect(() => {


   const usersCollection = collection(firestore, 'users');
   const userDoc = doc(usersCollection, playerId);
 
   const unsub = onSnapshot(userDoc, (snap) => {
     const user = snap.data();
   
 
     if(player.updatedAt !== user.updatedAt && user && player){

      // setPlayer(user);
      console.log('updatePlayerInActivePlayersLocal',player.updatedAt,user.updatedAt)
      teamsStore?.updatePlayerInActivePlayersLocal && teamsStore?.updatePlayerInActivePlayersLocal(user);
     }
   //   if(player.updatedAt === user.updatedAt) return;

  
   });
 

  return () => {
   if(unsub){unsub()}
  }
}, [playerId])


   const goToProfile = () => {
const {currentUserId} = smashStore

      if (playerId == currentUserId) {
         navigate(Routes.MyProfile);
      } else {
         navigate(Routes.MyProfileHome, { user: { uid: playerId } });
      }
   };

   const setStoriesForUser = () => {

         if (!smashStore.subscribedToUsers?.[playerId] && playerId) {
      smashStore.subscribeToUserStories(playerId, todayDateKey);
   }

      const { loadAndSetUserStories } =
      smashStore;
      const {  friendsTodayDocsHash, todayActivity } =
      smashStore;
      const todayPlayer = me ? todayActivity : friendsTodayDocsHash[player.uid] || {}
      const temporarySmashes = todayPlayer?.smashes;
      smashStore.navigation = navigation;
      loadAndSetUserStories(playerId, false, temporarySmashes);

      // alert('huh?')
   };



console.log('render avatar container in Friends', player.name)

   return (
      <TouchableOpacity
         onPress={setStoriesForUser}
         centerH
         marginR-8
         style={{
            borderRightWidth: me ? 1 : 0,
            borderColor: '#ccc',
            paddingRight: me ? 24 : 8,
            marginRight: me ? 16 : 0,
         }}>
   
         <SmartImage
            style={{
               height: 70,
               width: 70,
               borderRadius: 160,
               marginVertical: 6,
               marginHorizontal: 3,
               backgroundColor: '#eee'
            }}
            uri={player?.picture?.uri || 'temporaryAvatar'}
            preview={player?.picture?.preview || 'temporaryPreview'}
         />
       
         <TodayQty index={index} key={player.uid} player={player} setStoriesForUser={setStoriesForUser} me={me} />
       <Icons player={player}/>

         <TouchableOpacity onPress={goToProfile}>
            <Text M14 >
               {player?.name?.substring(0, 6)}{' '}
               <TodayScore player={player} me={me}/>
            </Text>
         </TouchableOpacity>
         <Text center secondaryContent R10 centerV>
            {unixToFromNow(player?.updatedAt)} {player && player?.feelings?.[todayDateKey]?.emoji || ''}
         </Text>
         {/* {smashStore.currentUser?.superUser && <Text center secondaryContent R10 centerV>
            {player?.updatedAt} {moment(player?.updatedAt, 'X').format('DD/MM/YYYY')}
         </Text>} */}
       
      </TouchableOpacity>
   );
};

export default inject('smashStore', 'teamsStore')(observer(AvatarContainer));
