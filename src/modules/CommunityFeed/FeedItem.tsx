import React, {useState} from 'react';
import { moment } from 'helpers/generalHelpers';;

/* components */
import PostLikes from '../../components/PostLikes';
import SmartImage from '../../components/SmartImage/SmartImage';
import LottieAnimation from 'components/LottieAnimation';

/* styles icons react lib*/
import { View, Colors, Image, Assets, Text } from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

const FeedItem = (props: any) => {
   const { smashStore, item } = props;
   const { kFormatter, actionLevels, currentUser } = smashStore;

   let [countOfTaps, setCountOfTaps] = useState(1);
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
   const setPost = () => props.setPost(item);

   const fnDoubleTapLikePost = () => {
      if (countOfTaps === 2) {
         setCountOfTaps(0);
         setShowLottie(true);

         smashStore.postLike(item);
      } else {
         setTimeout(() => {
            setCountOfTaps(0);
            setCurrentImageID(null);
            setShowLottie(false);
         }, 3000);
      }
   };

   const fnReturnLottieView = () => {
      if (item?.id === currentImageID && showLottie) {
         return (
            <View
               style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
               <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <LottieAnimation
                     autoPlay
                     loop={true}
                     style={{
                        width: 85,
                        height: 85,
                        zIndex: 5,
                     }}
                     source={require('../../lotties/heart-animation.json')}
                  />
               </View>
            </View>
         );
      }
   };

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

         {hasImage && item.showPicture && (
            <View style={{ marginHorizontal: 16 }}>
               <TouchableWithoutFeedback
                  style={{ zIndex: 1 }}
                  onPress={() => {
                     setCurrentImageID(item?.id);
                     setCountOfTaps(countOfTaps++);

                     fnDoubleTapLikePost();
                  }}>
                  <View>
                     <SmartImage
                        uri={item?.picture?.uri}
                        preview={item?.picture?.preview}
                        style={{
                           width: '100%',
                           height: 400,
                           backgroundColor: '#aaa',
                        }}
                        isShowLottie={true}
                        lottieViewComponent={fnReturnLottieView}
                     />

                     <LinearGradient
                        colors={[
                           'rgba(0,0,0,0)',
                           'rgba(0,0,0,0)',
                           'rgba(0,0,0,0.7)',
                        ]}
                        style={{
                           margin: 0,
                           height: 400,
                           width: '100%',
                           borderRadius: 0,
                           position: 'absolute',
                        }}
                     />

                     {item.activityName && item?.picture?.uri && (
                        <View
                           style={{
                              width: '100%',
                              position: 'absolute',
                              bottom: 16,
                              left: 16,
                           }}>
                           <Text R18 white>
                              {item.text && item.text + ' '}
                           </Text>
                        </View>
                     )}
                  </View>
               </TouchableWithoutFeedback>
            </View>
         )}

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
               <SmartImage
                  uri={item?.user?.picture?.uri}
                  preview={item?.user?.picture?.preview}
                  style={{
                     width: 50,
                     height: 50,
                     backgroundColor: '#aaa',
                     borderRadius: 10,
                  }}
               />
            </View>
            <View paddingL-16 flex>
               {item.activityName ? (
                  <Text H14 color28 marginT-16 marginB-8>
                     {item?.user?.name} {item.multiplier || 1} x{' '}
                     <Text style={{ color }}>{item.activityName}</Text> (
                     {kFormatter(pointsEarned)}pts)
                  </Text>
               ) : (
                  <Text H14 color28 marginT-16 marginB-8>
                     {item?.user?.name}{' '}
                     <Text R14 color28 marginT-16 marginB-8>
                        {item.text}
                     </Text>
                  </Text>
               )}
               <View row centerV>
                  <Image source={Assets.icons.ic_time_16} />
                  <Text R14 color6D marginL-4>
                     {moment(item.timestamp, 'X').fromNow()}
                  </Text>
                  {label && (
                     <Image
                        source={Assets.icons.ic_level}
                        tintColor={Colors.color6D}
                        marginL-16
                     />
                  )}
                  <Text R14 marginL-4 color6D>
                     {label}
                  </Text>
               </View>
            </View>
            <PostLikes post={item} />
         </View>
      </View>
   );
};

export default inject('smashStore')(observer(FeedItem));
