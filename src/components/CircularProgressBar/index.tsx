import React, { useState, useEffect } from 'react';
import type { PropTypes } from './types';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Text, Colors, View } from 'react-native-ui-lib';
import Shimmer from 'components/Shimmer';
import LottieAnimation from 'components/LottieAnimation';
const CircularProgressBar = (props: PropTypes) => {
   const [loaded, setLoaded] = useState(true);

   // useEffect(() => {
   //    setTimeout(() => {
   //       setLoaded(true);
   //    }, 4000);
   // });

   const {
      fill = 0,
      size = 100,
      width = 20,
      fontSize = 24,
      textColor,
      fontWeight = 'bold',
      tintColor = Colors.blue50,
      alreadyReached = false, //
      showLessThanOne = false, // display < 1%
      overBy = 0,
      dark,
      justToday = false,
      myScoreToday = 0,
      kFormatter,
      topText = false,
      bottomText = false,
      hidePercent = true,
      mainTextColor = '#333',
      mainText = false,
      circle = false,
      showPercent = false,
      score = 0,
      smallBottomText = false,
   } = props;
   if (!loaded) {
      return null; //<Shimmer style={{ width, height: width }} />;
   }
   return (
      <AnimatedCircularProgress
         size={size}
         fill={alreadyReached ? 100 : parseInt(fill)}
         rotation={92}
         arcSweepAngle={circle ? 360 : 360}
         width={width}
         // fillLineCap="round"
         // lineCap={'round'}
         tintColor={tintColor}
         backgroundColor={dark ? 'rgba(255, 255, 255, 0.1)' : Colors.colorF2}>
         {(fill) =>
            !showLessThanOne ? (
               <View centerH>
                  {topText?.length > 0 && false && (
                     <Text center secondaryContent R10>
                        {topText}
                     </Text>
                  )}

                  <Text
                     // color77
                     style={{
                        fontSize: fontSize || 14,
                        fontWeight,
                        color: alreadyReached
                           ? tintColor
                           : textColor
                           ? textColor
                           : dark
                           ? '#fff'
                           : null,
                     }}>
                     {mainText
                        ? mainText
                        : fill >= 0 && !alreadyReached
                        ? parseInt(fill) + (showPercent && '%')
                        : score + (showPercent && !alreadyReached ? '%' : '')}
                  </Text>
                  {bottomText && (
                     <Text center M14>
                        {bottomText}
                     </Text>
                  )}

                  {smallBottomText && (
                     <Text
                        center
                        secondaryContent
                        R10
                        style={{
                           bottom: -8,
                           marginTop: -6,
                           color: tintColor,
                        }}>
                        {smallBottomText?.toUpperCase()}
                     </Text>
                  )}

                  {/* {overBy > 0 && (
                     <Text
                        R14
                        center
                        style={{
                           color: Colors.green30,
                           color: dark ? '#fff' : null,
                        }}>
                        {'+'}
                        {overBy}
                     </Text>
                  )} */}
                  {/* {alreadyReached || true && (
                     <LottieAnimation
                        autoPlay
                        loop={false}
                        style={{
                           height: 40,
                           zIndex: 0,
                           top: -10,
                           position: 'absolute',
                        }}
                        source={require('../../lottie/win-day3.json')}
                     />
                  )} */}
               </View>
            ) : (
               <View center>
                  <Text
                     B24
                     color77
                     style={{
                        fontSize,
                        fontWeight,
                        color: dark ? '#fff' : null,
                     }}>
                     {'< 1%'}
                  </Text>
                  {smallBottomText && (
                     <Text
                        center
                        secondaryContent
                        R10
                        style={{
                           bottom: -8,
                           marginTop: -6,
                           color: tintColor,
                        }}>
                        {smallBottomText?.toUpperCase()}
                     </Text>
                  )}
               </View>
            )
         }
      </AnimatedCircularProgress>
   );
};;

export default CircularProgressBar;
