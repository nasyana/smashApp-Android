import ButtonLinear from 'components/ButtonLinear';
import Input from 'components/Input';
import { scaleH, width } from 'config/scaleAccordingToDevice';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { View, Text, Image, Assets, Colors, Button, TextField, TouchableOpacity } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import Routes from 'config/Routes';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useForm } from 'react-hook-form';
import * as Location from 'expo-location';
import { inject, observer } from 'mobx-react';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { onAuthStateChanged } from 'firebase/auth';
import { signInWithPhoneNumber } from "firebase/auth";
import * as AppleAuthentication from 'expo-apple-authentication';
import { getAuth, OAuthProvider, signInWithCredential } from "firebase/auth";
import { auth, FirebaseError } from 'firebase/auth';
import { PhoneAuthProvider } from "firebase/auth";
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OTPField } from './OTPField';
import PhoneInput from 'react-native-phone-number-input';
import { LocationGeocodedAddress, LocationObject } from 'expo-location';
import Header from 'components/Header';
import LinearLoading from 'components/LinearLoading';
import AnimatedView from 'components/AnimatedView';
import { FONTS } from 'config/FoundationConfig';
import moment from 'moment'
import firebaseInstance from 'config/Firebase';
import { collection, query, where, limit, onSnapshot,getDoc,doc } from 'firebase/firestore';
const isAndroid = Platform.OS === 'android';
export interface IMessage {
   _id: string | number;
   text: string;
   createdAt: Date | number;
   token: any;
}

const Login = (props) => {
   const recaptchaVerifier = useRef(null);
   const [phoneNumber, setPhoneNumber] = useState('');
   const [countryCode, setCountryCode] = useState('AU');
   const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
   const [placeholder, setPlaceholder] = useState('0412 345 678');
   const [confirmationResult, setConfirmationResult] = useState(null);
   const [initialLoading, setInitialLoading] = useState(true);
   const [phoneAuthInProcess, setPhoneAuthInProcess] = useState(false);
   const { navigate } = useNavigation();
   const { smashStore, notificatonStore, teamsStore, challengesStore } = props;


   //  teamsStore.loadTeamPlayersFromStorage();

   const setUserLocation = useCallback(async (uid) => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
         console.log('Permission to access location was denied');
         return;
      }

      let location: LocationObject = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      let response: LocationGeocodedAddress[] =
         await Location.reverseGeocodeAsync({
            latitude,
            longitude,
         });
      const { isoCountryCode = 'AU', city } = response[0];
      // setisoCountryCode(isoCountryCode);
      // Firebase.firestore
      //    .collection('users')
      //    .doc(uid)
      //    .set({ country: isoCountryCode, city }, { merge: true });
   }, []);

   const confirmCode = async (code) => {
      setInitialLoading(true);
     
      try {
         const credential = PhoneAuthProvider.credential(
          confirmationResult.verificationId,
          code
        );
        await signInWithCredential(firebaseInstance.auth,credential);
        console.log('User logged in through phone');
      } catch (error) {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-verification-code') {
          alert('The verification code is not valid.');
        } else {
          console.error(error);
        }
      } finally {
      //   setInitialLoading(false);
      }
    };
    
    const sendVerification = () => {
      setPhoneAuthInProcess(true);
      signInWithPhoneNumber(firebaseInstance.auth, formattedPhoneNumber, recaptchaVerifier.current)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message
          setConfirmationResult(confirmationResult);
        })
        .catch((error) => {
          const errorCode = error.code;
          alert('Error code: ' + errorCode);
          if (errorCode === 'auth/captcha-check-failed') {
            alert('Captcha check failed');
          } else if (errorCode === 'auth/invalid-phone-number') {
            alert('Invalid phone number');
          } else if (errorCode === 'auth/missing-phone-number') {
            alert('missing phone number');
          } else if (errorCode === 'auth/quota-exceeded') {
            alert('SMS quota for the Firebase project has been exceeded');
          }
        })
        .finally(() => {
          setPhoneAuthInProcess(false);
        });
    };

    const signInWithApple = () => {
      if (phoneAuthInProcess) return;
      const nonce = Math.random().toString(36).substring(2, 10);
    
      return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
        .then((hashedNonce) =>
          AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
            nonce: hashedNonce,
          })
        )
        .then((appleCredential) => {
          const { identityToken } = appleCredential;
          const provider = new OAuthProvider('apple.com');
          const credential = provider.credential({
            idToken: identityToken,
            rawNonce: nonce,
          });
          signInWithCredential(firebaseInstance.auth, credential).then((result) => {
            console.log('Login success: ' + result);
          });
          // Successful sign in is handled by firebase.auth().onAuthStateChanged
        })
        .catch(({ message }) => {
          alert(`Apple Login Error: ${message}`);
        });
    };

   const clear = () => {
      setFormattedPhoneNumber('');
      setPhoneNumber('');
      setPhoneAuthInProcess(false);
      setConfirmationResult(null);
   };

   
 

   const wrapperFunc = async ()=>{


   onAuthStateChanged(firebaseInstance.auth, async (user) => {
      if (user) {

         const uid = user.uid;
   
         const userDocSnap = await getDoc(doc(firebaseInstance.firestore, 'users', uid));
         const userDoc = userDocSnap?.data();
         smashStore.getLibraryActions();
         smashStore.getSettings();
         teamsStore.getSettings();
         smashStore.fetchHabitStacks();
         if(userDoc){
            smashStore.init(userDoc);
            
         }else{

            await smashStore.init(userDoc);
         }
       
         notificatonStore.initNotifications(uid);
   
         if (userDoc?.name) {
            navigate(Routes.MainTab);
            setInitialLoading(false);
         } else {
            navigate(Routes.StepOne);
         }
      } else {
         setAppDeciding(false);
         setInitialLoading(false);
         clear();
      }
   });



   }

   useEffect(() => {


      
wrapperFunc()
     

      return () => { }
   }, []);

   const [appDeciding, setAppDeciding] = useState(true);

   if (initialLoading || appDeciding) return <LinearLoading />;

   const goToPrivacyPolicy = () => {
      navigate(Routes.PrivacyPolicy);
   };


   return (
      <View
         flex
         backgroundColor={Colors.contentW}
         centerH
         style={{
            paddingBottom: 24 + getBottomSpace(),
         }}>
         <Header title="Sign In" />

         <PhoneInput
            disabled={phoneAuthInProcess}
            value={phoneNumber}
            defaultCode={countryCode}
            textInputProps={{ placeholderTextColor: 'rgba(0,0,0,0.3)', selectionColor: Colors.smashPink }}
            layout="first"
            onChangeText={setPhoneNumber}
            onChangeFormattedText={setFormattedPhoneNumber}
            onChangeCountry={(country) => {
               setCountryCode(country.cca2);
               if (country.cca2 === 'NZ') setPlaceholder('021 123 4567');
               else setPlaceholder('0412 345 678');
            }}
            withDarkTheme={false}
            // withShadow
            autoFocus
            placeholder={placeholder}
            textInputStyle={{ fontSize: 18, fontFamily: FONTS.heavy, color: Colors.black, paddingTop: isAndroid ? 4 : 0 }}
            countryPickerProps={{ fontFamily: FONTS.heavy }}
            codeTextStyle={{ fontSize: 18, fontFamily: FONTS.heavy, color: Colors.black, fontWeight: 'bold' }}
            containerStyle={{
               // backgroundColor: '#777',

               borderWidth: 1,
               width: width - 64,
               marginTop: scaleH(24),
               borderRadius: 8
            }}
            textContainerStyle={{ backgroundColor: '#fff', borderTopRightRadius: 8, borderBottomRightRadius: 8 }}
         />

         {confirmationResult && (
            <>
               <OTPField
                  confirmCode={confirmCode}
                  sendVerification={sendVerification}
               />
               <TouchableOpacity
                  onPress={() => {
                     clear();
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <Text R16 style={{ marginTop: 24, color: '#007AFF' }}>
                        Try another phone number
                     </Text>
                  </View>
               </TouchableOpacity>
            </>
         )}
         {phoneNumber.length > 0 ? (
            <AnimatedView style={{ width: width - (width / 3.5) }}>
               <ButtonLinear
                  title={'Send Code'}
                  style={styles.btnSignUp}
                  colors={
                     phoneAuthInProcess
                        ? [Colors.grey50, Colors.grey50]
                        : undefined
                  }
                  onPress={
                     phoneNumber.length > 0 && !phoneAuthInProcess
                        ? sendVerification
                        : () => { }
                  }
               />
            </AnimatedView>
         ) : (
            <View style={{ width: width - (width / 3.5) }} center>
               <ButtonLinear

                  full
                  title={'Sign In With Phone Number'}
                  style={styles.btnSignUp}

                  colors={
                     phoneAuthInProcess
                        ? [Colors.grey50, Colors.grey50]
                        : undefined
                  }
                  onPress={
                     phoneNumber.length > 0 && !phoneAuthInProcess
                        ? sendVerification
                        : () => { }
                  }
               />
            </View>
         )}
         <View paddingH-24 marginT-16><Text center R14 secondaryContent>If you're new here, signing in will automatically create an account for you. If you already have an account, simply sign in with your phone number.</Text></View>
         {Platform.OS === 'ios' && (
            <Image
               source={Assets.icons.or}
               marginV-16
               style={{ marginVertical: scaleH(24) }}
            />
         )}
         {/* <Text>{formattedPhoneNumber}</Text> */}
         {/* <Button
           label="SIGN UP WITH FACEBOOK"
           iconSource={Assets.icons.ic_facebook}
           backgroundColor={Colors.facebook}
           onPress={() => loginWithFacebook()}
           style={{ width: width - 48, height: 50 }}
        /> */}

         {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
               buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
               }
               buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
               }
               cornerRadius={50}
               style={{
                  width: width - (width / 3.5),
                  height: 50,
                  marginVertical: scaleH(4),
               }}
               onPress={signInWithApple}
            />
         )}

         <View flex />

         <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseInstance.config}
            attemptInvisibleVerification={
               Platform.OS === 'android' ? false : true
            }
         />
         <TouchableOpacity onPress={goToPrivacyPolicy}>
            <Text>Privacy Policy</Text>
         </TouchableOpacity>
      </View>
   );
};

export default inject(
   'smashStore',
   'notificatonStore',
   'teamsStore',
   'challengesStore'
)(observer(Login));

const styles = StyleSheet.create({
   btnSignUp: {
      marginTop: scaleH(24),
      // paddingHorizontal: 24,
      // borderRadius: 60,
   },
   container: {
      backgroundColor: Colors.contentW,
   },
   phoneField: {
      width: width - 80,
      marginTop: 10,
   },
});
