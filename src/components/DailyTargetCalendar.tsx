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
import { Calendar } from 'react-native-calendars';
import { FONTS } from 'config/FoundationConfig';
import { forEach } from 'lodash';
import ChallengeDayTarget from './ChallengeDayTarget';
import { hexToRgbA } from 'helpers/generalHelpers';
import Box from './Box';

const DailyTargetCalendar = ({ item }) => {

    const { daily = {} } = item;
    const rgba = hexToRgbA(item.colorStart, 0.1);

    const colorStart = item?.colorStart || Colors.buttonLink


    let markedDates = {};

    Object.keys(daily).forEach((key) => {

        const smashedDay = daily?.[key]?.score > daily?.[key]?.target;

        const isToday = moment().format('DDMMYYYY') == key;

        const newKey = moment(key, 'DDMMYYYY').format('YYYY-MM-DD');

        if (smashedDay) {

            markedDates[newKey] = { startingDay: false, endingDay: isToday, color: colorStart, textColor: 'white' };
        }



    })


    return (
        <View>
            <Box >
                <View paddingV-4>
            <Calendar
                markingType={'period'}
                // hideExtraDays={true}
                // markedDates={{
                //     '2022-11-15': { marked: true, dotColor: '#50cebb' },
                //     '2022-11-16': { marked: true, dotColor: '#50cebb' },
                //     '2022-11-21': { startingDay: true, color: '#50cebb', textColor: 'white' },
                //     '2022-11-22': { color: '#70d7c7', textColor: 'white' },
                //     '2022-11-23': { color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white' },
                //     '2022-11-24': { color: '#70d7c7', textColor: 'white' },
                //     '2022-11-25': { endingDay: true, color: '#50cebb', textColor: 'white' }
                // }}
                markedDates={markedDates}
                    minDate={moment().subtract(1, 'months').format('YYYY-MM-DD')}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    maxDate={moment().format('YYYY-MM-DD')}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    textSectionTitleDisabledColor: '#d9e1e8',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'orange',
                    disabledArrowColor: '#d9e1e8',
                    // monthTextColor: '#333',
                    indicatorColor: '#333',
                    textDayFontFamily: FONTS.roman,
                    textMonthFontFamily: FONTS.roman,
                    textDayHeaderFontFamily: FONTS.roman,
                    // textDayFontWeight: '300',
                    textMonthFontWeight: 'normal',
                    // textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 16
                }}

                dayComponent={({ date, state }) => {


                    return (
                        <ChallengeDayTarget date={date} item={item} rgba={rgba} state={state} />
                        // <View>
                        //     <Text R12 style={{ textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black' }}>{date.day}</Text>
                        // </View>
                    );
                }}
            />
                </View>
            </Box>
        </View>
    )
}

export default inject('smashStore', 'challengesStore', 'teamsStore')(observer(DailyTargetCalendar));