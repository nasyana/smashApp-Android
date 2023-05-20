import { FlatList } from 'react-native';
import { View, Text } from 'react-native-ui-lib';
import React, { useState, useEffect } from 'react';
import AnimatedView from 'components/AnimatedView';
import SmartImage from 'components/SmartImage/SmartImage';
import Firebase from 'config/Firebase';
import { width, height } from 'config/scaleAccordingToDevice';
import CommentLike from './CommentLike';
export default function StoryComments({ id }) {
   const [comments, setComments] = useState([]);

   useEffect(() => {
      const unsub = Firebase.firestore
         .collection('posts')
         .doc(id)
         .collection('comments')
         .orderBy('timestamp', 'desc')
         .limit(7)
         .onSnapshot((querySnapshot) => {
            const allComments = [];
            querySnapshot.forEach((snap) => {
               allComments.push(snap.data());
            });
            setComments(allComments);
         });

      return () => {
         if (unsub) {
            unsub();
            setComments([]);
         }
      };
   }, [id]);

   return (
      <View
         style={{
            position: 'absolute',
            bottom: 100,
            right: 0,
            left: 8,
            height: 180,
            borderWidth: 0,
            width: width / 1.5,
         }}>
         {comments?.length > 0 && (
            <FlatList
               inverted
               data={comments}
               keyExtractor={(item) => item.id}
               style={{
                  zIndex: 9999999999999999999999999,
                  height: 250,
                  borderWidth: 0,
                  borderColor: '#fff',
               }}
               renderItem={({ item, index }) => (
                  <StoryCommentItem comment={item} index={index} postId={id} />
               )}
            />
         )}
      </View>
   );
}

interface StoryCommentItemProps {
   comment: any;
   index: number;
}

const textShadow = {
   textShadowColor: 'rgba(0, 0, 0, 0.75)',
   textShadowOffset: { width: 0, height: 0 },
   textShadowRadius: 3,
};

function StoryCommentItem({ comment, index }: StoryCommentItemProps) {
   const { uid, picture, text, id, postId } = comment;

   return (
      <AnimatedView
         delay={100 * index}
         duration={500 * index}
         style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
            marginLeft: 5,
            borderRadius: 5,
            zIndex: 77777777,
            alignItems: 'center',
         }}>
         <View row centerV>
            <SmartImage
               style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  marginVertical: 5,
                  marginHorizontal: 5,
               }}
               uri={picture?.uri || ''}
               preview={picture?.preview}
            />

            <View style={{ paddingLeft: 10 }}>
               <Text
                  style={{
                     ...textShadow,
                     color: '#fff',
                     fontSize: 12,
                     lineHeight: 0,
                  }}>
                  {text}
               </Text>
            </View>
         </View>
         <CommentLike comment={{ id, postId }} />
      </AnimatedView>
   );
}
