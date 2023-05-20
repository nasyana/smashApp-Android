import React, { useState, useEffect } from 'react';
import {
   StyleSheet,
   TouchableOpacity,
   TouchableWithoutFeedback,
   PanResponder,
   Dimensions,
   Platform,
} from 'react-native';
import AnimatedView from '../../components/AnimatedView';
import { Assets, Image, Colors, View, Text } from 'react-native-ui-lib';
import LottieAnimation from 'components/LottieAnimation';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const { height, width } = Dimensions.get('window');

const isAndroid = Platform.OS === 'android';
const TakeVideoHype = ({smashStore}) => {


   // const activity = smashStore.activtyWeAreSmashing;
   const [hide, setHide] = useState(false);

   useEffect(() => {
      setTimeout(() => {
         setHide(true);
      }, 1200);

      return () => {};
   }, []);

   if (hide) {
      return null;
   }

   // if(!smashStore.masterIdsToSmash?.length > 0 || currentUserHasPointsEver)
   return (
      <View
         style={{
            height: isAndroid ? height + 40 : height,
            width: width,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            backgroundColor: '#fff',
         }}>
       
            <LottieAnimation
               autoPlay
               loop={true}
               style={{
                  // width: 200,
                  height: 250,
                  zIndex: 99999,
               }}
               source={require('../../lotties/camera-proof.json')}
            />
              <AnimatedView>
            {/* <Text center B18 style={{ color: '#aaa' }}>
        
               Select Activity the Take a Pic!
            </Text> */}
         
         </AnimatedView>
      </View>
   );
};

export default TakeVideoHype;
