import React from 'react'
import { View, Colors, Image, Assets, Text, Avatar } from "react-native-ui-lib";
import { thisMonth } from 'helpers/dateHelpers';
export default function ColDescription(props) {
   return (
      <View paddingV-16>
         <View paddingL-24 flex row spread paddingR-24>
            <Text style={{ flex: 2 }}>Rank ({thisMonth()})</Text>
            <View row spread paddingL-16 style={{ flex: 2, borderWidth: 0 }}>
               <Text marginR-30>{props?.unit || 'Points'}</Text>
               <Text>Likes</Text>
            </View>
         </View>
      </View>
   );
}
