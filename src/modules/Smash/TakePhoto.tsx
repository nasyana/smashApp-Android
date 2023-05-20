import Header from 'components/Header';
import React, {useEffect, useRef, useState} from 'react';
import {
   StyleSheet,
   TouchableOpacity,
   View,
   Text,
   TouchableWithoutFeedback,
   Dimensions,
} from 'react-native';
import {Camera} from 'expo-camera';
import {Assets, Image, Colors} from 'react-native-ui-lib';
import {Feather as Icon} from '@expo/vector-icons';
import FlashIcon from './components/FlashIcon';
import {inject, observer} from 'mobx-react';
import Routes from 'config/Routes';
import {useNavigation} from '@react-navigation/native';
import FinalScreen from './FinalScreen';
import * as ImagePicker from 'expo-image-picker';
import {AntDesign} from '@expo/vector-icons';
import {scale} from 'helpers/scale';
function TakePhoto(props) {
   const {navigate} = useNavigation();
   const {goBack} = useNavigation();
   const [hasPermission, setHasPermission] = useState(null);
   const [type, setType] = useState(Camera.Constants.Type.back);
   const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
   const [loading, setLoading] = useState(false);
   const cameraRef = useRef(null);
   const {smashStore} = props;

   const hypePost = props?.route?.params?.hypePost || props.hypePost;


   const onPressLibrary = async () => {
      smashStore.imageUploading = true;
      const result = await ImagePicker.launchImageLibraryAsync({
         allowsEditing: Platform.OS === 'ios' ? false : false,
         aspect: [4, 3],
         durationLimit: 60,
         mediaTypes:
            Platform.OS === 'ios'
               ? ImagePicker.MediaTypeOptions.All
               : ImagePicker.MediaTypeOptions.Images,
      });

      props.dismiss();

      if (hypePost) {
         smashStore.setCapturedPicture(result);

         smashStore.setHypePost({picture});
      } else {
         smashStore.setCapturedPicture(result);
         smashStore.imageUploading = false;
      }
   };
   const snap = async () => {
      try {
         setLoading(true);
         const result = await cameraRef.current.takePictureAsync({
            base64: false,
            skipProcessing: true,
         });
         setLoading(false);

         if (hypePost) {
            // smashStore.imageUploading = true;
            props.dismiss();

            smashStore.setCapturedPicture(result);
         } else {
            goBack();

            smashStore.setCapturedPicture(result);
         }

         // navigate(Routes.FinalScreen)
      } catch (e) {
         setLoading(false);
         // eslint-disable-next-line no-alert
         alert(serializeException(e));
      }
   };

   const toggleFlash = () => {
      const {on, off} = Camera.Constants.FlashMode;
      setFlashMode(flashMode === on ? off : on);
   };

   const toggleCamera = () => {
      const {front, back} = Camera.Constants.Type;
      setType(type === back ? front : back);
   };

   if (hasPermission === null) {
      return <View style={{flex: 1, backgroundColor: 'black'}} />;
   }
   if (hasPermission === false) {
      return (
         <View style={{flex: 1}}>
            <Text>No access to camera</Text>
         </View>
      );
   }

   const dismiss = () => props.dismiss();
   return (
      <View style={styles.container}>
         <Header
            title=""
            back
            backFn={dismiss || goBack}
            style={{
               position: 'absolute',
               backgroundColor: 'transparent',
            }}
            color={Colors.white}
         />

         <View
            style={{
               flexDirection: 'row',
               justifyContent: 'center',
               position: 'absolute',
               bottom: 0,
               alignSelf: 'center',
               zIndex: 1,
            }}>
            <TouchableWithoutFeedback onPress={toggleFlash}>
               <View>
                  <FlashIcon on={flashMode === Camera.Constants.FlashMode.on} />
               </View>
            </TouchableWithoutFeedback>

            <TouchableOpacity onPress={snap} style={styles.capture}>
               <Image source={Assets.icons.ic_capture} />
            </TouchableOpacity>

            <TouchableWithoutFeedback onPress={toggleCamera}>
               <View>
                  <Icon name="rotate-ccw" style={styles.rotate} size={25} />
               </View>
            </TouchableWithoutFeedback>
         </View>
         <TouchableOpacity
            onPress={onPressLibrary}
            style={{position: 'absolute', bottom: 40, left: 40}}>
            <AntDesign name={'picture'} size={40} color={'#fff'} />
         </TouchableOpacity>
      </View>
   );
}

export default inject('smashStore')(observer(TakePhoto));

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   preview: {
      zIndex: 0,
      flexDirection: 'column',
      alignItems: 'center',
      width: Dimensions.get('window').width,
      height: 500,

      overflow: 'hidden',
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
