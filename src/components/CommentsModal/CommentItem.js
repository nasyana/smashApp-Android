import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { View, Text } from 'react-native-ui-lib';
import SmartImage from 'components/SmartImage/SmartImage';
import ReplyComments from './ReplyComments';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { unixToFromNowShort } from 'helpers/dateHelpers';
import { inject, observer } from 'mobx-react';
import { Vibrate } from 'helpers/HapticsHelpers';
import { width } from 'config/scaleAccordingToDevice';
const CommentItem = ({ item, smashStore }) => {
   const {currentUserId} = smashStore;
   const comment = item;
   // console.log(comment);
   const reply = () => {
      Vibrate();
      smashStore.setReplyComment(comment);
   };

   const likeComment = () => {
      Vibrate();
      smashStore.commentLike(comment);
   };

   const haveLiked = comment?.likes?.includes(currentUserId);
   return (
      <TouchableWithoutFeedback onLongPress={reply}>
         <View>
            <View spread style={[styles.container, { paddingBottom: 4 }]}>
               <View row>
                  <SmartImage
                     style={[styles.image, { marginRight: 8 }]}
                     uri={comment?.picture?.uri}
                  />

                  <View>
                     <View>
                        {comment?.commentOwnerName && (
                           <Text  B12>
                              {comment?.commentOwnerName || ''}
                           </Text>
                        )}
                        <View row>
                           <Text R14 style={{ maxWidth: width - 100 }}>{item.text}</Text>
                        </View>
                     </View>

                     <View row centerV marginT-4 marginB-4>
                        <Text
                           secondaryContent
                           marginL-0
                           
                           R12
                           style={{ marginRight: 6 }}>
                           {unixToFromNowShort(comment.timestamp)}
                        </Text>
                        <TouchableOpacity onPress={reply}>
                           {/* <Entypo
                           name={haveLiked ? 'reply' : 'reply'}
                           size={20}
                           color={haveLiked ? 'orange' : '#aaa'}
                        /> */}

                           <Text secondaryContent  R12>Reply</Text>
                        </TouchableOpacity>
                     </View>
                  </View>

                  {/* <View row marginR-4>
                     <Text R14 secondaryContent>
                        {unixToFromNow(comment.timestamp)}
                     </Text>
                  </View> */}
               </View>

               <View row>
                  <TouchableOpacity
                     onPress={likeComment}
                     row
                     centerH
                     style={{ marginLeft: 16 }}>
                     <AntDesign
                        name={haveLiked ? 'heart' : 'hearto'}
                        size={20}
                        color={haveLiked ? 'orange' : '#aaa'}
                     />
                     <Text
                        center
                        secondaryContent={haveLiked ? '#333' : '#aaa'}>
                        {comment.like || ''}
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>
            <ReplyComments commentId={comment.id} />
         </View>
      </TouchableWithoutFeedback>
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
