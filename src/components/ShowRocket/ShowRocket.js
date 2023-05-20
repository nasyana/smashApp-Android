import { View, Text } from 'react-native-ui-lib';
import React, { useRef, useEffect, useState } from 'react';
import LottieAnimation from 'components/LottieAnimation';
import { inject, observer } from 'mobx-react';
import { width, height } from 'config/scaleAccordingToDevice';
import DoneDialogCombinedData from 'nav/DoneDialogCombinedData';
import { Platform } from 'react-native';
// import AnimatedView from 'components/AnimatedView';

const isAndroid = Platform.OS === 'android';
const ShowRocket = ({ smashStore }) => {
   const { showRocket, completion } = smashStore;
   const [showText, setShowText] = useState(false);


   console.log('render ShowRocket')
   // useEffect(() => {
   //    setTimeout(() => {
   //       setShowText(true);
   //    }, 1000);

   //    return () => {};
   // }, []);

   const ref = useRef(null);
   if (!showRocket) {
      return null;
   }
   // const benefits = smashStore?.activtyWeAreSmashing?.benefits || [];
   // const benefit = benefits[Math.floor(Math.random() * benefits.length)];
   return (
      <View
         // dismiss={this.dismiss}
         style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: isAndroid ? -25 : 0,
            left: 0,
            width: width,
            height: isAndroid ? height + 50 : height,
         }}>
         <LottieAnimation
            ref={ref}
            autoPlay
            loop={true}
            style={{
               height: 320,
               opacity: 1,
               borderWidth: 0,
               marginTop: 0,
               // marginBottom: height / 4,
               zIndex: 77777,
            }}
            source={require('../../lotties/rocket-lunch.json')}
         />

         {/* <DoneDialogCombinedData /> */}
         {/* {showText ? (
            <Text>
               {completion?.activityName || 'Adding your points, to 3 teams'}
            </Text>
         ) : (
            <Text></Text>
         )} */}

         {/* {benefits?.length > 0 && <View style={{
            width: width,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: height / 1.7,
            zIndex: 777777,
            paddingHorizontal: width / 7
         }}>
            <Text B28>🥳</Text>
            <Text secondaryContent M16 center>{benefit}</Text>

         </View>} */}
      </View>
   );
};

export default inject('smashStore', 'teamsStore')(observer(ShowRocket));
