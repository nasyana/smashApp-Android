import { useNavigation } from '@react-navigation/core';
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native-ui-lib';
import { RefreshControl } from 'react-native';
import MyChallenge from 'modules/Home/components/MyChallenge';
import AnimatedView from 'components/AnimatedView';
import { inject, observer } from 'mobx-react';
import { height, width } from 'config/scaleAccordingToDevice';
import Shimmer from 'components/Shimmer';
import SectionHeader from 'components/SectionHeader';
import { LinearGradient } from 'expo-linear-gradient';
import JoinChallengeButton from 'modules/Home/JoinChallengeButton';
import { FlashList } from "@shopify/flash-list";
import { collection, query, where, getDocs } from 'firebase/firestore';

import firebaseInstance from '../../config/Firebase';
const firestore = firebaseInstance?.firestore;
const MyChallengesList = (props) => {
   const navigation = useNavigation();
   const [refreshing, setRefreshing] = useState(false);
   const [loading, setLoading] = useState(false);
   const { numChallengeTargetsToday,myChallenges } =
      props.challengesStore;


      const [challengesList, setChallengesList] = useState(myChallenges);
   const getChallengesFromFirebase = async () => {
      const uid = firebaseInstance.auth.currentUser.uid;


      const q = query(collection(firestore, 'playerChallenges'), 
                      where('active', '==', true), 
                      where('uid', '==', uid),
                      where('challengeType', '==', 'user'));
      const querySnapshot = await getDocs(q);
      const challenges = [];
      querySnapshot.forEach((doc) => {
        challenges.push(doc.data());
      });
      setChallengesList(challenges);
    };

   useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
         getChallengesFromFirebase();
      });
      return unsubscribe;
   }, [navigation]);

   useEffect(() => {
      onRefresh()
   }, []);
   
   const onRefresh = () => {
      getChallengesFromFirebase();
   };
   

   useEffect(() => {
      setTimeout(() => {
         setLoading(false);
      }, 0);
      return () => {};
   }, []);

   // const onRefresh = () => {};
   const onRelease = () => {};


   if (loading) {
      return (
         <View flex>
            {/* <Header title="My Challenges" back noShadow /> */}
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

   // const data =  myChallenges
   // .filter(
   //    (c) => c.challengeType != 'team',
   // )
   return (
      <View flex>
     

         <FlashList
          estimatedItemSize={150} 
               showsVerticalScrollIndicator={false}
               data={challengesList}
            scrollEnabled={true}
            ListHeaderComponent={<SectionHeader
            style={{paddingLeft: 0, marginLeft: 16}}
               title={'My Habit Stack Challenges'.toUpperCase()}
               subtitle={
                  <AnimatedView>
                     <LinearGradient
                        colors={['#FF6243', '#FF0072']}
                        style={{
                           padding: 0,
                           paddingHorizontal: 8,
                           borderRadius: 16,
                        }}>
                        <Text B18 white>
                           {numChallengeTargetsToday}
                        </Text>
                     </LinearGradient>
                  </AnimatedView>
               }
            />}
               refreshControl={
                  <RefreshControl
                     refreshing={refreshing}
                     onRefresh={onRefresh}
                  />
               }
               ListFooterComponent={
                  <View>
                     <View marginB-16 />
                  </View>
               }
               ListEmptyComponent={
                  <JoinChallengeButton boxed />
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
            keyExtractor={(item, index) => item?.id ? item?.id?.toString() : index + 'N'}
               // style={{ paddingTop: 0, maxHeight: height - 150 }}
               contentContainerStyle={{
                  paddingTop: 16,
                  paddingHorizontal: 8
                  // backgroundColor: '#333',
               }}
               style={{ marginBottom: 0 }}
            />
         </View>

   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(MyChallengesList));
