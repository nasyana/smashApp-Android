import React from 'react'
import { View, Colors, Image, Assets, Text, Avatar } from "react-native-ui-lib";
import { thisMonth, todayHuman } from 'helpers/dateHelpers';
export default function ColDescription(props) {
   return (
      <View paddingV-16>
         <View paddingL-24 flex row spread paddingR-32>
            <Text R12 style={{ flex: 1.3 }}>Rank Today ({todayHuman()})</Text>
            <View row spread paddingL-16 style={{ flex: 1.7, borderWidth: 0 }}>
               <Text R12 marginR-0>Daily Avg</Text>
               {/* <Text marginR-30>{props?.unit || 'Points'}</Text> */}
               <Text R12>Streak</Text>
               <Text R12>Likes</Text>

            </View>
         </View>
      </View>
   );
}
