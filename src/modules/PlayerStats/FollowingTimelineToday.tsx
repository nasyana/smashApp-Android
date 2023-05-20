import { useNavigation } from '@react-navigation/core';
import ButtonLinear from 'components/ButtonLinear';
import Header from 'components/Header';
import Tag from 'components/Tag';
import Routes from 'config/Routes';
import { shadow } from 'config/scaleAccordingToDevice';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { View, Colors, Button, Assets, Text, Image } from 'react-native-ui-lib';
import Firebase from '../../config/Firebase';
import { moment } from 'helpers/generalHelpers';;
import SmartImage from 'components/SmartImage/SmartImage';
import { inject, observer } from 'mobx-react';
import Box from 'components/Box';
import SmashItemLog from 'components/SmashItemLog';
import SectionHeader from 'components/SectionHeader';
import SmartVideo from 'components/SmartImage/SmartVideo';
const _ = require('lodash');

export enum EnumTypeChart {
   week = 0,
   month = 1,
   year = 2,
   all = 3,
}
interface Props {
   type: EnumTypeChart;
}
const FollowingTimelineToday = (props) => {
   const { smashStore, SPACING = 28 } = props;

   const { levelColors, todayDateKey } = smashStore;
   const [posts, setPosts] = useState([]);
   const userId = Firebase.auth.currentUser.uid;

   const selectedDate = todayDateKey;
   useEffect(() => {
      let query = Firebase.firestore
         .collection('posts')
         .where('followers', 'array-contains', userId)
         .where('type', '==', 'smash')
         .where('dayKey', '==', selectedDate)
         .limit(40);

      const _postsByTeamId = {};
      const unsubscribeToPosts = query.onSnapshot((snaps) => {
         if (!snaps.empty) {
            const postsArray = [];

            snaps.forEach((snap) => {
               const post = snap.data();

               postsArray.push(post);
            });

            setPosts(postsArray);
         }
      });
      return () => {
         if (unsubscribeToPosts) {
            unsubscribeToPosts();
         }
      };
   }, []);

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
   console.log('check rerenders FollowingTimelineToday');

   if (finalData?.length == 0) {

      return <View paddingH-24><Text R14 secondaryContent>No activity yet today...</Text></View>
   }
   return (
      <>
         {finalData?.length > 0 && <SectionHeader title="Today's Smashes" />}
         <View flex style={{ marginHorizontal: 0 }}>
            <Box>
               <View flex>
                  {finalData
                     .sort((a, b) => b.time - a.time)
                     .map((item, index) => (
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
                           <View marginL-20 flex marginT-24>
                              <Text H14 color6D marginB-16 uppercase>
                                 {moment(item.time, 'X').format(
                                    'dddd Do MMM YYYY',
                                 )}
                              </Text>
                              <View
                                 style={{
                                    ...shadow,
                                    flex: 1,
                                 }}
                                 padding-0
                                 paddingB-0
                                 backgroundColor={Colors.white}>
                                 {item.records.map((item, index) => (
                                    <View
                                       row
                                       spread
                                       centerV
                                       marginB-16
                                       key={index}>
                                       <View row centerV>
                                          <SmartImage
                                             uri={item?.user?.picture?.uri}
                                             preview={
                                                item?.user?.picture?.preview
                                             }
                                             style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 40,
                                                backgroundColor: '#eee',
                                             }}
                                          />

                                          <View>
                                             <View row centerV marginL-16>
                                                <Tag
                                                   size={7}
                                                   // label={}
                                                   color={
                                                      levelColors?.[
                                                         item.level
                                                      ] || Colors.color58
                                                   }
                                                   style={{ marginRight: 8 }}
                                                />
                                                <Text R14 color28 centerV>
                                                   {`${
                                                      item.multiplier || 1
                                                   } x `}
                                                   {item?.activityName?.length >
                                                   20
                                                      ? item?.activityName?.substring(
                                                           0,
                                                           20,
                                                        ) + '...'
                                                      : item?.activityName}
                                                </Text>
                                             </View>
                                             <View row>
                                                <Text
                                                   R12
                                                   secondaryContent
                                                   marginL-16>
                                                   {item?.user?.name}
                                                </Text>
                                                <Text
                                                   R12
                                                   secondaryContent
                                                   marginL-4>
                                                   {moment(
                                                      item.updatedAt,
                                                      'X',
                                                   ).format('hh:mm a')}
                                                </Text>
                                             </View>
                                          </View>
                                       </View>
                                       <TouchableOpacity
                                          onPress={() =>
                                             smashStore.setCurrentStory(item)
                                          }>
                                          {item?.picture?.uri && (
                                             <SmartImage
                                                uri={item?.picture?.uri}
                                                preview={item?.picture?.preview}
                                                style={{
                                                   width: 30,
                                                   height: 30,
                                                   backgroundColor: '#ccc',
                                                   borderRadius: 3,
                                                }}
                                             />
                                          )}

                                          {item.video && (
                                             <SmartVideo
                                                uri={item?.video}
                                                style={{
                                                   width: 30,
                                                   height: 30,
                                                   backgroundColor: '#ccc',
                                                   borderRadius: 3,
                                                }}
                                             />
                                          )}
                                       </TouchableOpacity>
                                    </View>
                                 ))}
                              </View>
                           </View>
                        </View>
                     ))}
               </View>
            </Box>
         </View>
      </>
   );
};

export default inject(
   'smashStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(FollowingTimelineToday));

const styles = StyleSheet.create({});
