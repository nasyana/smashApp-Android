import { width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { View, Colors, Image, Assets, Text, ActionSheet, TouchableOpacity } from 'react-native-ui-lib';
import Firebase from '../../config/Firebase';
import FeedItem from './FeedItem';
import { inject, observer } from 'mobx-react';
import FriendsScrollview from 'components/FriendsScrollview';
import CommentsModal from 'components/CommentsModal';
import SectionHeader from 'components/SectionHeader';
import { FlashList } from "@shopify/flash-list";
import ButtonLinear from "components/ButtonLinear";
import Shimmer from "components/Shimmer";
const Feed = (props) => {
   const [feed, setFeed] = useState([]);
   const [post, setPost] = useState(false);
   const clearPost = () => {
      setPost(false);
   };
   const { arenaIndex, header } = props;
   const { challengeId, uid, following, smashStore } = props;
   const filterFn = (item) => !item.isPrivate;


   const [query, setQuery] = useState(null);


   useEffect(() => {
      
      let query;
      // if (following?.length > 9) following.length = 9;
      if (following) {
         query = Firebase.firestore
            .collection('posts')
            .where('type', '==', 'smash')
            .where('active', '==', true)
            .where('followers', 'array-contains', Firebase.auth.currentUser.uid)
            // .where('uid', 'in', followingArray)
            .orderBy('timestamp', 'desc')

      } else if (uid) {
         query = Firebase.firestore
            .collection('posts')
            .where('type', '==', 'smash')
            .where('active', '==', true)
            .where('uid', '==', uid)
            .orderBy('timestamp', 'desc')

      } else {
         query = Firebase.firestore
            .collection('posts')
            .where('active', '==', true)
            .where('type', '==', 'smash')
            .orderBy('timestamp', 'desc')

      }

      setQuery(query);

      const unsubscribeToFeed = query.limit(12).onSnapshot((snaps) => {
         const feedItems = [];
         snaps.forEach((snap) => {
            const feedItem = snap.data();
            const isMe = Firebase.auth.currentUser.uid == feedItem.uid;
            if (currentUser?.following?.includes(feedItem.uid) || isMe) {

               feedItems.push(
                  feedItem || {
                     id: feedItem.id,
                     uid: feedItem.uid,
                     user: { ...feedItem.user, uid: feedItem.uid },
                  },
               );

            }

            const hasPostHadImageJustAdded = smashStore?.userStoriesHash?.[feedItem?.id]?.picture?.uri != feedItem?.picture?.uri;

            if (!smashStore.userStoriesHash?.[feedItem.id] || hasPostHadImageJustAdded) {
               smashStore.savePostToHash(feedItem);
            }
         });
         setFeed(feedItems.filter(filterFn));
         setData(feedItems.filter(filterFn));
      });

      return () => {
         if (unsubscribeToFeed) {
            unsubscribeToFeed();
         }
      };
   }, [challengeId, uid, following?.length]);

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

   const { currentUser } = smashStore;


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
   const loadMore = refresh => {

      let finalQuery = query
      // if (refresh) { alert('refresh') }
      return new Promise(resolve => {
         const db = Firebase.firestore;

         if (!refresh) {
            finalQuery = query.limit(3).startAfter(data[data.length - 1].timestamp);
         }
         finalQuery.get().then(snapshots => {

            let array = [];
            snapshots.forEach(snap => {
               array.push(snap.data());
            });


            const resolveWith = refresh ? array : [...data, ...array];
            console.log('resolveWith', resolveWith)
            // alert(array.length)
            resolve(resolveWith);
         });
      });


   }

   const [posts, setPosts] = useState([]);
   const [limit, setLimit] = useState(10);
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   useEffect(() => {
      // const unsubscribe =
      Firebase.firestore
         .collection('posts')
         // .where('type', '==', 'smash')
         .where('active', '==', true)
         .where('followers', 'array-contains', Firebase.auth.currentUser.uid)
         // .where('uid', 'in', followingArray)
         .orderBy('timestamp', 'desc')
         .limit(limit)
         .get().then(async (querySnapshot) => {
            const newPosts = await addNewPosts(querySnapshot, posts);
            setPosts([...posts, ...newPosts]);
         });
      return () => null //unsubscribe();
   }, [limit, refreshing]);

   const handleShowMore = () => {
      setLimit(limit + 7);
   };


   const refreshFeed = () => {

      setRefreshing(true);

      setTimeout(() => {
         setRefreshing(false)
      }, 500);

   }



   const handleLoadMore = () => {

      console.log('handleLoadMore data', loading)

      if (!loading) {
         setLoading(true);
         loadMore().then(newData => {
            setData([...newData]);
            setLoading(false);
         });
      }
   };

   const handleRefresh = () => {
      setRefreshing(true);
      loadMore(true).then(newData => {
         setData(newData);
         setRefreshing(false);
      });
   };

   console.log('posts', posts)

   const noPosts = posts?.length == 0;

   const array = new Array(posts?.length);
   // if (feed.length == 0 || currentUser?.following?.length == 0) { return null }
   return (
      <View flex>

            <SectionHeader
               title={'Activity Feed'}
               style={{ marginTop: 24 }}
            // subtitle={<TouchableOpacity onPress={refreshFeed}><Text>Refresh</Text></TouchableOpacity>}
            />

         {/* {currentUser.following && <FriendsScrollview />} */}
         {!refreshing ? <FlashList
          estimatedItemSize={91} 
            data={refreshing ? posts.slice() : posts || []}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            renderItem={({ item, index }) => refreshing ? <Shimmer style={{ height: 120, borderRadius: 16, width: width - 32, marginHorizontal: 16, marginVertical: 8 }} /> : <FeedItem setPost={setPost} id={item?.id || index} />}
            keyExtractor={(item, index) => item?.id ? item?.id?.toString() : index + 'N'}
            // contentContainerStyle={{ paddingTop: 0 }}
            ListHeaderComponent={header}
            ListEmptyComponent={<View paddingH-24><Text R14>No Activity Yet</Text></View>}
            // onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListFooterComponent={noPosts ? <View /> : loading ? <View paddingV-16><ActivityIndicator /></View> : <ButtonLinear title="Load More" onPress={handleShowMore} />}
         /> : <Shimmer style={{ height: 220, borderRadius: 16, width: width - 32, marginHorizontal: 16, marginVertical: 8 }} />}

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
         {/* <CommentsModal /> */}
      </View>
   );
};

export default inject('challengeArenaStore', 'smashStore')(observer(Feed));



function addNewPosts(querySnapshot, stateArray) {
   return new Promise((resolve, reject) => {
      // Create a new array to hold the new posts
      const newPosts = [];

      // Loop through the query snapshot
      querySnapshot.forEach((doc) => {
         // Get the data for the current document
         const data = doc.data();

         // Check if the post is already in the state array
         const postExists = stateArray.some((statePost) => statePost.id === data.id);

         // If the post doesn't already exist, add it to the new array
         if (!postExists) {
            newPosts.push(data);
         }
      });

      // Sort the new posts by timestamp in descending order
      newPosts.sort((a, b) => b.timestamp - a.timestamp);

      // Resolve the promise with the new array of posts
      resolve(newPosts);
   });
}
