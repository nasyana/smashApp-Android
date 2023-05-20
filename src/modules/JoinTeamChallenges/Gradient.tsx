import React from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { inject, observer } from 'mobx-react';
const { width, height } = Dimensions.get("window")
const Gradient = (props) => {
    return (
        <LinearGradient
            colors={props.smashStore.headerGradient}
            style={{
                // opacity: 0.5,
                position: 'absolute',
                width: width,
                height: (width / 375) * 225,
            }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
        />
    )
}


export default inject("smashStore", "challengesStore")(observer(Gradient));
