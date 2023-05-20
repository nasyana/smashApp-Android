import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-ui-lib';

function ChatFooter({ replyMsg, onDismiss }) {
   if (!replyMsg) return null;
   return (
      <View style={{ height: 50, flexDirection: 'row' }}>
         <View style={{ height: 50, width: 5, backgroundColor: 'red' }}></View>
         <View style={{ flexDirection: 'column' }}>
            <Text style={{ color: 'red', paddingLeft: 10, paddingTop: 5 }}>
               {replyMsg?.user?.name
                  ? `Replying to ${replyMsg?.user?.name}`
                  : 'Replying To'}
            </Text>
            <Text style={{ color: 'gray', paddingLeft: 10, paddingTop: 5 }}>
               {replyMsg.text}
            </Text>
         </View>
         <View
            style={{
               flex: 1,
               justifyContent: 'center',
               alignItems: 'flex-end',
               paddingRight: 10,
            }}>
            <TouchableOpacity onPress={onDismiss}>
               <Ionicons name="close" size={25} />
            </TouchableOpacity>
         </View>
      </View>
   );
}

export default ChatFooter;
