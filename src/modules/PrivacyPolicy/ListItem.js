import { View, Text } from 'react-native';
import React from 'react';

const ListItem = (props) => {
   return (
      <View style={{ flex: 1 }}>
         <Text>{props.children}</Text>
      </View>
   );
};

export default ListItem;
