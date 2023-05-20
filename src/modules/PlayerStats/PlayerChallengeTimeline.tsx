import { useNavigation } from "@react-navigation/core";
import ButtonLinear from "components/ButtonLinear";
import Header from "components/Header";
import Tag from "components/Tag";
import Routes from "config/Routes";
import { shadow } from "config/scaleAccordingToDevice";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Dimensions } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { View, Colors, Button, Assets, Text, Image } from "react-native-ui-lib";
import Firebase from '../../config/Firebase'
import { moment } from 'helpers/generalHelpers';;
import { inject, observer } from 'mobx-react';
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
const PlayerChallengeTimeline = (props) => {
    const { close, challengeId, uid, endDateKey, arenaIndex, inModal, smashStore } = props;

    const [posts, setPosts] = useState([])

    
   useEffect(() => {

       const unsubscribeToPosts = Firebase.firestore.collection('posts').where('uid', '==', uid).where('challengeIds', 'array-contains', challengeId).limit(30).onSnapshot((snaps) => {

            if (!snaps.empty) {

                const postsArray = []

                snaps.forEach((snap) => {

                    const post = snap.data();

                    postsArray.push(post)
                })

                setPosts(postsArray)

            }

        })
        return () => {
            if (unsubscribeToPosts) { unsubscribeToPosts() }
        }
    }, [])



    const playerStatsData = {}


    const newPostsArray = posts.map((p) => {

        return { ...p, dateKey: moment(p.updatedAt, 'X').startOf('day').format('X') }

    })
    const groupBy = _.groupBy(newPostsArray, 'dateKey');

    const finalData = Object.keys(groupBy).map((key) => {

        return { time: key, records: groupBy[key].sort((b, a) => a.updatedAt - b.updatedAt) }
    })



    return (
       <View flex>
          {finalData &&
             finalData
                .sort((a, b) => b.time - a.time)
                .map((item, index) => (
                   <View flex row marginH-16 key={index}>
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
                            {moment(item.time, 'X').format('dddd Do MMM YYYY')}
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
                               <View row centerV marginB-16 key={index}>
                                  <View row centerV>
                                     <Tag
                                        size={26}
                                        label={`${item.multiplier || 1}`}
                                        color={Colors.color58}
                                     />
                                     <Text R16 color28 marginL-16>
                                        {item.activityName}
                                     </Text>
                                  </View>
                                  <Text R14 secondaryContent marginL-16>
                                     {moment(item.updatedAt, 'X').fromNow()}
                                  </Text>
                               </View>
                            ))}
                         </View>
                      </View>
                   </View>
                ))}
       </View>
    );
};

export default inject("smashStore", "challengeArenaStore")(observer(PlayerChallengeTimeline));

const styles = StyleSheet.create({});
