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
const Player = (props) => {
   const { navigate } = useNavigation();
   const {
      item,
      index,
      challenge,
      playerChallengeData,
      challengesStore,
      goToProfile,
      challengeIsSingleActivity,
      kFormatter,
      setInsightsPlayerChallengeDoc,
      currentUser,
      community,
   } = props;
   const { qty = 0, score = 0 } = item;
   const { user } = item;

   const fullUser = { ...user, uid: item.uid };
   const selectedGradient = playerChallengeData?.selectedGradient || [
      '#eee',
      '#333',
   ];
   const displayUnit = challenge?.targetType == 'points' ? score : qty;

   const iAmFollowing =
      !community ||
      currentUser?.following?.includes(item.uid) ||
      item.uid == currentUser?.uid;
   const pressInsights = () => {
      if (!iAmFollowing || !item) {
         return;
      }
      challengesStore?.setInsightsPlayerChallengeDoc(item);
   };

   const onPressUser = () => {
      goToProfile(fullUser);
   };
   const { dailyAverage } = challenge;

   const removePlayerChallenge = () => {
      if (currentUser.superUser) {
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
            onLongPress={removePlayerChallenge}>
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
                  preTouchableOpacity={user?.picture?.preview}
                  style={{
                     height: 50,
                     width: 50,
                     borderRadius: 60,
                     borderWidth: 2,
                     borderColor: '#fff',
                  }}
               />
            </LinearGradient>
         </TouchableOpacity>

         <View paddingL-16 centerV style={{ flex: 1 }} row spread>
            <Text H14 color28 marginT-16 marginB-8 onPress={onPressUser}>
               {user?.name || 'anon'}
            </Text>

            {!community && (
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
         <View paddingL-16 row spread paddingR-24 centerV style={{ flex: 2 }}>
            <Text
               buttonLink
               marginT-16
               marginB-8
               style={{ fontSize: isSmall ? 30 : 35 }}
               onPress={pressInsights}
               flex>
               {kFormatter(displayUnit) || 0}
            </Text>
            {/* <Text>{dailyAverage}</Text> */}
            <ChallengeLike item={item} />
         </View>
      </View>
   );
};
export default Player;
