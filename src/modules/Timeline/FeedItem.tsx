import React, { useState, useEffect } from "react";
import moment from "moment";
import { inject, observer } from 'mobx-react';
import SmartImage from "../../components/SmartImage/SmartImage"
import {
   View,
   Colors,
   Image,
   Assets,
   Text,
   TouchableOpacity,
} from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import PostLikesHorizontal from 'components/PostLikes/PostLikesHorizontal';
import Routes from 'config/Routes';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Alert, Platform } from 'react-native';
import SmartVideo from "components/SmartImage/SmartVideo";
import { width } from "config/scaleAccordingToDevice";
import Firebase from "config/Firebase";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LottieAnimation from "components/LottieAnimation";
import FeedItemWhoLiked from "./FeedItemWhoLiked";
const FeedItem = (props) => {
   const { navigate } = useNavigation();
   const { smashStore, id, challengesStore,post } = props;
   const {
      kFormatter,
      actionLevels,
      currentUser,
      userStoriesHash,
      numberWithCommas,
      setCommentPost,
      isPremiumMember,
      willExceedQuota,
      showUpgradeModal
   } = smashStore;

   const { myChallengesHash } = challengesStore;

   let item = userStoriesHash?.[id] || {};


   const [thePost, setThePost] = useState(item);

  
   useEffect(() => {
      let item = userStoriesHash?.[id] || false;


      let unsub = () => { };
      if (!item) {

         unsub = subToThePost(id)

      };

      return () => {
         if (unsub) { unsub() }
      }
   }, [])


   const handleDoubleTap = () => {

      alert('Like')
   }

   item = thePost;

   const pointsEarned = item.value * item.multiplier;
   const level = item.level;
   const levelData = actionLevels?.[level] || false;
   const color = levelData ? levelData?.color : false;
   const label = levelData ? levelData?.label : false;
   const shadow = {
      shadowColor: '#ccc',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
   };

   const isMe = item.uid == currentUser.uid;

   const showCommentsModal = () => {
      // props.smashStore.showCommentsModal = true;
      // props.smashStore.stories = [item];
      // props.smashStore.storyIndex = 0;

      setCommentPost(item);
      smashStore.showCommentsModal = true;
   };


   const subToThePost = (id) => {

      return Firebase.firestore
         .collection('posts')
         .doc(id)
         .onSnapshot((snap) => {
            const post = snap.data();



            setThePost(post);
         });

   }


// useEffect(() => {
   // const unsubscribeToPost = smashStore.subscribeToPost(post.id, newPost => setThePost({ post: newPost }));

//   return () => {
//     if(unsubscribeToPost){unsubscribeToPost()}
//   }
// }, [])




   const goToProfile = () => {

      if (isMe) {
         navigate(Routes.MyProfile);
      } else {
         navigate(Routes.MyProfileHome, {
            user: { ...item.user, uid: item.uid, id: item.uid },
         });
      }
   };

   const goToUserProfile = (user) => {

      if (user.uid == currentUser.uid) {
         navigate(Routes.MyProfile);
      } else {
         navigate(Routes.MyProfileHome, {
            user
         });
      }
   };


   const goToChallengeArena = (playerChallenge) => {
      navigate(Routes.ChallengeArena, {
         challenge: {
            id: playerChallenge.challengeId,
            name: playerChallenge.challengeName,
         },
      });
   };



   const IAmFollowingThem =
      currentUser.following && currentUser.following.includes(item.uid);

   const user = item?.user || {};

   const cantAccess = () => {
      if (IAmFollowingThem) {
         Alert.alert(
            `Oops! ${user.name} is not following you yet.`,
            `We'll send you a notification if ${user.name} follows you back.`,
            [
               {
                  text: 'Got it',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
               },
            ],
         );
      } else {
         Alert.alert(
            `Oops! ${user.name} is not following you!`,
            "You can't view pictures of players that are not following you. Follow this player, then we'll let you know if they follow you back.",
            [
               {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
               },
               {
                  text: `Follow ${user.name} Now`,
                  onPress: () => {
                     const isFollowing = currentUser?.following?.includes(item.uid);
                     if(!isFollowing && !isPremiumMember && willExceedQuota(currentUser?.following?.length,'followingQuota')){
                        showUpgradeModal(true)
               
                        return 
                     }

                     smashStore.toggleFollowUnfollow(item.uid)},
               },
            ],
         );
      }
   };

   let borderColor = IAmFollowingThem ? Colors.blue30 : 'transparent';
   const isFollowingMe =
      (currentUser.followers && currentUser.followers.includes(item.uid)) ||
      isMe;
   const hasImage = item?.picture?.uri?.length > 10 && (isFollowingMe || isMe);

   const hasVideo = item?.video?.length > 10 && (isFollowingMe || isMe);


   if (isFollowingMe) {
      borderColor = Colors.green50;
   }
   const setPost = () => props.setPost(item);
   const ios = Platform.OS == 'ios' || false;


   if (!item?.id) { return null }


   const challengesToDisplay = item.challenges || item.challengeIds || false;


   if (item.type == 'challengeStreak') {


      return (<View style={{ ...shadow, marginTop: hasImage ? 8 : 8, backgroundColor: '#fff', margin: 16, borderRadius: 4, padding: 16, paddingBottom: 0 }}>


         <View
            row
            centerV
            style={{
               borderRadius: 6,
               marginHorizontal: 0,
               backgroundColor: hasImage ? 'rgba(255,255,255,0.8)' : 'white',
               paddingBottom: 0,
               marginTop: hasImage ? 0 : 0
            }}>

            <TouchableOpacity onPress={goToProfile} >
               <SmartImage
                  uri={item?.user?.picture?.uri}
                  preview={item?.user?.picture?.preview}
                  style={{
                     width: 55,
                     height: 55,
                     backgroundColor: '#aaa',
                     borderRadius: 100,
                     borderColor,
                     borderWidth: 0,
                  }}
               />
            </TouchableOpacity>
            <View paddingL-16 flex centerV style={{ borderWidth: 0 }}>
               <TouchableOpacity onPress={goToProfile} centerV>
                  <Text M16 color28 marginB-0>
                     {item?.user?.name.length > 10
                        ? item?.user?.name?.substring(0, 10)
                        : item?.user?.name}{' '}

                     <Text R12 color6D >
                        {moment(item.timestamp, 'X').fromNow()}
                     </Text>
                  </Text>

               </TouchableOpacity>
               <View row centerV>
                  {/* <Text R14>{item.title}</Text> */}
                  {challengesToDisplay &&
                     challengesToDisplay.map((theChallenge) => {


                        const challenge = theChallenge?.id ? theChallenge : myChallengesHash[theChallenge] || false;

                        if (!challenge) { return null }
                        return (
                           <TouchableOpacity
                              onPress={() => goToChallengeArena(challenge)}
                              row
                              key={challenge.id}
                              centerV
                              marginR-8>
                              {Platform.OS == 'ios' && false ? <LinearGradient
                                 style={{
                                    padding: 4,
                                    borderRadius: 16,
                                    borderRadius: 4,
                                    marginRight: 8,
                                 }}
                                 colors={[
                                    challenge?.colorStart || '#333',
                                    challenge?.colorEnd || '#333',
                                 ]}></LinearGradient> : <View
                                    style={{
                                       padding: 4,
                                       borderRadius: 16,
                                       borderRadius: 4,
                                       marginRight: 8,
                                       backgroundColor: challenge?.colorStart || '#333'
                                    }}
                                 ></View>}
                              <Text R12 secondaryContent>
                                 <AntDesign />
                                 {challenge?.challengeName || 'nada'}
                              </Text>
                           </TouchableOpacity>
                        );
                     })}

               </View>
            </View>


            {(!isFollowingMe || !isMe) && item?.picture?.uri && (
               <TouchableOpacity onPress={cantAccess}>
                  <SmartImage
                     uri={item?.picture?.uri}
                     preview={item?.picture?.preview}
                     style={{
                        height: 40,
                        width: 40,
                        borderRadius: 4,
                        marginTop: 16,
                        marginRight: 16,
                     }}
                  />
               </TouchableOpacity>
            )}
         </View>
         <View marginT-8>
            <Text B14 style={{ fontSize: 20 }}>{item.streak} Day Streak!</Text>
            <TouchableOpacity onPress={() => goToChallengeArena({ challengeId: item.challengeId, challengeName: item.name })}><Text M14 marginB-8>{item.name} {item.streak} Day Streak!</Text></TouchableOpacity>


         </View>

         <View style={{ position: 'absolute', right: 16 }}>
            <LottieAnimation source={require('../../lotties/67230-trophy-winner.json')} autoPlay loop style={{ width: 100, height: 100, alignSelf: 'center' }} />

         </View>
         {/* {hasImage && (isFollowingMe || isMe) && ios && (
            <View style={{ marginHorizontal: 0 }}>
               <SmartImage
                  uri={item?.picture?.uri}
                  preview={item?.picture?.preview}
                  style={{
                     width: '100%',
                     height: 400,
                     backgroundColor: '#aaa',
                  }}
               />
            </View>
         )}

         {hasVideo && (isFollowingMe || isMe) && ios && (
            <View style={{ marginHorizontal: 0 }}>
               <SmartVideo
                  uri={item?.video}
                  autoPlay={true}
                  preview={item?.picture?.preview}
                  style={{
                     width: '100%',
                     height: 400,
                     backgroundColor: '#aaa',
                  }}
               />
            </View>
         )} */}

         <View row >
            {isFollowingMe ? (
               <TouchableOpacity onPress={showCommentsModal} paddingV-16 row centerV marginR-16>
                  <FontAwesome name='comment' style={{ color: Colors.grey50 }} size={20} />
                  <Text right R14 marginL-8 grey30>
                     {(item.commentCount &&
                        `${item.commentCount} ${item.commentCount == 1 ? 'Comment' : 'Comments'
                        }`) ||
                        'Write a comment'}{' '}
                  </Text>
               </TouchableOpacity>
            ) : (
               <View style={{ height: 16 }} />
            )}


            {isFollowingMe && ios && (
               <PostLikesHorizontal post={item} />
            )}
         </View>
         {isMe && (
            <TouchableOpacity
               onPress={setPost}
               style={{ alignItems: 'flex-end', paddingRight: 16, position: 'absolute', right: 0, top: 8 }}>
               <MaterialCommunityIcons
                  name={'dots-horizontal'}
                  size={30}
                  color={'#aaa'}
               />
            </TouchableOpacity>
         )}
      </View>)
   }
   return (

      <View style={{ ...shadow, marginTop: hasImage ? 8 : 8, backgroundColor: '#fff', margin: 16, borderRadius: 4, padding: 16, paddingBottom: 4 }}>
         <View
            row
            centerV
            style={{
               borderRadius: 6,
               marginHorizontal: 0,
               backgroundColor: hasImage ? 'rgba(255,255,255,0.8)' : 'white',
               paddingBottom: 0,
               marginTop: hasImage ? 0 : 0
            }}>
            <TouchableOpacity onPress={goToProfile} >
               <SmartImage
                  uri={item?.user?.picture?.uri}
                  preview={item?.user?.picture?.preview}
                  style={{
                     width: 55,
                     height: 55,
                     backgroundColor: '#aaa',
                     borderRadius: 100,
                     borderColor,
                     borderWidth: 0,
                  }}
               />
            </TouchableOpacity>


            <View paddingL-16 flex centerV style={{ borderWidth: 0 }}>
               <TouchableOpacity onPress={goToProfile} centerV>
                  <Text M16 color28 marginB-0>
                     {item?.user?.name.length > 10
                        ? item?.user?.name?.substring(0, 10)
                        : item?.user?.name}{' '}

                     <Text R12 color6D >
                        {moment(item.timestamp, 'X').fromNow()}
                  </Text>
                  </Text>

               </TouchableOpacity>
               <View row centerV>

                  {challengesToDisplay &&
                     challengesToDisplay.map((theChallenge) => {


                        const challenge = theChallenge?.id ? theChallenge : myChallengesHash[theChallenge] || false;

                        if (!challenge) { return null }
                        return (
                           <TouchableOpacity
                              onPress={() => goToChallengeArena(challenge)}
                              row
                              key={challenge.id}
                              centerV
                              marginR-8>
                              {Platform.OS == 'ios' && false ? <LinearGradient
                                 style={{
                                    padding: 4,
                                    borderRadius: 16,
                                    borderRadius: 4,
                                    marginRight: 8,
                                 }}
                                 colors={[
                                    challenge?.colorStart || '#333',
                                    challenge?.colorEnd || '#333',
                                 ]}></LinearGradient> : <View
                                    style={{
                                       padding: 4,
                                       borderRadius: 16,
                                       borderRadius: 4,
                                       marginRight: 8,
                                       backgroundColor: challenge?.colorStart || '#333'
                                    }}
                                 ></View>}
                              <Text R12 secondaryContent>
                                 <AntDesign />
                                 {challenge?.challengeName || 'nada'}
                              </Text>
                           </TouchableOpacity>
                        );
                     })}

               </View>
            </View>


            {!isFollowingMe && !isMe && item?.picture?.uri && (
               <TouchableOpacity onPress={cantAccess}>
                  <SmartImage
                     uri={item?.picture?.uri}
                     preview={item?.picture?.preview}
                     style={{
                        height: 40,
                        width: 40,
                        borderRadius: 4,
                        marginTop: 16,
                        marginRight: 16,
                     }}
                  />

               </TouchableOpacity>
            )}
         </View>
         <View marginT-8>
            {(isFollowingMe || isMe) ? <Text M14 marginB-8>
               {item.multiplier || 1} x{' '} {item?.activityName?.length > 9
                  ? item.activityName
                  : item.activityName}
               <Text>{' '}({numberWithCommas(pointsEarned)} pts)</Text> </Text> : <Text M14 marginB-8>
               Smashed {item.activityName}
               <Text></Text> </Text>}

         </View>

         {hasImage && (isFollowingMe || isMe) && ios && (
            <View style={{ marginHorizontal: 0 }}>
               <SmartImage
                  uri={item?.picture?.uri}
                  preview={item?.picture?.preview}
                  style={{
                     width: '100%',
                     height: 400,
                     backgroundColor: '#fafafa',
                  }}
               />
            </View>
         )}

         {hasVideo && (isFollowingMe || isMe) && ios && (
            <View style={{ marginHorizontal: 0 }}>
                <SmartVideo
                  uri={item?.video}
                  autoPlay={true}
                  preview={item?.picture?.preview}
                  style={{
                     width: '100%',
                     height: 400,
                     backgroundColor: '#aaa',
                  }}
               />
            </View>
         )}

         <View row >
         {isFollowingMe ? (
               <TouchableOpacity onPress={showCommentsModal} paddingV-16 row centerV marginR-16>
                  <FontAwesome name='comment' style={{ color: Colors.grey50 }} size={20} />
                  <Text right R14 marginL-8 grey30>
                  {(item.commentCount &&
                     `${item.commentCount} ${
                        item.commentCount == 1 ? 'Comment' : 'Comments'
                     }`) ||
                     'Write a comment'}{' '}
               </Text>
            </TouchableOpacity>
         ) : (
            <View style={{ height: 16 }} />
         )}


            {isFollowingMe && (
               <PostLikesHorizontal post={item} />
            )}
         </View>
         {isMe && (
            <TouchableOpacity
               onPress={setPost}
               style={{ alignItems: 'flex-end', paddingRight: 16, position: 'absolute', right: 0, top: 8 }}>
               <MaterialCommunityIcons
                  name={'dots-horizontal'}
                  size={30}
                  color={'#aaa'}
               />
            </TouchableOpacity>
         )}


         <FeedItemWhoLiked item={item} goToUserProfile={goToUserProfile} />

      </View>

   );
};

export default inject("smashStore", "challengesStore")(observer(FeedItem))