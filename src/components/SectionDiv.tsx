import { View, Text } from 'react-native'
import React from 'react'
import { inject, observer } from 'mobx-react';
const SectionDiv = ({ smashStore, style ={}, transparent = false, height = 10 }) => {


    return (
        <View style={{ height: height, backgroundColor: transparent ? 'transparent' : '#333', width: '100%',...style }} />


    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(SectionDiv));