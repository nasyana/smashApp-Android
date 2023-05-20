import { width } from "config/scaleAccordingToDevice";
import React, { useMemo, useState } from "react";
import { FlatList, ImageBackground, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
   View,
   Colors,
   Image,
   Assets,
   Text,
   SegmentedControlItemProps,
   SegmentedControl,
} from 'react-native-ui-lib';
import Challenge from 'components/Challenge/components/Challenge';
import { inject, observer } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import Gradient from './Gradient';
import LottieAnimation from 'components/LottieAnimation';
const filterSegments: SegmentedControlItemProps[] = [
   { label: 'monthly' },
   { label: 'weekly' },
];

const LifestyleChallenges = (props) => {
   const { smashStore, challengesStore } = props;
   const { settings } = smashStore;
   const { challengesArray } = challengesStore;
   const filteredData = challengesArray.filter(
      (item) => item.lifestyle === true && item.duration != 'weekly',
   );

   const challenges = filteredData;

   const isFocused = useIsFocused();
   // if (!loaded) {
   //    return null;
   // }
   // if (isFocused) {
   //    smashStore.headerGradient = ['#D685A7', '#8F1874'];
   // }
   return (
      <View flex backgroundColor={Colors.background}>
         <Gradient colors={['#D685A7', '#8F1874']} />
         <ScrollView  showsVerticalScrollIndicator={false}>
            <View style={{ padding: 32, paddingBottom: 16 }}>
               <Text H18 white marginB-8>
                  Lifestyle Challenges (
                  {(challenges.length > 0 && challenges.length) ||
                     'No Challenges'}
                  )
               </Text>
               <View row>
                  {/* <Image source={Assets.icons.ic_time_16_w} />
                <Text R14 white marginL-4 marginR-24>
                  <Text R14 white marginL-4 marginR-24>
                    {props?.challenges.length > 0 && props?.challenges.length + ' Challenges' || 'No Challenges'}
                  </Text>
                </Text> */}
                  <Image source={Assets.icons.ic_level} />
                  <Text R14 white marginL-4 marginR-24>
                     {settings?.messages?.lifestyle ||
                        'Stay Focussed, Goals, Wellbeing & Momentum'}
                  </Text>
               </View>
               {/* <LottieAnimation
                  autoPlay
                  loop={true}
                  style={{
                     // width: 200,
                     height: 140,
                     zIndex: 99999,
                     position: 'absolute',
                     top: 0,
                     right: 5,
                  }}
                  source={require('../../lotties/trackprogress.json')}
               /> */}
            </View>
            <FlatList
            showsVerticalScrollIndicator={false}
               data={filteredData}
               renderItem={({ item, index }) => {
                  return <Challenge item={item} />;
               }}
               keyExtractor={(item, index) => item.id.toString()}
               contentContainerStyle={{}}
               ListFooterComponent={<View marginB-70 />}
            />
         </ScrollView>
      </View>
   );
};

export default inject("smashStore", "challengesStore")(observer(LifestyleChallenges));
