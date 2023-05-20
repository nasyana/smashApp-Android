import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { View, Text } from 'react-native-ui-lib';
import SmartImage from 'components/SmartImage/SmartImage';
import ReplyComments from './ReplyComments';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { todayHuman, unixToD, unixToFromNowShort, unixToHuman, unixToM, unixToMonth } from 'helpers/dateHelpers';
import { inject, observer } from 'mobx-react';
import { Vibrate } from 'helpers/HapticsHelpers';
import { width } from 'config/scaleAccordingToDevice';
const JournalEntry = ({ item, smashStore }) => {
   const comment = item;
   
   const reply = () => {
      Vibrate();
      smashStore.setReplyComment(comment);
   };

   const likeComment = () => {
      Vibrate();
      smashStore.commentLike(comment);
   };

   const haveLiked = comment?.likes?.includes(smashStore.currentUserId);
   const boxShadow = {
      shadowRadius: 3,
      shadowOpacity: 0.1,
      shadowColor: '#171717',
      shadowOffset: { width: 0, height: 2 },
   };

   return (
      <TouchableWithoutFeedback onLongPress={reply}>
         <View>
            <View spread style={[styles.container, { paddingBottom: 4 }]}>
               <View row flex centerV>
                  {/* <SmartImage
                     style={[styles.image, { marginRight: 8 }]}
                     uri={comment?.picture?.uri}
                  /> */}
   <View style={{width: 70}}><Text B18 center>{unixToM(comment.timestamp)}</Text><Text secondaryContent center R14>{unixToD(comment.timestamp)}</Text></View>
                  <View flex style={{...boxShadow, borderWidth:0, backgroundColor: '#fff', padding: 16, borderRadius: 4}} >
                     <View>
                        {comment?.commentOwnerName && (
                           <Text secondaryContent R12>
                              {comment?.commentOwnerName || ''}
                           </Text>
                        )}
                        <View row marginB-24>
                           <Text style={{ maxWidth: width - 100 }}>{item.text}</Text>
                        </View>
                     </View>

             
                        <View row spread>
                           <Text R12 secondaryContent>...</Text>
                     <Text
                           secondaryContent
                           marginL-0
                           R12
                           style={{ marginRight: 6 }}>
                           {unixToHuman(comment.timestamp)}
                        </Text>
                        </View>
                  </View>

                  {/* <View row marginR-4>
                     <Text R14 secondaryContent>
                        {unixToFromNow(comment.timestamp)}
                     </Text>
                  </View> */}
               </View>

               {/* <View row>
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
               </View> */}
            </View>
            {/* <ReplyComments commentId={comment.id} /> */}
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

export default inject('smashStore', 'notificatonStore')(observer(JournalEntry));
