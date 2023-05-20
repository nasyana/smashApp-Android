import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { View, Text, Colors, Assets, Image } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import { formatDistanceToNow } from 'date-fns';
import SmartImage from '../../components/SmartImage/SmartImage';
import firebaseInstance from 'config/Firebase';
import Routes from 'config/Routes';
import { useNavigation } from '@react-navigation/native';
import SmartVideo from 'components/SmartImage/SmartVideo';
import LottieAnimation from 'components/LottieAnimation';
import { width } from 'config/scaleAccordingToDevice';
import { doc, onSnapshot } from "firebase/firestore";


const SocialNotification = ({ item, hearts, pressImage, isCelebration }) => {
   const [post, setPost] = useState({ picture: item.itemPicture, video: null });

   useEffect(() => {

      if(!item.itemId){return}
      // const unsub = onSnapshot(doc(firebaseInstance.firestore, 'posts', item.itemId), (docSnap) => {
      //    const postData = docSnap.data();
      
      //    if (postData) {
      //       setPost(postData);
      //    }
      // });

      // return () => {
      //    if (unsub) {
      //       unsub();
      //    }
      // };
   }, []);

   // if (post?.video) {
   //    console.log('post?.video', post.video);
   // }

   const isChallengeStreak = item.itemType == 'challengeStreak';
   
   return (
      <TouchableOpacity
         onPress={() => isCelebration ? () => null : pressImage(item)}
         style={{
            marginHorizontal: 16,
            marginBottom: 16,
            borderRadius: 6,
            backgroundColor: item?.unread ? Colors.grey60 : Colors.grey80,
            flexDirection: 'row',
            padding: 16,
         }}>
         <SmartImage
            uri={item?.causeUserPicture?.uri}
            preview={item?.causeUserPicture?.preview}
            style={{ height: 50, width: 50, borderRadius: 60 }}
         />

         <View marginL-16 flex >

            <Text H14 color28 marginB-0 style={{ width: isCelebration ? width - (width / 1.8) : width - (width / 2.2) }}>
               {item.title} {hearts.length > 1 && hearts.map((heart) => '♥')}
            </Text>
            {!isCelebration && item.subtitle && <Text R14>({item.subtitle})</Text>}
            {isCelebration && item.comment && <Text R14>{`"${item.comment}"`}</Text>}
            {isChallengeStreak ? <Text>{item.itemName}</Text> : item.itemName && <Text secondaryContent R14>
                  {/* {item.multiplier && item.multiplier + ' x '} */}
                  {item.itemName}
            </Text>}


            <Text R12 color6D>
               {formatDistanceToNow(item.timestamp)} 
            </Text>
         </View>

         {(post?.picture?.uri?.length > 10 || item?.picture?.uri?.length > 10) && (
            <SmartImage
               uri={post?.picture?.uri || item?.picture?.uri}
               preview={item?.itemPicture?.preview || item?.picture?.preview}
               style={{
                  height: 50,
                  width: 50,
                  borderRadius: 3,
                  borderWidth: 0
                  // backgroundColor: Colors.buttonLink
               }}
            />
         )}

         {isCelebration && <View style={{ position: 'absolute', right: 16, top: isChallengeStreak ? -15 : 0 }}>
            <LottieAnimation source={require('../../lotties/67230-trophy-winner.json')} autoPlay loop style={{ width: 100, height: 100, alignSelf: 'center' }} />

         </View>}

         {post?.video?.length > 10 && (
            <SmartVideo
               key={post.video}
               isBackground
               rate={1.0}
               volume={1.0}
               isMuted={false}
               resizeMode="cover"
               shouldPlay={true}
               isLooping
               useNativeControls={false}
               source={{ uri: post?.video }}
               uri={post.video || ''}
               style={{
                  height: 50,
                  width: 50,
                  borderRadius: 3,

                  borderWidth: 0
                  // borderWidth: 1,
                  // backgroundColor: '#333',
               }}
            />
         )}
         {/* <Text>{post?.video}</Text> */}
      </TouchableOpacity>
   );
};

export default SocialNotification;
