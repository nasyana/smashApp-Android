import React from 'react'
import { View, Text, Colors } from 'react-native-ui-lib'
import { Ionicons } from '@expo/vector-icons';
const StarterTask = (props) => {


    const { done, title } = props;

    const color = done ? '#49be25' : '#333'
    return (
        <View row marginH-16 marginV-8 centerV>
            <Ionicons name={done ? 'ios-checkbox' : 'ios-checkbox-outline'} size={20} color={color} />
            <Text marginH-8 color={color}>{title || 'Emtpy'}</Text>
        </View>
    )
}

export default StarterTask
