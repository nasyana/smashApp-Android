import { View, Text } from 'react-native';
import React from 'react';
import { WIDTH, HEIGHT } from 'helpers/scale';
const QuickModal = (props) => {
   const { visible } = props;

   if (!visible) {
      return null;
   }
   return (
      <View
         style={{
            position: 'absolute',
            width: WIDTH,
            height: HEIGHT,
            top: 0,
            left: 0,
            zIndex: 10000,
            elevation: 10000,
         }}>
         {props.children}
      </View>
   );
};

export default QuickModal;
