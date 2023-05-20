import ButtonLinear from 'components/ButtonLinear';
import { scaleH, width } from 'config/scaleAccordingToDevice';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import {
   View,
   Text,
   Image,
   Assets,
   Colors,
   TouchableOpacity,
   Switch,
   Picker,
   LoaderScreen,
} from 'react-native-ui-lib';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import Routes from 'config/Routes';
import Input from 'components/Input';
import { Controller, useForm } from 'react-hook-form';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import Header from 'components/Header';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../components/SmartImage/SmartImage';
import _, { merge } from 'lodash';
import { FONTS } from 'config/FoundationConfig';
import { collection, doc, getDocs, query, where, setDoc,updateDoc,writeBatch } from 'firebase/firestore';
import { getCountriesFromISO } from 'helpers/IsoCodes';
import { AntDesign } from '@expo/vector-icons';
import ChallengesStore from 'stores/ChallengesStore';
import { todayDateKey } from 'helpers/dateHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
const countryOptions = getCountriesFromISO();

const EditProfile = (props) => {
   const navigation = useNavigation();

   const [loadingPicture, setLoadingPicture] = useState(false);
   const { navigate } = navigation;
   const { uid } = firebaseInstance.auth.currentUser;
   const { smashStore, challengesStore, teamsStore } = props;
   const { currentUser = {} } = smashStore;
   const [followingNotiDisabled, setFollowingNotiDisabled] = useState(
      currentUser.followingNotificationsDisabled || false,
   );

   const [isPrivate, setIsPrivate] = useState(currentUser.isPrivate || false);
   const [publicFeedDisabled, setPublicFeedDisabled] = useState(
      currentUser.publicFeedDisabled || false,
   );


   

   const editCity = true;
   const onSave = React.useCallback(
      (data) => {
         const { name, country, city } = data;
   
         const userDocRef = doc(firebaseInstance.firestore, 'users', uid);
   
         updateDoc(
            userDocRef,
            {
               name,
               country,
               city,
               timestamp: parseInt(Date.now() / 1000),
               updatedAt: parseInt(Date.now() / 1000),
               testUpdatedAt: parseInt(Date.now() / 1000),
               followingNotificationsDisabled: followingNotiDisabled,
               publicFeedDisabled,
               isPrivate,
            },
            { merge: true },
         ).then(() => {
            if (isPrivate != currentUser.isPrivate || name !=currentUser.name) {
               const playerChallengeQuery = query(
                  collection(firebaseInstance.firestore, 'playerChallenges'),
                  where('uid', '==', uid),
                  where('active', '==', true),
               );
               getDocs(playerChallengeQuery).then((allPlayerChallengesSnap) => {
                  allPlayerChallengesSnap.forEach((pSnap) => {
                     updateDoc(
                        pSnap.ref,
                        { isPrivate: isPrivate, user: {name: name} },
                        { merge: true },
                     );
                  });
               });
   
               const postsQuery = query(
                  collection(firebaseInstance.firestore, 'posts'),
                  where('uid', '==', uid),
                  where('dayKey', '==', todayDateKey()),
                  where('active', '==', true),
               );
               getDocs(postsQuery).then((postSnaps) => {
                  postSnaps.forEach((pSnap) => {
                     updateDoc(
                        pSnap.ref,
                        { isPrivate: isPrivate, user: {name: name} },
                        { merge: true },
                     );
                  });
               });
            }
            navigation.goBack();
         });
      },
      [followingNotiDisabled, isPrivate],
   );

   const { control, handleSubmit } = useForm({
      defaultValues: {
         name: smashStore.currentUser.name || 'no name',
         country: smashStore.currentUser.country || '-',
         city: smashStore.currentUser.city || '-',
      },
   });

   const changeImage = async () => {
      try {
        const picture = await props.smashStore.uploadImageFromLibrary(
          setLoadingPicture,
          'small',
          true
        );
        const userRef = doc(collection(firestore, 'users'), uid);
        const playerChallengesQuery = query(
          collection(firestore, 'playerChallenges'),
          where('uid', '==', uid),
          where('active', '==', true)
        );
        const postsQuery = query(
          collection(firestore, 'posts'),
          where('uid', '==', uid),
          where('dayKey', '==', todayDateKey()),
          where('active', '==', true)
        );
        const batch = writeBatch(firestore);
      //   batch.set(userRef, { picture }, { merge: true });
        const allPlayerChallengesSnap = await getDocs(playerChallengesQuery);
        allPlayerChallengesSnap.forEach((pSnap) => {
          const playerChallengeRef = doc(
            collection(firestore, 'playerChallenges'),
            pSnap.id
          );
          batch.set(playerChallengeRef, { user: { picture } }, { merge: true });
        });
        const postsSnapshot = await getDocs(postsQuery);
        postsSnapshot.forEach((postDoc) => {
          const postRef = doc(collection(firestore, 'posts'), postDoc.id);
          batch.set(postRef, { user: { picture } }, { merge: true });
        });
        await batch.set(userRef, { picture: picture }, { merge: true });
        await batch.commit();
      //   const userRef = doc(firebaseInstance.firestore, 'users', firebaseInstance.auth.currentUser.uid);
   
      } catch (error) {
        console.error(error);
      }
    };
    

   const deleteMyAccount = () => {
      Alert.alert(
         'Are you sure?',
         'Your account will be removed and you will not be able to get this account back.',
         [
            {
               text: 'Cancel',
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel',
            },
            {
               text: 'OK',
               onPress: () => alert('Your account will be removed.'),
            },
         ],
      );
   };
   const restore = async () => {

      await smashStore.getCustomerData();

   }

   const restoreMyPurchases = () => {
      Alert.alert(
         'No problem!',
         "We can check your purchase status and update your user status.",
         [
            {
               text: 'Cancel',
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel',
            },
            {
               text: 'Yes, please restore',
               onPress: () => restore(),
            },
         ],
      );
   };


   const clearAllAsyncStorage = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
        console.log('AsyncStorage successfully cleared');
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
    };


   return (
<View flex>
         <Header title="Edit Profile" back />

         <KeyboardAwareScrollView contentContainerStyle={{paddingBottom: 32}} bounces={true} style={styles.container} showsVerticalScrollIndicator={false}>
            <TouchableOpacity centerH marginT-40 onPress={changeImage}>
               <View
                  style={{
                     height: 100,
                     width: 100,
                     borderRadius: 160,
                     backgroundColor: '#eee',
                  }}>
                  <SmartImage
                     uri={props.smashStore?.currentUser?.picture?.uri}
                     preview={props.smashStore?.currentUser?.picture?.preview}
                     style={{
                        height: 100,
                        width: 100,
                        borderRadius: 160,
                        backgroundColor: '#eee',
                     }}
                  />
                  {loadingPicture && (
                     <LoaderScreen color={Colors.buttonLink} overlay />
                  )}
                  <View
                     style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 4,
                        borderRadius: 16,
                        backgroundColor: '#eee',
                        position: 'absolute',
                        bottom: 4,
                        right: 4,
                     }}>
                     <AntDesign name={'camera'} size={20} color={'#333'} />
                  </View>
               </View>
            </TouchableOpacity>
            <View
               flex
               backgroundColor={Colors.contentW}
               style={{
                  paddingTop: scaleH(40),
                  justifyContent: 'flex-end',
               }}>
               <Controller
                  control={control}
                  name="name"
                  render={({ field: { value, onChange } }) => (
                     <Input
                        value={value}
                        onChangeText={onChange}
                        label={'Nickname'}
                     />
                  )}
               />

               <Controller
                  control={control}
                  name="city"
                  render={({ field: { value, onChange } }) => (
                     <Input
                        value={value}
                        onChangeText={onChange}
                        label={'City'}
                        autoFocus={editCity}
                     />
                  )}
               />

               <Controller
                  control={control}
                  name="country"
                  render={({ field: { value, onChange } }) => (
                     <Picker
                        title="Country"
                        placeholder="Select a Country"
                        useNativePicker
                        value={value}
                        onChange={onChange}
                        containerStyle={{
                           marginTop: 10,
                           marginHorizontal: 30,
                        }}>
                        {_.map(countryOptions, (option) => (
                           <Picker.Item
                              key={option.value}
                              value={option.value}
                              label={option.label}
                           />
                        ))}
                     </Picker>
                  )}
               />

               {false && (
                  <View flex row spread marginH-16 marginB-16 paddingH-16>
                     <View flex>
                        <Text M16 color6D>
                           Public Profile
                        </Text>
                        <Text R12 color6D>
                           Anyone can follow you and see your progress &
                           updates.
                        </Text>
                     </View>
                     <Switch
                        height={35}
                        width={53}
                        onColor={Colors.color44}
                        offColor={Colors.color6D}
                        //   value={lifestyle}
                        //   onValueChange={setLifestyle}
                        thumbSize={30}
                     />
                  </View>
               )}

               {false && (
                  <View flex row spread marginH-16 marginB-16 paddingH-16>
                     <View flex>
                        <Text M16 color6D>
                           Public Feed
                        </Text>
                        <Text R12 color6D>
                           Disable your feed of photos and completions from
                           being displayed to the public.
                        </Text>
                     </View>
                     <Switch
                        height={35}
                        width={53}
                        onColor={Colors.color44}
                        offColor={Colors.color6D}
                        value={!publicFeedDisabled}
                        onValueChange={(val) => setPublicFeedDisabled(!val)}
                        thumbSize={30}
                     />
                  </View>
               )}

               <View flex row spread marginH-16 marginB-16 paddingH-16>
                  <View flex>
                     <Text M16 color6D>
                        Private Mode
                     </Text>
                     <Text R12 color6D>
                        Private mode hides your activity and name from everyone
                        on SmashApp unless you're in a team with them or you
                        follow them.
                     </Text>
                  </View>
                  <Switch
                     height={35}
                     width={53}
                     onColor={Colors.color44}
                     offColor={Colors.color6D}
                     value={isPrivate}
                     onValueChange={(val) => setIsPrivate(val)}
                     thumbSize={30}
                  />
               </View>

               {false && (
                  <View flex row spread marginH-16 marginB-16 paddingH-16>
                     <View flex>
                        <Text M16 color6D>
                           Following Notifications
                        </Text>
                        <Text R12 color6D>
                           Receive Notifications from players you follow if they
                           overtake you!
                        </Text>
                     </View>
                     <Switch
                        height={35}
                        width={53}
                        onColor={Colors.color44}
                        offColor={Colors.color6D}
                        value={followingNotiDisabled}
                        onValueChange={(val) => setFollowingNotiDisabled(val)}
                        thumbSize={30}
                     />
                  </View>
               )}
               <ButtonLinear
                  title={'Save'}
                  style={styles.btnSignUp}
                  onPress={handleSubmit(onSave)}
               />
               <Text R14 color28 center>
                  Switch Users?
                  <Text
                     R14
                     buttonLink
                     onPress={() => {

                        clearAllAsyncStorage();
                        smashStore.clearStore();
                        teamsStore.clearStore();
                        challengesStore.clearStore();
                        navigate(Routes.Login);
                        firebaseInstance.auth.signOut();

                        
                  
                     
                     }}>
                     {' '}
                     Log Out
                  </Text>
               </Text>

               <TouchableOpacity center marginT-64 onPress={restoreMyPurchases}>
                  <Text style={{ color: Colors.secondaryContent }}>Restore My Premium Subscription</Text>
               </TouchableOpacity>
               <TouchableOpacity center marginT-16 onPress={deleteMyAccount}>
                  <Text style={{ color: Colors.red40 }}>Delete My Account</Text>
               </TouchableOpacity>
            </View>
             </KeyboardAwareScrollView>
             </View>

   );
};

export default inject(
   'smashStore',
   'teamsStore',
   'challengesStore',
)(observer(EditProfile));

const styles = StyleSheet.create({
    btnSignUp: {
        marginVertical: scaleH(16),
    },
    container: {
        backgroundColor: Colors.contentW,
    },
});
