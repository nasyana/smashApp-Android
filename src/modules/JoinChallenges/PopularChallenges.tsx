import { width, height } from 'config/scaleAccordingToDevice';
import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, ImageBackground, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
   View,
   Colors,
   Image,
   Assets,
   Text,
   TouchableOpacity,
   SegmentedControl,
   SegmentedControlItemProps,
} from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import Challenge from '../../components/Challenge/components/Challenge';
import Routes from 'config/Routes';
import { inject, observer } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import Gradient from './Gradient';
import LottieAnimation from 'components/LottieAnimation';

const filterSegments: SegmentedControlItemProps[] = [
   { label: 'monthly' },
   { label: 'weekly' },
];

const PopularChallenges = (props) => {
   const { smashStore, challengesStore } = props;

   const { challengesArray } = challengesStore;
   const { settings } = smashStore;

   const filteredData = challengesArray.filter(
      (item) => item.popular === true && item.duration != 'weekly',
   );
   const challenges = filteredData;
   const isFocused = useIsFocused();
   // if (isFocused) {
   //    smashStore.headerGradient = ['#FF5E3A', '#FF2A68'];
   // }
   // if (!loaded) {
   //    return null;
   // }
   return (
      <View flex>
         <Gradient colors={['#FF5E3A', '#FF2A68']} />

         <ScrollView  showsVerticalScrollIndicator={false}>
            <>
               {/* <ImageBackground
               source={Assets.bg.popular}
               style={{
                  width: width,
                  height: height || (width / 575) * 225,
                  marginBottom: 8,
                  justifyContent: 'flex-end',
                  paddingBottom: 16,
                  paddingHorizontal: 16,
               }}
               > */}
               <View style={{ padding: 32, paddingBottom: 16 }}>
                  <Text H18 white marginB-8>
                     Popular Challenges (
                     {(challenges.length > 0 && challenges.length) ||
                        'No Challenges'}
                     )
                  </Text>
                  <View row>
                     <Image source={Assets.icons.ic_level} />
                     <Text R14 white marginL-4 marginR-24>
                        {settings?.messages?.popular ||
                           'Popular in SmashApp Community'}
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
                     source={require('../../lotties/findteam2.json')}
                  /> */}
               </View>
               {/* </ImageBackground> */}
            </>

               <FlatList
               data={filteredData}
               showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                     return <Challenge item={item} index={index} />;
                  }}
                  keyExtractor={(item, index) => item.id.toString()}
                  contentContainerStyle={{}}
                  ListFooterComponent={<View marginB-70 />}
                  // ListHeaderComponent={

                  // }
               />

         </ScrollView>
      </View>
   );
};;

export default inject(
   'smashStore',
   'challengesStore',
)(observer(PopularChallenges));
