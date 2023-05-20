import { width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect, useRef } from 'react';
import { FlatList, ImageBackground, StyleSheet } from 'react-native';
import {
   View,
   Colors,
   Image,
   Assets,
   Text,
   TouchableOpacity,
} from 'react-native-ui-lib';
import firebaseInstance from '../../config/Firebase';
import FeedItem from './FeedItem';
import { inject, observer } from 'mobx-react';
import Header from 'components/Header';
import Follower from 'components/Follower';
import Box from 'components/Box';
import FeedPreview from 'components/FeedPreview';
import SectionHeader from 'components/SectionHeader';
import FriendsScrollview from 'components/FriendsScrollview';
import Feed from 'modules/Timeline/Feed';
import { TextInput } from 'react-native-gesture-handler';
import { FONTS } from 'config/FoundationConfig';
import { FontAwesome5 } from '@expo/vector-icons';
import { InstantSearch } from 'react-instantsearch-hooks';
import { SearchBox } from './SearchBox';
import { InfiniteHits } from './InfiniteHits';
import algoliasearch from 'algoliasearch';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import CommentsModal from 'components/CommentsModal';
const searchClient = algoliasearch(
   'YE75PI6H3X',
   'b1e30281d5711cabc07ee5324c39b98c',
);

const Explore = (props) => {
   const [following, setFollowing] = useState([]);
   const [searchFocus, setSearchFocus] = useState(false);

   const { smashStore, challengesStore } = props;

   const { like, kFormatter, currentUser,currentUserId } = smashStore;
   const { uid } = currentUser;

   useEffect(() => {
      const unsubscribeToPlayers = onSnapshot(
         query(
            collection(firebaseInstance.firestore,'users'),
            where('followers', 'array-contains', uid)
         ),
         (snaps) => {
            if (!snaps.empty) {
               const followingArray = [];
      
               snaps.forEach((snap) => {
                  if (snap.exists) {
                     const user = snap.data();
      
                     if (user.uid != currentUserId && user.uid) {
                        followingArray.push(user);
                     }
                  }
               });
            }
         }
      );
      

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

   const listRef = useRef<FlatList>(null);

   return (
      <View flex>
         <Header title={"Find Players"} back />
         <InstantSearch searchClient={searchClient} indexName="users">
            <SearchBox
               onFocus={setSearchFocus}
               onChange={() =>
                  listRef.current?.scrollToOffset({
                     animated: false,
                     offset: 0,
                  })
               }
            />
            {searchFocus && <InfiniteHits ref={listRef} />}
         </InstantSearch>
     

         {/* <CommentsModal /> */}

         {/* <FlatList
            data={following}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingTop: 0 }}
         /> */}
      </View>
   );
};

export default inject('challengesStore', 'smashStore')(observer(Explore));