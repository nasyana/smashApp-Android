import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Header from "components/Header";
import ButtonLinear from "components/ButtonLinear";
import { FONTS } from "config/FoundationConfig";
import Routes from "config/Routes";
import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import {
    Assets,

    Colors,
    Dialog,
    Image,
    PanningProvider,
    Text,
    View,
    Button,
} from "react-native-ui-lib";

import { inject, observer } from 'mobx-react';

import { bottom, height, width } from "../../config/scaleAccordingToDevice";
import PlayerStats from "../PlayerStats"
import useBoolean from "../../hooks/useBoolean";
import { useNavigation } from "@react-navigation/core";
import SegmentControl from 'libs/react-native-segment';
import FollowingList from "./components/FollowingList"
import moment from "moment";
const screens = ['Following', 'Community']
const Tab = createMaterialTopTabNavigator();
const ChallengeArena = (props) => {



    const handleArenaChange = (index) => {

        props.challengeArenaStore.challengeArenaIndex = index;

    }

    useEffect(() => {

        return () => {
            props.challengeArenaStore.challengeArenaIndex = 0;
        }
    }, [])


    return (

        <View centerH>
            <SegmentControl
                values={screens}
                momentary
                disable={false}
                style={styles.segment}
                selectedIndex={props.challengeArenaStore.challengeArenaIndex}
                onChange={handleArenaChange}
                tintColor="#fff"
            />
        </View>

    );
}

export default inject("smashStore", "challengesStore", "challengeArenaStore")(observer(ChallengeArena));

const styles = StyleSheet.create({
    segment: { marginHorizontal: 16, marginBottom: 16, width: width - 32, height: 30 }
});

