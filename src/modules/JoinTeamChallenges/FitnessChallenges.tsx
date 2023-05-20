import {width} from 'config/scaleAccordingToDevice';
import React, {useMemo, useState} from 'react';
import {FlatList, ImageBackground} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
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
import {inject, observer} from 'mobx-react';
import Gradient from './Gradient';
import {useIsFocused} from '@react-navigation/native';
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
      (item) => item.fitness == true && item.duration != 'weekly',
   );
   const numOfChallenges =
      filteredData.length > 0 ? filteredData.length : 'No Challenges';

   const isFocused = useIsFocused();
   // if (isFocused) {
   //    smashStore.headerGradient = ['#0177FF', '#4CBAE5'];
   // }
   return (
      <View flex backgroundColor={Colors.background}>
         <FlatList
            data={filteredData}
            renderItem={({ item, index }) => {
               return <Challenge item={item} />;
            }}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{}}
            ListFooterComponent={<View marginB-70 />}
            ListHeaderComponent={useMemo(() => {
               return (
                  <View marginB-16>
                     <ImageBackground
                        source={Assets.bg.fitness}
                        style={{
                           width: width,
                           height: (width / 575) * 225,
                           marginBottom: 8,
                           justifyContent: 'flex-end',
                           paddingBottom: 16,
                           paddingHorizontal: 16,
                        }}>
                        <Gradient />
                        <Text H18 white marginB-16>
                           Fitness Challenges ({numOfChallenges})
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
                              height: 160,
                              zIndex: 99999,
                              position: 'absolute',
                              top: 0,
                              right: 5,
                           }}
                           source={require('../../lotties/earnbadges2.json')}
                        /> */}
                     </ImageBackground>
                     {/* <View flex centerV right marginB-8 marginR-16>
                        <SegmentedControl
                           segments={filterSegments}
                           onChangeIndex={setfilterSegmentIndex}
                        />
                     </View> */}
                  </View>
               );
            }, [])}
         />
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
)(observer(FitnessChallenges));
