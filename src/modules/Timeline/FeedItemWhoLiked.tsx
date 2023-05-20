import React, { useState, useEffect } from "react";
import moment from "moment";
import { inject, observer } from 'mobx-react';
import SmartImage from "../../components/SmartImage/SmartImage"
import {
    View,
    Colors,
    Image,
    Assets,
    Text,
    TouchableOpacity,
} from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { doc, onSnapshot, getDoc, collection } from 'firebase/firestore';
import PostLikesHorizontal from 'components/PostLikes/PostLikesHorizontal';
import Routes from 'config/Routes';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Alert, Platform } from 'react-native';
import SmartVideo from "components/SmartImage/SmartVideo";
import { width } from "config/scaleAccordingToDevice";
import firebaseInstance from "config/Firebase";
const firestore = firebaseInstance.firestore;
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LottieAnimation from "components/LottieAnimation";
const FeedItem = (props) => {
    const { navigate } = useNavigation();
    const { smashStore, id, challengesStore, item, goToUserProfile } = props;
  
    // let item = userStoriesHash?.[id] || {};
    const likes = item?.likes?.length > 0 ? item?.likes : ['1'];
    const likesLength = likes?.length;
    // const usersRef = Firebase.firestore.collection('users').where('uid', 'in', likes);
    const [users, setUsers] = useState([]);


    const getUserDocs = async (userIds) => {
        const userDocs = [];
      
        try {
          // Create an array of promises for each user document
          const promises = userIds?.map((userId) => {
            const userRef = doc(collection(firestore, 'users'), userId);
            return getDoc(userRef).then((snapshot) => snapshot.data());
          });
      
          // Wait for all promises to resolve and store the results in an array
          const results = await Promise.all(promises);
      
          // Filter out any null or undefined results and store the valid ones in userDocs
          results.filter((result) => result !== null && result !== undefined).forEach((result) => {
            userDocs.push(result);
          });
      
          setUsers(userDocs);
        } catch (error) {
          console.error('Error getting user documents:', error);
        }
      };
      

    const [postLikes, setPostLikes] = useState([]);

    const subToThePostLikes = (id) => {
        const postRef = doc(firestore, 'posts', id);
    
      
        const unsubscribe = onSnapshot(postRef, (doc) => {
          const post = doc.data();
          setPostLikes(post?.likes || []);
        });
      
        return unsubscribe;
      };




    useEffect(() => {


        const unsub = subToThePostLikes(item.id);


        if (postLikes?.length > 0) {

            getUserDocs(postLikes);
        }



        return () => { if(unsub){unsub()} };
    }, [postLikes]);





    return (

        <View row style={{ position: 'absolute', bottom: 40, right: 16 }}>
            {users?.map((user,index) => {
              if (!user || index > 2) { return null};

                return (

                    <TouchableOpacity onPress={() => goToUserProfile(user)} key={user?.uid}><SmartImage uri={user?.picture?.uri} style={{ width: 40, height: 40, borderRadius: 32 }} />
                        {/* <Text>🚀</Text> */}
                    </TouchableOpacity>
                )
            })}
        </View>


    );
};

export default inject("smashStore", "challengesStore")(observer(FeedItem))