import React from 'react'
import { View, Colors, Image, Assets, Text, Avatar } from "react-native-ui-lib";
import { thisMonth, todayHuman } from 'helpers/dateHelpers';
export default function ColDescription(props) {

   const {dark} = props;
   return (
      <View paddingV-16>
         <View  flex row spread paddingR-42>
            <Text R12 style={{ flex: 1 }} center white={dark}>Rank</Text>
            <Text R12 style={{ flex: 0.8 }} center white={dark}>Name</Text>
            <View row spread  style={{ flex: 1.7, borderWidth: 0 }}>
               <Text R12 marginR-0  center white={dark}>Contribution</Text>
               {/* <Text marginR-30>{props?.unit || 'Points'}</Text> */}
               {/* <Text R12>Streak</Text> */}
               <Text R12 center white={dark}>Likes</Text>

            </View>
         </View>
      </View>
   );
}
