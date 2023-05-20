import React, { useRef, useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';

import { FONTS } from 'config/FoundationConfig';
import { height, width as ScreenWidth } from 'config/scaleAccordingToDevice';
import { View, Colors, Text, TouchableOpacity } from 'react-native-ui-lib';
import {
   Animated,
   StyleSheet,
   Platform,
   ScrollView,
   TextInput,
   ActivityIndicator
} from 'react-native';
import AnimatedView from 'components/AnimatedView';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import SectionHeader from 'components/SectionHeader';
import FavouriteActivity from './FavouriteActivity'
import * as _ from 'lodash';
import TakeVideoHype from './TakeVideoHype';
const numbersData = [...Array(100).keys()].map((i) => {
   return { text: i + 1 };
});

const CustomPicker = (props: any) => {
   const {
      width,
      challengesStore,
      smashStore,
      closeCamera,
   } = props;
   const {
      libraryActivitiesHash = {},
      smashEffects,
      levelColors,
      currentUser,
      searchText, 
      setSearchText,
      getLevelColor,
      setSelectMultiplier
   } = smashStore;

   
   const [activities, setActivities] = useState([]);

   // alert(JSON.stringify(activities))
   const onPick = (item: any) => {
      setSelectMultiplier(true);
      smashStore.activtyWeAreSmashing = item;
      if (!item?.id) {
         smashStore.multiplier = parseInt(item) || 1;
      }
   };
   const [isLoading, setIsLoading] = useState(false);

   const hasImage =
   smashStore.capturedPicture || smashStore.capturedVideo || smashStore.manuallySkipped;


   const fetchData = async () => {
      setIsLoading(true);
      // Fetch data and set state here

   
      const allMasterIdsInArray = challengesStore.myChallenges?.map(
         (challenge: any) => {
            return [...(challenge.masterIds || [])];
         },
      );
   
      const allMasterIds = [...new Set(allMasterIdsInArray.flat(1))] || [];
      const allActivities = allMasterIds?.map(
         (id: any) => libraryActivitiesHash?.[id],
      );
      const specificActivities = props?.masterIds
         ? props?.masterIds?.map((id: number) => libraryActivitiesHash?.[id] || {text: 'oops no library activity'})
         : false;
   
      const dataActivity = props.activity ? allActivities : numbersData;
      const data = specificActivities ? specificActivities : dataActivity;
      const activities = Object.values(data) || [];


      setSearchText('')
      if (data?.length == 1 && currentUser?.allPointsEver > 0) {
         if (data[0]) onPick(data[0]);
      } else {
         smashStore.activtyWeAreSmashing = false;
      }

      setActivities(activities)

      setTimeout(() => {

      setIsLoading(false);
      }, 900);

    };


   useEffect(() => {
      fetchData();
  
      return () => {
        // Clean up code if necessary
      };
    }, []);

   const clearSelectedActivity = () => {
      smashEffects();
      smashStore.activtyWeAreSmashing = false;
   };
  

   if (isLoading) {
      return (
         <View
         center
         style={{
            position: 'absolute',
          top: 0, 
          left: 0, 
          width: ScreenWidth,
            height: height,
            borderWidth: 0,
            borderColor: '#fff',
         }}>
         {/* <TakeVideoHype /> */}
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }

   if (smashStore?.activtyWeAreSmashing && !hasImage) {
      const activityLevel = smashStore.activtyWeAreSmashing?.level;

      const selectedColor = levelColors?.[activityLevel];

      return (
         <View
         style={{
            position: 'absolute',
            bottom: Platform.OS === 'android' ? 240 : 150,
            borderWidth: 0,
            borderColor: '#fff',
         }}>
         <View style={{ marginHorizontal: 16, marginTop: 16 }}>
            <TouchableOpacity
                  onPress={clearSelectedActivity}
                  style={{
                     flexDirection: 'row',
                     borderRadius: 24,
                     alignItems: 'center',
                     justifyContent: 'center'
                  }}>
                  <Text white>Cancel</Text><Entypo name="cross" size={20} color={selectedColor} />
               </TouchableOpacity>
            <AnimatedView>
               <TouchableOpacity
                  onPress={clearSelectedActivity}
                  style={{
                     backgroundColor: selectedColor || Colors.buttonLink,
                     borderRadius: 36,
                     paddingHorizontal: 16,
                     margin: 3,
                     marginLeft: 0,
                     height: 40,
                     marginVertical: 8,
                     justifyContent: 'center',
                     alignItems: 'center',
                     padding: 0,
                  }}>
                  <Text white>{smashStore?.activtyWeAreSmashing?.text}</Text>
               </TouchableOpacity>
             
            </AnimatedView>
            
         </View>
         </View>
        
      );
   }
   
   let favoriteActivities = currentUser.userFavourites ? Object.keys(currentUser.userFavourites).sort(
      (a, b) =>
         currentUser?.userFavourites?.[b] -
         currentUser?.userFavourites?.[a],
   ) : currentUser?.activityQuantities
? Object.keys(currentUser.activityQuantities).sort(
   (a, b) =>
      currentUser?.activityQuantities?.[b] -
      currentUser?.activityQuantities?.[a],
)
: [];
   
   // currentUser?.activityQuantities
   // ? Object.keys(currentUser.activityQuantities).sort(
   //      (a, b) =>
   //         currentUser?.activityQuantities?.[b] -
   //         currentUser?.activityQuantities?.[a],
   //   )
   // : [];
   
   
   
 
   
 
   


   const hasFrequently = favoriteActivities.length > 0 && searchText.length == 0;

   favoriteActivities.length = 10;

   const fullFavoriteActivities = [];

   favoriteActivities.forEach((a) => {
      const activity = libraryActivitiesHash?.[a] || false;

      if (activity) {
         fullFavoriteActivities.push(activity);
      }
   });

   const activityIds = activities.map((a) => a.id);

   const selectActivitiesPre = searchText.length == 0 ? activities
      .filter((a) => a?.text.toUpperCase().indexOf(searchText.toUpperCase()) > -1 ? true : false, )
      .filter((ac) => !favoriteActivities.includes(ac.id))
      .sort((b, a) => b.level - a.level) : activities
      .filter((a) => a?.text.toUpperCase().indexOf(searchText.toUpperCase()) > -1 ? true : false, )
      // .filter((ac) => !favoriteActivities.includes(ac.id))
      .sort((b, a) => b.level - a.level) ;

    const selectActivities: any[] = [...new Set(selectActivitiesPre)];

    const hasActivities = selectActivities?.length > 0;

    const activitiesByCategory = selectActivities.reduce((prev, curr) => {
       const category = curr.actionCategory[0];
       if (!category && category != 0) return prev;
       if (!prev[category]) {
          prev[category] = [];
       }
       prev[category].push(curr);
       return prev;
    }, {});

  
    if(hasImage){return null}
    return (
      <View
      style={{
         position: 'absolute',
         bottom: Platform.OS === 'android' ? 240 : 150,
         borderWidth: 0,
         borderColor: '#fff',
      }}>
       <AnimatedView>
          <ScrollView
             style={{ height: height - 150, width: ScreenWidth - 8 }}
             keyboardShouldPersistTaps="handled"
             contentContainerStyle={{
                paddingTop: 50,
             }}>

               {!currentUser.allPointsEver && <View paddingH-24 paddingB-24 row spread><Text white B18>1. Select a Habit/Activity:</Text>
               <TouchableOpacity
                   onPress={closeCamera}
                   center
                   style={{
                     //  flex: 1,
                      margin: 0,
                      marginTop: 0,
                     //  height: 40,
                      borderWidth: 0,
                      borderColor: '#fff',

                      alignContent: 'center',
                      justifyContent: 'center',
                   }}>
                   <AntDesign name="close" size={30} color={'#fff'} />
                </TouchableOpacity></View>}
             {currentUser.allPointsEver && <View row centerV spread flex>
                <TextInput
                   value={searchText}
                   onChangeText={(text) => setSearchText(text)}
                   style={{
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.5)',
                      height: 40,
                      color: '#fff',
                      borderRadius: 10,
                      paddingLeft: 15,
                      margin: 16,
                      marginTop: 0,
                      flex: 8,
                      fontFamily: FONTS.medium
                      // width: ScreenWidth - 32,
                   }}
                   placeholder="Search Activities / Habits"
                   placeholderTextColor='rgba(255,255,255,0.7)'
                />
                <TouchableOpacity
                   onPress={closeCamera}
                   center
                   style={{
                      flex: 1,
                      margin: 16,
                      marginTop: 0,
                      height: 40,
                      borderWidth: 0,
                      borderColor: '#fff',

                      alignContent: 'center',
                      justifyContent: 'center',
                   }}>
                   <AntDesign name="close" size={30} color={'#fff'} />
                </TouchableOpacity>
             </View>}

             {hasFrequently && (
                <SectionHeader title="Your Top 10 Frequently Smashed" white />
             )}
             {hasFrequently && (
                <View
                   style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginHorizontal: 16,
                   }}>
                   {_.intersection(favoriteActivities, activityIds).map(
                      (aid) => {
                        
                         
                         return (
                            <FavouriteActivity onPick={onPick} aid={aid}  smashEffects={smashEffects}/>
                         );
                      },
                   )}
                </View>
             )}

             {hasFrequently && hasActivities && (
                <View
                   flex
                   style={{ height: 1, backgroundColor: '#aaa', margin: 24 }}
                />
             )}
             {/* {hasActivities && <SectionHeader title="All Activities" white />} */}
             <View>
                {Object.entries(activitiesByCategory).map(
                   ([category, selectActivities]) => {
                      return (
                         <View>
                            <SectionHeader
                               title={
                                  smashStore.activityCategoryLabels[category]
                               }
                               white
                            />
                            <View
                               style={{
                                  flexDirection: 'row',
                                  flexWrap: 'wrap',
                                  marginHorizontal: 16,
                                  paddingBottom: 16,
                               }}>
                               {selectActivities.map((a) => {
                                  const isSelected =
                                     smashStore?.activtyWeAreSmashing?.id ==
                                     a?.id;

                                  const color = levelColors?.[a.level] || getLevelColor(a.activityValue);
                                  return (
                                     <TouchableOpacity
                                        onPress={() => {
                                           onPick(a);
                                           smashEffects();
                                        }}
                                        style={{
                                           backgroundColor: isSelected
                                              ? Colors.buttonLink
                                              : 'rgba(255,255,255,0.2)',
                                           borderRadius: 36,
                                           paddingHorizontal: 16,
                                           margin: 3,
                                           marginLeft: 0,
                                           marginVertical: 0,
                                           height: 40,
                                           marginVertical: 4,
                                           justifyContent: 'center',
                                           alignItems: 'center',
                                           padding: 0,
                                           flexDirection: 'row',
                                           borderColor: color,
                                           borderWidth: 0,
                                        }}>
                                        <View
                                           style={{
                                              width: 7,
                                              height: 7,
                                              borderRadius: 14,
                                              backgroundColor: color,
                                              marginRight: 8,
                                           }}
                                        />
                                        <Text
                                           H14
                                           // content28
                                           style={{
                                              color: isSelected
                                                 ? '#fff'
                                                 : '#fff',
                                              padding: 0,
                                           }}>
                                           {a?.text || 'cannot find text'}
                                        </Text>
                                     </TouchableOpacity>
                                  );
                               })}
                            </View>
                         </View>
                      );
                   },
                )}
             </View>
          </ScrollView>
       </AnimatedView>
       </View>
    );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(CustomPicker));

const styles = StyleSheet.create({
   wrapper: {
      height: '50%',
   },
});
