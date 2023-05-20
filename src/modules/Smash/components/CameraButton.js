import React, { useEffect, useRef, useState } from "react";
import { PanResponder, View, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { inject, observer } from 'mobx-react';
import { Assets, Image, Colors } from 'react-native-ui-lib';

const CameraButton = (props) => {
    const { smashStore, allow } = props;
    const { recordingProgress, recording, arrowDown = false } = smashStore;
    
    return (
        <>
        {arrowDown && <View>{arrowDown}</View>}
            <Image source={Assets.icons.ic_capture} />
            {recording && <AnimatedCircularProgress
                size={100}
                width={20}
                arcSweepAngle={360}
                rotation={80}
                lineCap="round"
                prefill={0}
                duration={1000}
                fill={recordingProgress}
                tintColor={'red'}
                backgroundColor={'#ccc'}
                style={[{ position: 'absolute', right: 2, top: -3, opacity: recordingProgress < 0.1 ? 0.2 : 1 }]}
            />}
        </>
    );
};

export default inject("smashStore")(observer(CameraButton))
