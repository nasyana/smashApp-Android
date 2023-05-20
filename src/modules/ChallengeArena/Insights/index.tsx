import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Header from "../../../components/Header";
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
import InsightsScreens from "../components/InsightsScreens";
import Insights from "modules/Overview/Insights";


const InsightsScreen = (props) => {



    return (
        <View flex >
            <Header title={"Insights"} back titleColor={'#aaa'} />
            <Insights />
        </View>
    )
}

export default InsightsScreen
