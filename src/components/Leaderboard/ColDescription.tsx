import React from 'react';
import { View, Colors, Image, Assets, Text, Avatar } from 'react-native-ui-lib';
export default function ColDescription() {
   return (
      <View paddingV-16>
         <View paddingL-24 flex row spread paddingR-24>
            <Text R14>Rank</Text>
            <View center row spread paddingR-16>
               <Text R14 marginR-30>Score</Text>
               <Text R14 marginR-40>Today</Text>
               <Text R14 marginR-20>Week</Text>
            </View>
         </View>
      </View>
   );
}
