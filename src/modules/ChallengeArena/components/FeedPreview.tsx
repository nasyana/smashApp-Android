import React, {useEffect, useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {inject, observer} from 'mobx-react';
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
/* styles native helpers*/
import {FONTS} from 'config/FoundationConfig';
import {
   StyleSheet,
   TouchableOpacity,
   TouchableWithoutFeedback,
   Modal,
   Platform,
   Image,
} from 'react-native';
import {AntDesign, Fontisto} from '@expo/vector-icons';
import {View, Colors, Text, Assets, Button, Avatar} from 'react-native-ui-lib';
import {scale} from 'helpers/scale';

/* components */
import AnimatedView from 'components/AnimatedView';
import SmartImage from '../../../components/SmartImage/SmartImage';
import HypePost from '../../HypePost';
import firebaseInstance from '../../../config/Firebase';

const firestore = firebaseInstance.firestore;

const FeedPreview = (props) => {
   const [feed, setFeed] = useState([]);
   const {navigate} = useNavigation();
   const textRef = useRef(null);
   const { challengeId = false, uid = false, following = false, smashStore, goalId = false, dark = false } = props;
   const { capturedPicture, smashEffects, hypePost } = smashStore;
   const value = hypePost?.text || '';

   const onChangeText = (value) => {
      smashStore.setHypePost({ text: value });
   };

   const onClearText = () => {
      smashStore.hypePost = false;
      textRef.current.blur();
   };

   const goToCamera = async () => {
      navigate('TakePhoto', { hypePost: true });
   };

   const goToFeed = () => {
      navigate('Feed', { challengeId, following, goalId });
   };

   useEffect(() => {
      let unsubscribeToFeed;
const {currentUserId} = smashStore;
      const uid = currentUserId;

      if (following && !goalId) {
         const q = query(collection(firestore, "posts"), 
            where('active', '==', true),
            where('showInFeed', '==', true),
            where('followers', 'array-contains', uid),
            orderBy('timestamp', 'desc'),
            limit(3)
         );

         unsubscribeToFeed = onSnapshot(q, (snaps) => {
            const feedItems = [];
            snaps.forEach((snap) => {
               const feedItem = snap.data();
               feedItems.push(feedItem);
            });
            setFeed(feedItems);
         });
      } else if (uid && challengeId) {
         const q = query(collection(firestore, "posts"), 
            where('active', '==', true),
            where('showInFeed', '==', true),
            where('challengeIds', 'array-contains', challengeId),
            where('uid', '==', uid),
            orderBy('timestamp', 'desc'),
            limit(3)
         );

         unsubscribeToFeed = onSnapshot(q, (snaps) => {
            const feedItems = [];
            snaps.forEach((snap) => {
               const feedItem = snap.data();
               feedItems.push(feedItem);
            });
            setFeed(feedItems);
         });
      } else {

         if(goalId){


            const q = query(collection(firestore, "posts"), 
            where('active', '==', true),
            where('showInFeed', '==', true),
            where('goals', 'array-contains', goalId),
            orderBy('timestamp', 'desc'),
            limit(3)
         );

         unsubscribeToFeed = onSnapshot(q, (snaps) => {
            const feedItems = [];
            snaps.forEach((snap) => {
               const feedItem = snap.data();
               feedItems.push(feedItem);
            });
            setFeed(feedItems);
         });


         }else{


            const q = query(collection(firestore, "posts"), 
            where('active', '==', true),
            where('showInFeed', '==', true),
            where('challengeIds', 'array-contains', challengeId),
            orderBy('timestamp', 'desc'),
            limit(3)
         );

         unsubscribeToFeed = onSnapshot(q, (snaps) => {
            const feedItems = [];
            snaps.forEach((snap) => {
               const feedItem = snap.data();
               feedItems.push(feedItem);
            });
            setFeed(feedItems);
         });


         }
      
      }

      return () => {
         if (unsubscribeToFeed) {
            unsubscribeToFeed();
         }
      };
   }, [challengeId, following]);

   const openPostModal = async () => smashStore.setHypePost({ text: '' });

   const feedEmpty = feed?.length == 0;
   return (
      <>
         <TouchableWithoutFeedback
            onPress={() => textRef.current && textRef.current.focus()}>
            <View
               height={70}
               row
               spread
               paddingH-16
               paddingV-11
               marginH-16
               style={{
                  // borderWidth: 1,
                  borderColor: Colors.line,
                  borderRadius: 4,
                  alignItems: 'center',
                  backgroundColor: dark ? 'rgba(255,255,255,0.1)' : '#fff',
               }}>
               {/* <Image source={Assets.icons.ic_search_16} /> */}
               {/* <TouchableOpacity onPress={openPostModal}>
                  <AntDesign
                     name={'camera'}
                     size={scale(25)}
                     color={Colors.grey50}
                  />
               </TouchableOpacity> */}

               <TouchableOpacity
                  onPress={goToFeed}
                  style={{ flexDirection: 'row', marginHorizontal: 16 }}>
                  {feed.map((post) => {
                     return post.picture?.uri ? (
                        <SmartImage
                           key={post.id}
                           blur={post.isPrivate}
                           uri={post.picture?.uri}
                           preview={post.picture?.preview}
                           style={{
                              height: 50,
                              width: 50,
                              backgroundColor: '#ccc',
                              marginLeft: 2,
                              borderRadius: 4,
                           }}
                        />
                     ) : (
                        <SmartImage
                           key={post.id}
                           uri={post?.user?.picture?.uri}
                           blur={post.isPrivate}
                           preview={post?.user?.picture?.preview}
                           style={{
                              height: 50,
                              width: 50,
                              backgroundColor: '#ccc',
                              marginLeft: 2,
                              borderRadius: 4,
                           }}
                        />
                     );
                  })}
               </TouchableOpacity>
               {/* <TextInput
                    ref={textRef}
                    style={{
                        fontSize: 16,
                        fontFamily: FONTS.heavy,
                        marginLeft: 16,
                        color: Colors.color28,
                        flex: 1,
                    }}
                    onFocus={() => {
                        smashEffects();

                    }}
                    // onFocus={() => props.toggleFindChallenge(true)}
                    placeholder={props.placeholder || 'Hype up the team...'}
                    placeholderTextColor={Colors.color6D}
                    value={value}
                    onChangeText={onChangeText}
                    underlineColorAndroid={'transparent'}
                /> */}

               <TouchableOpacity
                  onPress={goToFeed}
                  style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                     justifyContent: 'center',
                     borderWidth: 0,
                     paddingVertical: 15,
                  }}>
                  <Text
                     marginR-6
                     color={dark ? Colors.grey50 : '#333'}
                     style={{ fontSize: scale(12) }}>
                     {feedEmpty ? 'No posts yet' : 'View More Posts'}
                  </Text>

                  <Fontisto
                     name="angle-right"
                     size={scale(16)}
                     color={Colors.grey50}
                  />
               </TouchableOpacity>
            </View>
         </TouchableWithoutFeedback>
         <Modal
            presentationStyle="overFullScreen"
            animationType="slide"
            keyboardShouldPersistTaps="always"
            transparent={false}
            statusBarTranslucent={false}
            visible={smashStore.hypePost ? true : false}
            onRequestClose={() => {}}>
            {/* <HypeUpInput challengeId={challenge.id} /> */}
            <HypePost challengeId={challengeId} />
         </Modal>
      </>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
)(observer(FeedPreview));
