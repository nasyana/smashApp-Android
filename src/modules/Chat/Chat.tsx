import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Linking from 'expo-linking';
// import AppLoading from 'expo-app-loading';
import { useNavigation, useRoute } from '@react-navigation/core';

import React, {
   useState,
   useEffect,
   useLayoutEffect,
   useCallback,
   Component,
} from 'react';
import { StyleSheet, Platform, Alert } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { getDoc, updateDoc } from "firebase/firestore";
import { collection, query, where, orderBy, limit, onSnapshot, doc, setDoc, getDocs } from "firebase/firestore";

import {
   Bubble,
   GiftedChat,
   SystemMessage,
   IMessage,
   Send,
   SendProps,
   MessageText,
} from 'react-native-gifted-chat';
import { inject, observer } from 'mobx-react';
import AccessoryBar from './example-expo/AccessoryBar';
import CustomActions from './example-expo/CustomActions';
import CustomView from './example-expo/CustomView';
import messagesData from './example-expo/data/messages';
import earlierMessages from './example-expo/data/earlierMessages';
import { NavBar } from './components/navbar';
import Header from 'components/Header';
import SmartImage from 'components/SmartImage/SmartImage';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import ImageUpload from 'helpers/ImageUpload';
import { Vibrate } from 'helpers/HapticsHelpers';

import { width, height } from 'config/scaleAccordingToDevice';
import ChatFooter from './ChatFooter';
import MessageReply from './MessageReply';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { sendNotification } from 'services/NotificationsService';

const styles = StyleSheet.create({
   container: { flex: 1 },
});

const filterBotMessages = (message) =>
   !message.system &&
   message.user &&
   message.user._id &&
   message.user._id === 2;
const findStep = (step) => (message) => message._id === step;

// const user = {
//    _id: 1,
//    name: 'Developer',
// };

const otherUser = {
   _id: 2,
   name: 'React Native',
   avatar: 'https://facebook.github.io/react/img/logo_og.png',
};

@inject('smashStore')
@observer
export default class Chat extends Component {
   constructor() {
      super();
      this.state = {
         inverted: false,
         step: 0,
         messages: [],
         loadEarlier: false,
         typingText: null,
         isLoadingEarlier: false,
         appIsReady: false,
         isTyping: false,
         stream: { streamName: 'Chat!', streamId: false, smashappchat: false },
         replyMsg: null,
      };
      this.onClickReactions.bind(this);
   }

   _isMounted = false;
   unsubmessages;
   componentDidMount() {
      this._isMounted = true;
      const streamId = this.props.route?.params?.stream?.streamId || false;
      const streamName = this.props.route?.params?.stream?.streamName || false;
      const stream = this.props.route?.params?.stream || false;
      //   const isGoal = this.props.route?.params?.isGoal || false;
      const markRead = this.props.route?.params?.markRead || false;
      const idToMarkAsRead = this.props.route?.params?.idToMarkAsRead || false;

      if (markRead) {
         updateDoc(doc(collection(firestore, "chats"), idToMarkAsRead), {
            read: true
         });
      }

      const smashappchat = this.props.route?.params?.stream?.smashappchat || false;

      const { uid } = firebaseInstance.auth.currentUser;
      if (uid && streamId)
         setDoc(doc(collection(firestore, "unreads"), streamId), {
            [uid]: 0
         }, { merge: true });

      this.setState({ stream });
      if (!streamId) {
         alert("No stream Id!");
      }

      const collectionRef = query(
         collection(firestore, "chats"),
         where("streamId", "==", streamId),
         orderBy("createdAt", "desc"),
         limit(30)
      );
      this.unsubmessages = onSnapshot(
         collectionRef,
         (querySnapshot) => {
            const messagesArray = [];
            querySnapshot.forEach((doc) =>
               messagesArray.push({
                  _id: doc.data()._id,
                  docId: doc.data().id,
                  createdAt: doc.data().createdAt.toDate(),
                  text: doc.data().text,
                  user: doc.data().user,
                  streamName: streamName,
                  image: doc.data().image,
                  location: doc.data().location,
                  isReply: doc.data().isReply,
                  replyTo: doc.data().replyTo,
                  replyToUserId: doc.data().replyToUserId,
                  replyText: doc.data().replyText,
                  likesCount: doc.data().likesCount,
                  reactions: doc.data()?.reactions || false,
                  userReactions: doc.data()?.userReactions || false
               })
            );

            this.setState({
               messages: messagesArray,
               smashappchat
            });
         }
      );
   }

   componentWillUnmount() {
      this._isMounted = false;

      if (this.unsubmessages) {
         this.unsubmessages();
      }
   }

   onLoadEarlier = () => {
      this.setState(() => {
         return {
            isLoadingEarlier: true,
         };
      });

      setTimeout(() => {
         if (this._isMounted === true) {
            this.setState((previousState: any) => {
               return {
                  messages: GiftedChat.prepend(
                     previousState.messages,
                     earlierMessages() as IMessage[],
                     Platform.OS !== 'web',
                  ),
                  loadEarlier: true,
                  isLoadingEarlier: false,
               };
            });
         }
      }, 1500); // simulating network
   };

   onSend = async (messages = []) => {
      // const { params } = useRoute();
      Vibrate();
      const messageId = ImageUpload.uid();

      const theMessage = messages?.[0] || false;
      const imageToUpload = {
         uri: theMessage?.image || false,
         width: theMessage.width,
         height: theMessage.height,
      };

      const streamId = this.props.route?.params?.stream?.streamId || false;
      const isGoal = this.props.route?.params?.isGoal || false;
      const selectedImage = false;
      if (!streamId) {
         alert(`Can't send a message becuase this is not a stream!`);
      }

      const { smashStore } = this.props;

      const { currentUser, currentUserId } = smashStore;
      const step = this.state.step + 1;

      const sentMessages = [{ ...theMessage, sent: true, received: true }];

      this.setState((previousState: any) => {
         return {
            messages: GiftedChat.append(
               previousState.messages,
               sentMessages,
               Platform.OS !== 'web',
            ),
            step,
         };
      });

      const messageData = {
         _id: sentMessages[0]?._id,
         id: messageId,
         createdAt: sentMessages[0]?.createdAt,
         streamId: streamId,
         isGoal: isGoal,
         smashappchat: this.state.stream.smashappchat || false,
         uploadingImage: theMessage?.image?.length > 5 || false,
         location: theMessage?.location || false,
         isUser: currentUser?.superUser ? false : true,
         user: {
            id: currentUser.uid,
            _id: currentUser.uid,
            avatar: currentUser?.picture?.uri || 'no image',
            name: currentUser.name,
         },
      };

      if (this.state.replyMsg) {
         messageData.isReply = true;
         messageData.replyToUserId = this.state.replyMsg?.user?.id || '';
         messageData.replyTo = this.state.replyMsg?.user?.name || '';
         messageData.replyText = this.state.replyMsg?.text || '';
      }

      if (sentMessages[0]?.text) {
         messageData.text = sentMessages[0]?.text;
      }

      // alert(JSON.stringify(messageData));

      // console.log('messageData123', messageData);

      // const { _id, createdAt, text } = this.state.messages[0];
      const messageDocRef = doc(firestore, 'chats', messageId);
      setDoc(messageDocRef, messageData)
         .then(() => {
            this.setState({ replyMsg: null });
         });


      /// if image, upload to firestore storage. Otherwise

      if (!currentUser.superUser && this.state.stream.smashappchat) {
         const title = `${theMessage.user.name} needs help`;
         const message = `"${theMessage.text}"`;

         const usersRef = collection(firestore, 'users');
         const q = query(usersRef, where('superUser', '==', true));

         getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
               const userData = doc.data();
               if (userData.expoPushToken) {
                  const body = {
                     to: userData.expoPushToken,
                     sound: 'default',
                     title: title,
                     subtitle: message,
                  };
                  sendNotification(body);
               }
            });
         });
      }
      //// update chat message doc with image url. this

      if (imageToUpload.uri) {
         smashStore.uploadImage(imageToUpload).then(async (picture) => {
            // Assuming you have the messageId and picture variables defined already
            const chatDocRef = doc(firestore, 'chats', messageId);
            try {
               await updateDoc(chatDocRef, {
                  image: picture?.uri || '',
                  preview: picture?.preview || '',
                  uploadingImage: false,
               }, { merge: true });
               console.log('Image uploaded successfully');
            } catch (error) {
               console.error('Error uploading image:', error);
            }
         });
      }

      // for demo purpose
      // setTimeout(() => this.botSend(step), Math.round(Math.random() * 1000))
   };

   botSend = (step = 0) => {
      const newMessage = (messagesData as IMessage[])
         .reverse()
         // .filter(filterBotMessages)
         .find(findStep(step));
      if (newMessage) {
         this.setState((previousState: any) => ({
            messages: GiftedChat.append(
               previousState.messages,
               [newMessage],
               Platform.OS !== 'web',
            ),
         }));
      }
   };

   parsePatterns = (_linkStyle: any) => {
      return [
         {
            pattern: /#(\w+)/,
            style: { textDecorationLine: 'underline', color: 'darkorange' },
            onPress: () => Linking.openURL('http://gifted.chat'),
         },
      ];
   };

   onClickReactions = (message = {}) => {
      const { smashStore } = this.props;
      smashStore.showChatReactionsModal = true;
      smashStore.activeChatMessage = {
         ...message,
         streamId: this.props.route?.params?.stream?.streamId,
      };
   };

   renderCustomView = (props) => {
      const message = props.currentMessage;
      const isCurrentUserMessage =
         firebaseInstance.auth.currentUser.uid === message.user.id;
      console.log('message', message?.reactions);

      const allReactions = message.userReactions
         ? Object.values(message.userReactions)
         : [];
      return (
         <View style={{ borderWidth: 0 }}>
            <CustomView {...props} />
            <View
               row
               spread
               marginL-10
               style={{
                  flexDirection: 'row',
                  // backgroundColor: '#fff',
               }}>
               <TouchableOpacity
                  onPress={() => this.props.smashStore.showWhoReacted(message)}
                  row
                  style={{ alignSelf: 'flex-start' }}>
                  {allReactions &&
                     allReactions.map((user) => {
                        return (
                           <View row>
                              <SmartImage
                                 uri={user?.picture?.uri}
                                 preview={user?.picture?.preview}
                                 style={{
                                    height: 15,
                                    width: 15,
                                    borderRadius: 30,
                                    backgroundColor: '#333',
                                 }}
                              />
                              <Text marginR-4 style={{ marginLeft: -4 }}>
                                 {user?.reaction}
                              </Text>
                           </View>
                        );
                     })}
               </TouchableOpacity>

               {!isCurrentUserMessage && (
                  <TouchableOpacity
                     onPress={() => this.onClickReactions(message)}
                     style={{ alignSelf: 'flex-end' }}>
                     <Ionicons
                        name="happy-outline"
                        size={20}
                        style={{
                           alignSelf: 'flex-end',
                        }}
                     />
                  </TouchableOpacity>
               )}
            </View>
         </View>
      );
   };

   onReceive = (text: string) => {
      this.setState((previousState: any) => {
         return {
            messages: GiftedChat.append(
               previousState.messages as any,
               [
                  {
                     _id: Math.round(Math.random() * 1000000),
                     text,
                     createdAt: new Date(),
                     user: otherUser,
                  },
               ],
               Platform.OS !== 'web',
            ),
         };
      });
   };

   onSendFromUser = (messages: IMessage[] = []) => {
      const { smashStore } = this.props;
      const { currentUser, currentUserId } = smashStore;
      const createdAt = new Date();
      const messagesToUpload = messages.map((message) => ({
         ...message,
         user: {
            name: currentUser.name,
            _id: currentUserId,
            id: currentUserId,
         },
         createdAt,
         _id: Math.round(Math.random() * 1000000),
      }));

      // alert(JSON.stringify(messagesToUpload));
      this.onSend(messagesToUpload);
   };

   setIsTyping = () => {
      this.setState({
         isTyping: !this.state.isTyping,
      });
   };

   renderAccessory = () => (
      <AccessoryBar onSend={this.onSendFromUser} isTyping={this.setIsTyping} />
   );

   renderCustomActions = (props) =>
      Platform.OS === 'web' ? null : (
         <CustomActions {...props} onSend={this.onSendFromUser} />
      );

   renderBubble = (props: any) => {
      return (
         <View row>
            <Bubble {...props} />
         </View>
      );
   };

   renderSystemMessage = (props) => {
      return (
         <SystemMessage
            {...props}
            containerStyle={{
               marginBottom: 15,
            }}
            textStyle={{
               fontSize: 14,
            }}
         />
      );
   };

   onQuickReply = (replies) => {
      const createdAt = new Date();
      if (replies.length === 1) {
         this.onSend([
            {
               createdAt,
               _id: Math.round(Math.random() * 1000000),
               text: replies[0].title,
               user,
            },
         ]);
      } else if (replies.length > 1) {
         this.onSend([
            {
               createdAt,
               _id: Math.round(Math.random() * 1000000),
               text: replies.map((reply) => reply.title).join(', '),
               user,
            },
         ]);
      } else {
         console.warn('replies param is not set correctly');
      }
   };

   renderQuickReplySend = () => <Text>{' custom send =>'}</Text>;

   renderSend = (props: SendProps<IMessage>) => (
      <Send {...props} containerStyle={{ justifyContent: 'center' }}>
         <MaterialIcons size={30} color={'tomato'} name={'send'} />
      </Send>
   );

   renderMessageText = (props) => {
      if (props.currentMessage.isReply) {
         return <MessageReply {...props} />;
      }
      return (
         <View>
            <MessageText {...props} />
         </View>
      );
   };

   deleteMessage = (messageDocId) => {
      if (!messageDocId) return;
      Firebase.firestore.collection('chats').doc(messageDocId).delete();
   };

   onLongPress = (context, message) => {

      const isCurrentUserMessage =
         firebaseInstance.auth.currentUser.uid === message.user.id;
      const replyOptionText =
         message?.user?.name && !isCurrentUserMessage
            ? `Reply to ${message?.user?.name}`
            : 'Reply';

      let options = [replyOptionText, 'Copy Text', 'Cancel'];
      if (isCurrentUserMessage) {
         options = [replyOptionText, 'Delete', 'Copy Text', 'Cancel'];
      }

      const cancelButtonIndex = options.length - 1;

      const onClickActionButton = (buttonIndex: number) => {
         switch (buttonIndex) {
            case 0:
               this.setState({ replyMsg: message });
               break;
            case 1:
               Clipboard.setString(message.text);
               break;
         }
      };

      const onClickActionButtonWithDelete = (buttonIndex: number) => {
         switch (buttonIndex) {
            case 0:
               this.setState({ replyMsg: message });
               break;
            case 1:
               this.deleteMessage(message.docId);
            case 2:
               Clipboard.setString(message.text);
               break;
         }
      };

      context.actionSheet().showActionSheetWithOptions(
         {
            options,
            cancelButtonIndex,
         },
         isCurrentUserMessage
            ? onClickActionButtonWithDelete
            : onClickActionButton,
      );
   };

   render() {
      // if (!this.state.appIsReady) {
      //    return <AppLoading />;
      // }
      const { smashStore } = this.props;
      const { currentUser, currentUserId } = smashStore;
      const { stream } = this.state;
      // const { collection, addDoc, orderBy, query, onSnapshot } =
      //    Firebase.firestore;

      // const { signOut } = Firebase.aauth;
      return (
         <View
            style={styles.container}
            accessible
            accessibilityLabel="main"
            testID="main">
            {/* <NavBar /> */}
            <Header
               back
               title={
                  this.state.stream.smashappchat
                     ? 'Chat with us'
                     : `${stream?.streamName} Chat`
               }
            />
            <GiftedChat
               messages={this.state.messages}
               onSend={this.onSend}
               loadEarlier={this.state.loadEarlier}
               onLoadEarlier={this.onLoadEarlier}
               isLoadingEarlier={this.state.isLoadingEarlier}
               parsePatterns={this.parsePatterns}
               // renderMessageImage={(message) => {
               //    const { image } = message?.currentMessage;
               //    return (
               //       <SmartImage
               //          uri={image || ''}
               //          preview={image || ''}
               //          style={{
               //             height: 110,
               //             width: width / 2.6,
               //             borderTopLeftRadius: 15,
               //             borderRadius: 19,
               //             margin: 3,
               //          }}
               //       />
               //    );
               // }}
               renderAvatar={(message) => {
                  const { user } = message?.currentMessage || {
                     name: 'noone',
                     avatar: 'oops',
                  };

                  return (
                     <SmartImage
                        uri={user?.avatar || ''}
                        preview={user?.avatar || ''}
                        style={{ height: 40, width: 40, borderRadius: 60 }}
                     />
                  );
               }}
               user={{
                  name: currentUser.name,
                  _id: currentUserId,
                  id: currentUserId,
               }}
               scrollToBottom
               onLongPressAvatar={(user) => alert(JSON.stringify(user))}
               onPressAvatar={() => alert('short press')}
               // onPress={() => {
               //    Alert.alert('Bubble pressed');
               // }}
               onQuickReply={this.onQuickReply}
               keyboardShouldPersistTaps="never"
               renderAccessory={
                  Platform.OS === 'web' ? null : this.renderAccessory
               }
               // renderActions={this.renderCustomActions}
               renderBubble={this.renderBubble}
               renderSystemMessage={this.renderSystemMessage}
               renderCustomView={this.renderCustomView}
               renderSend={this.renderSend}
               quickReplyStyle={{ borderRadius: 2 }}
               quickReplyTextStyle={{
                  fontWeight: '200',
               }}
               renderQuickReplySend={this.renderQuickReplySend}
               inverted={Platform.OS !== 'web'}
               timeTextStyle={{
                  left: { color: 'red' },
                  right: { color: 'yellow' },
               }}
               isTyping={this.state.isTyping}
               infiniteScroll
               renderChatFooter={() => (
                  <ChatFooter
                     replyMsg={this.state.replyMsg}
                     onDismiss={() => this.setState({ replyMsg: null })}
                  />
               )}
               renderMessageText={this.renderMessageText}
               onLongPress={this.onLongPress}
            />
            {/* <Text>Like</Text> */}
         </View>
      );
   }
}



