
import React, { useState } from 'react'
import { inject, observer } from 'mobx-react';
import { collection, query, where, orderBy, onSnapshot,setDoc,doc } from "firebase/firestore";

import { View, Colors, Image, Assets, Text, ActionSheet, TouchableOpacity, ExpandableSection } from 'react-native-ui-lib';
import firebaseInstance from 'config/Firebase';
import moment from 'moment';
const firestore = firebaseInstance.firestore;

const ActionMenu = ({smashStore}) => {
const {setActionMenuPost,actionMenuPost} = smashStore;

    // const [post, setPost] = useState(false);
console.log('actionMenuPost',actionMenuPost)
const post = actionMenuPost;
    const clearPost = () => {
        setActionMenuPost(false);
    };


   const removePostAndPoints = () => {
    smashStore.smash(post, false, true);
 };
 const hideImage = () => {
    const postRef = doc(firestore, "posts", post.id);
    setDoc(postRef, { hideImage: true }, { merge: true });

    smashStore.updateSinglePostInFeed({...post, hideImage: true, updatedAt: moment().unix() })
 };

 const showImage = () => {


      const postRef = doc(firestore, "posts", post.id);
      setDoc(postRef, { hideImage: false, updatedAt: moment().unix() }, { merge: true });

      smashStore.updateSinglePostInFeed({...post, hideImage: false, updatedAt: moment().unix() })
   };

 
//  const hidePicture = (bool) => {
//     const postRef = doc(firestore, "posts", post.id);
//     setDoc(postRef, { hideImage: !bool }, { merge: true });
//     smashStore.addToFeed({...post, hideImage: false, updatedAt: moment().unix() })
//  };

 let optionsArray = [
    { label: 'Hide Post from Feed', onPress: () => hideImage() },
    // { label: post?.showPicture ? 'Hide Picture' : 'Show Picture', onPress: () => hidePicture(post?.showPicture) },
 ];

 if (actionMenuPost.type == 'smash') {


    optionsArray = [
       { label: actionMenuPost?.hideImage ? 'Show Image/Video' : 'Hide Image/Video from Post', onPress: actionMenuPost?.hideImage ? ()=>showImage() : () => hideImage() },
      //  {
      //     label: 'Cancel Smash & Remove Points',
      //     onPress: () => removePostAndPoints(),
      //  },
       {label: 'Cancel', onPress: () => clearPost() },
  
    ];
 }
// return (<View />)
  return (

  <ActionSheet
            title={'Post Options'}
            cancelButtonIndex={3}
            destructiveButtonIndex={0}
            useNativeIOS={true}
            options={optionsArray}
            visible={actionMenuPost}
            onDismiss={clearPost}
         />

  )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ActionMenu));