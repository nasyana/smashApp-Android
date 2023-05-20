import React, { useState, useCallback } from 'react';
import {
   View,
   Text,
   TouchableOpacity,
   Platform,
   Vibration,
} from 'react-native';
import {
   Bubble,
   GiftedChat,
   InputToolbar,
   Composer,
   MessageText,
} from 'react-native-gifted-chat';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
   SystemMessage,
   IMessage,
   Send,
   SendProps,
} from 'react-native-gifted-chat';
import _messages from './example-expo/data/messages';
import { inject, observer } from 'mobx-react';
// import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { SwipeRow } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Feather';

const Gifted = ({ id, smashStore }) => {
   const { currentUser } = smashStore;
   const [messages, setMessages] = useState(_messages);

   const [replyMsg, setReplyMsg] = React.useState({
      replyId: null,
      text: '',
      user: null,
   });

   const renderBubble = (props) => {
      return (
         <>
            <BubbleComp props={props} />
         </>
      );
   };

   const BubbleComp = ({ props }) => {
      const { text, system } = props.currentMessage;
      const onLeftAction = useCallback(
         ({ isActivated }) => {
            if (isActivated) {
               Vibration.vibrate(50);
               setReplyMsg({
                  replyId: props.currentMessage._id,
                  text,
                  user: props.currentMessage?.user?.name,
               });
            }
         },
         [id],
      );

      return (
         <SwipeRow
            useNativeDriver
            onLeftActionStatusChange={onLeftAction}
            disableLeftSwipe
            disableRightSwipe={
               system ||
               props.currentMessage.user?.name === currentUser?.nickname ||
               props.currentMessage.isReply ||
               props.currentMessage?.audio ||
               props.currentMessage?.image
            }
            leftActivationValue={90}
            leftActionValue={0}
            swipeKey={id + ''}>
            <></>
            <Bubble
               {...props}
               re
               wrapperStyle={{
                  left: { backgroundColor: '#F4183B', marginBottom: 10 },
                  right: { backgroundColor: '#D4D4D4', marginBottom: 10 },
               }}
               textStyle={{
                  left: { color: '#fff' },
                  right: { color: '#2A2E31' },
               }}
               timeTextStyle={{
                  left: { color: '#fff' },
                  right: { color: '#2A2E31' },
               }}
               tickStyle={{
                  color: props.currentMessage?.seen ? '#01A35D' : '#999',
               }}>
               <></>
            </Bubble>
         </SwipeRow>
      );
   };

   const renderSend = (props: SendProps<IMessage>) => (
      <Send {...props} containerStyle={{ justifyContent: 'center' }}>
         <MaterialIcons size={30} color={'tomato'} name={'send'} />
      </Send>
   );

   const Reply = () => {
      return (
         <View
            style={{
               height: 55,
               flexDirection: 'row',
               marginTop: 10,
               backgroundColor: 'rgba(0,0,0,.1)',
               borderRadius: 10,
               position: 'relative',
            }}>
            <View
               style={{ height: 55, width: 5, backgroundColor: 'red' }}></View>
            <View style={{ flexDirection: 'column', overflow: 'hidden' }}>
               <Text
                  style={{
                     color: 'red',
                     paddingLeft: 10,
                     paddingTop: 5,
                     fontWeight: 'bold',
                  }}>
                  {replyMsg?.user}
               </Text>
               <Text
                  style={{
                     color: '#034f84',
                     paddingLeft: 10,
                     paddingTop: 5,
                     marginBottom: 2,
                  }}>
                  {replyMsg.text}
               </Text>
            </View>
            <View
               style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  paddingRight: 2,
                  position: 'absolute',
                  right: 0,
                  top: 0,
               }}>
               <TouchableOpacity
                  onPress={() =>
                     setReplyMsg({ replyId: null, text: '', user: null })
                  }>
                  <Icon name="x" type="feather" color="#0084ff" size={20} />
               </TouchableOpacity>
            </View>
         </View>
      );
   };
   const ReplyWrapper = ({ id }) => {
      return <Reply id={id} />;
   };

   const renderInputToolbar = (props) => {
      return (
         <InputToolbar
            {...props}
            placeholder="Type your message here..."
            containerStyle={{
               marginLeft: 15,
               marginRight: 15,
               marginBottom: 5,
               borderRadius: 25,
               borderColor: '#fff',
               borderTopWidth: 0,
            }}
            textInputStyle={{ color: '#000' }}
            renderComposer={(props1) => {
               return (
                  <View style={{ flex: 1 }}>
                     {replyMsg.replyId && (
                        <ReplyWrapper id={replyMsg.replyId} />
                     )}
                     <Composer {...props1} />
                  </View>
               );
            }}
            textInputProps={{
               multiline: true,
               returnKeyType: 'go',
               onSubmitEditing: () => {
                  if (props.text && props.onSend) {
                     let text = props.text;
                     props.onSend({ text: text.trim() }, true);
                  }
               },
            }}
         />
      );
   };

   let platformConf =
      Platform.OS === 'ios'
         ? {
              minInputToolbarHeight: 58,
              bottomOffset: 0,
           }
         : {};

   const CustomMessageText = (props) => {
      return (
         <>
            <View style={{ padding: 5 }}>
               <View style={{ backgroundColor: '#005CB5', borderRadius: 15 }}>
                  <View style={{ flexDirection: 'row' }}>
                     <View
                        style={{
                           height: '100%',
                           width: 10,
                           backgroundColor: '#00468A',
                           borderTopLeftRadius: 15,
                           borderBottomLeftRadius: 15,
                        }}
                     />
                     <View style={{ flexDirection: 'column' }}>
                        <Text
                           style={{
                              color: 'white',
                              paddingHorizontal: 10,
                              paddingTop: 5,
                              fontWeight: '700',
                           }}>
                           {props.currentMessage?.isReply?.name}
                        </Text>
                        <Text
                           style={{
                              color: 'white',
                              paddingHorizontal: 10,
                              paddingTop: 5,
                              marginBottom: 5,
                           }}>
                           {props.currentMessage?.isReply?.text}
                        </Text>
                     </View>
                  </View>
               </View>
            </View>

            <MessageText {...props} />
         </>
      );
   };

   const renderMessageText = (props) => {
      if (props.currentMessage.isReply) {
         return <CustomMessageText {...props} />;
      }
      return <MessageText {...props} />;
   };

   return (
      <>
         <GiftedChat
            messages={messages}
            // onSend={message => onSend(message)}  // Don't forget to uncomment this.
            user={{
               _id: currentUser?._id,
               name: currentUser?.nickname,
               avatar: currentUser?.profileImage?.url,
            }}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            // onLongPress={onLongPress}
            alwaysShowSend
            renderSend={renderSend}
            // disableComposer={audioPressed}
            shouldUpdateMessage={() => true}
            renderMessageText={renderMessageText}
            // renderMessageAudio={props => renderAudio(props)}
            // renderActions={() => (
            //   <React.Fragment>
            //     <TouchableOpacity onPress={() => handleChoosePhoto()}>
            //       <MCI
            //         style={{
            //           alignItems: 'center',
            //           justifyContent: 'center',
            //           marginBottom: 9,
            //           marginLeft: 7,
            //           transform: [{rotate: '-45deg'}],
            //         }}
            //         name="attachment"
            //         size={30}
            //         color="#273C66"
            //       />
            //     </TouchableOpacity>
            //   </React.Fragment>
            // )}
            {...platformConf}
         />
      </>
   );
};

export default inject('smashStore', 'challengesStore')(observer(Gifted));
