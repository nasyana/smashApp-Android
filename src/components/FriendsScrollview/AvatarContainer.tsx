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
import { collection, doc, onSnapshot } from 'firebase/firestore';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
const AvatarContainer = (props) => {
   const navigation = useNavigation();

   const { navigate = ()=>null } = navigation;
   const {

      smashStore,
      me = false,
      player,
      index,
      teamsStore,
      currentUser = false
   } = props;

  

// const today = new Date();
// const day = today.getDate().toString().padStart(2, '0');
// const month = (today.getMonth() + 1).toString().padStart(2, '0'); // add 1 because months are zero-indexed
// const year = today.getFullYear().toString();
// const todayDateKey = `${day}${month}${year}`;

// const [player, setPlayer] = useState(_player);

const [smashes, setSmashes] = useState(player?.smashes || []);
const [updatedAt, setUpdatedAt] = useState(player?.updatedAt || player.userUpdatedAt || 0);
const [score, setScore] = useState(player?.score || 0);
const [qty, setQty] = useState(player?.qty || 0);

// useEffect(() => {

//    const { todayDateKey } = smashStore;
// const { uid } = player;
// const query = doc(firebaseInstance.firestore, 'users', uid, 'days', todayDateKey);

 
//    const unsubToUserDailyActivity = onSnapshot(query, (daySnap) => {
//      if (daySnap.exists()) {
      
//       if(daySnap.data()?.smashes?.length != smashes?.length){

//          setSmashes(daySnap.data()?.smashes || []);
//       }

//       if(daySnap.data()?.updatedAt != updatedAt){

//          setUpdatedAt(daySnap.data()?.updatedAt || 0);
//       }
      
//       if(daySnap.data()?.score != score){
//        setScore(daySnap.data()?.score || 0);
//       }

//       if(daySnap.data()?.qty != qty){
//          setQty(daySnap.data()?.qty || 0);
//       }
//      }
//    });
 
//    return () => {
//      if (unsubToUserDailyActivity) {
//        unsubToUserDailyActivity();
//      }
//    };
//  }, []);


const playerId = player?.uid;



   const goToProfile = () => {
      

      // alert('playerId')

      // return
const {currentUserId} = smashStore

      if (playerId == currentUserId) {
         navigate(Routes.MyProfile);
      } else {
         navigate(Routes.MyProfileHome, { user: { uid: playerId } });
      }
   };



   

   const setStoriesForUser = () => {

// alert('asd')
//       console.log('player?.smashes ',player )
      const { todayDateKey } = smashStore;

      if (!smashStore.subscribedToUsers?.[playerId] && playerId) {
         smashStore.subscribeToUserStories(playerId, todayDateKey);
      }

      const { loadAndSetUserStories } = smashStore;

      smashStore.navigation = navigation;
      loadAndSetUserStories(playerId, false, (smashes || []));
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
       
         <TodayQty index={index} key={player.uid} player={player} smashes={smashes} setStoriesForUser={setStoriesForUser} me={me} />
       {/* <Icons player={player}/> */}

         <TouchableOpacity onPress={goToProfile}>
            <Text M14 >
               {player?.name?.substring(0, 6)}{' '}
               <TodayScore score={score} me={me}/>
            </Text>
         </TouchableOpacity>
         <Text center secondaryContent R10 centerV>
            {unixToFromNow(updatedAt )} {player?.emojis || ''}
         </Text>
         {/* {smashStore.currentUser?.superUser && <Text center secondaryContent R10 centerV>
            {player?.updatedAt} {moment(player?.updatedAt, 'X').format('DD/MM/YYYY')}
         </Text>} */}
       
      </TouchableOpacity>
   );
};

export default inject('smashStore', 'teamsStore')(observer(AvatarContainer));
