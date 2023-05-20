import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Dimensions } from 'react-native'

import { inject, observer } from "mobx-react/native";

import moment from 'moment-timezone';

import { BarChart, Grid } from 'react-native-svg-charts'
const { width } = Dimensions.get('window');
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Firebase, DayChart } from ".."
import { Theme } from '../Theme';
import { DayGraphBars } from '..';
@inject('smashStore')
@observer
export class DayBarChart extends Component {
   constructor(props) {
      super(props);
      this.state = {
         axisWidth: 0,
         axisHeight: 10,
         todayCompletions: [],
      };
   }

   componentDidMount() {
      const { smashStore } = this.props;

      const { selectedDayData } = smashStore;

      const { selectedDay } = selectedDayData;

      let startUnix = moment(selectedDay.timestamp, 'DDMMYYYY')
         .startOf('day')
         .unix();
      let endUnix = moment(selectedDay.timestamp, 'DDMMYYYY')
         .endOf('day')
         .unix();

      if (!selectedDay) {
         startUnix = moment().startOf('day').unix();
         endUnix = moment().endOf('day').unix();
      }
   }

   render() {
      const { actionId, smashStore, user, completions } = this.props;

      const {
         activity,
         daysToDisplay,
         actions,
         selectedUserId,
         activeGame,
         selectedDayData,
      } = smashStore;

      const { selectedDay = {} } = selectedDayData;

      const { uid } = Firebase.auth.currentUser;
      const selectedUser = user?.id || selectedUserId || uid;

      let data;

      let hours = {};

      const today = moment().startOf('day');
      const now = moment();
      let diffMinutes = now.diff(today, 'minutes');

      for (let index = 0; index < 24; index++) {
         hours[index] = {
            x: index,
            y: 0,
            time: moment(index, 'H').tz(activeGame.timeZone).format('ha'),
         };
      }

      Object.values(completions).forEach((completion, index) => {
         let hourKey = moment(completion.timestamp, 'X')
            .tz(activeGame.timeZone)
            .format('H');
         let hourKeyTwo = moment(completion.timestamp, 'X')
            .tz(activeGame.timeZone)
            .format('ha');
         hours[hourKey].y = hours[hourKey]?.y + completion.pointsEarned || 0;
         hours[hourKey].x = hourKeyTwo;
         hours[hourKey].timestamp = completion?.timestamp;
         hours[hourKey].uid = completion?.uid;
      });

      const hoursToShow = [
         '12am',
         '3am',
         '6am',
         '9am',
         '12pm',
         '3pm',
         '6pm',
         '9pm',
         '12am',
      ];
      data = Object.keys(hours).map((hour, index) => hours[index]);

      return (
         <View style={{ marginBottom: 5, marginTop: -20 }}>
            <DayChart
               singleUser={this.props.singleUser}
               user={this.props.user}
               data={data}
               color={this.props.color}
               light
               dark={this.props.dark}
               setState={(state) => this.props.setState({ ...state })}
            />
            {/* <DayGraphBars data={data} height={this.props.height} dark={this.props.dark} team={this.props.team} dark={this.props.dark} /> */}

            <View
               style={{
                  paddingLeft: this.props.user ? 25 : 0,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderWidth: 0,
                  marginBottom: 4,
               }}>
               {data.map((hr, index) => {
                  const currentHour = moment().format('ha') == hr?.time;
                  return (
                     <View
                        style={{
                           height: 3,
                           flex: 1,
                           marginHorizontal: 2,
                           backgroundColor:
                              !selectedDay && currentHour
                                 ? Theme.palette.bonus
                                 : this.props.dark
                                 ? 'rgba(255,255,255,0.2)'
                                 : '#fff',
                        }}
                     />
                  );
               })}
            </View>

            <View
               style={{
                  paddingLeft: this.props.user ? 25 : 0,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: width - 40,
                  borderWidth: 0,
                  marginTop: 0,
               }}>
               {hoursToShow.map((hr, index) => {
                  return (
                     <Text
                        key={hr + index}
                        style={{
                           transform: [{ rotate: '0deg' }],
                           fontSize: 9,
                           color: this.props.dark
                              ? 'rgba(255,255,255,0.8)'
                              : '#000',
                        }}>
                        {hr || ''}
                     </Text>
                  );
               })}
            </View>
         </View>
      );
   }
}

export default DayBarChart
