import { width } from "config/scaleAccordingToDevice";
import React, { useMemo, useState } from "react";
import { FlatList, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Colors, Image, Assets, Text, TouchableOpacity, SegmentedControl, SegmentedControlItemProps } from "react-native-ui-lib";
import { useNavigation } from "@react-navigation/native";
import Challenge from "../../components/Challenge/components/Challenge";
import Routes from "config/Routes";
import { inject, observer } from 'mobx-react';
import { useIsFocused } from "@react-navigation/native";
import Gradient from "./Gradient"
import LottieAnimation from 'components/LottieAnimation';
const filterSegments: SegmentedControlItemProps[] = [
   { label: 'monthly' },
   { label: 'weekly' },
];

const PopularChallenges = (props) => {
   const { smashStore } = props;
   const { settings } = smashStore;
   const { navigate } = useNavigation();
   const { challenges = [] } = props;
   const [filterSegmentIndex, setfilterSegmentIndex] = useState(1);
   const filteredData =
      challenges.filter(
         (item) => item.duration === filterSegments[filterSegmentIndex].label,
      ) || challenges;

   const isFocused = useIsFocused();
   if (isFocused) {
      smashStore.headerGradient = ['#FF5E3A', '#FF2A68'];
   }
   return (
      <View flex backgroundColor={Colors.background}>
         <FlatList
            data={filteredData}
            renderItem={({ item, index }) => {
               return <Challenge item={item} index={index} />;
            }}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{}}
            ListFooterComponent={<View marginB-70 />}
            ListHeaderComponent={useMemo(() => {
               return (
                  <View marginB-16>
                     <ImageBackground
                        source={Assets.bg.popular}
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
                           Popular Challenges (
                           {(challenges.length > 0 && challenges.length) ||
                              'No Challenges'}
                           )
                        </Text>
                        <View row>
                           {/* <Image source={Assets.icons.ic_time_16_w} />
                <Text R14 white marginL-4 marginR-24>
                  {props?.challenges.length > 0 && props?.challenges.length + ' Challenges' || 'No Challenges'}
                </Text> */}
                           <Image source={Assets.icons.ic_level} />
                           <Text R14 white marginL-4 marginR-24>
                              {settings?.messages?.popular ||
                                 'Popular in SmashApp Community'}
                           </Text>
                        </View>
                        <LottieAnimation
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
                           source={require('../../lotties/findteam2.json')}
                        />
                     </ImageBackground>
                     {/* <View flex centerV right marginB-8 marginR-16>
                <SegmentedControl segments={filterSegments} onChangeIndex={setfilterSegmentIndex}/>
              </View> */}
                  </View>
               );
            }, [challenges.length])}
         />
      </View>
   );
};

export default inject("smashStore", "challengesStore")(observer(PopularChallenges));
