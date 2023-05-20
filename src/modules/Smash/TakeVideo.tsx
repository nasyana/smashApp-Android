import React, { useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';

import {
   StyleSheet,
   TouchableWithoutFeedback,
   PanResponder,
   Dimensions,
   Platform,
   Modal,
} from 'react-native';

import { Camera, CameraType, } from 'expo-camera';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FinalScreen from './FinalScreen';
import { Vibrate } from 'helpers/HapticsHelpers'
import * as ImagePicker from 'expo-image-picker';
import ActivitiesSelector from './ActivitiesSelector';
// import CustomPicker from './CustomPicker';
// import CameraButton from './components/CameraButton';
import RequestPermissions from './RequestPermissions';
import FlashAndCameraButton from './FlashAndCameraButton'
import SmashCamera from './SmashCamera'
/* component camera */

import HypeContainer from './HypeContainer';
import TakePicVideo from './TakePicVideo'

import ActivityTeamsTakeVid from 'components/ActivityTeamsTakeVid';

import ActivityChallengesTakeVid from 'components/ActivityChallengesTakeVid';
import FirstSmash from './FirstSmash';
import { Alert } from 'react-native';
import IOSPicker from './IOSPicker'
const isAndroid = Platform.OS === 'android';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const { height, width } = Dimensions.get('window');


const TakeVideo = (props: any)=> {


   const cameraRef = useRef(null);
   // const [selectMultiplier, setSelectMultiplier] = useState(false);
   const { smashStore, setSelectMultiplier } = props;
   const {
      smashEffects,
      currentUserHasPointsEver,
      manuallySkipped = false,
      setManuallySkipped,
   } = smashStore;
   // const [takeVideoLoaded, setTakeVideoLoaded] = useState(false);

   const [hyping, setHyping] = useState(false);
   const [hasPermission, setHasPermission] = useState(null);
   const [hasAudioPermission, setHasAudioPermission] = useState(null);
   const [zoom, setZoom] = useState(0);
   // const [record, setRecord] = useState();

   // const [recording, setRecording] = useState(false);
   // const [recordProgress, setRecordProgress] = useState<number>(0);

   const [type, setType] = useState(CameraType.back);
   const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);


   // const [loading, setLoading] = useState(false);
   const setLoading = (bool) => {
      smashStore.universalLoading = bool;
   };



   useEffect(() => {
      setManuallySkipped(false);

      return () => { setZoom(0) };
   }, []);


   const fetchPermissions = async () => {
      const { status } = await Camera.getCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      const audioStatus = await Camera.getMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');
   };

 

   useEffect(() => {
      fetchPermissions();

      return () => null
   }, []);

   const onPressLibrary = async () => {
      if (!smashStore?.activtyWeAreSmashing) {
         Alert.alert('Oops!', 'Select a Habit/Activity first..');
         return;
      }

      // setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
         allowsEditing: Platform.OS === 'ios' ? false : false,
         aspect: [4, 3],
         durationLimit: 60,
         mediaTypes: ImagePicker.MediaTypeOptions.All,
      });

      if (!result.canceled) {
         if (result?.assets?.[0]) {
            const selectedAsset = result.assets[0];
            if (selectedAsset.type === 'video') {
               smashStore.setCapturedVideo({ ...selectedAsset, library: true });
            } else {
               smashStore.setCapturedPicture({ ...selectedAsset, library: true });
            }
         }
      }
      // setLoading(false);
   };







   const toggleFlash = () => {
      const { on, off } = Camera.Constants.FlashMode;
      setFlashMode(flashMode === on ? off : on);
   };

   const toggleCamera = () => {
      Vibrate();
      setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
   };

   if ((!hasPermission || !hasAudioPermission) && smashStore.checkPermissions) {
      return (
         <RequestPermissions
            setHasPermission={setHasPermission}
            setHasAudioPermission={setHasAudioPermission}
            hasAudioPermission={hasAudioPermission}
            hasPermission={hasPermission}
         />
      );
   }


   const hasImage =
      smashStore.capturedPicture || smashStore.capturedVideo || manuallySkipped;



   const clearSelectedActivity = () => {
      smashEffects();
      smashStore.activtyWeAreSmashing = false;
   };

   const masterIds =
      smashStore.masterIdsToSmash || false;

   const { setMasterIdsToSmash } = smashStore;


  


   if (!masterIds || smashStore.smashing) {
      return null;
   }



   const closeCamera = () => {
      // setTakeVideoLoaded(false);
      setMasterIdsToSmash(false);
      smashStore.smashEffects();
      smashStore.setCapturedPicture(false);
      smashStore.setCapturedVideo(false);
      smashStore.multiplier = 1;
   };



   const onPressSetManuallySkipped = () => {
      if (!smashStore?.activtyWeAreSmashing) {
         Alert.alert('Oops!', 'Select a Habit/Activity first..');
         return;
      }
      smashStore.setManuallySkipped(true);
   };



   return (
      <View
         style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: width,
            height: Platform.OS === 'android' ? height + 80 : height,
         }}>
         <SmashCamera cameraRef={cameraRef} />

         <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
            style={{
               height: height,
               width: width,
               position: 'absolute',
               top: 0,
               left: 0,
            }}
         />
         {smashStore.activtyWeAreSmashing && <FinalScreen />}
         <ActivitiesSelector
            masterIds={masterIds}
            closeCamera={closeCamera}
            width={'90%'}
            activity
            height={screenHeight - 320}
         />

         <ActivityTeamsTakeVid />

         <ActivityChallengesTakeVid />

         <TakePicVideo />

         {/* ENABLE AGAIN WHEN ANDROID IS BACK */}
         {/* {selectMultiplier && Platform.OS === 'android' && !hideMulti && activtyWeAreSmashing && (
               <CustomPicker
                  showArrowDown={(hasImage || manuallySkipped) && smashStore.multiplier < 2 ? <DissapearingArrow /> : () => null}
                  multiplier
                  style={{ borderWidth: 1, borderColor: '#fff' }}
                  height={screenHeight - (screenHeight / 2 + 100)}
               />
            )} */}


         <IOSPicker />


         <FlashAndCameraButton toggleFlash={toggleFlash} toggleCamera={toggleCamera} cameraRef={cameraRef} />


         {!hasImage && (
            <TouchableOpacity
               onPress={onPressLibrary}
               style={{
                  position: 'absolute',
                  bottom: Platform.OS === 'android' ? 90 : 40,
                  left: 40,
               }}>
               <AntDesign name={'picture'} size={30} color={'#ccc'} />
               {/* <Text white>{JSON.stringify(hasImage)}</Text>
               <Text white>{JSON.stringify(smashStore.activtyWeAreSmashing)}</Text>
               <Text white>{JSON.stringify(masterIds)}x</Text>
               <Text white>{JSON.stringify(smashStore.masterIdsToSmash)}</Text>
                */}
            </TouchableOpacity>
         )}

         {!hasImage && (
            <TouchableOpacity
               onPress={onPressSetManuallySkipped}
               style={{
                  position: 'absolute',
                  bottom: Platform.OS === 'android' ? 80 : 40,
                  right: 24,
               }}>
               <View
                  row
                  centerV
                  style={{ borderWidth: 0, borderColor: '#777', padding: 8 }}>
                  <Text B14 style={{ color: '#aaa' }} marginR-4>
                     Skip Picture
                  </Text>
                  <AntDesign name={'right'} size={16} color={'#aaa'} />
               </View>
            </TouchableOpacity>
         )}


        


         {smashStore.activtyWeAreSmashing && !hasImage && (
            <TouchableOpacity
               onPress={clearSelectedActivity}
               row
               centerV
               style={{
                  flex: 1,
                  margin: 16,
                  marginTop: 8,
                  // height: 40,
                  borderWidth: 0,
                  borderColor: '#fff',
                  position: 'absolute',
                  top: 24,
                  right: 0,
                  padding: 16

               }}>
               <AntDesign
                  name="left"
                  size={24}
                  color={'rgba(255,255,255,1)'}
               />
               <Text R14 white marginL-4>Back to Select Activity</Text>
            </TouchableOpacity>
         )}
        {/* <TakeVideoHype smashStore={smashStore} /> */}
       
         <FirstSmash  />

      </View>
   );
}

export default inject('smashStore', 'challengesStore')(observer(TakeVideo));

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      zIndex: 0,
   },

   capture: {
      flex: 0,
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
   },
   rotate: {
      backgroundColor: 'transparent',
      color: 'white',
   },
});
