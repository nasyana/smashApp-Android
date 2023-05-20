import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Dimensions, Platform} from 'react-native';
import {Camera} from 'expo-camera';

const {height, width} = Dimensions.get('window');

export default function CameraWithRatio(props: any) {
   const {cameraRef, type, flashMode} = props;

   const [hasCameraPermission, setHasCameraPermission] = useState<any>(null);
   const [camera, setCamera] = useState<any>(null);
   const [isRatioSet, setIsRatioSet] = useState(false);
   const [ratio, setRatio] = useState<any>('4:3');
   const [imagePadding, setImagePadding] = useState(0);

   const screenRatio = height / width;

   useEffect(() => {
      async function getCameraStatus() {
         const {status} = await Camera.requestPermissionsAsync();
         setHasCameraPermission(status == 'granted');
      }
      getCameraStatus();
   }, []);

   const prepareRatio = async () => {
      let desiredRatio = '4:3';
      if (Platform.OS === 'android') {
         const ratios = await camera.getSupportedRatiosAsync();

         let distances: any = {};
         let realRatios: any = {};
         let minDistance = null;

         for (const ratio of ratios) {
            const parts = ratio.split(':');
            const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
            realRatios[ratio] = realRatio;

            const distance = screenRatio - realRatio;
            distances[ratio] = realRatio;
            if (minDistance == null) {
               minDistance = ratio;
            } else {
               if (distance >= 0 && distance < distances[minDistance]) {
                  minDistance = ratio;
               }
            }
         }
         desiredRatio = minDistance;

         const remainder = Math.floor(
            (height - realRatios[desiredRatio] * width) / 2,
         );

         setImagePadding(remainder);
         setRatio(desiredRatio);
         setIsRatioSet(true);
      }
   };

   const setCameraReady = async () => {
      if (!isRatioSet) {
         await prepareRatio();
      }
   };

   if (hasCameraPermission === null) {
      return (
         <View style={styles.information}>
            <Text>Waiting for camera permissions</Text>
         </View>
      );
   } else if (hasCameraPermission === false) {
      return (
         <View style={styles.information}>
            <Text>No access to camera</Text>
         </View>
      );
   } else {
      return (
         <View style={styles.container}>
            <Camera
               style={[
                  styles.cameraPreview,
                  {marginTop: imagePadding, marginBottom: imagePadding},
               ]}
               onCameraReady={setCameraReady}
               ratio={ratio}
               // ref={cameraRef}
               ref={(e: any) => {
                  console.log('------------------->', e);
                  e.current = cameraRef;
                  setCamera(e);
               }}
            />
         </View>
      );
   }
}

const styles = StyleSheet.create({
   information: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
   },
   container: {
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
   },
   cameraPreview: {
      flex: 1,
   },
});
