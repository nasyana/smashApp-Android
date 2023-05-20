import { useNavigation } from '@react-navigation/core';
import ButtonLinear from 'components/ButtonLinear';
import Header from 'components/Header';
import Tag from 'components/Tag';
import Routes from 'config/Routes';
import { shadow } from 'config/scaleAccordingToDevice';
import React, { useEffect, useState } from 'react';
import {
   FlatList,
   ScrollView,
   StyleSheet,
   TouchableOpacity,
} from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { View, Colors, Button, Assets, Text, Image } from 'react-native-ui-lib';

import { moment } from 'helpers/generalHelpers';;
import SmartImage from 'components/SmartImage/SmartImage';
import { inject, observer } from 'mobx-react';
import Box from 'components/Box';
import SmashItemLog from 'components/SmashItemLog';
import { collection, where, query, onSnapshot, limit } from "firebase/firestore";
import firebaseInstance from '../../config/Firebase';
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
const TimelineTodayInTeam = (props) => {
   const { smashStore, date, challengeId, focusUser, teamsStore, team } = props;
   const { myTeamsHash, currentTeam } = teamsStore;
   const [posts, setPosts] = useState([]);
   const userId = focusUser.uid || smashStore?.currentUser.uid;
   const [postsByTeamId, setPostsByTeamId] = useState([]);

   const theTeam = team || currentTeam;
   useEffect(() => {
      let theQuery = query(
        collection(firebaseInstance.firestore, "posts"),
        where("uid", "==", userId),
        where("inTeam", "array-contains", theTeam?.id),
        where("type", "==", "smash"),
        where("dayKey", "==", date),
        limit(30)
      );
    
      const _postsByTeamId = {};
      const unsubscribeToPosts = onSnapshot(theQuery, (snaps) => {
        if (!snaps.empty) {
          const postsArray = [];
    
          snaps.forEach((snap) => {
            const post = snap.data();
    
            postsArray.push(post);
            if (post.inTeam) {
              post.inTeam?.forEach((teamId) => {
                _postsByTeamId[teamId] = _postsByTeamId[teamId]
                  ? [..._postsByTeamId[teamId], post]
                  : [post];
              });
            }
          });
          setPostsByTeamId(_postsByTeamId);
          setPosts(postsArray);
        }
      });
      return () => {
        if (unsubscribeToPosts) {
          unsubscribeToPosts();
        }
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

   const teamsData = [];
   for (id in postsByTeamId) {
      const teamSmashes = postsByTeamId[id] || [];

      teamsData.push({ team: myTeamsHash?.[id], smashes: teamSmashes });
   }

   const teamSmashes = postsByTeamId?.[theTeam.id] || [];

   return (
      <View flex>
         <View>
            <View flex>
               <View
                  row
                  paddingH-16
                  paddingT-13
                  paddingB-11
                  centerV
                  style={{
                     justifyContent: 'space-between',
                  }}>
                  <Text H12 color28>
                     {/* {currentTeam?.name?.toUpperCase() || 'TEAM REMOVED'} */}
                     ACTIVITY SUMMARY
                  </Text>
                  {/* <Text H12>{humanDate.toUpperCase()}</Text> */}
                  {/* <Button label={humanDate} link color={Colors.buttonLink} /> */}
               </View>
               <View height={1} backgroundColor={Colors.line} />

               <View row marginV-16 style={{ flexWrap: 'wrap' }} paddingH-24>
                  {/* {teamSmashes?.map((smash) => {
                     return <SmashItemLog activity={smash} />; //<Text>{smash.activityName}</Text>;
                  })} */}

                  <FlatList
                     data={teamSmashes}
                     contentContainerStyle={{
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                     }}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({ item, index }) => (
                        <SmashItemLog key={item.id} activity={item} />
                     )}
                  />
               </View>
            </View>
         </View>
         {false && (
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
                                 padding-16
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
                                          <Tag
                                             size={26}
                                             label={`${item.multiplier || 1}`}
                                             color={Colors.color58}
                                          />
                                          <View>
                                             <Text R16 color28 marginL-16>
                                                {item.activityName}
                                             </Text>
                                             <Text
                                                R12
                                                secondaryContent
                                                marginL-16>
                                                {moment(
                                                   item.updatedAt,
                                                   'X',
                                                ).format('hh:mm a')}
                                             </Text>
                                          </View>
                                       </View>
                                       <TouchableOpacity
                                          onPress={() =>
                                             smashStore.setCurrentStory(item)
                                          }>
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
                                       </TouchableOpacity>
                                    </View>
                                 ))}
                              </View>
                           </View>
                        </View>
                     ))}
               </View>
            </Box>
         )}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(TimelineTodayInTeam));

const styles = StyleSheet.create({});
