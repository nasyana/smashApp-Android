import { View, Text } from 'react-native';
import React from 'react';

const List = (props) => {
   return <View style={{ flex: 1 }}>{props.children}</View>;
};

export default List;
