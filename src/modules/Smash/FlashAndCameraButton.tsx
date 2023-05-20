import React, { useState, useRef, useEffect } from 'react';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    PanResponder,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { Camera, CameraType, } from 'expo-camera';
import CameraButton from './components/CameraButton';
import Animated from 'react-native-reanimated';
import { Feather as Icon } from '@expo/vector-icons';
import FlashIcon from './components/FlashIcon';
import DissapearingArrow from 'components/DissapearingArrow';
import { Vibrate } from 'helpers/HapticsHelpers';
const FlashAndCameraButton = ({toggleFlash, smashStore,cameraRef}) => {

const {activtyWeAreSmashing,currentUserHasPointsEver, hasImage, flashMode,setZoom,setSelectMultiplier,recording,cameraType,setCameraType,setUniversalLoading} = smashStore;


const toggleCamera = () => {
   Vibrate();
   setCameraType(cameraType === CameraType.back ? CameraType.front : CameraType.back);
};

const isLongPressRef = useRef<any>(false);
const timerIdRef = useRef<any>(null);
const videoTimerId = useRef(false);
// const cameraRef: any = useRef<any>(null);


const StartVideo = async () => {
    if (!smashStore?.activtyWeAreSmashing) {
      smashStore.setUniversalLoading(false)
       alert('Oops select an activity first..');
       return;
    }
    smashStore.smashEffects();
    // let timerId;
    if (!recording) {
       smashStore.recordingProgress = 1;
       videoTimerId.current = setInterval(() => {
          smashStore.recordingProgress = smashStore.recordingProgress + 5;
       }, 100);
       smashStore.recording = true;
       // setRecording(true);
       smashStore.capturedVideo = await cameraRef.current.recordAsync();
    } else {
       clearInterval(videoTimerId);
       smashStore.recordingProgress = 0;
       // setRecording(false);
       cameraRef.current.stopRecording();
       smashStore.recording = false;
    }
 };

 const setLoading = (bool) => {
   smashStore.universalLoading = bool;
};

 const stopVideo = async () => {
    smashStore.smashEffects();
    cameraRef.current.stopRecording();
    if (videoTimerId.current) { clearInterval(videoTimerId?.current); }
    // clearInterval(timerId);
    smashStore.recordingProgress = 0;
    // setRecording(false);
    setZoom(0);
 };
 const snap = async () => {

   setLoading(true)
   if (!smashStore?.activtyWeAreSmashing) {
      smashStore.setUniversalLoading(false)
      Alert.alert('Oops!', 'Select a Habit/Activity first..');
      return;
   }
 
   if (smashStore.multiplier == 1) {
   } else {
      setSelectMultiplier(false);
   }
 
   smashStore.smashEffects();
 
   try {
      let picture = await cameraRef.current.takePictureAsync({
         base64: false,
         skipProcessing: Platform.OS === 'android' ? false : true,
         // flipHorizontally: cameraType === CameraType.front, // Flip horizontally if cameraType is 'front'
         // resize: {
         //    width: width,
         //    height: height,
         // },
         rotate: 0,
      });
 
          // Flip image horizontally if cameraType is 'front'
     if (cameraType === CameraType.front) {
      picture = await ImageManipulator.manipulateAsync(
         picture.uri,
         [{ flip: ImageManipulator.FlipType.Horizontal }]
      );
   }

      smashStore.setCapturedPicture(picture);
 
      setTimeout(() => {
         setLoading(false);
      }, 400);
   } catch (e) {
      setLoading(false);
      console.warn(e);
   }
 };
 

 const snapAndroid = async () => {

    // alert('Please add image from your media library');
    // alert('android!')


    if (!smashStore?.activtyWeAreSmashing) {
       Alert.alert('Oops!', 'Select a Habit/Activity first..');
       return;
    }

    if (smashStore.multiplier == 1) {
    } else {
       setSelectMultiplier(false);
    }
    // setLoading(true);
    smashStore.smashEffects();





    const picture = await cameraRef.current.takePictureAsync({
       base64: false,
       skipProcessing: Platform.OS === 'android' ? false : true,
       quality: 1,
       resize: {
          width: width, // also resizing here, which is just an additional thing I'm doing
          height: height,
       },
       rotate: 0,
    });

    setTimeout(() => {
    //    setLoading(false);
       smashStore.universalLoading = false;
    }, 700);
    smashStore.setCapturedPicture(picture);


    // navigate(Routes.FinalScreen)

 };

const panResponder = useRef(
    PanResponder.create({
       onStartShouldSetPanResponder: (evt, gestureState) => true,
       onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
       onMoveShouldSetPanResponder: (evt, gestureState) => true,
       onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
       onPanResponderStart: async (e, gestureState) => {
          await new Promise<void>((resolve): void => {
             clearTimeout(timerIdRef.current);
             timerIdRef.current = setTimeout(() => {
                isLongPressRef.current = true;
                resolve();
             }, 200);
          });
          isLongPressRef?.current && StartVideo();
       },
       onPanResponderGrant: () => { },
       onPanResponderMove: (evt, gestureState) => {
          const { dy } = gestureState;
          if (parseInt(dy) < 0) setZoom((parseInt(dy) * -1) / 300);
       },
       onPanResponderRelease: (e, gestureState) => {

          setZoom(0);
          smashStore.recording = false;
          // const { timeStamp } = e;
          timerIdRef.current && clearTimeout(timerIdRef.current);

          if (Platform.OS == 'android)') { snapAndroid(); return; }

          isLongPressRef?.current ? stopVideo() : snap();
          isLongPressRef.current = false;
       },
    }),
 ).current;


if(hasImage){return null}
    return (
        <View
               style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: Platform.OS === 'android' ? 60 : 0,
                  alignSelf: 'center',
                  zIndex: 1,
               }}>
               <TouchableWithoutFeedback onPress={toggleFlash}>
                  <View>
                     <FlashIcon
                        on={flashMode === Camera.Constants.FlashMode.on}
                     />
                  </View>
               </TouchableWithoutFeedback>
               {activtyWeAreSmashing && (!currentUserHasPointsEver || currentUserHasPointsEver < 1000) && <DissapearingArrow center />}
               <Animated.View {...panResponder.panHandlers}>
                  <View
                     style={styles.capture}>
                     <CameraButton arrowDown={false} />
                  </View>
               </Animated.View>

               <TouchableWithoutFeedback onPress={toggleCamera}>
                  <View>
                     <Icon name="rotate-ccw" style={styles.rotate} size={25} />
                  </View>
               </TouchableWithoutFeedback>
            </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(FlashAndCameraButton));

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