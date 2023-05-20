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
import TodayQtyCurrentUser from './TodayQtyCurrentUser';
import TodayScore from './TodayScore';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
const CurrentUserAvatarContainer = (props) => {


   const navigation = useNavigation();

   const { navigate = ()=>null } = navigation;
   const {

      smashStore,
      me = false,
      player,
      index,
   } = props;

   const {currentUserPicture, todayActivity, currentUser }= smashStore

// const today = new Date();
// const day = today.getDate().toString().padStart(2, '0');
// const month = (today.getMonth() + 1).toString().padStart(2, '0'); // add 1 because months are zero-indexed
// const year = today.getFullYear().toString();
// const todayDateKey = `${day}${month}${year}`;

// const [player, setPlayer] = useState(_player);

const playerId = currentUser?.uid;



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
      loadAndSetUserStories(playerId, false, (smashStore.todayActivity?.smashes || []));
   };


console.log('render avatar container in Friends', player[0])

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
            uri={currentUserPicture?.uri || 'temporaryAvatar'}
            preview={currentUserPicture?.preview || 'temporaryPreview'}
         />
       
         <TodayQtyCurrentUser smashes={todayActivity?.smashes || []} index={index} key={currentUser.uid} isCurrentUser={true} setStoriesForUser={setStoriesForUser} me={me} />
       {/* <Icons player={player}/> */}

         <TouchableOpacity onPress={goToProfile}>
            <Text M14 >
               {currentUser?.name?.substring(0, 6)}{' '}
               <TodayScore score={todayActivity.score} me={me}/>
            </Text>
         </TouchableOpacity>
         <Text center secondaryContent R10 centerV>
            {unixToFromNow(currentUser?.updatedAt)} {smashStore?.currentUserEmoji || ''}
         </Text>
         {/* {smashStore.currentUser?.superUser && <Text center secondaryContent R10 centerV>
            {player?.updatedAt} {moment(player?.updatedAt, 'X').format('DD/MM/YYYY')}
         </Text>} */}
       
      </TouchableOpacity>
   );
};

export default inject('smashStore', 'teamsStore')(observer(CurrentUserAvatarContainer));
