import React from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { inject, observer } from 'mobx-react';
const { width, height } = Dimensions.get("window")
const Gradient = (props) => {
   const { colors } = props;
    
    return (
       <LinearGradient
          colors={colors || props.smashStore.headerGradient}
          style={{
             // opacity: 0.5,
             position: 'absolute',
             width: width,
             height: height || (width / 375) * 225,
             ...props.style,
          }}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
       />
    );
}


export default inject("smashStore", "challengesStore")(observer(Gradient));
