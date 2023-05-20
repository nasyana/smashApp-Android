import React, {
   useCallback,
   useEffect,
   useMemo,
   useRef,
   useState,
} from 'react';
import {
   Keyboard,
   KeyboardAvoidingView,
   StyleSheet,
   Image,
   TextInput,
   TouchableOpacity,
   FlatList,
} from 'react-native';
// import BottomSheet from '@gorhom/bottom-sheet';
import { View, Text } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { commentListener, send } from './commentService';
import CommentItem from './CommentItem';
import { inject, observer } from 'mobx-react';
import Firebase from 'config/Firebase';
import ImageUpload from 'helpers/ImageUpload';
import firebase from 'firebase';
import * as Haptics from 'expo-haptics';
import { sendNotification } from 'services/NotificationsService';
import { NotificationType } from 'constants/Type';
import SmartImage from 'components/SmartImage/SmartImage';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { width, height } from 'config/scaleAccordingToDevice';
import LottieAnimation from 'components/LottieAnimation';
import AnimatedView from 'components/AnimatedView';
const mostUsedEmojis = ['😂', '❤️', '😍', '👍', '😊', '🙏', '🤔'];
const CoolInput = (props) => {
   const { smashStore, send, placeholder = 'Add comment', isJournal = false } = props;
   const { coolComment, setCoolComment, currentUser, commentPost } = smashStore;

   const inputRef = useRef();
   const pressEmoji =(emoji)=>{

      //if input is not focussed then focus it
      if(!inputRef.current.isFocused()){
         inputRef.current.focus();
      }
     
      // inputRef.current.focus();
      const {coolComment}=smashStore; 
      setCoolComment(coolComment + emoji);
   }
   const handleKeyPress = () => {
      // Code to handle return key press goes here
   //   alert('Return key pressed!');
   send();
    };

    if(!commentPost){return null}
    
   return (<View style={{borderTopWidth: 0.5, borderColor: '#ddd'}}>
      <View row spread paddingH-24 paddingT-8>{mostUsedEmojis.map((e)=><TouchableOpacity onPress={()=>pressEmoji(e)} padding-8><Text B24>{e}</Text></TouchableOpacity>)}</View>
      <View style={styles.containerInput}>
         <SmartImage
            style={styles.image}
            uri={currentUser?.picture?.uri}
            preview={currentUser?.picture?.preview}
            //  source={{
            //     uri: 'https://cdn.vox-cdn.com/thumbor/HME6YC8484Vf48wW0vz9AGRNa3c=/0x0:4200x2600/1200x0/filters:focal(0x0:4200x2600):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/9490719/thor_big.jpg',
            //  }}
         />
         <BottomSheetTextInput
            style={styles.input}
            value={coolComment}
            ref={inputRef}
            placeholder={placeholder}
            onChangeText={setCoolComment}
            style={styles.input}
            autoFocus={isJournal}
            returnKeyType='send'
            onSubmitEditing={handleKeyPress}
         />
         {/* <TextInput
                      value={comment}
                      onChangeText={setComment}
                      style={styles.input}
                   /> */}
         {/* <TouchableOpacity onPress={send} style={{ marginLeft: 8 }}>
            <Ionicons name="arrow-up-circle" size={34} />
         </TouchableOpacity> */}
      </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 24,
      backgroundColor: 'grey',
   },
   contentContainer: {
      flex: 1,
      justifyContent: 'flex-end',
   },
   containerInput: {
      paddingBottom: 16,
      flexDirection: 'row',
      width: width - 16,
      justifyContent: 'space-between',
      alignItems: 'center',
      // borderWidth: 2,
   },
   image: {
      height: 32,
      width: 32,
      borderRadius: 32,
      marginRight: 8,
   },
   // input: {
   //    backgroundColor: 'lightgrey',
   //    flex: 1,
   //    borderRadius: 4,
   //    marginHorizontal: 10,
   //    paddingHorizontal: 10,
   // },
   input: {
      marginTop: 8,
      marginBottom: 10,
      borderRadius: 20,
      fontSize: 14,
      height: 40,
      // lineHeight: 20,
      padding: 8,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(151, 151, 151, 0.15)',
      flex: 1,
   },
});

export default inject('smashStore', 'notificatonStore')(observer(CoolInput));
