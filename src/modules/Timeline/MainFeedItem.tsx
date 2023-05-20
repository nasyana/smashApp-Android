import { useState, useEffect, useCallback } from "react";
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
import { LinearGradient } from 'expo-linear-gradient';

import { Alert, Platform } from 'react-native';
import SmartVideo from "components/SmartImage/SmartVideo";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import FeedItemWhoLiked from "./FeedItemWhoLiked";
import ImageContainer from "./ImageContainer";
import CommentCount from './CommentCount';
import ChallengeStreak from './ChallengeStreak';
const MainFeedItem = (props) => {
   const { navigate } = useNavigation();


   const { smashStore, id, challengesStore,post } = props;
   
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

   const { myChallengesHash } = challengesStore;

   let item = {};


   const [thePost, setThePost] = useState(post);


   const setPost = () => {
// alert(JSON.stringify(thePost));
      smashStore.setActionMenuPost(thePost);
   }

   item = thePost;

   const pointsEarned = (item?.value || 0) * (item?.multiplier || 0);
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
   const showCommentsModal = () => {
// alert('ss')
//       console.log('{...item, isFeedPost: true}',{...item, isFeedPost: true})
      setCommentPost({...item, isFeedPost: true});
   };



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


      return (<ChallengeStreak {...{item, post,shadow,hasImage, id}} />)
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
               <View row centerV style={{flexWrap: 'wrap'}}>

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
            <Text M14 marginB-8>
               {item.multiplier || 1} x{' '} {item?.activityName?.length > 9
                  ? item.activityName
                  : item.activityName}
               <Text>{' '}({numberWithCommas(pointsEarned)} pts)</Text> </Text>

         </View>
                  {/* <Text>{thePost.id}</Text> */}
         {hasImage && (isFollowingMe || isMe) &&  !item?.hideImage && (
           <TouchableWithoutFeedback onPress={goToPost}><ImageContainer post={item} isFollowingMe={isFollowingMe || isMe} ios={ios} id={id} hasImage={hasImage}/></TouchableWithoutFeedback>
          )}

         {hasVideo && (isFollowingMe || isMe) &&  !item?.hideImage && (
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
     <CommentCount {...{item, isFollowingMe,showCommentsModal}} />


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

            {/* <TouchableOpacity onPress={goToPost}><Text>Go To Post</Text></TouchableOpacity> */}
         <FeedItemWhoLiked item={item} goToUserProfile={goToUserProfile} />

      </View>

   );
};

export default inject("smashStore", "challengesStore")(observer(MainFeedItem))