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
// import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';
import AnimatedView from './AnimatedView';

const ChallengeQuestions = () => {
    // const { navigate } = useNavigation();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answerData, setAnswerData] = useState({
        participants: null,
        challengeType: null,
        targetType: null,
    });

    const questions = [
        {
            text: 'Is this a personal challenge or would you like others to join?',
            options: [
                { label: 'Personal Goal', value: 'personal' },
                { label: 'Start with a friend', value: 'friend' },
            ],
        },
        {
            text: 'Do you want to focus on consistency or motivation?',
            options: [
                { label: 'Streak Challenge (Consistency)', value: 'streak' },
                { label: 'Goal Challenge (Motivation)', value: 'goal' },
            ],
        },
        {
            text: 'What type of goal do you want to set?',
            options: [
                { label: 'Quantity-based (qty)', value: 'qty' },
                { label: 'Points-based (points)', value: 'points' },
            ],
        },
    ];

    const handleAnswer = (key, value) => {
        setAnswerData((prev) => ({ ...prev, [key]: value }));
        setCurrentQuestion(currentQuestion + 1);
    };

    const handleBack = () => {
        setCurrentQuestion(currentQuestion - 1);
    };

    const handleDone = () => {
        // navigate('CreateGoal', { data: answerData });
    };

    return (
        <View flex center style={{width: width, height, backgroundColor: 'rgba(255,255,255,1)'}}>
            {questions.map((question, index) => (
                <AnimatedView
                    key={index}
                    style={{
                        display: currentQuestion === index ? 'flex' : 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width,
                        
                    }}
                    paddingH-24
                >
                    <Text B18 margin-16 marginB-24 center>{question.text}</Text>
                    {question.options.map((option, idx) => (
                        <ButtonLinear
                    
                            key={idx}
                            title={option.label}
                            onPress={() => handleAnswer(index, option.value)}
                            style={styles.button}
                        />
                    ))}
                    {index > 0 && (
                        <ButtonLinear
                            title="Back"
                            onPress={handleBack}
                            // style={styles.backButton}
                        />
                    )}
                </AnimatedView>
            ))}
            {currentQuestion === questions.length && (
                <ButtonLinear title="Done" onPress={handleDone} style={styles.doneButton} />
            )}
        </View>
    );
};


export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(ChallengeQuestions));

const styles = StyleSheet.create({
    button: {
        width: width * 0.8,
        marginBottom: 16
        // backgroundColor: Colors.primary,
        // marginBottom: 10,
        // borderRadius: 10,
        // paddingVertical: 15,
        // paddingHorizontal: 20,
        // alignItems: 'center',
        // justifyContent: 'center',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
    },
    backButton: {
        width: width * 0.8,
        backgroundColor: Colors.grey30,
        marginBottom: 10,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneButton: {
        width: width * 0.8,
        backgroundColor: Colors.secondary,
        marginBottom: 10,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    questionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
});
