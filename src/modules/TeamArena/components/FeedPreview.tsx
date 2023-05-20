import {useNavigation} from '@react-navigation/native';
import {FONTS} from 'config/FoundationConfig';
import React, {useEffect, useState, useRef} from 'react';
import {
   StyleSheet,
   TouchableOpacity,
   TouchableWithoutFeedback,
   Modal,
   Platform,
   Image,
} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {View, Colors, Text, Assets, Button, Avatar} from 'react-native-ui-lib';
import {inject, observer} from 'mobx-react';
import AnimatedView from 'components/AnimatedView';
import SmartImage from '../../../components/SmartImage/SmartImage';
import HypePost from '../../HypePost';
import Firebase from '../../../config/Firebase';
const FeedPreview = (props) => {
   const [feed, setFeed] = useState([]);
   const {navigate} = useNavigation();
   const textRef = useRef(null);
   const { challengeId, uid, following = false, smashStore, team } = props;
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
      navigate('Feed', { challengeId, following, team });
   };

   useEffect(() => {
      let unsubscribeToFeed;

      // if (following?.length > 9) following.length = 9;

      if (following) {
         unsubscribeToFeed = Firebase.firestore
            .collection('posts')
            // .where("type", "==", "smash")
            .where('active', '==', true)
            .where('showInFeed', '==', true)
            // .where('uid', 'in', [...following, Firebase.auth.currentUser.uid])
            .where('followers', 'array-contains', Firebase.auth.currentUser.uid)
            .orderBy('timestamp', 'desc')
            .limit(3)
            .onSnapshot((snaps) => {
               const feedItems = [];
               snaps.forEach((snap) => {
                  const feedItem = snap.data();
                  feedItems.push(feedItem);
               });
               setFeed(feedItems);
            });
      } else if (uid) {
         unsubscribeToFeed = Firebase.firestore
            .collection('posts')
            // .where("type", "==", "smash")
            .where('active', '==', true)
            .where('showInFeed', '==', true)
            .where('challengeIds', 'array-contains', challengeId)
            .where('uid', '==', uid)
            .orderBy('timestamp', 'desc')
            .limit(3)
            .onSnapshot((snaps) => {
               const feedItems = [];
               snaps.forEach((snap) => {
                  const feedItem = snap.data();
                  feedItems.push(feedItem);
               });
               setFeed(feedItems);
            });
      } else if (team) {
         unsubscribeToFeed = Firebase.firestore
            .collection('posts')
            .where('active', '==', true)
            .where('showInFeed', '==', true)
            .where('inTeam', 'array-contains', team.id)
            .orderBy('timestamp', 'desc')
            .limit(3)
            .onSnapshot((snaps) => {
               const feedItems = [];
               snaps.forEach((snap) => {
                  const feedItem = snap.data();
                  feedItems.push(feedItem);
               });
               setFeed(feedItems);
            });
      } else {
         unsubscribeToFeed = Firebase.firestore
            .collection('posts')

            .where('challengeIds', 'array-contains', challengeId)
            .where('active', '==', true)
            .where('showInFeed', '==', true)
            .orderBy('timestamp', 'desc')
            .limit(3)
            .onSnapshot((snaps) => {
               const feedItems = [];
               snaps.forEach((snap) => {
                  const feedItem = snap.data();
                  feedItems.push(feedItem);
               });
               setFeed(feedItems);
            });
      }

      return () => {
         if (unsubscribeToFeed) {
            unsubscribeToFeed();
         }
      };
   }, [challengeId]);

   const openPostModal = async () => smashStore.setHypePost({text: ''});

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
               style={{
                  // borderWidth: 1,
                  borderColor: Colors.line,
                  borderRadius: 4,
                  alignItems: 'center',
                  backgroundColor: Colors.white,
               }}>
               {/* <Image source={Assets.icons.ic_search_16} /> */}
               <TouchableOpacity onPress={openPostModal}>
                  <AntDesign name={'camera'} size={30} color={Colors.grey50} />
               </TouchableOpacity>

               <TouchableOpacity
                  onPress={goToFeed}
                  style={{ flexDirection: 'row', marginHorizontal: 16 }}>
                  {feed.map((post) => {
                     return post.picture?.uri ? (
                        <SmartImage
                           key={post.id}
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
                     paddingVertical: 15,
                  }}>
                  <Text color={Colors.grey50} marginR-8>
                     {feedEmpty ? 'No posts yet' : 'View More Posts'}
                  </Text>
                  <AntDesign name={'right'} size={20} color={Colors.grey50} />
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
