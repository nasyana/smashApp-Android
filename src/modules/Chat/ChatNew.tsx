import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getFirestore, collection, query, where, limit } from '@firebase/firestore';
import { addDoc, serverTimestamp } from '@firebase/firestore';

const firestore = getFirestore();



// const messagesRef = collection(firestore, `streams/${streamId}/messages`);
// const messagesQuery = query(messagesRef, where('read', '==', false), limit(100));
const GiftedChatComponent = (props) => {
// get streamId from props route from navigation
  const streamId = props.route.params?.stream?.streamId;

   
  const [messages, setMessages] = useState([]);

  const collectionRef = query(
    collection(firestore, 'chats'),
    where('streamId', '==', streamId),
    limit(30),
  );

  const [dbMessages] = useCollectionData(collectionRef, { idField: 'id' });

  useEffect(() => {
    const formattedMessages = dbMessages
      ? dbMessages.map((msg) => ({
          _id: msg.id,
          text: msg.text,
          createdAt: msg.createdAt.toDate(),
          user: {
            _id: msg.user.id,
            name: msg.user.name,
            avatar: msg.user.avatar,
          },
        }))
      : [];
    setMessages(formattedMessages);
  }, [dbMessages]);

  const onSend = async (newMessages = []) => {
   const newMessage = newMessages[0];
 
   try {
     await addDoc(collection(firestore, 'chats'), {
       text: newMessage.text,
       createdAt: serverTimestamp(),
       streamId: streamId,
       user: {
         id: newMessage.user._id, // Replace this with the actual user id
         name: newMessage.user.name,
         avatar: newMessage.user.avatar,
       },
     });
   } catch (error) {
     console.error('Error adding document: ', error);
   }
 };
 

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: 1, // Replace this with the actual user id
      }}
      renderUsernameOnMessage
      showUserAvatar
      isTyping
    />
  );
};

export default GiftedChatComponent;
