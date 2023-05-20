import React, {useState, useRef, useCallback} from 'react';
import { moment } from 'helpers/generalHelpers';;

/* components */
import PostLikes from '../../components/PostLikes';
import SmartImage from '../../components/SmartImage/SmartImage';
import SmartVideo from '../../components/SmartImage/SmartVideo';

/* styles icons react lib*/
import { View, Colors, Image, Assets, Text } from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { scale } from 'helpers/scale';
import LottieAnimation from 'components/LottieAnimation';
import Routes from 'config/Routes';
const FeedItem = (props: any) => {
   const { navigate } = useNavigation();
   const { smashStore, item, challengesStore } = props;
   const { kFormatter, actionLevels, currentUser } = smashStore;

   const doubleTapRef = useRef();

   const [currentImageID, setCurrentImageID] = useState(null);
   const [showLottie, setShowLottie] = useState(false);

   const hasImage = item?.picture?.uri?.length > 10;
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

   const isMe = currentUser?.uid == item.uid;
   const setPost = (post) => {

      smashStore.setActionMenuPost(post);
   }

   const fnReturnLottieView = () => {
      if (item?.id === currentImageID && showLottie) {
         return (
            <View
               style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
               <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <LottieAnimation
                     autoPlay
                     loop={false}
                     style={{
                        width: 200,
                        height: 200,
                        zIndex: 5,
                     }}
                     source={require('../../lotties/heart-beat-pop-up.json')}
                  />
               </View>
            </View>
         );
      }
   };

   const handleDoubleTap = useCallback((e) => {
      setShowLottie(true);
      smashStore.postLike(item);

      setTimeout(() => {
         setCurrentImageID(null);
         setShowLottie(false);
      }, 1400);
   }, []);

   const goToProfile = () => {
      if (isMe) {
         navigate(Routes.MyProfile);
      } else {
         navigate(Routes.MyProfileHome, {
            user: { ...item.user, uid: item.uid, id: item.uid },
         });
      }
   };

   const showCommentsModal = () => {
      props.smashStore.showCommentsModal = true;
      props.smashStore.stories = [item];
      props.smashStore.storyIndex = 0;
   };
   const isFollowingMe =
      (currentUser.followers && currentUser.followers.includes(item.uid)) ||
      isMe;

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
                  onPress: () => smashStore.toggleFollowUnfollow(item.uid),
               },
            ],
         );
      }
   };

   let borderColor = IAmFollowingThem ? Colors.blue30 : 'transparent';

   if (isFollowingMe) {
      borderColor = Colors.green50;
   }
   // return null
   return (
      <View style={{ ...shadow }}>
         {isMe && (
            <TouchableOpacity
               onPress={setPost}
               style={{ alignItems: 'flex-end', paddingRight: 16 }}>
               <MaterialCommunityIcons
                  name={'dots-horizontal'}
                  size={30}
                  color={'#333'}
               />
            </TouchableOpacity>
         )}

         <View style={{ marginHorizontal: 16 }}>
            <TapGestureHandler
               // onActivated={() => (smashStore.currentStory = item)}
               ref={doubleTapRef}
               numberOfTaps={2}
               maxDelayMs={250}
               // onBegan={() => (smashStore.currentStory = item)}
               // onPress={}
               // onActivated={handleDoubleTap}
            >
               {/* <TapGestureHandler
                     onActivated={() => setCurrentImageID(item?.id)}> */}
               <View>
                  {item?.picture?.uri?.length > 10 && isFollowingMe && (
                     <SmartImage
                        uri={item?.picture?.uri}
                        blur={item.isPrivate}
                        preview={item?.picture?.preview}
                        style={{
                           height: scale(380),
                           width: '100%',
                           backgroundColor: '#aaa',
                           resizeMode: 'cover',
                        }}
                        isShowLottie={true}
                        lottieViewComponent={fnReturnLottieView}
                     />
                  )}
                  {item?.video?.length > 10 && !item.isPrivate && (
                     <SmartVideo
                        source={{ uri: item?.video }}
                        uri={item?.video}
                        key={item?.video}
                        rate={1.0}
                        volume={1.0}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay={true}
                        useNativeControls={false}
                        isLooping
                        // style={[styles.picture, { height: 200, position: "absolute", top: 0 }]}
                        style={{
                           height: scale(380),
                           width: '100%',
                           backgroundColor: '#aaa',
                           resizeMode: 'cover',
                        }}
                     />
                  )}

                  {isFollowingMe && item?.picture?.uri && (
                     <LinearGradient
                        colors={[
                           'rgba(0,0,0,0)',
                           'rgba(0,0,0,0)',
                           'rgba(0,0,0,0.7)',
                        ]}
                        style={{
                           margin: 0,
                           height: scale(380),
                           width: '100%',
                           borderRadius: 0,
                           position: 'absolute',
                        }}
                     />
                  )}

                  {item.activityName && item?.picture?.uri && (
                     <View
                        style={{
                           width: '100%',
                           position: 'absolute',
                           bottom: 16,
                           left: 16,
                        }}>
                        <Text R18 white>
                           {item.text && item.text + ' '} {item?.video}
                        </Text>
                     </View>
                  )}
               </View>
               {/* </TapGestureHandler> */}
            </TapGestureHandler>
         </View>

         <View
            row
            style={{
               borderRadius: 6,
               marginHorizontal: 16,
               backgroundColor: '#FFF',
               paddingBottom: 16,
               overflow: 'hidden',
               marginBottom: 16,
               paddingRight: 16,
            }}
            center>
            <View marginT-16 paddingL-16>
               <TouchableOpacity onPress={goToProfile}>
                  <SmartImage
                     uri={item?.user?.picture?.uri}
                     preview={item?.user?.picture?.preview}
                     style={{
                        width: 50,
                        height: 50,
                        backgroundColor: '#aaa',
                        borderRadius: 10,
                        borderColor,
                        borderWidth: 2,
                     }}
                  />
               </TouchableOpacity>
            </View>
            <View paddingL-16 flex>
               {item.activityName ? (
                  <TouchableOpacity onPress={goToProfile}>
                     <Text H14 color28 marginT-16 marginB-0>
                        {item?.user?.name} {item.multiplier || 1} x{' '}
                        <Text style={{ color }}>{item.activityName}</Text> (
                        {kFormatter(pointsEarned)}pts)
                     </Text>
                  </TouchableOpacity>
               ) : (
                  <TouchableOpacity onPress={goToProfile}>
                     <Text H14 color28 marginT-16 marginB-8>
                        {item?.user?.name}{' '}
                        <Text R14 color28 marginT-16 marginB-8>
                           {item.text}
                        </Text>
                     </Text>
                  </TouchableOpacity>
               )}
               <View row centerV>
                  {/* <Image source={Assets.icons.ic_time_16} /> */}
                  <Text R14 color6D >
                     {moment(item.timestamp, 'X').fromNow()}
                  </Text>
                  {label && (
                     <Image
                        source={Assets.icons.ic_level}
                        tintColor={Colors.color6D}
                        marginL-16
                     />
                  )}
                  {/* <Text R14 marginL-4 color6D>
                     {label}
                  </Text> */}
               </View>
            </View>
            {isFollowingMe && <PostLikes post={item} />}
            {/* <Text>{item.uid}</Text> */}

            {!isFollowingMe && item?.picture?.uri && (
               <TouchableOpacity onPress={cantAccess}>
                  <SmartImage
                     uri={item?.picture?.uri}
                     preview={item?.picture?.preview}
                     style={{ height: 40, width: 40, borderRadius: 4 }}
                  />
               </TouchableOpacity>
            )}
         </View>
         {isFollowingMe && (
            <View marginB-32>
               <TouchableOpacity
                  onPress={showCommentsModal}
                  marginB-44
                  paddingL-16
                  style={{ width: '100%', borderWidth: 0 }}>
                  <Text right marginL-16>
                     {(item.commentCount &&
                        `${item.commentCount} ${
                           item.commentCount == 1 ? 'Comment' : 'Comments'
                        }`) ||
                        'Write a comment'}{' '}
                  </Text>
               </TouchableOpacity>
            </View>
         )}
      </View>
   );
};

export default inject('smashStore', 'challengesStore')(observer(FeedItem));
