import { width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect } from "react";
import { FlatList, ImageBackground } from "react-native";
import { View, Colors, Image, Assets, Text } from "react-native-ui-lib";
import { Button, ActionSheet } from 'react-native-ui-lib'; //eslint-disable-line
import _ from 'lodash';
import Firebase from "../../config/Firebase";
import FeedItem from "./FeedItem";
import { inject, observer } from 'mobx-react';
import Header from 'components/Header';
const CommunityFeed = (props) => {

  const [post, setPost] = useState(false)
  const [feed, setFeed] = useState([]);
  const { smashStore } = props;
  const { currentUser } = smashStore;
  const clearPost = () => { setPost(false) }




  useEffect(() => {
    let unsubscribeToFeed

    unsubscribeToFeed = Firebase.firestore.collection("posts")
      .where('active', '==', true)
      .where('showInFeed', '==', true)
      .orderBy("timestamp", "desc")
      .limit(15)
      .onSnapshot((snaps) => {
        const feedItems = []
        snaps.forEach((snap) => {
          const feedItem = snap.data();
          feedItems.push(feedItem);
        })
        setFeed(feedItems)
      })

    return () => {
      if (unsubscribeToFeed) { unsubscribeToFeed() }
    };
  }, []);


  const DATA = [
    {
      img: "https://firebasestorage.googleapis.com/v0/b/smash-app-81ca9.appspot.com/o/d75b8421-332e-b9f7-7f9c-acfe5281a224?alt=media&token=d40c35bc-a3d7-40b2-9346-1884d6fbcef6",
      title: `Design Your Diet To Fight Chronic Inflammation`,
      time: "Jan 30, 2018",
      type: "Nutrition",
    },
    {
      img: "https://firebasestorage.googleapis.com/v0/b/smash-app-81ca9.appspot.com/o/002f1a14-a70d-1194-6b58-2c9afaa29de7?alt=media&token=7b0a3b65-c68a-4720-8b65-80eeaa59c9e5",
      title: `The Ultimate Kris Gethin Muscle-Building Meal Plan`,
      time: "Jan 30, 2018",
      type: "Nutrition",
    },
    {
      img: "https://firebasestorage.googleapis.com/v0/b/smash-app-81ca9.appspot.com/o/4504476b-9fd9-9375-4622-a32d13a0bca2?alt=media&token=817b30ad-4318-4df9-8ad9-c9b1f31f3eac",
      title: `Your Expert Guide To Chia Seeds`,
      time: "Jan 30, 2018",
      type: "Nutrition",
    },
    {
      img: Assets.icons.img_nu3,
      title: `Podcast Episode 33: The Science of Physique…`,
      time: "Jan 30, 2018",
      type: "Nutrition",
    },
  ];

  const removePostAndPoints = () => { smashStore.smash(post, false, true) }
  const hidePostFromFeed = () => { Firebase.firestore.collection("posts").doc(post.id).set({ showInFeed: false }, { merge: true }) }
  const hidePicture = (bool) => { Firebase.firestore.collection("posts").doc(post.id).set({ showPicture: !bool }, { merge: true }) }

  let optionsArray = [
    { label: 'Hide Post from Feed', onPress: () => hidePostFromFeed() },
    // { label: post?.showPicture ? 'Hide Picture' : 'Show Picture', onPress: () => hidePicture(post?.showPicture) },
  ]

  if (post.type == 'smash') {
    optionsArray = [
      { label: 'Hide Post from Feed', onPress: () => hidePostFromFeed() },
      { label: 'Cancel & Remove Points', onPress: () => removePostAndPoints() },
      // { label: post?.showPicture ? 'Hide Picture' : 'Show Picture', onPress: () => hidePicture(post?.showPicture) },
    ]
  }
  return (
    <View flex>

      <FlatList
        data={feed || DATA}
        renderItem={({ item, index }) => <FeedItem item={item} setPost={(post) => setPost(post)} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingTop: 16 }}
        ListEmptyComponent={<View row spread paddingH-16 centerH marginT-8>
          <Text R16 color28 >
            Oops! No-one you follow has posted yet..
          </Text>

        </View>}
      // ListHeaderComponent={}

      />

      <ActionSheet
        title={'Post Options'}
        // message={'Message of action sheet'}
        cancelButtonIndex={3}
        destructiveButtonIndex={0}
        useNativeIOS={false}
        options={optionsArray}
        visible={post}
        onDismiss={clearPost}
      />
    </View>
  );
};

export default inject("challengeArenaStore", "smashStore")(observer(CommunityFeed));
