import { width } from 'config/scaleAccordingToDevice';
import React, { useEffect, useState } from 'react';
import SmartImage from '../SmartImage/SmartImage';
import { Alert, FlatList, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
import { doc, onSnapshot } from 'firebase/firestore';
import firebaseInstance from 'config/Firebase';
import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';
import { kFormatter } from 'helpers/generalHelpers';
import { moment } from 'helpers/generalHelpers';;
import ButtonLinear from 'components/ButtonLinear';
const Follower = (props) => {
   const { navigate } = useNavigation();
   const {
      item,
      index,
      like,
      selectedDayKey,
      smashStore,
      challengesStore,
      currentUser,
      community,
   } = props;
   const { qty = 0 } = item;
   const user = item;
   const { uid } = user;

   const [day, setDay] = useState(false);

   const { kFormatter, todayDateKey } = smashStore;
 

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
    }, [uid, todayDateKey]);
  



   const goToProfile = () => {
      navigate(Routes.MyProfileHome, { user });
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

   const { challengesHash } = challengesStore;
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
               <View row spread marginB-4 centerV flex>
                  <Text H14 color28 marginT-16 onPress={goToProfile} marginR-8>
                     {user?.name || 'anon'} ({user.os}){' '}
                     <Text M14 meToday marginL-16 marginT-16>
                        {(user?.dailyScores?.[todayDateKey] > 0 &&
                           user?.dailyScores?.[todayDateKey]) ||
                           0}
                     </Text>
                  </Text>

                  <Text M14 marginR-16 marginT-16>
                     {moment(user.updatedAt, 'X').fromNow()}
                  </Text>
               </View>
               <View>
                  {numTeams > 0 && (
                     <Text H14 secondaryContent marginB-8 marginR-8>
                        {numTeams
                           ? numTeams > 1
                              ? numTeams + ' Teams'
                              : numTeams + ' Team'
                           : null}
                     </Text>
                  )}
                  {/* {user.teams?.map((t)=><Text>{t}</Text>)} */}
                  {numChallenges > 0 && (
                     <Text H14 secondaryContent marginB-8 marginR-8>
                        {numChallenges
                           ? numChallenges > 1
                              ? numChallenges + ' Challenges'
                              : numChallenges + ' Challenge'
                           : ''}
                     </Text>
                  )}
                  {/* <View marginB-8>
                     {user?.inChallengeArray && user?.inChallengeArray?.map((cId) => {
                        const challenge = challengesHash?.[cId] || false;
                        if(!challenge) return null;
                        return <Text marginL-8 secondaryContent style={{ fontSize: 12 }}>{challenge.name}</Text>
                     })}

                  </View> */}
                  {numFollowers > 0 && (
                     <Text H14 secondaryContent marginB-8>
                        {numFollowers > 1
                           ? numFollowers + ' Followers'
                           : numFollowers + ' Follower'}
                     </Text>
                  )}

{/* <ButtonLinear onPress={()=>deleteUser(user)} title="Delete"/> */}

               </View>
            </View>
           
         </View>
       
      </View>
   );
                        };
export default Follower;
