import AddActivities from 'modules/CreateChallenge/components/AddActivities';
import React, { useEffect, useState } from 'react';
import { Colors, View, Text, TouchableOpacity } from 'react-native-ui-lib';
import Box from 'components/Box';
import Input from 'components/Input';
import { bottom, height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { ScrollView } from 'react-native-gesture-handler';
import Header from 'components/Header';
import CustomButtonLinear from 'components/CustomButtonLinear';
import { ActivityIndicator } from 'react-native';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import { getFirestore, doc, setDoc, merge } from '@firebase/firestore';

import { useNavigation } from '@react-navigation/core';
import SmartImage from 'components/SmartImage/SmartImage';
import * as ImagePicker from 'expo-image-picker';
function CreateHabitStack(props) {
   const { goBack } = useNavigation();
   const { actionsStore, smashStore } = props;
   const [name, setName] = useState('');
   const [loading, setLoading] = useState(false);

   const [picture, setPicture] = useState(false);
   const [pictureTwo, setPictureTwo] = useState(false);
   const [imageLoading, setImageLoading] = useState(false);
   const [imageLoadingTwo, setImageLoadingTwo] = useState(false);

   const { selectedActions = [], setSelectedActions } = actionsStore;
   const { libraryActivitiesHash, libraryActionsList } = smashStore;

   const habitStack = props?.route?.params?.habitStack || false;
   useEffect(() => {
      return () => {
         actionsStore.clearSelectedActions();
      };
   }, []);

   useEffect(() => {
      if (!habitStack) {
         return;
      }
      setName(habitStack?.name);
      setPicture(habitStack?.picture || false);
      setPictureTwo(habitStack?.pictureTwo || false);
      const selectedActions = libraryActionsList.filter((item: any) =>
         habitStack?.masterIds.includes(item?.id),
      );

      actionsStore.setSelectedActions(selectedActions);

      return () => {};
   }, []);

   const handleCreateHabitStack = async () => {
      setLoading(true);
      const habitStack = props?.route?.params?.habitStack || false;
      const uid = firebaseInstance.auth.currentUser.uid;
      const masterIds = selectedActions.map((item) => item.id);
      const actions = selectedActions.reduce((acc, item) => {
         acc[item.id] = { text: item.text };
         return acc;
      }, {});

      const habitStackDoc = {
         name,
         updatedAt: parseInt(Date.now() / 1000),
         masterIds,
         actions,
         uid,
         active: true,
         picture,
         pictureTwo,
      };

      let habitStackRef = doc(collection(firestore, 'habitStacks'));

      if (habitStack?.id) {
        habitStackRef = doc(firestore, 'habitStacks', habitStack.id);
      }
      
      try {
        await setDoc(habitStackRef, { ...habitStackDoc, id: habitStackRef.id }, { merge: true });
        setLoading(false);
      } catch (error) {
        console.error('Error updating document:', error);
        setLoading(false);
      }

      goBack();
   };

   const removeHabitStack = async (habitStack) => {
      const habitStackRef = doc(firestore, 'habitStacks', habitStack.id);

      try {
        await setDoc(habitStackRef, { active: false }, { merge: true });
      } catch (error) {
        console.error('Error updating document:', error);
      }

      goBack();
   };

   const onPressLibraryTwo = async () => {
      if (imageLoadingTwo) return;

      try {
         const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: Platform.OS === 'ios' ? false : false,
            aspect: [4, 3],
            durationLimit: 60,
            mediaTypes:
               Platform.OS === 'ios'
                  ? ImagePicker.MediaTypeOptions.All
                  : ImagePicker.MediaTypeOptions.Images,
         });

         if (!result.cancelled) {
            setImageLoadingTwo(true);
            const picture = await smashStore.uploadImage(result);
            setPictureTwo(picture);

            setImageLoadingTwo(false);
         }
      } catch (e) {
         console.log(e);
         setImageLoading(false);
      }
   };

   const onPressLibrary = async () => {
      if (imageLoading) return;

      try {
         const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: Platform.OS === 'ios' ? false : false,
            aspect: [4, 3],
            durationLimit: 60,
            mediaTypes:
               Platform.OS === 'ios'
                  ? ImagePicker.MediaTypeOptions.All
                  : ImagePicker.MediaTypeOptions.Images,
         });

         if (!result.cancelled) {
            setImageLoading(true);
            const picture = await smashStore.uploadImage(result);
            setPicture(picture);

            setImageLoading(false);
         }
      } catch (e) {
         console.log(e);
         setImageLoading(false);
      }
   };

   return (
      <View flex>
         <Header
            title={
               habitStack?.name
                  ? habitStack?.name +
                    ' (' +
                    habitStack?.masterIds?.length +
                    ' Activities)'
                  : 'Create Habit Stack'
            }
            back
         />

         <ScrollView>
            <Box style={{ marginTop: 20, paddingTop: 20 }}>
               <Input
                  value={name}
                  onChangeText={(text) => setName(text)}
                  label={'Habit Stack Name'}
                  parentStyle={{
                     marginHorizontal: 16,
                     width: width - 64,
                     borderColor: Colors.line,
                  }}
               />

               <View row paddingH-16 >
                  <TouchableOpacity onPress={onPressLibrary} style={{backgroundColor: '#aaa',marginRight: 8,}}>
                     {!imageLoading || picture?.uri ? (
                        <SmartImage
                           uri={picture?.uri}
                           preview={picture?.preview}
                           style={{
                              width: 80,
                              height: 80,
                              
                              // backgroundColor: '#ccc',
                              borderWidth: 0.5,
                              borderColor: Colors.secondaryContent,
                           }}
                        />
                     ) : (
                        <ActivityIndicator />
                     )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onPressLibraryTwo}>
                     {!imageLoadingTwo || pictureTwo?.uri ? (
                        <SmartImage
                           uri={pictureTwo?.uri}
                           preview={pictureTwo?.preview}
                           style={{
                              width: 80,
                              height: 80,
                              backgroundColor: '#eee',
                              borderWidth: 0.5,
                              borderColor: Colors.secondaryContent,
                           }}
                        />
                     ) : (
                        <ActivityIndicator />
                     )}
                  </TouchableOpacity>
               </View>
               <AddActivities
                  title={'Activities'}
                  data={selectedActions.length > 0 ? selectedActions : []}
               />
            </Box>
            <CustomButtonLinear
               title={habitStack?.id ? 'Update' : 'Create'}
               onPress={
                  !loading && habitStack?.id
                     ? handleCreateHabitStack
                     : !loading
                     ? handleCreateHabitStack
                     : () => {}
               }
               style={{
                  marginBottom: 16,
               }}
               loader={
                  loading ? (
                     <ActivityIndicator size="small" color="#ffffff" />
                  ) : null
               }
            />

            <CustomButtonLinear
         
            color={'#333'}
            colors={['#ccc', '#ccc']}
               title={'Delete'}
           
               onPress={() => removeHabitStack(habitStack)}
               style={{
                  marginBottom: bottom,
                  backgroundColor: '#fff'
               }}
               loader={
                  loading ? (
                     <ActivityIndicator size="small" color="#ffffff" />
                  ) : null
               }
            />
         </ScrollView>
      </View>
   );
}

export default inject(
   'createChallengeStore',
   'actionsStore',
   'smashStore',
   'teamsStore',
)(observer(CreateHabitStack));
