
import SegmentedRoundDisplay from "components/SegmentedRoundDisplay";
import Routes from "config/Routes";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, TouchableOpacity } from 'react-native';
import {
   Text,
   View,
   Assets,
   Button,
   Colors,
   PanningProvider,
} from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDistanceToNow } from 'date-fns';
import { inject, observer } from 'mobx-react';
import LottieAnimation from 'components/LottieAnimation';
const { width } = Dimensions.get('window');
const CohersionSwiper = (props) => {
   const { navigate } = useNavigation();
   const { smashStore, subtitle } = props;
   const firstTime = smashStore;
   const ShareButton = useCallback(
      () => (
         <Button
            iconSource={Assets.icons.ic_share}
            backgroundColor={Colors.white}
         />
      ),
      [Assets.icons.ic_share, Colors.white],
   );
   const isUpdate = props.itemName == 'SmashApp';
   return (
      <View
         panDirection={PanningProvider.Directions.LEFT}
         marginH-16
         marginB-16
         style={{
            // position: props.index != 0 ? 'absolute' : 'relative',
            width: width - 32,
            // top: props.index != 0 ? 0 : 0,
            // zIndex: props.index != 0 ? 0 : 99999,
            borderRadius: 6,
            shadowColor: '#000',
            shadowOffset: {
               width: 0,
               height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
            // transform: [{ rotate: props.index != 0 ? '-3deg' : '0deg', }]
         }}
         backgroundColor={Colors.white}>
         {/* <LinearGradient
            colors={['#C644FC', '#5856D6']}
            start={{
               x: 0,
               y: 0,
            }}
            end={{ x: 1, y: 0 }}
            style={{
               //    marginHorizontal: 16,
               borderRadius: 6,
               //    marginBottom: 24,
            }}> */}
         <View
            padding-16
            row
            style={{
               justifyContent: 'space-between',
               alignItems: 'center',
            }}>
            <View
               style={{
                  backgroundColor: Colors.red20,
                  height: 20,
                  width: 20,
                  borderRadius: 10,
               }}
            />
            {!isUpdate && (
               <Text R14 color28>
                  {props.itemName || 'SmashApp'}
               </Text>
            )}

            <View />
            {/* <ShareButton /> */}
            {/* <Button iconSource={Assets.icons.ic_close_24} backgroundColor={Colors.white} /> */}

            {/* <Button label="Dismiss" color={"#333"} backgroundColor={Colors.white} /> */}
         </View>

         <View
            row
            style={{
               justifyContent: 'space-around',
               alignItems: 'center',
            }}>
            <View />

            {/* <LottieAnimation

                    autoPlay
                    loop={true}
                    style={{
                        width: 85,
                        height: 85,
                        zIndex: 99999
                    }}
                    source={require("../../../lotties/sad.json")}
                /> */}

            <View
               style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 32,
               }}>
               {props.header2 && (
                  <Text M18 color28 center>
                     {props.header2}
                  </Text>
               )}
               <Text M18 color6D center>
                  {props.header1 || 'Overtook You! 😬'}
               </Text>
               {props.subtitle && (
                  <Text R14 color6D center marginH-16 center>
                     {props.subtitle}
                  </Text>
               )}
            </View>

            <View />
         </View>
         <View
            padding-16
            row
            style={{
               justifyContent: 'space-between',
            }}>
            <Text R12 color6D>
               Updated {formatDistanceToNow(props.timestamp)} ago
            </Text>
            {/* <TouchableOpacity onPress={()=> {}}>
                     <Text color28>Dismiss</Text>
                </TouchableOpacity> */}
         </View>
         <LottieAnimation
            autoPlay
            loop={true}
            style={{
               width: 85,
               height: 85,
               zIndex: 99999,
               position: 'absolute',
               bottom: -5,
               right: 0,
            }}
            source={require('../../../lotties/swipeleft.json')}
         />
         {/* </LinearGradient> */}
      </View>
   );
};

export default inject("smashStore")(observer(CohersionSwiper));
