import { width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect } from "react";
import { FlatList, ImageBackground } from "react-native";
import { View, Colors, Image, Assets, Text } from "react-native-ui-lib";
import { Button, ActionSheet } from 'react-native-ui-lib'; //eslint-disable-line
import _ from 'lodash';
import firebaseInstance from "../../config/Firebase";
import FeedItem from "../Timeline/FeedItem";
import { inject, observer } from 'mobx-react';
import Header from 'components/Header';
import Shimmer from 'components/Shimmer';
import { onSnapshot, query, collection, where, orderBy, limit } from 'firebase/firestore';
import CommentsModal from "components/CommentsModal";
import MainFeedItem from "modules/Timeline/MainFeedItem";
const Feed = (props) => {
   const [post, setPost] = useState(false);
   const [feed, setFeed] = useState([]);

   const [loaded, setLoaded] = useState(false);
   const { smashStore } = props;
   const { challengeId, uid, following, team, goalId } = props?.route?.params;
   // console.warn(following);
   
   const clearPost = () => {
      setPost(false);
   };


useEffect(() => {


  let unsubscribeToFeed;

  setTimeout(() => {
    setLoaded(true);
  }, 300);

  const filterFn = (item) => !item.isPrivate;

  const firestore = firebaseInstance.firestore;
  const postsCollection = collection(firestore, 'posts');

  const commonConstraints = [
    where('active', '==', true),
    orderBy('timestamp', 'desc'),
  ];

  let q;

  if(goalId){

   q = query(
      postsCollection,
      where('goals', 'array-contains', goalId),
      where('showInFeed', '==', true),
      ...commonConstraints,
      limit(25)
    );


  }else{

   if (team) {
      q = query(
        postsCollection,
        where('inTeam', 'array-contains', team.id),
        ...commonConstraints,
        limit(15)
      );
    } else if (following && !team) {
      q = query(
        postsCollection,
        where('followers', 'array-contains', firebaseInstance.auth.currentUser.uid),
        where('showInFeed', '==', true),
        ...commonConstraints,
        limit(25)
      );
    } else if (uid && !team) {
      q = query(
        postsCollection,
        where('challengeIds', 'array-contains', challengeId),
        where('followers', 'array-contains', firebaseInstance.auth.currentUser.uid),
        where('showInFeed', '==', true),
        where('uid', '==', uid),
        ...commonConstraints,
        limit(25)
      );
    } else {
      q = query(
        postsCollection,
        where('challengeIds', 'array-contains', challengeId),
        ...commonConstraints,
        limit(25)
      );
    }


  }
  

  unsubscribeToFeed = onSnapshot(q, (snaps) => {
    const feedItems = snaps.docs.map((doc) => doc.data());
    setFeed(feedItems.filter(filterFn));
  });

  return () => {
    if (unsubscribeToFeed) {
      unsubscribeToFeed();
    }
  };
}, [challengeId]);


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

   const removePostAndPoints = () => {
      smashStore.smash(post, false, true);
   };
   const hidePostFromFeed = () => {
      Firebase.firestore
         .collection('posts')
         .doc(post.id)
         .set({ showInFeed: false }, { merge: true });
   };
   const hidePicture = (bool) => {
      Firebase.firestore
         .collection('posts')
         .doc(post.id)
         .set({ showPicture: !bool }, { merge: true });
   };

   let optionsArray = [
      { label: 'Hide Post from Feed', onPress: () => hidePostFromFeed() },
      // { label: post?.showPicture ? 'Hide Picture' : 'Show Picture', onPress: () => hidePicture(post?.showPicture) },
   ];

   if (post.type == 'smash') {
      optionsArray = [
         { label: 'Hide Post from Feed', onPress: () => hidePostFromFeed() },
         {
            label: 'Cancel & Remove Points',
            onPress: () => removePostAndPoints(),
         },
         // { label: post?.showPicture ? 'Hide Picture' : 'Show Picture', onPress: () => hidePicture(post?.showPicture) },
      ];
   }
   return (
      <View flex>
         <Header
            title={following ? "Players I'm Following" : 'Recent Posts'}
            back
         />

         {!loaded ? (
            <View style={{ marginTop: 32 }}>
               <Shimmer
                  style={{
                     width: width - 32,
                     height: 300,
                     margin: 16,
                  }}
               />
               <Shimmer
                  style={{
                     width: width - 32,
                     height: 300,
                     margin: 16,
                  }}
               />
            </View>
         ) : (
            <FlatList
               data={feed}
               showsVerticalScrollIndicator={false}
               renderItem={({ item, index }) => (

                  // const post = item
                  <MainFeedItem post={item} id={item.id} setPost={(item) => setPost(item)} />
                  // <FeedItem id={item?.id || index} setPost={(post) => setPost(post)} />
               )}
               keyExtractor={(item, index) => index.toString()}
               contentContainerStyle={{ paddingTop: 16 }}
               ListEmptyComponent={
                  <View row spread paddingH-16 centerH marginT-8>
                     <Text R16 color28>
                    {!team
                       ? 'Oops! No-one you follow has posted yet..'
                       : 'Oops! No-one in your team has posted yet..'}
                     </Text>
                  </View>
               }
               // ListHeaderComponent={}
            />
         )}

         <ActionSheet
            title={'Post Options'}
            // message={'Message of action sheet'}
            cancelButtonIndex={3}
            destructiveButtonIndex={0}
            useNativeIOS={false}
            options={optionsArray}
            visible={post}
            onDismiss={clearPost}
         />
         {/* <CommentsModal feedComments />  */}
      </View>
   );
};

export default inject("challengeArenaStore", "smashStore")(observer(Feed));
