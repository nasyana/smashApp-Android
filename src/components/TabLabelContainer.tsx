import { View, Text } from 'react-native';
import React from 'react';

const TabLabelContainer = (props) => {
   return <Text style={{ color: 'red' }}>{props.children}</Text>;
};

export default TabLabelContainer;
