import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import initialMessages from './messages';
import { renderInputToolbar, renderActions, renderComposer, renderSend } from './InputToolbar';
import {
  renderAvatar,
  renderBubble,
  renderSystemMessage,
  renderMessage,
  renderMessageText,
  renderCustomView,
} from './MessageContainer';

const Chats = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [replyId, setReplyId] = useState(null);
  useEffect(() => {
     setMessages(initialMessages.reverse());
  }, []);

  const onSend = (newMessages = []) => {
     setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, newMessages),
     );
  };

  const Reply = ({ id }) => {
     const message = messages.find(({ _id }) => _id === id) || {};

     return <Text>{message?.text}</Text>;
  };

  const ReplyWrapper = ({ id }) => {
     const setChatState = useSetState(`conversations.${conversationId}`);
     const resetReply = () => setChatState({ replyId: null });
     return (
        <View style={styles.ReplyWrapper}>
           <Reply id={id} />
           <Button onPress={resetReply} title={'X'} />
        </View>
     );
  };

 
  return (
    <GiftedChat
      messages={messages}
      text={text}
      onInputTextChanged={setText}
      onSend={onSend}
      user={{
        _id: 1,
        name: 'Aaron',
        avatar: 'https://placeimg.com/150/150/any',
      }}
      alignTop
      alwaysShowSend
      scrollToBottom
      // showUserAvatar
      renderAvatarOnTop
      renderUsernameOnMessage
      bottomOffset={26}
      onPressAvatar={console.log}
      renderInputToolbar={renderInputToolbar}
      renderActions={renderActions}
      renderComposer={renderComposer}
      renderSend={renderSend}
      renderAvatar={renderAvatar}
      renderBubble={renderBubble}
      renderSystemMessage={renderSystemMessage}
      renderMessage={renderMessage}
      renderMessageText={renderMessageText}
      // renderMessageImage
      renderCustomView={renderCustomView}
      isCustomViewBottom
      messagesContainerStyle={{ backgroundColor: 'indigo' }}
      parsePatterns={(linkStyle) => [
        {
          pattern: /#(\w+)/,
          style: linkStyle,
          onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
        },
      ]}
    />
  );
};

export default Chats;
