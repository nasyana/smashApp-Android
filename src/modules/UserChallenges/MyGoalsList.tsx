import { useNavigation } from '@react-navigation/core';
import { useState, useEffect } from 'react';
import { View, Text, Colors } from 'react-native-ui-lib';
import { FlatList, RefreshControl } from 'react-native';
import MyGoal from 'modules/Home/components/MyChallenge/MyGoal';
import AnimatedView from 'components/AnimatedView';
import { inject, observer } from 'mobx-react';
import { width } from 'config/scaleAccordingToDevice';
import Shimmer from 'components/Shimmer';
import SectionHeader from 'components/SectionHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from "@shopify/flash-list";

import EnterGoalCodeButton from 'modules/Home/EnterGoalCodeButton';
const MyGoalsList = (props) => {
   const [refreshing, setRefreshing] = useState(false);
   const [loading, setLoading] = useState(false);

   const {challengesStore} = props;
   const { goals,  } = challengesStore;


   useEffect(() => {
      onRefresh()
   }, []);
   
   const onRefresh = () => {
      challengesStore.fetchGoals();
      // challengesStore.fetchMyPlayerGoals();
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
   // if(goals.length === 0){ return null}
console.log('render MyGoalsList')
   return (
      <View flex style={{backgroundColor: Colors.background}}>
     
{/* <Text>{goals?.map((g)=>{return g.name + ', '})}</Text> */}
         <FlatList
          estimatedItemSize={150} 
               showsVerticalScrollIndicator={false}
               data={goals}
            scrollEnabled={true}
            ListHeaderComponent={goals?.length > 0 && <SectionHeader 
               title={'My Goals'.toUpperCase()}
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
                           {goals.length}
                        </Text>
                     </LinearGradient>
                  </AnimatedView>
               }
            />}
               refreshControl={
                  <RefreshControl
                     refreshing={refreshing}
                     onRefresh={onRefresh}
                     // colors={["#ff0000", "#00ff00", "#0000ff"]}
                     // tintColor={'#fff'}
                     
                  />
               }
               ListFooterComponent={
                  <View>
                  <EnterGoalCodeButton boxed/>
                  </View>
               }
               // ListEmptyComponent={
               //    <JoinChallengeButton boxed />
               // }
               onResponderRelease={onRelease}
               renderItem={({ item, index }) => {

                  // if(!item.goalId){return null}
                  return (
                  
                  <MyGoal
                     goalId={item.id}
                     key={item.id}
                     goal={item}
                     index={index}
                     playerChallengeInitial={item}
                     challengeId={item.challengeId}
                     smashStore={props.smashStore}
                  />
               )}}
            keyExtractor={(item, index) => item?.id ? item?.id?.toString() : index + 'N'}
               contentContainerStyle={{
                  paddingTop: 16,
                  paddingHorizontal: 8
               }}
          
            />
         </View>

   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(MyGoalsList));
