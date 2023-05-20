import { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';

import {
   StyleSheet, Dimensions,
   Platform
} from 'react-native';

import { Camera, CameraType, } from 'expo-camera';

const isAndroid = Platform.OS === 'android';


function TakeVideo(props: any) {


//    const [selectMultiplier, setSelectMultiplier] = useState(false);
   const { smashStore, cameraRef } = props;
   const {
      cameraType,
      setManuallySkipped,
   } = smashStore;

   const [zoom, setZoom] = useState(0);
 
   const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);


   // const [loading, setLoading] = useState(false);
   const setLoading = (bool) => {
      smashStore.universalLoading = bool;
   };

   useEffect(() => {
      setManuallySkipped(false);

      return () => { setZoom(0) };
   }, []);

   const [ratio, setRatio] = useState<any>('4:3');
   const [imagePadding, setImagePadding] = useState(0);


   const setCameraReady = async () => {
      // if (!isRatioSet) {
      //    await prepareRatio();
      // }
   };

 

   const masterIds =
      smashStore.masterIdsToSmash || false;



   if (!masterIds) {
      return null;
   }


   return (
      <Camera
      useCamera2Api={!isAndroid}
         type={cameraType == 'front' ? CameraType.front : CameraType.back}
         zoom={zoom}
         ratio={ratio}
         ref={cameraRef}
         flashMode={flashMode}
         onCameraReady={setCameraReady}
         style={[
            styles.preview,
            { marginTop: imagePadding, marginBottom: imagePadding },
         ]}
      />
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
