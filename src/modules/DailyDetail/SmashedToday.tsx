import { Text, View, Colors, Button } from 'react-native-ui-lib';
import SmashItemLog from 'components/SmashItemLog';
import React from 'react';

const SmashedToday = (props) => {
   const smashes = props.smashes || [];
   return (
      <View row margin-16 style={{ flexWrap: 'wrap' }}>
         {smashes.map((s) => {
            return <SmashItemLog activity={s} />;
         })}
      </View>
   );
};

export default SmashedToday;
