import React, { useState, useRef, useEffect } from 'react';

import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Button, Incubator, View, Text, Colors } from 'react-native-ui-lib';
import LibraryActivitiesModal from './LibraryActivitiesModal';

const LibraryActivitiesContainer = ({teamsStore}) => {


    if(!teamsStore.showLibraryActivitiesModal){return null}
   console.log('render LibraryActivitiesContainer');

    return (
        <LibraryActivitiesModal />
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(LibraryActivitiesContainer));