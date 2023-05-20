import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';
import Routes from 'config/Routes';
import firebaseInstance from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
import Box from './Box';
import SectionHeader from './SectionHeader';
import { unixToFromNow, unixToHuman } from 'helpers/generalHelpers';
import AnimatedView from 'components/AnimatedView';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
const firestore = firebaseInstance.firestore;
const ActivityJourney = ({dayKey = false, activityId = false, smashStore}) => {


    const {stringLimit} = smashStore;
    const { navigate } = useNavigation();

    const {uid} = firebaseInstance.auth.currentUser;
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
      let theQuery = collection(firestore, "posts");
      const filters = [];
  
      if (uid) {
        filters.push(where("uid", "==", uid));
      }
  
      if (activityId) {
        filters.push(where("activityId", "==", activityId));
      }
  
      if (dayKey) {
        filters.push(where("dayKey", "==", dayKey));
      }
  
      if (filters.length > 0) {
        theQuery = query(filters[0]);
        for (let i = 1; i < filters.length; i++) {
          theQuery = query(filters[i]);
        }
      }
  
      theQuery = query(where("type", "==", "smash"));
      theQuery = query(orderBy("updatedAt", "desc"));
  
      if (!dayKey && activityId) {
        theQuery = query(limit(25));
      } else {
        theQuery = query(limit(15));
      }
  
      const unsubscribe = onSnapshot(theQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => doc.data());
        setPosts(posts.filter((post) => post.text?.length > 0));
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, [uid, activityId, dayKey]);

    if(posts.length == 0){return null}
    return (
      <AnimatedView>
        
        <SectionHeader title={activityId ? 'Activity Journal' : 'Journal'}  style={{marginTop: 16}}/>
        <Box>
     
        <View padding-24 paddingB-24>
       
 
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <View row spread centerV style={{borderBottomWidth: 1, borderColor: '#eee'}} paddingB-8>
                <View>
                <Text R14>{'"'+item?.text+'"' || item.activityName}</Text>
                <Text R12 secondaryContent>{item?.activityName}</Text>
                </View>
                <Text R14 secondaryContent>{unixToHuman(item.timestamp)}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      </Box>
      </AnimatedView>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ActivityJourney));