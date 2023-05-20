import Header from 'components/Header';
import React, { useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
   View,
   Text,
   Button,
   Assets,
   Colors,
   TouchableOpacity,
} from 'react-native-ui-lib';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getFirestore, doc, getDoc, onSnapshot } from 'firebase/firestore';
import Routes from 'config/Routes';
import { FONTS } from 'config/FoundationConfig';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
import firebaseInstance from '../../config/Firebase';
import MainFeedItem from '../Timeline/MainFeedItem';
import Shimmer from 'components/Shimmer';
import { width } from 'config/scaleAccordingToDevice';


const SinglePost = (props) => {
   const { postId, tempPost = false } = props.route.params;

   const [post, setPost] = React.useState(tempPost);
   /// loading state
   const [isLoading, setIsLoading] = React.useState(true);


   // get post
   useEffect(() => {


      const getPost = () => {

         setIsLoading(true);

         const postRef = doc(firebaseInstance.firestore, 'posts', (postId || post.id));

         const unsubscribe = onSnapshot(postRef, (postSnap) => {

           if (postSnap.exists()) {

            console.log('hideImage',postSnap.data()?.hideImage)
             setPost(postSnap.data());
           } else {
             // handle the case when the post does not exist
           }
           setIsLoading(false);

         }, (error) => {
           // handle the error
           console.error(error);
           setIsLoading(false);

         });
       
         // Clean up subscription on unmount
         return () => unsubscribe();
       };


      const unsubscribe = getPost();
    
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [postId, post.id]);


   return (
      <View flex>
         <Header
            title={"Single Post"}
            noShadow
            back

         />

         {isLoading && <Shimmer style={{ width: width - 32, height: 300, marginLeft: 16, marginTop: 16, borderRadius: 8 }} />}
         {post && !isLoading && <MainFeedItem post={post} id={(post.id || postId)} />}

      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(SinglePost));

const styles = StyleSheet.create({});
