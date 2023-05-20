import { width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView } from 'react-native';
import { View, Colors, Image, Assets, Text, ActionSheet, TouchableOpacity, ExpandableSection } from 'react-native-ui-lib';
import firebaseInstance from '../../config/Firebase';
import MainFeedItem from './MainFeedItem';
import { inject, observer } from 'mobx-react';
import FriendsScrollview from 'components/FriendsScrollview';
import CommentsModal from 'components/CommentsModal';
import SectionHeader from 'components/SectionHeader';
import { FlashList } from "@shopify/flash-list";
import ButtonLinear from "components/ButtonLinear";
import Shimmer from "components/Shimmer";
import { Feather } from "@expo/vector-icons";
import FeedHeader from "./FeedHeader";
import FeedFooter from "./FeedFooter";
import { collection, query, where, orderBy, onSnapshot,setDoc } from "firebase/firestore";
import ActionMenu from './ActionMenu'

const firestore = firebaseInstance?.firestore;
const MainFeed = (props) => {

 

const setPost = (post) => {

   smashStore.setActionMenuPost(post);
}
   const {  uid, smashStore } = props;
   const {initFeed,feed = [],  currentUserFollowing, showFeed} = smashStore;
 
   const following = currentUserFollowing || [];

   useEffect(() => {

      if(!showFeed){return}
      let theQuery;
    
      if (following || true) {
         theQuery = query(
          collection(firestore, "posts"),
          where("active", "==", true),
          where("followers", "array-contains", firebaseInstance.auth.currentUser.uid),
          orderBy("timestamp", "desc")
        );
      } else if (uid) {
         theQuery = query(
          collection(firestore, "posts"),
          where("active", "==", true),
          where("uid", "==", uid),
          orderBy("timestamp", "desc")
        );
      } else {
         theQuery = query(
          collection(firestore, "posts"),
          where("active", "==", true),
          where("type", "==", "smash"),
          orderBy("timestamp", "desc")
        );
      }
      console.log('initFeed render')
      initFeed(theQuery);
     
  
    
      return () => null;
    }, [following?.length,showFeed]);









 

   const MemoizedMainFeedItem = React.memo(MainFeedItem, (prevProps, nextProps) => {
      return prevProps.id === nextProps.id;
    });

   const renderItem = ({ item, index }) => {
      // if (refreshing) {
      //   return <Shimmer style={{ height: 120, borderRadius: 16, width: width - 32, marginHorizontal: 16, marginVertical: 8 }} />;
      // } else {
        return <MemoizedMainFeedItem  setPost={setPost} post={item} id={item?.id || index} />;
      // }
    };
   const noPosts = feed?.length == 0 || feed == false;
   if(!showFeed){return <FeedHeader />}

   console.log('render mainfeed')

   return (
      <View flex>

            <FeedHeader />



            <FlatList
            estimatedItemSize={250} 
            data={feed.map((item)=>item)}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id ? item?.id?.toString() : index + 'N'}
            contentContainerStyle={{ paddingTop: 0, paddingBottom: 32 }}
            // ListHeaderComponent={header}
            ListEmptyComponent={<View paddingH-24><Text R14 secondaryContent>Activity will be displayed here once you connect with a friend and start posting, completing daily habit challenge goals, and maintaining winning streaks. You can also like and comment on your friend's activities and photos.</Text></View>}
            // refreshing={loadingFeed}
            // refreshControl={<RefreshControl refreshing={loadingFeed} onRefresh={checkForNewPosts} />}
            // onEndReached={handleShowMore}
            // onEndReachedThreshold={0.5}
            // refreshing={refreshing}
            // onRefresh={handleRefresh}
            ListFooterComponent={<FeedFooter/>}
         />
    
<ActionMenu />
       
         {/* <CommentsModal /> */}
      </View>
   );
};

export default inject('challengeArenaStore', 'smashStore')(observer(MainFeed));

