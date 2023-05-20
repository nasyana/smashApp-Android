import { width } from 'config/scaleAccordingToDevice';
import React, { useEffect, useState } from 'react';
import SmartImage from '../../components/SmartImage/SmartImage';
import { FlatList, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
   MaterialCommunityIcons,
   AntDesign,
   Ionicons,
   Feather,
} from '@expo/vector-icons';
import {
   View,
   Colors,
   Image,
   Assets,
   Text,
   Button,
   TouchableOpacity,
} from 'react-native-ui-lib';
import Box from 'components/Box';
import TimelineToday from 'modules/PlayerStats/TimelineToday';
import Firebase from 'config/Firebase';
import { useNavigation } from '@react-navigation/core';
import Routes from 'config/Routes';
import { inject, observer } from 'mobx-react';
import Header from 'components/Header';

const UserDayView = (props) => {
   const _day = props.route?.params?._day;
   const user = props.route?.params?.user;
   const [day, setDay] = useState(_day || false);
   useEffect(() => {
      const { smashStore } = props;
      const { user, dayDocId } = props?.route?.params;
      const query = Firebase.firestore
         .collection('dailyActivity')
         .doc(dayDocId);

      const unsubToUserDailyActivity = query.onSnapshot((daySnap) => {
         if (daySnap.exists) {
            const day = daySnap.data();
            setDay(day);
            smashStore.userDayDoc[day.uid] = day;
         }
      });

      return () => {
         if (unsubToUserDailyActivity) {
            unsubToUserDailyActivity();
         }
      };
   }, []);

   const { smashStore } = props;
   const { todayDateKey } = smashStore;
   return (
      <View flex>
         <Header title={'View User Day'} back />
         {/* <Text>{day.score}</Text> */}

         {/* What challenges user has smashed in */}

         {/* What teams the user smahed in */}

         {day && (
            <Box>
               <TimelineToday date={todayDateKey} focusUser={user} />
            </Box>
         )}
      </View>
   );
};

export default inject('challengesStore', 'smashStore')(observer(UserDayView));
