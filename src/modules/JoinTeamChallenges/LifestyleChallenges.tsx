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
   SegmentedControlItemProps,
   SegmentedControl,
} from 'react-native-ui-lib';
import Challenge from 'components/Challenge/components/Challenge';
import {inject, observer} from 'mobx-react';
import {useIsFocused} from '@react-navigation/native';
import Gradient from './Gradient';
import LottieAnimation from 'components/LottieAnimation';
const filterSegments: SegmentedControlItemProps[] = [
   { label: 'monthly' },
   { label: 'weekly' },
];

const LifestyleChallenges = (props) => {
   const { smashStore, challenges = [] } = props;
   const { settings } = smashStore;
   const [filterSegmentIndex, setfilterSegmentIndex] = useState(1);
   const filteredData =
      challenges.filter(
         (item) => item.duration === filterSegments[filterSegmentIndex].label,
      ) || challenges;
   const numOfChallenges =
      challenges.length > 0 ? challenges.length : 'No Challenges';
   const isFocused = useIsFocused();

   if (isFocused) {
      smashStore.headerGradient = ['#D685A7', '#8F1874'];
   }
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
                        source={Assets.bg.lifestyle}
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
                           Lifestyle Challenges ({numOfChallenges})
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
                        <LottieAnimation
                           autoPlay
                           loop={true}
                           style={{
                              // width: 200,
                              height: 170,
                              zIndex: 99999,
                              position: 'absolute',
                              top: 0,
                              right: 5,
                           }}
                           source={require('../../lotties/trackprogress.json')}
                        />
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
)(observer(LifestyleChallenges));
