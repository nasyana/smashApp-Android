import { useNavigation } from "@react-navigation/core";
import Routes from "config/Routes";
import { shadow } from "config/scaleAccordingToDevice";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Colors, Assets, Text, Image } from 'react-native-ui-lib';
import firebaseInstance from '../../config/Firebase';
import { moment } from 'helpers/generalHelpers';;
import SmartImage from 'components/SmartImage/SmartImage';
import { inject, observer } from 'mobx-react';
import Box from 'components/Box';
import SmashItemLog from 'components/SmashItemLog';
import SectionHeader from 'components/SectionHeader';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
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
const TimelineToday = (props) => {


   const {navigate} = useNavigation();
   const {
      smashStore,
      date,
      challengeId,
      teamsStore,
      showTeamData = false,
      SPACING = 28,
      focusUid = false,
      notMe = false
   } = props;
   const { myTeamsHash } = teamsStore;
   const { levelColors, todayDateKey,currentUserId } = smashStore;
   const [posts, setPosts] = useState([]);
   const userId = currentUserId;
   const [postsByTeamId, setPostsByTeamId] = useState([]);
   const selectedDate = date || todayDateKey;

   const uid = focusUid || userId;
   useEffect(() => {
      let theQuery = query(
        collection(firebaseInstance.firestore, 'posts'),
        where('uid', '==', uid || userId),
        where('type', '==', 'smash'),
        where('dayKey', '==', selectedDate),
        limit(30)
      );
    
      if (challengeId) {
         theQuery = query(
          collection(firebaseInstance.firestore, 'posts'),
          where('challengeIds', 'array-contains', challengeId),
          where('uid', '==', uid || userId),
          where('type', '==', 'smash'),
          where('dayKey', '==', date),
          limit(30)
        );
      }
    
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

   const goToSinglePost = (post) => {
      navigate(Routes.SinglePost, {postId:post.id, tempPost: post})
   }
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

   return (
      <>

  
         <View flex >
         <SectionHeader title="Smashes" />
            <Box>
               {showTeamData &&
                  teamsData?.map((teamD) => {
                     if (!teamD?.team?.name) {
                        return;
                     }
                     return (
                        <View flex>
                           <SectionHeader
                              title="TEAMS"
                              style={{ marginTop: 0 }}
                           />
                           <View height={1} backgroundColor={Colors.line} />
                           <View
                              row
                              paddingH-24
                              paddingT-13
                              paddingB-11
                              centerV
                              style={{
                                 justifyContent: 'space-between',
                              }}>
                              <Text H12 color28>
                                 {teamD?.team?.name?.toUpperCase() ||
                                    'TEAM REMOVED'}
                              </Text>
                              {/* <Text H12>{humanDate.toUpperCase()}</Text> */}
                              {/* <Button label={humanDate} link color={Colors.buttonLink} /> */}
                           </View>
                           <View height={1} backgroundColor={Colors.line} />

                           <View
                              row
                              marginV-16
                              style={{ flexWrap: 'wrap' }}
                              paddingH-24>
                              {teamD?.smashes?.map((smash) => {
                                 return <SmashItemLog activity={smash} />; //<Text>{smash.activityName}</Text>;
                              })}
                           </View>
                        </View>
                     );
                  })}
            </Box>
            {/* <Box> */}
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
                           <View marginL-20 flex marginT-0>
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
                                       marginB-8
                                       key={index}
                                       style={{borderBottomWidth: 0.5, paddingBottom: 8, borderColor: '#ccc'}}
                                       >
                                       <View row centerV>
                                          <SmartImage

                                                uri={item?.user?.picture?.uri}
                                                preview={item?.user?.picture?.preview}
                                    style={{height: 30, width: 30, borderRadius: 15}}
                                                />

                                          {/* <Tag
                                             size={7}
                                             // label={}
                                             color={
                                                levelColors?.[item.level] ||
                                                Colors.color58
                                             }
                                          /> */}
                                          <View padding-8>
                                             <Text R14 color28>
                                              
                                                {item?.activityName} <Text smashPink>({`${item.multiplier}` || 1})</Text>
                                             </Text>
                                             <Text
                                                R12
                                                secondaryContent
                                                marginL-0>
                                                {moment(
                                                   item.updatedAt,
                                                   'X',
                                                ).format('h:mm a')}
                                             </Text>
                                          </View>
                                       </View>
                                       <View row centerV paddingR-8>
                                      {item?.picture?.uri?.length > 10 &&  <TouchableOpacity
                                          onPress={() =>
                                             goToSinglePost(item)
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
                                       </TouchableOpacity>}
                                      {/* {!notMe && item?.uid == uid && <TouchableOpacity row style={{padding: 16}} onPress={()=> smashStore.setCommentPost({...item, journal: true})}><MaterialCommunityIcons name="book-open-page-variant" size={18} color={'#aaa'}/><Text M12 secondaryContent marginL-4>{item.journalCount}</Text></TouchableOpacity>} */}
                                       </View>
                                    </View>
                                 ))}
                              </View>
                           </View>
                        </View>
                     ))}
               </View>
            {/* </Box> */}
         </View>
      </>
   );
};

export default inject(
   'smashStore',
   'challengeArenaStore',
   'teamsStore',
)(observer(TimelineToday));

const styles = StyleSheet.create({});
