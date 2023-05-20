import ButtonLinear from 'components/ButtonLinear';
import Header from 'components/Header';
import Input from 'components/Input';
import { width } from 'config/scaleAccordingToDevice';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';
import Feed from './Feed';
import { useNavigation } from "@react-navigation/native";
import TimelineFull from "../PlayerStats/TimelineFull";
import Firebase from 'config/Firebase';
const Timeline = (props) => {
    const { control } = useForm({
        defaultValues: {
            name: '',
            calories: '',
            duration: '',
        },
    });


    const uid = props?.route?.params?.uid || Firebase.auth.currentUser.uid;

    const challengeId = props?.route?.params?.challengeId || false;

    const activityId = props?.route?.params?.activityId || false;

    const dayKey = props?.route?.params?.dayKey || false;


    
    return (
       <View flex>
          <Header title={'Recent Activity'} back />
          <ScrollView>
             <TimelineFull {...{ activityId, dayKey, challengeId, uid }} />
          </ScrollView>
       </View>
    );
};

export default Timeline;

const styles = StyleSheet.create({});
