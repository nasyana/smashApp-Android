import { useNavigation } from '@react-navigation/native';
import FooterLinear from 'components/FooterLinear';
import Input from 'components/Input';
import Routes from 'config/Routes';
import SegmentControl from 'libs/react-native-segment';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Platform, Alert } from 'react-native';
import SmartImage from '../../components/SmartImage/SmartImage';
import { sendNotificationToUser } from 'services/NotificationsService';
import {
   View,
   Text,
   Colors,
   Image,
   Assets,
   KeyboardAwareScrollView,
   TouchableOpacity,
} from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import { AntDesign } from '@expo/vector-icons';
import Header from 'components/Header';
import moment from 'moment-timezone';
import { collection, doc, setDoc } from 'firebase/firestore';
import firebaseInstance from '../../config/Firebase';
const firestore = firebaseInstance.firestore;
const StepOne = (props) => {
   const { navigate } = useNavigation();
   const onNext = (data) => {
      const { name } = data;

      if (name?.length < 1) {
         Alert.alert(
            'Oops!',
            `Write your nickname...`,
            [{ text: 'Got it', onPress: () => {}, style: 'cancel' }],
            { cancelable: true },
         );

         return;
      }

      const { uid, phoneNumber } = firebaseInstance.auth.currentUser;

      const newUserObj = {
         name,
         id: uid,
         uid,
         phoneNumber,
         timeZone: moment.tz.guess(true),
         updatedAt: parseInt(Date.now() / 1000),
         dateCreated: parseInt(Date.now() / 1000),
         city: 'SmashVille',
         os: Platform.OS || 'na',
         version: Platform.Version || 'na',
      };

      const usersCollectionRef = collection(firestore, 'users');
const userDocRef = doc(usersCollectionRef, uid);

      setDoc(userDocRef, newUserObj, { merge: true })
  .then(() => {
    props.smashStore.init(newUserObj);

    props.smashStore.adminIds.forEach(uid => {
      sendNotificationToUser(
        'New user signed up: ' + newUserObj.name,
        newUserObj.os,
        uid,
      );
    });

    props.smashStore.setFirstTime(true);
  });


      navigate(Routes.StepTwo, { name, uid });
   };

   const nameFromFB = props?.route?.params?.nameFromFB || false;
   const { control, handleSubmit } = useForm({
      defaultValues: {
         name: nameFromFB || '',
         age: '',
      },
   });


   const CustomRight = () => {

      return (<TouchableOpacity onPress={handleSubmit(onNext)} row centerV>
         <Text smashPink B16 marginR-4>Next</Text><AntDesign
            name={'right'}
            size={18}
            color={Colors.smashPink}
         />
      </TouchableOpacity>
      )

   }

   return (
      <View flex backgroundColor={Colors.contentW}>
         <Header noShadow back customRight={<CustomRight />} />
         <Text H36 marginL-24 marginT-20>
            Step 1/4
         </Text>
         <Text R18 marginL-24 marginB-16>
            Hey Champ! What's your Nickname?
         </Text>
         <View flex>
            {/* <Image
          source={Assets.icons.img_user_photo}
          style={{ alignSelf: 'center' }}
          marginV-40
        /> */}

            <Controller
               control={control}
               name="name"
               render={({ field: { value, onChange } }) => (
                  <Input
                     value={value}
                     onChangeText={onChange}
                     label={'Your Nickname'}
                     autoCapitalize
                  />
               )}
            />
            {/* <Controller
          control={control}
          name="age"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              label={'Your Age'}
              keyboardType={'number-pad'}
            />
          )}
        /> */}
            {/* <SegmentControl
          values={['FITNESS', 'LIFESTYLE']}
          onChange={(currentIndex) => { }}
          disable={false}
          selectedIndex={1}
          style={{ marginTop: 24 }}
        /> */}
         </View>
         {/* <FooterLinear title={'NEXT'} onPress={handleSubmit(onNext)} /> */}
      </View>
   );
};

export default inject("smashStore")(observer(StepOne));

const styles = StyleSheet.create({});
