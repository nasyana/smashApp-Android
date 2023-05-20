import SwipeableItem from 'components/SwipeableItem/SwipeableItem';
import Tag from 'components/Tag';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Assets, Colors, View, Text, Image } from 'react-native-ui-lib';

const VoteRecord = (props) => {
   return (
      <SwipeableItem>
         <View padding-16 row>
            <View
               style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingRight: 8,
               }}>
               <Tag size={40} color={Colors.color58} label={props.changeTo} />
               {/* <Image source={Assets.icons.ic_food_checked} marginT-8 /> */}
            </View>
            <View row center>
               <View row>
                  <Image source={Assets.icons.ic_calories_burn} />
                  <Text R14 color6D marginL-4>
                     3 of 5 Voted
                  </Text>
               </View>
               <View row marginL-24>
                  <Image source={Assets.icons.check} />
                  <Text R14 color6D marginL-4>
                     10th Mar 2022
                  </Text>
               </View>
            </View>
         </View>
      </SwipeableItem>
   );
};

export default VoteRecord;

const styles = StyleSheet.create({});
