import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { MessageText } from 'react-native-gifted-chat';
import { inject, observer } from 'mobx-react';
import { TouchableOpacity } from 'react-native-ui-lib';

function MessageReply(props) {
   const { replyTo, replyText } = props.currentMessage;

   return (
      <View>
         <View style={{ padding: 5 }}>
            <View style={{ backgroundColor: '#005CB5', borderRadius: 15 }}>
               <View style={{ flexDirection: 'row' }}>
                  <View
                     style={{
                        height: 50,
                        width: 10,
                        backgroundColor: '#00468A',
                        borderTopLeftRadius: 15,
                        borderBottomLeftRadius: 15,
                     }}
                  />
                  <View style={{ flexDirection: 'column' }}>
                     {replyTo ? (
                        <Text
                           style={{
                              color: 'white',
                              paddingHorizontal: 10,
                              paddingTop: 5,
                              fontWeight: '700',
                           }}>
                           {replyTo}
                        </Text>
                     ) : null}
                     <Text
                        style={{
                           color: 'white',
                           paddingHorizontal: 10,
                           paddingTop: 5,
                        }}>
                        {replyText}
                     </Text>
                  </View>
               </View>
            </View>
            <MessageText {...props} />
         </View>
      </View>
   );
}

export default inject('smashStore')(observer(MessageReply));
