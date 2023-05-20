import React, { useState, useEffect } from 'react';
import { Colors, Text,View } from 'react-native-ui-lib';
import moment from 'moment-timezone';
import { Ionicons } from '@expo/vector-icons';

const TimerUntilSunday = () => {
  const [time, setTime] = useState('--:--:--');

  const timeZone =  moment.tz.guess(true);
  useEffect(() => {
    const interval = setInterval(() => {
        const now = moment();
        const sunday = moment().endOf('week');
        const duration = moment.duration(sunday.diff(now));
        const hours = duration.asHours();
        const minutes = duration.asMinutes();
        const seconds = duration.asSeconds();
        setTime(`${Math.floor(hours)}:${Math.floor(minutes%60)}:${Math.floor(seconds%60)}`);
      
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View row>
        <Ionicons name={'timer'} size={16} color={Colors.secondaryContent} />
    <Text R14 marginL-4 secondaryContent>
      {time} 
    </Text>
    </View>
  );
};

export default TimerUntilSunday;