import { width } from 'config/scaleAccordingToDevice';
import React, { useState, useEffect } from 'react';
import { FlatList, ImageBackground } from 'react-native';
import { View, Colors, Image, Assets, Text } from 'react-native-ui-lib';
import firebaseInstance from '../../config/Firebase';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import FeedItem from './FeedItem';
import { inject, observer } from 'mobx-react';
import Header from 'components/Header';
import Follower from 'components/Follower';
const FollowingNew = (props) => {
   const [followers, setFollowers] = useState([]);

   const { user } = props?.route?.params;
   const { smashStore, challengesStore } = props;

   const { like, kFormatter, currentUser } = smashStore;
   const { uid } = user;

   useEffect(() => {
      const q = query(
        collection(firebaseInstance.firestore, 'users'),
        where('followers', 'array-contains', uid),
        limit(30)
      );
      const unsubscribeToPlayers = onSnapshot(q, (snaps) => {
        if (!snaps.empty) {
          const users = [];
    
          snaps.forEach((doc) => {
            const user = doc.data();
            users.push(user);
          });
    
          setFollowers(users);
        }
      });
    
      return () => {
        if (unsubscribeToPlayers) {
          unsubscribeToPlayers();
        }
      };
    }, [uid]);

   const renderItem = ({ item, index }) => {
      if (!item) {
         return null;
      }
      return (
         <Follower
            item={item}
            index={index}
            {...{ currentUser, challengesStore, smashStore, like, kFormatter }}
         />
      );
   };

   const DATA = [
      {
         img: 'https://firebasestorage.googleapis.com/v0/b/smash-app-81ca9.appspot.com/o/d75b8421-332e-b9f7-7f9c-acfe5281a224?alt=media&token=d40c35bc-a3d7-40b2-9346-1884d6fbcef6',
         title: `Design Your Diet To Fight Chronic Inflammation`,
         time: 'Jan 30, 2018',
         type: 'Nutrition',
      },
      {
         img: 'https://firebasestorage.googleapis.com/v0/b/smash-app-81ca9.appspot.com/o/002f1a14-a70d-1194-6b58-2c9afaa29de7?alt=media&token=7b0a3b65-c68a-4720-8b65-80eeaa59c9e5',
         title: `The Ultimate Kris Gethin Muscle-Building Meal Plan`,
         time: 'Jan 30, 2018',
         type: 'Nutrition',
      },
      {
         img: 'https://firebasestorage.googleapis.com/v0/b/smash-app-81ca9.appspot.com/o/4504476b-9fd9-9375-4622-a32d13a0bca2?alt=media&token=817b30ad-4318-4df9-8ad9-c9b1f31f3eac',
         title: `Your Expert Guide To Chia Seeds`,
         time: 'Jan 30, 2018',
         type: 'Nutrition',
      },
      {
         img: Assets.icons.img_nu3,
         title: `Podcast Episode 33: The Science of Physique…`,
         time: 'Jan 30, 2018',
         type: 'Nutrition',
      },
   ];

   return (
      <View flex>
         <Header title={'Following'} back />
         <FlatList
            data={followers}
            renderItem={renderItem}
            keyExtractor={(item, index) => item?.id.toString()}
            contentContainerStyle={{ paddingTop: 16 }}
            // ListHeaderComponent={}
         />
      </View>
   );
};

export default inject('challengesStore', 'smashStore')(observer(FollowingNew));
