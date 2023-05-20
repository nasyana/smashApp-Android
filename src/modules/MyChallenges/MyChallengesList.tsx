
import { useNavigation } from '@react-navigation/core';
import React, { useState, useEffect } from 'react';
import { View, Assets, Colors, Text } from 'react-native-ui-lib';
import { ScrollView, FlatList, RefreshControl } from 'react-native';
import MyChallenge from 'modules/Home/components/MyChallenge';
import AnimatedView from 'components/AnimatedView';
import { inject, observer } from 'mobx-react';
import { height, width } from 'config/scaleAccordingToDevice';
import SectionHeader from 'components/SectionHeader';
import { LinearGradient } from 'expo-linear-gradient';

const MyChallengesList = (props) => {
   const {  smashStore } = props;

   const { numChallenges, playerChallengeIdsOrdered } =
      props.challengesStore;


   const { challengesView } = smashStore;


   // const [challengesList, setChallengesList] = useState([])
   // useEffect(() => {


   //    const challengesList = [...myChallengesFull].filter(
   //       (c) => c.challengeType != 'team',
   //    )

   //    setChallengesList(challengesList)
   //    setTimeout(() => {
   //       setLoading(false);
   //    }, 2000);
   //    return () => { };
   // }, [numChallenges]);

   // const onRefresh = () => {};
   // const onRelease = () => {};

   // const goToFindChallenge = () => {
   //    navigate(Routes.JoinChallenges);
   // };


   console.log('check rerenders MyChallegesList');
   // if (loading) {
   //    return (
   //       <View flex>
   //          {/* <Header title="My Challenges" back noShadow /> */}
   //          {[1, 2, 3, 4, 5].map((s) => {
   //             return (
   //                <Shimmer
   //                   style={{
   //                      height: 120,
   //                      width: width - 32,
   //                      marginLeft: 16,
   //                      marginVertical: 8,
   //                      borderRadius: 7,
   //                      opacity: 0.4,
   //                   }}
   //                />
   //             );
   //          })}
   //       </View>
   //    );
   // }

   if (challengesView != 'last7') { return null }

   return (
      <View flex>
         {/* <ButtonLinear
            title={'Find A New Challenge'}
            onPress={goToFindChallenge}
            style={{ marginTop: 16 }}
         /> */}
         {numChallenges > 0 && (
            <SectionHeader

               // larger
               title={'My Challenges'.toUpperCase()}
               style={{ marginTop: 16, paddingBottom: 0, marginBottom: 0 }}
               subtitle={
                  <AnimatedView>
                     <LinearGradient
                        colors={['#FF6243', '#FF0072']}
                        style={{
                           padding: 4,
                           paddingHorizontal: 16,
                           borderRadius: 16,
                        }}>
                        <Text B18 white>
                           {numChallenges}
                        </Text>
                     </LinearGradient>
                  </AnimatedView>
               }
            />
         )}
         <View duration={300} delay={0} style={{ width: '100%' }}>
            <FlatList
               showsVerticalScrollIndicator={false}
               data={playerChallengeIdsOrdered || []}
               scrollEnabled={false}
               // refreshControl={
               //    <RefreshControl
               //       refreshing={refreshing}
               //       onRefresh={onRefresh}
               //    />
               // }
               // ListHeaderComponent={
               //    <View>
               //       <ButtonLinear
               //          title={'Join Challenges'}
               //          onPress={goToFindChallenge}
               //          // style={{ marginTop: 16 }}
               //       />
               //    </View>
               // }
               // ListFooterComponent={
               //    <JoinChallengeButton boxed />

               // }
               // onResponderRelease={onRelease}
               renderItem={({ item, index }) => (
                  <MyChallenge
                     playerChallengeId={item}
                     index={index}
                     playerChallengeInitial={{ id: item }}
                     // challengeId={item.challengeId}
                     smashStore={props.smashStore}
                  />
               )}
               keyExtractor={(item) => item?.toString()}
               // style={{ paddingTop: 0, maxHeight: height - 150 }}
               contentContainerStyle={{
                  paddingTop: 8,
                  paddingBottom: 0,
                  // backgroundColor: '#333',
               }}
               style={{ marginBottom: 0 }}
            />
         </View>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(MyChallengesList));
