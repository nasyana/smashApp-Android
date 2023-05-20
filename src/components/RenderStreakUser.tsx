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
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;

const RenderStreaksUser = ({ streak }) => {

    const { navigate } = useNavigation();
    const [user, setUser] = useState({ name: 'blah' });
    const userRef = Firebase.firestore.collection('users').doc(`${streak.uid}`);
    useEffect(() => {
        const unsubscribe = userRef.onSnapshot((snapshot) => {
            setUser(snapshot.data());
        });

        return () => unsubscribe();
    }, [userRef]);

    return (
        <>
            {user && (
                <View row spread paddingH-24>
                    <Text>{user?.name}</Text>
                    {/* <Text>{moment(streak?.monthKey, 'MMYYYY').format('Do Mo')}</Text> */}
                    <Text>{streak?.name}</Text>
                    <Text>Streak: {streak?.streak}</Text>
                </View>
            )}
        </>
    );
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(RenderStreaksUser));