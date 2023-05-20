import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { inject, observer } from 'mobx-react';

/* styles native helpers*/
import { FONTS } from 'config/FoundationConfig';
import {
   StyleSheet,
   TouchableOpacity,
   TouchableWithoutFeedback,
   Modal,
   Platform,
   Image,
} from 'react-native';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import {
   View,
   Colors,
   Text,
   Assets,
   Button,
   Avatar,
} from 'react-native-ui-lib';
import { scale } from 'helpers/scale';

/* components */
import AnimatedView from 'components/AnimatedView';
import SmartImage from 'components/SmartImage/SmartImage';
import HypePost from 'modules/HypePost';
import firebaseInstance from 'config/Firebase';

const FeedPreview = (props) => {
   const [feed, setFeed] = useState([]);
   const { navigate } = useNavigation();
   const textRef = useRef(null);
   const { uid, following = false, smashStore } = props;
   const { capturedPicture, currentUserId, hypePost, currentUser } = smashStore;
   const value = hypePost?.text || '';

   const onChangeText = (value) => {
      smashStore.setHypePost({ text: value });
   };

   const onClearText = () => {
      smashStore.hypePost = false;
      textRef.current.blur();
   };

   const goToCamera = async () => {
      navigate('TakePhoto', { hypePost: true });
   };


   const goToFeed = () => {

      const {uid} = currentUser;
      navigate('Feed', { uid });
   };
   const openPostModal = async () => smashStore.setHypePost({ text: '' });

   const feedEmpty = feed?.length == 0;
   return (
      <>
         <TouchableWithoutFeedback
            onPress={() => textRef.current && textRef.current.focus()}>
            <View
               height={70}
               row
               spread
               paddingH-16
               paddingV-11
               style={{
                  // borderWidth: 1,
                  borderColor: Colors.line,
                  borderRadius: 4,
                  alignItems: 'center',
                  backgroundColor: Colors.white,
               }}>
               {/* <Image source={Assets.icons.ic_search_16} /> */}
               <TouchableOpacity onPress={openPostModal}>
                  <AntDesign
                     name={'camera'}
                     size={scale(25)}
                     color={Colors.grey50}
                  />
               </TouchableOpacity>

               <TouchableOpacity
                  onPress={goToFeed}
                  style={{ flexDirection: 'row', marginHorizontal: 16 }}>
                  {feed.map((post) => {
                     return post.picture?.uri ? (
                        <SmartImage
                           key={post.id}
                           uri={post.picture?.uri}
                           preview={post.picture?.preview}
                           style={{
                              height: 50,
                              width: 50,
                              backgroundColor: '#ccc',
                              marginLeft: 2,
                              borderRadius: 4,
                           }}
                        />
                     ) : (
                        <SmartImage
                           key={post.id}
                           uri={post?.user?.picture?.uri}
                           preview={post?.user?.picture?.preview}
                           style={{
                              height: 50,
                              width: 50,
                              backgroundColor: '#ccc',
                              marginLeft: 2,
                              borderRadius: 4,
                           }}
                        />
                     );
                  })}
               </TouchableOpacity>
               {/* <TextInput
                    ref={textRef}
                    style={{
                        fontSize: 16,
                        fontFamily: FONTS.heavy,
                        marginLeft: 16,
                        color: Colors.color28,
                        flex: 1,
                    }}
                    onFocus={() => {
                        smashEffects();

                    }}
                    // onFocus={() => props.toggleFindChallenge(true)}
                    placeholder={props.placeholder || 'Hype up the team...'}
                    placeholderTextColor={Colors.color6D}
                    value={value}
                    onChangeText={onChangeText}
                    underlineColorAndroid={'transparent'}
                /> */}

               <TouchableOpacity
                  onPress={goToFeed}
                  style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                     justifyContent: 'center',
                     borderWidth: 0,
                     paddingVertical: 15,
                  }}>
                  <Text
                     marginR-6
                     color={Colors.grey50}
                     style={{ fontSize: scale(12) }}>
                     {feedEmpty ? 'No posts yet' : 'View More Posts'}
                  </Text>

                  <Fontisto
                     name="angle-right"
                     size={scale(16)}
                     color={Colors.grey50}
                  />
               </TouchableOpacity>
            </View>
         </TouchableWithoutFeedback>
         <Modal
            presentationStyle="overFullScreen"
            animationType="slide"
            keyboardShouldPersistTaps="always"
            transparent={false}
            statusBarTranslucent={false}
            visible={smashStore.hypePost ? true : false}
            onRequestClose={() => {}}>
            {/* <HypeUpInput challengeId={challenge.id} /> */}
            <HypePost uid={currentUserId} />
         </Modal>
      </>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'challengeArenaStore',
)(observer(FeedPreview));
