import React from 'react';
import { View, Colors, Image, Assets, Text, Avatar } from 'react-native-ui-lib';
import { thisMonth } from 'helpers/dateHelpers';
export default function ColDescription(props) {
   return (
      <View paddingV-16 style={{ backgroundColor: '#eee' }}>
         <View paddingH-24 flex row spread>
            <Text secondaryContent style={{ flex: 1 }}>
               Team
            </Text>
            {/* <View row spread paddingL-16 style={{ borderWidth: 0 }}> */}
            <Text secondaryContent style={{ flex: 1 }}>
               {'# Players'}
            </Text>
            <Text secondaryContent style={{ flex: 1 }}>
               {'Player Avg'}
            </Text>
            <Text secondaryContent style={{ flex: 1 }}>
               Week Score
            </Text>
            {/* </View> */}
         </View>
      </View>
   );
}
