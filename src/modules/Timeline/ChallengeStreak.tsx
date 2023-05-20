import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { inject, observer } from 'mobx-react';
import SmartImage from "../../components/SmartImage/SmartImage";
import {
    View,
    Colors, Text,
    TouchableOpacity
} from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import PostLikesHorizontal from 'components/PostLikes/PostLikesHorizontal';
import Routes from 'config/Routes';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, Platform } from 'react-native';
import LottieAnimation from "components/LottieAnimation";
import CommentCount from './CommentCount';
const MainFeedItem = (props) => {
   const { navigate } = useNavigation();


   const { smashStore, id, challengesStore,item, post,challenge } = props;
   
   const goToPost = () => {

      navigate(Routes.SinglePost, {postId: id})

   }


   const {
      
      currentUserId,
      numberWithCommas,
      setCommentPost,
      isPremiumMember,
      willExceedQuota,
      showUpgradeModal,
      currentUserFollowing,
      currentUserFollowers,
   } = smashStore;




   const [thePost, setThePost] = useState(post);


   const setPost = () => {
// alert(JSON.stringify(thePost));
      smashStore.setActionMenuPost(thePost);
   }


   const pointsEarned = item.value * item.multiplier;
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

   const isMe = item.uid == currentUserId;
//wrap showCommentsModal with useCallback
   const showCommentsModal = useCallback(() => {
      setCommentPost(item);
   }, [item, setCommentPost]);



   // const showCommentsModal = () => {
   //    setCommentPost(item);
   //    smashStore.showCommentsModal = true;
   // };





useEffect(() => {

   console.log('useeffect post.id',post.id);
   const unsubscribeToPost = smashStore.subscribeToPost(post.id, newPost => setThePost(newPost));

  return () => {
    if(unsubscribeToPost){unsubscribeToPost()}
  }
}, [post.id])




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

      if (user.uid == currentUserId) {
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
      currentUserFollowing && currentUserFollowing.includes(item.uid);

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
                     const isFollowing = currentUserFollowing?.includes(item.uid);
                     if(!isFollowing && !isPremiumMember && willExceedQuota(currentUserFollowing?.length,'followingQuota')){
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
      (currentUserFollowers && currentUserFollowers.includes(item.uid)) ||
      isMe;
   const hasImage = item?.picture?.uri?.length > 10 && (isFollowingMe || isMe);

   const hasVideo = item?.video?.length > 10 && (isFollowingMe || isMe);


   if (isFollowingMe) {
      borderColor = Colors.green50;
   }
   // const setPost = () => props.setPost(item);
   const ios = Platform.OS == 'ios' || false;


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
             
            </View>


            {!isFollowingMe && item?.picture?.uri && (
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

         <TouchableOpacity onPress={goToPost} style={{ position: 'absolute', right: 16 }}>
            <LottieAnimation source={require('../../lotties/67230-trophy-winner.json')} autoPlay loop style={{ width: 100, height: 100, alignSelf: 'center' }} />

         </TouchableOpacity>
         

         <View row >
         <CommentCount {...{item, isFollowingMe,showCommentsModal}} />


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
   
};

export default inject("smashStore", "challengesStore")(observer(MainFeedItem))