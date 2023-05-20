import React from 'react';
import { Modal, StyleSheet, Text, useWindowDimensions, TouchableWithoutFeedback } from 'react-native';
import { View,TouchableOpacity } from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import Firebase from 'config/Firebase';
import firebase from 'firebase';
import {height, width} from 'config/scaleAccordingToDevice'
import AnimatedView from 'components/AnimatedView'
import { Vibrate } from 'helpers/HapticsHelpers';
import { sendEpicNotification } from 'services/NotificationsService';
const reactions = ['👍','😂','😯','😡','😢','🤗']
function ChatReactions({ smashStore }) {
   const { width: screenWidth, height: screenHeight } = useWindowDimensions();
   const { activeChatMessage, showChatReactionsModal, currentUser,hideChatReactionsModal } = smashStore;
   const onLike = (e) => {

      Vibrate();
      if (!activeChatMessage) return;

      const {uid} = Firebase.auth.currentUser
      Firebase.firestore
         .collection('chats')
         .doc(activeChatMessage.docId)
         .set(
            {
               likesCount: firebase.firestore.FieldValue.increment(1),
               reactions: {[e]: firebase.firestore.FieldValue.increment(1)},
               userReactions: {[uid]: {reaction: e, count:firebase.firestore.FieldValue.increment(1), picture: currentUser.picture, name: currentUser?.name }}
            },
            { merge: true },
         );

   
         sendEpicNotification(
            activeChatMessage?.user?._id,
            `${currentUser?.name} reacted ${e} to your comment`,
            {teamId: activeChatMessage.streamId},
            `"${activeChatMessage.text?.length > 20 ? activeChatMessage.text?.substring(0,20) : activeChatMessage.text}" (${activeChatMessage.streamName})`,
         );

      smashStore.showChatReactionsModal = false;
      smashStore.activeChatMessage = null;
   };

   return (
      <Modal
         visible={showChatReactionsModal}
         presentationStyle="overFullScreen"
         // animationType='slide'
         transparent>
         <TouchableOpacity onPress={hideChatReactionsModal} style={{backgroundColor: 'rgba(0,0,0,0.2)', height, width, position: 'absolute', top: 0, left: 0,alignItems: 'center',justifyContent: 'center'}}  >
        
           
            
               <AnimatedView row style={{borderWidth: 0,width: width - 32,alignItems: 'center', justifyContent: 'center',  padding: 30, flexDirection: 'row',
                  flexWrap: 'wrap'}}>
               {reactions.map((e, index) => <TouchableOpacity key={index + 'N'} onPress={() => onLike(e)} style={{ padding: 12 }}>
                     <Text style={{ fontSize: 60 }}>{e}</Text>
                  </TouchableOpacity>)}
               </AnimatedView>
      
            </TouchableOpacity>
   
      </Modal>
   );
}

export default inject('smashStore')(observer(ChatReactions));

const styles = StyleSheet.create({
   reactionsWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
   },
});
