import { Alert, FlatList, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import DoneDialog from '../nav/DoneDialog';
import { inject, observer } from 'mobx-react';
import UniversalLoader from 'components/UniversalLoader';
import VotingDialog from 'modules/TeamArena/VotingDialog';
import { height, width } from 'config/scaleAccordingToDevice';
import Box from 'components/Box';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import LottieAnimation from 'components/LottieAnimation';
import ButtonLinear from 'components/ButtonLinear';
import { dismissCelebration } from 'helpers/CelebrationHelpers';
import AnimatedView from 'components/AnimatedView';
import { Vibrate } from 'helpers/HapticsHelpers';
import EpicBadgeCelebration from 'components/EpicBadgeCelebration';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
// import firebase from 'firebase';
import { AntDesign } from '@expo/vector-icons';
import HabitStack from 'components/HabitStack';
import ListActivitiesInSelectedHabitStacks from 'components/ListActivitiesInSelectedHabitStacks';
import { kFormatter } from 'helpers/generalHelpers';
import SectionHeader from 'components/SectionHeader';
import { doc, onSnapshot, writeBatch, collection, arrayRemove, arrayUnion,updateDoc } from "firebase/firestore";
const LibraryActivitiesModal = (props) => {
   const { smashStore, challengesStore, teamsStore } = props;




   const {
      libraryActionsList,
      habitStacksList,
      removeHabitStackFromStoreHash,
      activityCategoryLabels,
      returnActionPointsValue,
      serverTimestamp,
      getLabelAndColor
   } = smashStore;
   const numberToSelect = 2;
   const { currentTeam } = teamsStore;




 

   
   const dismiss = () => {

         const { currentTeam } = teamsStore;
      Vibrate();
      teamsStore.setShowLibraryActivitiesModal(false);
      // alert(currentTeam?.habitStackIds?.length)
      // if (currentTeam?.habitStackIds?.length >= numberToSelect) {
      //    teamsStore.setShowLibraryActivitiesModal(false);
      // } 
      // else {
      //    Alert.alert('Oops!', 'You need to select 3 stacks to continue', [
      //       { text: 'OK', onPress: () => console.log('OK Pressed') },
      //    ]);
      // }
   };

   const justDismiss = () => {
      Vibrate();
      teamsStore.setShowLibraryActivitiesModal(false);
   };

   const [hidePrimer , setHidePrimer] = useState(false);
   const addRemoveActivity = (activity) => {


      const batch = writeBatch(firestore);
      const removed = currentTeam.hideMasterIds?.includes(activity.id);
      const selected = (currentTeam?.masterIds?.includes(activity.id) && !removed) || (currentTeam?.singleMasterIds?.includes(activity.id) && !removed);

      if (selected) {
         const teamRef = doc(collection(firestore, 'teams'), currentTeam.id);
         batch.update(teamRef, {
            actions: arrayRemove({
               text: activity.text,
               id: activity.id,
               level: activity.level,
            }),
            singleMasterIds: arrayRemove(activity.id),
            hideMasterIds: arrayUnion(activity.id),
            updatedAt: serverTimestamp
         });
      } else {
         const teamRef = doc(collection(firestore, 'teams'), currentTeam.id);
         batch.update(teamRef, {
            actions: arrayUnion({
               text: activity.text,
               id: activity.id,
               level: activity.level,
            }),
            singleMasterIds: arrayUnion(activity.id),
            hideMasterIds: arrayRemove(activity.id),
            updatedAt: serverTimestamp
         });
      }

      batch.commit();
      
   };

   const addRemoveHabitStacks = async (stack) => {
      const selected = currentTeam?.habitStackIds?.includes(stack.id);
    
      removeHabitStackFromStoreHash(stack.id);
      if (selected) {
        await updateDoc(doc(firestore, "teams", currentTeam.id), {
          habitStackIds: arrayRemove(stack.id),
          updatedAt: serverTimestamp
        });
      } else {
        await updateDoc(doc(firestore, "teams", currentTeam.id), {
          habitStackIds: arrayUnion(stack.id),
          updatedAt: serverTimestamp
        });
      }
    };

   const renderItem = ({ item, index }) => {

      const labelAndColor = getLabelAndColor(item)
      const removed = currentTeam?.hideMasterIds?.includes(item.id);

      const selected = (currentTeam?.masterIds?.includes(item.id) && !removed) || currentTeam?.singleMasterIds?.includes(item.id);

if(item.hideFromTeams) return null;
      return (
         <TouchableOpacity
            style={{
               // backgroundColor: selected ? Colors.smashPink : '#fafafa',
               padding: 16,
               borderWidth: 2,
               borderRadius: 24,
               borderColor: '#eee',
               marginBottom: 8,
               backgroundColor: selected ? labelAndColor?.color || '#333' : '#fafafa',

            }}
            onPress={() => addRemoveActivity(item)}
            row
            spread
            centerV>
            <View style={{ minWidth: 60 }}>
               <Text R14 B14={selected} secondaryContent={!selected} style={{color: selected ?  '#fff' : Colors.secondaryContent}}>+{kFormatter(returnActionPointsValue(item))}</Text>
            </View>
            <View flex>
               <Text R16 B16={selected} secondaryContent={!selected} white={selected}>{item.text} </Text>
            </View>
            <Text style={{ color:  selected ?  '#fff'  : '#333' }}>
               {selected ? (
                  <AntDesign name="check" color={'#fff'} size={22} />
               ) : (
                     removed ? <AntDesign name="plus" color={Colors.green20} size={22} /> : <AntDesign name="plus" color={Colors.smasgreen20hPink} size={18} />
               )}
            </Text>
         </TouchableOpacity>
      );
   };

   const [selectedCategories, setSelectedCategories] = useState([0]);

   const handlePressCategoryButton = (index) => {
      let updatedSelectedCategories = [...selectedCategories];
      if (selectedCategories.includes(index)) {
         updatedSelectedCategories = updatedSelectedCategories.filter((i) => i !== index);
      } else {
         updatedSelectedCategories.push(index);
      }
      setSelectedCategories([index]);
   }

   const renderCategoryButton = (index) => {

      const buttonStyle = {
         backgroundColor: selectedCategories.includes(index) ? Colors.smashPink : 'white',
         color: selectedCategories.includes(index) ? 'white' : 'white',
         borderWidth: 1,
         borderColor: selectedCategories.includes(index) ? Colors.smashPink : '#aaa',
         paddingHorizontal: 10,
         paddingVertical: 8,
         borderRadius: 16,
         marginVertical: 4,
         marginRight: 4
      };

      const textStyle = { color: selectedCategories.includes(index) ? 'white' : '#aaa', }

      return (
         <TouchableOpacity onPress={() => handlePressCategoryButton(index)} style={buttonStyle}>
            <Text R16 style={textStyle}>{activityCategoryLabels[index]}</Text>
         </TouchableOpacity>
      );
   }

   const filteredLibraryActionsList = libraryActionsList.filter((item) => {
      if (selectedCategories.length === 0 || item?.hideFromTeams) {
         return true;
      }
      return item.actionCategories.some((category) => selectedCategories.includes(category));
   });


   const renderHabitStackItem = ({ item, index }) => {
      return <HabitStack stack={item} onPress={addRemoveHabitStacks} />;
   };

   const remainingStacks = numberToSelect - (currentTeam?.habitStackIds?.length || 0);
   const selectedSomeStacks = remainingStacks < numberToSelect;
   const label = remainingStacks <= 0 ? `All Set. Let's go!` : remainingStacks == numberToSelect ? `Select at least ${numberToSelect} stacks` : remainingStacks == 1 ? 'Select 1 more stack' : `Select ${remainingStacks} more stacks`;
const seen = () => {  setHidePrimer(true)}

   if(!hidePrimer && teamsStore.showLibraryActivitiesModal == 'habitStacks' && (currentTeam?.habitStackIds?.length == 0 || currentTeam?.habitStackIds == undefined)){

      return (<AnimatedView style={{ flex: 1, height, width, backgroundColor: 'rgba(255,255,255,1)' }} center flex padding-32>

         <Text B18>Next, Choose {numberToSelect} Habit Stacks</Text>
         <Text R14 padding-32 center>On the next step, choose some Habit Stacks to give your team some Habits/Activities to start with. You can change them later from the team screen.</Text>
          <TouchableOpacity
                  onPress={seen}
                  style={{
                     alignItems: 'center',
                  }}>
                  <View
                     style={{
                        backgroundColor: Colors.smashPink,
                        borderRadius: 45,
                        alignItems: 'center',
                        paddingVertical: 15,
                        zIndex: 9999,
                        paddingHorizontal: 24,
                        marginTop: 16
                     }}>
                     <View row>
                     <Text B14 white>Got It, Let's Go!</Text></View>
                  </View>
               </TouchableOpacity></AnimatedView>)
   }

 
return (
   <View>
      <Modal
         visible={(teamsStore.showLibraryActivitiesModal && (hidePrimer || currentTeam?.habitStackIds?.length > 0)) ? true : false}
         transparent={true}
         animationType="fade"
         style={{
            alignItems: 'center',
            justifyContent: 'center',
         }}>
         <View
            style={{
               backgroundColor: 'rgba(0,0,0,0.7)',
               position: 'absolute',
               height,
               width,
               justifyContent: 'center',
               alignItems: 'center',
            }}>

            {teamsStore.showLibraryActivitiesModal == 'habitStacks' ? <AnimatedView>
               <Box
                  style={{
                     height: height / 1.2,
                     width: width - 32,

                     paddingHorizontal: 24,
                     alignItems: 'center',
                     justifyContent: 'center',
                  }}>
                  {true && (
                     <FlatList
                        // horizontal
                        ListHeaderComponent={
                           <View paddingB-16>
                              <Text B22 center>
                                 {currentTeam.name} Stacks
                              </Text>
                              {!selectedSomeStacks && (
                                 <Text center secondaryContent>
                                    Choose at least {numberToSelect} Stacks
                                 </Text>
                              )}
                              {/* {currentTeam.habitStackIds?.map((i) => <Text>{i}</Text>)} */}
                              {selectedSomeStacks && (
                                 <Text center secondaryContent>
                                    Great! Scroll to the bottom to see the
                                    activities in the stacks you've selected. You can remove any that you don't want to use.
                                 </Text>
                              )}
                           </View>
                        }
                        ListFooterComponent={
                           <ListActivitiesInSelectedHabitStacks addRemoveActivity={addRemoveActivity} />
                        }
                        numColumns={2}
                        data={habitStacksList}
                        keyExtractor={(item) => item.id}
                        renderItem={renderHabitStackItem}
                        showsHorizontalScrollIndicator={false}
                        style={{
                           height: height / 2,
                           width: width - 32,
                           marginTop: 24,
                        }}
                        contentContainerStyle={{
                           paddingHorizontal: 16,
                           alignItems: 'center',
                           justifyContent: 'center',
                        }}
                     />
                  )}


               </Box>
            </AnimatedView> : <AnimatedView>
               <Box
                  style={{
                     height: height / 1.2,
                     width: width - 32,

                        paddingHorizontal: 0,
                     alignItems: 'center',
                     justifyContent: 'center',
                     }}>

                     <FlatList
                        data={filteredLibraryActionsList}
                        ListHeaderComponent={<View >
                           <Text B22 center>
                              {currentTeam.name} Activities (
                              {currentTeam.masterIds?.length})
                           </Text>
                           <SectionHeader title="Habit Categories" top={24} bottom={0} style={{paddingBottom: 0}}/>
                           <View row style={{ flexWrap: 'wrap', padding: 8, marginBottom: 24 }} center>
                              {activityCategoryLabels.map((label, index) => renderCategoryButton(index))}
                           </View>
                           <SectionHeader title="Selected Habits & Activities" />
                        </View>
                        }
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        style={{
                           height: height / 2,
                           width: width - 24,
                        }}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 32 }}
                     />
                  </Box>
            </AnimatedView>}
            {teamsStore.showLibraryActivitiesModal == 'habitStacks' ? <ButtonLinear
               title={
                  label
               }
               style={{
                  marginTop: 0,
                  position: 'absolute',
                  bottom: -20,
               }}
               colors={[Colors.buttonLink, Colors.smashPink]}
               style={{
                  width: '90%',
                  marginBottom: 0,
                  marginTop: -24,
               }}
               onPress={dismiss}
            /> : <ButtonLinear
               title="Done"
               style={{
                  marginTop: 0,
                  position: 'absolute',
                  bottom: -20,
               }}
               colors={[Colors.buttonLink, Colors.smashPink]}
               style={{
                  width: '90%',
                  marginBottom: 0,
                  marginTop: -24,
               }}
               onPress={justDismiss}
            />}
         </View>
      </Modal>
   </View>
);
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(LibraryActivitiesModal));
