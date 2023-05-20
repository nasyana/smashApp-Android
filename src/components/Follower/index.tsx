import { width } from "config/scaleAccordingToDevice";
import React, { useEffect, useState } from 'react';
import SmartImage from '../../components/SmartImage/SmartImage';
import { doc, onSnapshot } from 'firebase/firestore';
import {
   MaterialCommunityIcons,
   AntDesign,
   Ionicons,
   Feather,
} from '@expo/vector-icons';
import {
   View,
   Colors,
   Image,
   Assets,
   Text,
   Button,
   TouchableOpacity,
} from 'react-native-ui-lib';
import { endMonthKey } from 'helpers/dateHelpers';
// import Firebase from 'config/Firebase';
import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';
import { kFormatter } from 'helpers/generalHelpers';
import firebaseInstance from "../../config/Firebase";
const Follower = (props) => {
   const { navigate } = useNavigation();
   const {
      item,
      index,
      like,
      selectedDayKey,
      smashStore,
      currentUser,
      community,
   } = props;
   const { qty = 0 } = item;
   const user = item;
   const { uid } = user;

   const [day, setDay] = useState(false);

   const { kFormatter, todayDateKey, currentUserId, currentUserFollowing } = smashStore;
   const score = item?.dailyScores?.[selectedDayKey] || 0;
   const iAmFollowing =
      currentUserFollowing?.includes(item.uid) ||
      item.uid == currentUserId;
   const isMe = uid == currentUserId || user == false;

   useEffect(() => {
      const query = doc(firebaseInstance.firestore, 'dailyActivity', `${uid}_${todayDateKey}`);
  
      const unsubToUserDailyActivity = onSnapshot(query, (daySnap) => {
        if (daySnap.exists()) {
          const day = daySnap.data();
          setDay(day);
          smashStore.userDayDoc[day.uid] = day;
        }
      });
  
      return () => {
        if (unsubToUserDailyActivity) {
          unsubToUserDailyActivity();
        }
      };
    }, []);

   const onPressUser = () => {
      return null;
   };

   const goToProfile = () => {
      navigate(Routes.MyProfileHomeFollower, { user });
   };

   const goToUserDayView = () => {
      // navigate(Routes.UserDayView, {
      //    user,
      //    dayDocId: `${uid}_${todayDateKey}`,
      //    _day: day,
      // });
      navigate(Routes.DailyDetail, {
         focusUser: user,
         dayDocId: `${uid}_${todayDateKey}`,
         _day: day,
      });
   };
const numChallenges = user?.inChallengeArray?.length || false;
const numTeams = user.teams?.length;
const numFollowers = user?.followers?.length;
return (
   <View
      row
      style={{
         borderRadius: 6,
         marginHorizontal: 16,
         backgroundColor: '#FFF',
         paddingBottom: 12,
         overflow: 'hidden',
         marginBottom: 8,
      }}
      // onPress={() => goToProfile(user)}
   >
      <TouchableOpacity paddingT-16 paddingL-16 onPress={goToProfile}>
         {/* <Avatar source={Assets.icons.img_latest} /> */}
         <SmartImage
            uri={user?.picture?.uri}
            preview={user?.picture?.preview}
            style={{
               height: 50,
               width: 50,
               borderRadius: 60,
               backgroundColor: '#eee',
            }}
         />
      </TouchableOpacity>

      <View paddingL-16 flex row spread>
         <View paddingT-4>
            <View row spread marginB-4>
               <Text H16 color28 marginT-16 onPress={goToProfile}>
                  {user?.name || 'anon'}
               </Text>
               {/* <Text
                  secondaryContent
                  marginT-16
                  marginR-16
                  H14
                  meToday={day?.score > 0 ? true : false}
                  onPress={goToUserDayView}>
                  {day?.score > 0 ? kFormatter(day?.score) + ' pts' : ''}
               </Text> */}
            </View>
            <View row>
               {numTeams > 0 && (
                  <Text H14 secondaryContent marginB-8 marginR-8>
                     {numTeams
                        ? numTeams > 1
                           ? numTeams + ' Teams'
                           : numTeams + ' Team'
                        : null}
                  </Text>
               )}
               {numChallenges > 0 && (
                  <Text H14 secondaryContent marginB-8 marginR-8>
                     {numChallenges
                        ? numChallenges > 1
                           ? numChallenges + ' Challenges'
                           : numChallenges + ' Challenge'
                        : null}
                  </Text>
               )}
               {numFollowers > 0 && (
                  <Text H14 secondaryContent marginB-8>
                     {numFollowers > 1
                        ? numFollowers + ' Followers'
                        : numFollowers + ' Follower'}
                  </Text>
               )}
               {/* {numChallenges > 0 && (
                  <Text H14 secondaryContent marginB-8>
                     {numChallenges > 1
                        ? numChallenges + ' Challenges'
                        : numChallenges + ' Challenge'}
                  </Text>
               )} */}
            </View>
         </View>
      </View>

      <View paddingL-16 row spread paddingR-0 center>
         {/* {!isMe && (
               <Button
                  center
                  outline={iAmFollowing}
                  marginH-16
                  onPress={() => toggleFollowUnfollow(uid)}>
                  <Text white={!iAmFollowing}>
                     {iAmFollowing ? 'Following' : 'Follow'}
                  </Text>
               </Button>
            )} */}

         {isMe && (
            <Button outline marginH-16 center>
               <Text>Me</Text>
            </Button>
         )}
      </View>
   </View>
);
};
export default Follower