import Header from 'components/Header';
import { FONTS } from 'config/FoundationConfig';

import React, { useState, useEffect } from 'react';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { View, Assets, Colors } from 'react-native-ui-lib';
import { ScrollView, FlatList, RefreshControl } from 'react-native';
import MyChallenge from 'modules/Home/components/MyChallenge';
import DailyDetail from 'modules/DailyDetail';
import AnimatedView from 'components/AnimatedView';
import { inject, observer } from 'mobx-react';
import { height, width } from 'config/scaleAccordingToDevice';
import Shimmer from 'components/Shimmer';
const MyChallenges = (props) => {
   const { challengesStore } = props;
   const { myChallengesFull, myFinishedChallenges } = challengesStore;

   const [refreshing, setRefreshing] = useState(false);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      setTimeout(() => {
         setLoading(false);
      }, 0);
      return () => {};
   }, []);

   const onRefresh = () => {};
   const onRelease = () => {};

   if (loading) {
      return (
         <View flex>
            <Header title="My Challenges" back noShadow />
            {[1, 2, 3, 4, 5].map((s) => {
               return (
                  <Shimmer
                     style={{
                        height: 120,
                        width: width - 32,
                        marginLeft: 16,
                        marginVertical: 8,
                        borderRadius: 7,
                        opacity: 0.4,
                     }}
                  />
               );
            })}
         </View>
      );
   }
   return (
      <View flex>
         <Header title="My Challenges" back noShadow />

         <View duration={300} delay={0} style={{ width: '100%' }}>
            {/* <FlatList
               showsVerticalScrollIndicator={false}
               data={[...myChallengesFull].filter(
                  (c) => c.challengeType != 'team',
               )}
               refreshControl={
                  <RefreshControl
                     refreshing={refreshing}
                     onRefresh={onRefresh}
                  />
               }
               ListFooterComponent={
                  <View>
                     <View marginB-120 />
                  </View>
               }
               onResponderRelease={onRelease}
               renderItem={({ item, index }) => (
                  <MyChallenge
                     playerChallengeId={item.id}
                     index={index}
                     playerChallengeInitial={item}
                     challengeId={item.challengeId}
                     smashStore={props.smashStore}
                  />
               )}
               keyExtractor={(item) => item?.id.toString()}
               style={{ paddingTop: 0, maxHeight: height - 150 }}
               contentContainerStyle={{ paddingTop: 32 }}
            /> */}
         </View>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(MyChallenges));
