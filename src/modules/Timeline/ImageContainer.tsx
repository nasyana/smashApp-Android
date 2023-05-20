import React, { useState, useRef, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot
} from "firebase/firestore";
import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { height, width } from '../../config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from '../../helpers/scale';
import SmartImage from '../../components/SmartImage/SmartImage';
import Routes from '../../config/Routes';
import firebaseInstance from '../../config/Firebase';
const firestore = firebaseInstance.firestore;
import ButtonLinear from '../../components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
import { unsubscribeToChallenge } from 'modules/TargetToday/fireStore';

const ImageContainer = ({post, id,isFollowingMe,ios, smashStore, hasImage}) => {

    const {userStoriesHash, feed} = smashStore
    const [picture, setPicture] = useState(false);
    const [loaded, setLoaded] = useState(true);

    // useEffect(() => { 

    //     setTimeout(() => {
    //         setLoaded(true)
    //     }, 10000);
    // },[])


    useEffect(() => {
      const postRef = doc(collection(firestore, "posts"), id);
      const unsub = onSnapshot(postRef, (docSnap) => {
        if (docSnap.exists()) {
          setPicture(docSnap.data()?.picture || false);
        }
      });
    
      return () => {
        if (unsub) {
          unsub();
        }
      };
    }, [id]);
    let item = userStoriesHash?.[id] || {};

    const isMostRecent = feed?.[0]?.post?.id == id
// if(!(picture?.uri?.length > 0))return null
   if(!isFollowingMe){return null}
   if(!ios){return null}
    if(!hasImage){return null}
   if(!loaded && isMostRecent){return null}
    return (
        <View style={{ marginHorizontal: 0, borderWidth: 0 }}>
            {/* <Text>{picture?.uri}</Text> */}
            <SmartImage
           uri={post?.picture?.uri}
           preview={post?.picture?.preview}
           style={{
              width: width - 64,
              height: 400,
              backgroundColor: '#aaa',
           }}
           key={id}
        />
     </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ImageContainer));