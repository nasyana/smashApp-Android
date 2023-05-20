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
   SegmentedControl,
   SegmentedControlItemProps,
} from 'react-native-ui-lib';
import JoinChallengesList from '../../components/JoinChallengesList';
import Challenge from 'components/Challenge/components/Challenge';
import { inject, observer } from 'mobx-react';
import Gradient from './Gradient';
import { useIsFocused } from '@react-navigation/native';
import LottieAnimation from 'components/LottieAnimation';
const filterSegments: SegmentedControlItemProps[] = [
   { label: 'monthly' },
   { label: 'weekly' },
];

const FitnessChallenges = (props) => {
   const { smashStore, challengesStore } = props;

   const { challengesArray } = challengesStore;
   const { settings } = smashStore;
   const filteredData = challengesArray.filter(
      (item) => item.fitness === true && item.duration != 'weekly',
   );

   const challenges = challengesArray;

   const isFocused = useIsFocused();
   if (isFocused) {
      smashStore.headerGradient = ['#0177FF', '#4CBAE5'];
   }
   // if (!loaded) {
   //    return null;
   // }
   return (
      <View flex backgroundColor={Colors.background}>
         <Gradient colors={['#0177FF', '#4CBAE5']} />
         <ScrollView  showsVerticalScrollIndicator={false}>
            <View style={{ padding: 32, paddingBottom: 16 }}>
               <Text H18 white marginB-8>
                  Fitness Challenges (
                  {(challenges.length > 0 && challenges.length + '') ||
                     'No Challenges'}
                  )
               </Text>
               <View row>
                  {/* <Image source={Assets.icons.ic_time_16_w} />
                <Text R14 white marginL-4 marginR-24>
                  Jan 30, 2018
                </Text> */}
                  <Image source={Assets.icons.ic_level} />
                  <Text R14 white marginL-4 marginR-24>
                     {settings?.messages?.fitness ||
                        'Stay in Shape, Stay on the grind, Stay Motivated.'}
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
                  source={require('../../lotties/earnbadges2.json')}
               /> */}
            </View>

            <FlatList
               data={filteredData}
               showsVerticalScrollIndicator={false}
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

export default inject("smashStore", "challengesStore")(observer(FitnessChallenges));
