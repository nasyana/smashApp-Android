import React, { useRef, useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import { FONTS } from 'config/FoundationConfig';
import { height } from 'config/scaleAccordingToDevice';
import { View, Colors, Text } from 'react-native-ui-lib';
import { Animated, StyleSheet, Platform } from 'react-native';

import SmoothPicker from 'components/SmoothPicker';

const ITEM_HEIGHT = 70;
const MASK_HEIGHT = 77;
const SPACING = (height / 2 - ITEM_HEIGHT) / 2;

const numbersData = [...Array(100).keys()].map((i) => {
   return { text: i + 1 };
});

const CustomPicker = (props) => {
   const { width, challengesStore, smashStore, teamsStore } = props;

   const onPick = (item) => {
      item?.id
         ? (smashStore.activtyWeAreSmashing = item)
         : (smashStore.multiplier = parseInt(item) || 1);
   };

   const { libraryActionsList = [], libraryActivitiesHash = {} } = smashStore;
   const allMasterIdsInArray = challengesStore.myChallenges?.map(
      (challenge) => {
         return [...(challenge.masterIds || [])];
      },
   );

   const allMasterIds = [...new Set(allMasterIdsInArray.flat(1))] || [];
   const allActivities = allMasterIds?.map((id) => libraryActivitiesHash?.[id]);

   const specificActivities = props?.masterIds
      ? props?.masterIds?.map((id) => libraryActivitiesHash?.[id])
      : false;

   const data = specificActivities
      ? specificActivities
      : props.activity
      ? allActivities
      : numbersData;
   const challenge = props?.route?.params?.challenge || false;
   const scrollY = useRef(new Animated.Value(0)).current;
   const onScrollY = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      if (data) {
         console.log('data[0]', data[0]);
         if (data[0]) {
            onPick(data[0]);
         }
      }

      return () => {
         onPick(false);
      };
   }, []);

   return (
      <View style={[styles.wrapper, { width, height: props.height }]}>
         <Animated.FlatList
            bounces={true}
            data={data}
            keyExtractor={(item) => item?.text?.toString()}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate={'normal'}
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
               const OS = Platform.OS === 'android' ? true : false;
               const additionalComputation = OS ? 1.5 : 1;

               scrollY.setValue(e.nativeEvent.contentOffset.y);
               if (props.activity) {
                  const i =
                     Math.floor(
                        e.nativeEvent.contentOffset.y / ITEM_HEIGHT +
                           additionalComputation,
                     ) - 1;

                  onPick(data[i]);
               } else {
                  onPick(
                     Math.floor(
                        e.nativeEvent.contentOffset.y / ITEM_HEIGHT +
                           additionalComputation,
                     ),
                  );
               }
            }}
            onScroll={Animated.event(
               [{ nativeEvent: { contentOffset: { y: onScrollY } } }],
               {
                  useNativeDriver: true,
               },
            )}
            renderItem={({ item, index }) => {
               const inputRange = [
                  (index - 2) * ITEM_HEIGHT,
                  (index - 1) * ITEM_HEIGHT,
                  index * ITEM_HEIGHT,
                  (index + 1) * ITEM_HEIGHT,
                  (index + 2) * ITEM_HEIGHT,
               ];

               const color =
                  '#fff' ||
                  scrollY.interpolate({
                     inputRange,
                     outputRange: [
                        Colors.grey60,
                        Colors.grey60,
                        '#FFFFFF',
                        Colors.grey60,
                        Colors.grey60,
                     ],
                  });

               const scale = scrollY.interpolate({
                  inputRange,
                  outputRange: [1, 1, 1.1, 1, 1],
                  extrapolate: 'clamp',
               });

               const scaleFont = scrollY.interpolate({
                  inputRange,
                  outputRange: [1, 1, 36 / 22 / (80 / 70), 1, 1],
                  extrapolate: 'clamp',
               });

               const opacity = onScrollY.interpolate({
                  inputRange,
                  outputRange: [0.25, 0.5, 1, 0.5, 0.25],
               });

               const zIndex = onScrollY.interpolate({
                  inputRange,
                  outputRange: [0, 0, 2, 0, 0],
               });

               return (
                  <Animated.View
                     style={{
                        height: ITEM_HEIGHT,
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        transform: [{ scaleY: scale }],
                        // backgroundColor: 'purple',
                     }}>
                       
                     <Animated.Text
                        style={{
                           color: color,
                           fontSize: 18,
                           fontFamily: FONTS.medium,
                           transform: [{ scale: scaleFont }],
                           opacity,

                           textShadowColor: 'rgba(0, 0, 0, 0.75)',
                           textShadowOffset: { width: 0, height: 0 },
                           textShadowRadius: 3,
                        }}>
                        {item?.text || 'hmm'}
                     </Animated.Text>

                     {/* <Animated.View
                        style={{
                           height: 1,
                           width: '100%',
                           backgroundColor: Colors.line,
                           position: 'absolute',
                           bottom: 0,
                           opacity,
                        }}
                     /> */}
                     
                  </Animated.View>
               );
            }}
            contentContainerStyle={{
               paddingVertical: 140,
            }}
         />

         {/* <Text white>{smashStore.multiplier || ''}</Text> */}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(CustomPicker));

const styles = StyleSheet.create({
   wrapper: {
      height: '50%',
      // backgroundColor: 'red',
   },
   container: {
      position: 'absolute',
      width: '100%',
      height: MASK_HEIGHT,
      top: (height - MASK_HEIGHT) / 2,
      backgroundColor: Colors.color58,
      justifyContent: 'center',
      alignItems: 'center',
   },
});
