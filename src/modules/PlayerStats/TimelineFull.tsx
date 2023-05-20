import { useNavigation } from "@react-navigation/core";
import ButtonLinear from "components/ButtonLinear";
import Header from "components/Header";
import Tag from "components/Tag";
import Routes from "config/Routes";
import { shadow } from "config/scaleAccordingToDevice";
import React, { useEffect, useState } from "react";
import {
   FlatList,
   ScrollView,
   StyleSheet,
} from 'react-native';
import { getFirestore, collection, where, orderBy, limit, getDocs, query } from 'firebase/firestore';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { View, Colors, Button, Assets, Text, Image,TouchableOpacity } from 'react-native-ui-lib';
import firebaseInstance from '../../config/Firebase';
import { moment } from 'helpers/generalHelpers';;
import SmartImage from 'components/SmartImage/SmartImage';
import { inject, observer, action } from 'mobx-react';
import Shimmer from 'components/Shimmer';
import Box from 'components/Box';
import { width, height } from 'config/scaleAccordingToDevice';
import { MaterialCommunityIcons } from "@expo/vector-icons";
const _ = require('lodash');
const db = firebaseInstance.firestore;
export enum EnumTypeChart {
   week = 0,
   month = 1,
   year = 2,
   all = 3,
}
interface Props {
   type: EnumTypeChart;
}
const TimelineFull = (props) => {
   const {
      smashStore,
      team,
      challengeId,
      activity,
      setSmashes = false,
   } = props;

   const activityId = props.activityId || activity?.activityMasterId;
   const uid = props.uid || smashStore?.currentUser?.uid;

   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const dayKey = props.dayKey || smashStore.todayDateKey;
   const { levelColors } = smashStore;

   useEffect(() => {
      setLoading(true);
    
      let queryRef = query(
        collection(db, 'posts'),
        where('uid', '==', uid),
        where('type', '==', 'smash'),
        orderBy('timestamp', 'desc')
      );
    
      if (activityId) {
        queryRef = query(
          collection(db, 'posts'),
          where('uid', '==', uid),
          where('activityMasterId', '==', activityId),
          where('type', '==', 'smash'),
          orderBy('timestamp', 'desc')
        );
      }
    
      if (team) {
        queryRef = query(
          collection(db, 'posts'),
          where('inTeam', 'array-contains', team.id),
          where('type', '==', 'smash'),
          orderBy('timestamp', 'desc')
        );
      }
    
      if (challengeId && uid) {
        queryRef = query(
          collection(db, 'posts'),
          where('uid', '==', uid),
          where('challengeIds', 'array-contains', challengeId),
          where('type', '==', 'smash'),
          orderBy('timestamp', 'desc')
        );
      }
    
      if (challengeId) {
        queryRef = query(
          collection(db, 'posts'),
          where('active', '==', true),
          where('challengeIds', 'array-contains', challengeId),
          where('type', '==', 'smash'),
          orderBy('timestamp', 'desc')
        );
      }
    
      getDocs(queryRef)
        .then((snaps) => {
          if (!snaps.empty) {
            const postsArray = [];
    
            snaps.forEach((snap) => {
              const post = snap.data();
    
              postsArray.push(post);
    
              props.smashStore.completionsHash[post.id] = {
                picture: post?.picture || false,
                video: post?.video || false,
                user: post.user || false,
                points: post.value,
                multiplier: post.multiplier || false,
              };
            });
            if (setSmashes) {
              setSmashes(postsArray);
            }
            setPosts(postsArray);
          }
          setLoading(false);
        });
    
      return () => {
        // if (unsubscribeToPosts) {
        //    unsubscribeToPosts();
        // }
      };
    }, []);
    

   const playerStatsData = {};

   const newPostsArray = posts.map((p) => {
      return {
         ...p,
         dateKey: moment(p.updatedAt, 'X').startOf('day').format('X'),
      };
   });
   const groupBy = _.groupBy(newPostsArray, 'dateKey');

   const finalData = Object.keys(groupBy).map((key) => {
      return {
         time: key,
         records: groupBy[key].sort((b, a) => a.updatedAt - b.updatedAt),
      };
   });

   if (loading) {
      return (
         <View paddingV-16>
            <Shimmer
               style={{
                  height: 60,
                  width: width - 64,
                  marginTop: 16,
                  marginLeft: 16,
                  borderRadius: 7,
               }}
            />
            <Shimmer
               style={{
                  height: 60,
                  width: width - 64,
                  marginTop: 16,
                  marginLeft: 16,
                  borderRadius: 7,
               }}
            />
            <Shimmer
               style={{
                  height: 60,
                  width: width - 64,
                  marginTop: 16,
                  marginLeft: 16,
                  borderRadius: 7,
               }}
            />
            <Shimmer
               style={{
                  height: 60,
                  width: width - 64,
                  marginTop: 16,
                  marginLeft: 16,
                  borderRadius: 7,
               }}
            />
         </View>
      );
   }  

 

   const renderItem = ({ item, index }) => {
      return (
         <View flex row marginH-16 key={item.time}>
            <View>
               <View
                  width={2}
                  height={'100%'}
                  backgroundColor={Colors.line}
                  marginL-5
               />
               <Image
                  source={Assets.icons.point}
                  style={{
                     position: 'absolute',
                     top: 28,
                  }}
               />
            </View>
            <View marginL-16 flex marginT-24>
               <View row centerV marginB-16 spread>
               <Text H14 color6D  uppercase>
                  {moment(item.time, 'X').format('dddd Do MMM YYYY ')}
               </Text>
               <TouchableOpacity row style={{padding: 16}} onPress={()=> smashStore.setCommentPost({...{activityName: activity?.text,baseActivityId: (activity?.baseActivityId || false), dayKey: moment(item.time, 'X').format('DDMMYYYY'), id: activityId, masterActivityId: activityId}, journal: true})}><MaterialCommunityIcons name="book-open-page-variant" size={18} color={'#aaa'}/><Text M12 secondaryContent marginL-4>{item.journalCount}</Text></TouchableOpacity>
               </View>
               <View
                  style={{
                     ...shadow,
                     flex: 1,
                  }}
                  padding-16
                  paddingB-0
                  backgroundColor={Colors.white}>
                  {item.records.map((item, index) => (
                     <View
                        row
                        spread
                        centerV
                        marginB-16
                        key={index}
                        style={{ width: '100%' }}>
                        <View row centerV spread flex>
                           <View row centerV>
                              <SmartImage
                                 uri={item?.user?.picture?.uri || ''}
                                 preview={item?.picture?.preview || ''}
                                 style={{
                                    height: 25,
                                    width: 25,
                                    borderRadius: 80,
                                    marginRight: 8,
                                 }}
                              />

                              {/* <View
                                 style={{
                                    backgroundColor:
                                       levelColors[item.level || 0] ||
                                       Colors.color58,
                                    height: 25,
                                    width: 25,
                                    borderRadius: 60,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    left: -20,
                                    top: -5,
                                 }}>
                                 <Text white B10>
                                    {item.multiplier}
                                 </Text>
                              </View> */}
                           </View>

                           <Text R14 color28 marginL-4 flex secondaryContent>
                           {item.multiplier} x {item.activityName.substring(0, 117)}
                           </Text>
                          <TouchableOpacity row style={{padding: 16}} onPress={()=> smashStore.setCommentPost({...item,baseActivityId: (activity?.baseActivityId || false), journal: true})}><MaterialCommunityIcons name="book-open-page-variant" size={18} color={item.journalCount ? '#aaa' : '#eee'}/><Text M12 secondaryContent marginL-4>{item.journalCount}</Text></TouchableOpacity>
                           <Text R12 secondaryContent marginL-16>
                              {true &&
                                 moment(item.updatedAt, 'X').format('h:mm a')}
                           </Text>
                        </View>
                        <TouchableOpacity
                           onPress={() => {
                              smashStore.loadingUserStories = true;
                              smashStore.setCurrentStory(item);
                           }}
                           style={{
                              flexDirection: 'row',

                              alignItems: 'flex-end',
                           }}>
                           {item?.picture?.uri ? (
                              <SmartImage
                                 uri={item?.picture?.uri}
                                 preview={item?.picture?.preview}
                                 style={{
                                    width: 30,
                                    height: 30,
                                    backgroundColor: '#ccc',
                                    borderRadius: 3,
                                    marginLeft: 16,
                                 }}
                              />
                           ) : (
                              <View
                                 style={{
                                    width: 30,
                                    height: 30,
                                    backgroundColor: 'transparent',
                                    borderRadius: 3,
                                    marginLeft: 16,
                                 }}
                              />
                           )}
                        </TouchableOpacity>
                       
                     </View>
                  ))}
              
               </View>
            </View>
         </View>
      );
   };
   return (
      <View flex>
         <FlatList
            data={finalData.sort((a, b) => b.time - a.time) || []}
            renderItem={renderItem}
            ListEmptyComponent={
               <Text secondaryContent margin-16>
                  No smashes yet..
               </Text>
            }
         />
         {/* {finalData
            .sort((a, b) => b.time - a.time)
            .map()} */}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(TimelineFull));

const styles = StyleSheet.create({});
