import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { View, Text, Colors, Assets, Image } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import { formatDistanceToNow } from 'date-fns';
import SmartImage from '../../components/SmartImage/SmartImage';
import Firebase from 'config/Firebase';
import Routes from 'config/Routes';
import SmartVideo from 'components/SmartImage/SmartVideo';
import FollowButton from './FollowButton';
import { useNavigation } from '@react-navigation/core';
const FollowNotification = ({ item, hearts, pressImage, notificatonStore, updateReadNotification }) => {
   // const [post, setPost] = useState({ picture: item.itemPicture, video: null });
   const { navigate } = useNavigation();


   const goToProfile = () => {


      if (item.type) {

         // console.warn(item.type);

         notificatonStore.resetNotificationCount('activity')
      }

      navigate(Routes.MyProfileHome, { user: { uid: item.causeUser } })
      updateReadNotification(item, item.type)

   }
   // if (post?.video) {
   //    console.log('post?.video', post.video);
   // }

   return (
      <View marginB-16>
         <TouchableOpacity
            onPress={() => goToProfile(item)}
            style={{
               marginHorizontal: 16,
               marginBottom: 0,
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

            <View marginL-16 flex>
               <Text H14 color28 marginB-0>
                  {item.title}
                  {/* {hearts.length > 1 && hearts.map((heart) => '♥')} */}
               </Text>
               {item.itemName && (
                  <Text secondaryContent>
                     {item.multiplier && item.multiplier + ' x '}
                     {item.itemName}
                  </Text>
               )}
               <View row centerV>
                  <Image source={Assets.icons.ic_time_16} />
                  <Text R14 color6D marginL-4>
                     {formatDistanceToNow(item.timestamp)} ago
                  </Text>
               </View>
               <FollowButton causeUser={item.causeUser} style={{ marginTop: 8, marginBottom: 0, marginHorizontal: 0 }} />
            </View>


         </TouchableOpacity>

      </View>
   );
};

export default FollowNotification;
