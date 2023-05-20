import {useNavigation} from '@react-navigation/native';
import FooterLinear from 'components/FooterLinear';
import Routes from 'config/Routes';
import {height, width} from 'config/scaleAccordingToDevice';
import React, { useCallback, useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import Carousel, {getInputRangeFromIndexes} from 'react-native-snap-carousel';
import { View, Text, Colors, Image, Assets, KeyboardAwareScrollView, TouchableOpacity } from 'react-native-ui-lib';
import firebaseInstance from '../../config/Firebase';
const firestore = firebaseInstance.firestore;
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { inject, observer } from 'mobx-react';
import SmartImage from '../../components/SmartImage/SmartImage'
import { AntDesign } from '@expo/vector-icons';
import { moment } from 'helpers/generalHelpers';;
import Header from 'components/Header';
const DATA = [1, 2, 3];
import { onAuthStateChanged } from 'firebase/auth';
const SLIDER_WIDTH = width;
const ITEM_WIDTH = Math.round((SLIDER_WIDTH * 279) / 375);
const ITEM_HEIGHT = Math.round((height / 812) * 450);
const TRANSLATE_VALUE = Math.round((SLIDER_WIDTH * 0.6) / 4);
const TRANSLATE_VALUE_Y = Math.round((ITEM_HEIGHT * 0.1) / 4);

const StepTwo = (props) => {
  const {navigate} = useNavigation();

  const { name } = props.route.params;
  const [picture, setPicture] = useState(false)
  let [loadingPicture, setLoadingPicture] = useState(false)
const [uploading, setUploading] = useState(false);
  const capturedPicture = props.smashStore?.capturedPicture || false;
  const setLoadingToTrue = (bool) => {
     setLoadingPicture(bool);
  };

  const changeImage = async () => {
   try {
     const picture = await props.smashStore.uploadImageFromLibrary(setLoadingToTrue, 'small', true);
     setPicture(picture);
     setLoadingPicture(false);
     onNext();
 
     // Get the current user's UID

    //  let uid;
    //  onAuthStateChanged(firebaseInstance.auth, (user) => {
    //    if (user) {
    //      uid = user.uid;
    //    }
    //  });
 
 
     const userDocRef = doc(firestore, 'users', firebaseInstance.auth?.currentUser?.uid);
     await setDoc(userDocRef, { picture }, { merge: true });
 
   } catch (error) {
     console.error('Error updating user picture: ', error);
   }
 };
 

  const onNext = useCallback(() => {
     navigate(Routes.StepFive, { firstTime: true });
     // navigate(Routes.StepThree, { firstTime: true });
  }, []);

  const CustomRight = () => {

   return (<TouchableOpacity onPress={onNext} row centerV>
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
          <Header noShadow back customRight={picture.uri ? <CustomRight /> : ()=>null} />
        <Text H36 marginL-24>
           Step 2/5
        </Text>
        <Text R18 marginL-24 marginR-24>
           Thanks {name}! Next, Add Your Profile Pic from your library. 
        </Text>
        <Text secondaryContent R14 marginL-24 marginR-24 marginT-8>Tip💡: It can be anything you want. Some people use a Superhero, Cartoon, Themselves or even their Pet!</Text>
        <KeyboardAwareScrollView>
           <View centerH marginT-32>
              {/* {loadingPicture && <LoaderScreen color={Colors.buttonLink} overlay />} */}
              <TouchableOpacity
                 style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ccc',
                    borderRadius: 140,
                    flex: 1,
                    height: 70,
                    width: 70,
                 }}
                 onPress={changeImage}>
                 {capturedPicture ? (
                    <Image
                       source={{ uri: capturedPicture?.uri || false }}
                       style={{
                          backgroundColor: '#ccc',
                          borderRadius: 140,
                          flex: 1,
                          height: 70,
                          width: 70,
                       }}
                    />
                 ) : picture?.uri ? (
                    <>
                       <SmartImage
                          uri={picture?.uri}
                          preview={picture?.preview}
                          style={{
                             flex: 1,
                             height: 70,
                             width: 70,
                             borderRadius: 140,
                          }}
                       />
                    </>
                 ) : (
                    <View
                       style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 4,
                          borderRadius: 16,
                       }}>
                       {!loadingPicture && (
                          <AntDesign name={'picture'} size={30} color={'#333'} />
                       )}
                    </View>
                 )}
              </TouchableOpacity>
              {loadingPicture == 'uploading' && (
                 <View style={{ marginTop: 16 }} row>
                    <Text secondaryContent>
                       Hang tight we're uploading your pic...
                    </Text>
                    <ActivityIndicator />
                 </View>
              )}
              {!loadingPicture && picture.uri && (
                 <View style={{ marginTop: 16 }} row>
                    <Text secondaryContent>
                       You're all set and looking pretty!
                    </Text>
                    <AntDesign
                       name={'check'}
                       size={16}
                       color={Colors.green30}
                    />
                 </View>
              )}
           </View>
           {/* <View flex>
        <Carousel
          data={DATA}
          renderItem={_renderItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          containerCustomStyle={styles.carouselContainer}
          inactiveSlideShift={0}
          scrollInterpolator={scrollInterpolator}
          slideInterpolatedStyle={animatedStyles}
          inactiveSlideScale={350 / 450}
        />
      </View> */}
        </KeyboardAwareScrollView>
        {/* {picture.uri && <FooterLinear title={'NEXT'} onPress={onNext} bottom />} */}
     </View>
  );
};



export default inject("smashStore")(observer(StepTwo));
export function scrollInterpolator(index, carouselProps) {
  const range = [1, 0, -1];
  const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
  const outputRange = range;

  return {inputRange, outputRange};
}
export function animatedStyles(index, animatedValue, carouselProps) {
  const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';
  let animatedOpacity = {};
  let animatedTransform = {};

  if (carouselProps.inactiveSlideOpacity < 1) {
    animatedOpacity = {
      opacity: animatedValue.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [
          carouselProps.inactiveSlideOpacity,
          1,
          carouselProps.inactiveSlideOpacity,
        ],
      }),
    };
  }

  if (carouselProps.inactiveSlideScale < 1) {
    animatedTransform = {
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [
              carouselProps.inactiveSlideScale,
              1,
              carouselProps.inactiveSlideScale,
            ],
          }),
          translateX: animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [
              TRANSLATE_VALUE * carouselProps.inactiveSlideScale,
              0,
              -TRANSLATE_VALUE * carouselProps.inactiveSlideScale,
            ],
          }),
          translateY: animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [
              -TRANSLATE_VALUE_Y * carouselProps.inactiveSlideScale,
              0,
              -TRANSLATE_VALUE_Y * carouselProps.inactiveSlideScale,
            ],
          }),
        },
      ],
    };
  }

  return {
    ...animatedOpacity,
    ...animatedTransform,
  };
}
const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 40,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginLeft: 6,
  },
  itemLabel: {
    color: 'white',
    fontSize: 24,
  },
  counter: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
