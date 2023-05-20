import { StyleSheet, Image } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { View, Text } from 'react-native-ui-lib';
import SmartImage from 'components/SmartImage/SmartImage';
import ReplyComments from './ReplyComments';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { unixToFromNow } from 'helpers/generalHelpers';
import { inject, observer } from 'mobx-react';
import { Vibrate } from 'helpers/HapticsHelpers';
const CommentItem = ({ item, smashStore }) => {
   const comment = item;
   
   const reply = () => {
      Vibrate();
      smashStore.setReplyComment(comment);
   };

   const likeComment = () => {
      Vibrate();
      smashStore.commentLike(comment);
   };

   const haveLiked = comment?.likes?.includes(smashStore.currentUser?.uid);
   return (
      <View>
         <View style={[styles.container, { paddingBottom: 4 }]}>
            <SmartImage
               style={styles.image}
               uri={comment?.picture?.uri}
               //  source={{
               //     uri: 'https://cdn.vox-cdn.com/thumbor/HME6YC8484Vf48wW0vz9AGRNa3c=/0x0:4200x2600/1200x0/filters:focal(0x0:4200x2600):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/9490719/thor_big.jpg',
               //  }}
            />
            <View>
               <View>
                  <View
                     style={[
                        styles.containerText,
                        {
                           backgroundColor: '#F0F1F5',
                           padding: 7,
                           paddingHorizontal: 10,

                           borderRadius: 20,
                        },
                     ]}>
                     {comment?.commentOwnerName && (
                        <Text style={styles.userName}>
                           {comment?.commentOwnerName || ''}
                        </Text>
                     )}
                     <Text secondaryContent>{item.text}</Text>
                  </View>
               </View>
            </View>
         </View>
         <View row paddingL-67 paddingR-16 marginB-16 spread>
            <View row marginR-4>
               <Text R14 secondaryContent>
                  {unixToFromNow(comment.timestamp)}
               </Text>
               <TouchableOpacity
                  style={{ marginHorizontal: 16 }}
                  onPress={reply}>
                  <Text R14>Reply</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={likeComment}>
                  <Text R14>Like</Text>
               </TouchableOpacity>
            </View>
            <View row>
               <Text>{comment.like || ''}</Text>
               <AntDesign
                  name="like2"
                  size={14}
                  color={haveLiked ? 'orange' : '#333'}
               />
            </View>
         </View>
         <ReplyComments commentId={comment.id} />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      padding: 20,
      flexDirection: 'row',
      flex: 1,
   },
   image: {
      height: 32,
      width: 32,
      borderRadius: 32,
   },
   containerText: {
      marginHorizontal: 5,
   },
   userName: {
      color: 'black',
      fontSize: 14,
   },
});

export default inject('smashStore', 'notificatonStore')(observer(CommentItem));
