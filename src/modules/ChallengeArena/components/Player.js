import { width, isSmall } from 'config/scaleAccordingToDevice';
import React from 'react';
import SmartImage from '../../../components/SmartImage/SmartImage';
import { FlatList, ImageBackground, Alert } from 'react-native';
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
   Avatar,
   TouchableOpacity,
} from 'react-native-ui-lib';
import ChallengeLike from './ChallengeLike';
import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import { dayNumberOfChallenge } from 'helpers/dateHelpers';
import CurrentPlayerStreak from './CurrentPlayerStreak';
import HighestPlayerStreak from './HighestPlayerStreak'
const Player = (props) => {
   const { navigate } = useNavigation();
   const {
      item,
      challenge,
      challengesStore,
      smashStore,
      kFormatter,
      currentUser,
      community,
      index
   } = props;

console.log('item',item)
   const {  playerChallengeHashByChallengeId } = challengesStore;
   const {currentUserId,currentUserFollowing} = smashStore;
   const { qty = 0, score = 0, rank = 1 } = item;
   const { user, isPrivate = false } = item;

   const fullUser = { ...user, uid: item.uid };

   const playerChallengeData = playerChallengeHashByChallengeId[challenge.id];
   const selectedGradient = playerChallengeData?.selectedGradient || [
      '#eee',
      '#333',
   ];
   const displayUnit = challenge?.targetType == 'points' ? score : qty;

   const iAmFollowing =
      !community ||
      currentUserFollowing?.includes(item.uid) ||
      item.uid == currentUserId;
   const pressInsights = () => {
      if (!iAmFollowing || !item) {
         return;
      }
      challengesStore?.setInsightsPlayerChallengeDoc(item);
   };
   const isPlayerPrivate = isPrivate && item.uid != currentUserId;

   const goToProfile = () => {

      const playerId = item.uid;
      if (playerId == currentUserId) {
         smashStore.navigation.navigate(Routes.MyProfile);
      } else {
         smashStore.navigation.navigate(Routes.MyProfileHome, {
            user: { uid: playerId },
         });
      }

      smashStore.stories = [];
      smashStore.storyIndex = 0;
   };


   const onPressUser = () => {

      if(isPlayerPrivate)return 
      goToProfile(fullUser);
   };
   const { dailyAverageQty, dailyAverage,targetType  } = item;

   const removePlayerChallenge = () => {
      if (smashStore.isSuperUser) {
         Alert.alert('Remove Player Challenge?', 'Are you sure?', [
            {
               text: 'Cancel',
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel',
            },
            {
               text: 'OK',
               onPress: () =>
                  Firebase.firestore
                     .collection('playerChallenges')
                     .doc(item.id)
                     .update({ active: false }),
            },
         ]);
      }
   };
   const dayOfChallenge = dayNumberOfChallenge(item) || 1;


   return (
      <View
         row
         style={{
            borderRadius: 6,
            marginHorizontal: 16,
            backgroundColor: '#FFF',
            paddingBottom: 16,
            overflow: 'hidden',
            marginBottom: 2,
         }}
         // onPress={() => goToProfile(user)}
      >
         <View centerV paddingL-16 paddingT-16>
            <Text>{index + 1}</Text>
         </View>

         <TouchableOpacity
            paddingT-16
            paddingL-16
            onPress={onPressUser}
            // onLongPress={removePlayerChallenge}
            >
            <LinearGradient
               start={{ x: 0.6, y: 0.1 }}
               colors={selectedGradient}
               style={{
                  width: 55,
                  height: 55,
                  borderRadius: 27.5,
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               {/* <Avatar source={Assets.icons.img_latest} /> */}
               <SmartImage
                  uri={user?.picture?.uri}
                  blur={isPlayerPrivate}
                  preview={user?.picture?.preview}
                  // preTouchableOpacity={user?.picture?.preview}
                  style={{
                     height: 50,
                     width: 50,
                     borderRadius: 60,
                     borderWidth: 2,
                     borderColor: '#fff',
                  }}
               />
            </LinearGradient>
            {/* {isPlayerPrivate && <Text>isPlayerPrivate</Text>} */}

         </TouchableOpacity>

         <View paddingL-16 centerV style={{ flex: 1.2 }} row spread>
            <View>
               <Text H14 color28 marginT-16 onPress={onPressUser}>
                  {isPlayerPrivate ? 'Private User' : user?.name || 'anon'}
               </Text>
               <HighestPlayerStreak playerChallenge={item} />
               {/* <Text R12 secondaryContent onPress={onPressUser}>
                  Day {dayOfChallenge}
               </Text> */}
            </View>
            {!community && false && (
               <TouchableOpacity
                  style={{ marginRight: 16 }}
                  onPress={pressInsights}>
                  <AntDesign
                     name="barschart"
                     size={20}
                     color={iAmFollowing ? '#333' : '#eee'}
                  />
               </TouchableOpacity>
            )}
         </View>
         <View paddingL-16 row spread paddingR-24 centerV centerH style={{ flex: 2 }}>

            <Text
               marginT-16
               buttonLink
               marginB-8
               centerH
               style={{ fontSize: isSmall ? 20 : 25 }}
               onPress={pressInsights}
               flex>
               {targetType == 'points' ? kFormatter(dailyAverage) : kFormatter(dailyAverageQty) || 0}
            </Text>


            <View flex ><CurrentPlayerStreak playerChallenge={item} relative /></View>
            {!isPlayerPrivate && <ChallengeLike item={item} />}
         </View>

      </View>
   );
};
export default Player;
