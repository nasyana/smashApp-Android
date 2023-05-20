import React from 'react';

/* styles libs */
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';

/* components */
import SmartImage from '../../components/SmartImage/SmartImage';
import CircularProgressBar from 'components/CircularProgressBar';

const Player = (props) => {
   const {
      item,
      index,
      community,
      kFormatter,
      currentUser,
      todayDateKey,
      team,
      thisWeekTarget,
      weekScore,
      day,
   } = props;

   const isLegacy = team?.type === 'Game';
   const user = item;
   const { daily } = item;
   const today = isLegacy ? day : daily?.[todayDateKey] || false;

   const todayScore = isLegacy
      ? today.userData?.[item.id]?.userTotal
      : today?.score || 0;

   const numberOfPlayers = isLegacy
      ? team?.joinedUsers?.length
      : team?.joined?.length;

   const todayTarget = thisWeekTarget / 7 / numberOfPlayers;


   const pressInsights = () => {
      return null;
   };

   const onPressUser = () => {
      return null;
   };



   return (
      <View
         row
         style={{
            borderRadius: 6,
            marginHorizontal: 16,
            backgroundColor: '#FFF',
            paddingBottom: 16,
            overflow: 'hidden',
            marginBottom: 2,
         }}>
         <View centerV paddingL-16 paddingT-16>
            <Text>{index + 1}</Text>
         </View>

         <TouchableOpacity paddingT-16 paddingL-16 onPress={onPressUser}>
            <SmartImage
               uri={user?.picture?.uri}
               preTouchableOpacity={user?.picture?.preview}
               style={{
                  height: 50,
                  width: 50,
                  borderRadius: 60,
                  backgroundColor: '#ccc',
               }}
            />
         </TouchableOpacity>

         <View paddingL-10 centerV flex row spread>
            <Text H14 color28 marginT-16 marginB-8 onPress={onPressUser}>
               {user?.name || 'anon'}
            </Text>
         </View>

         <View paddingL-0 flex row spread paddingR-0 centerV>
            <Text
               buttonLink
               marginT-16
               marginB-8
               style={{ fontSize: 20 }}
               onPress={pressInsights}>
               {kFormatter(weekScore) || 0}
            </Text>
         </View>

         {/* Today */}
         <View
            paddingL-0
            flex
            row
            spread
            paddingR-16
            centerV
            marginT-10
            marginL-2>
            <CircularProgressBar
               showPercent
               tintColor={Colors.rgba(91, 149, 246, 1)}
               fill={parseInt((todayScore / todayTarget) * 100)}
               size={60}
               width={6}
               fontSize={15}
               fontWeight="normal"

            />
         </View>

         {/* Week */}
         <View
            paddingL-0
            flex
            row
            spread
            paddingR-24
            centerV
            marginT-10
            marginL-2>
            <CircularProgressBar
               showPercent
               tintColor={Colors.rgba(228, 44, 58, 1)}
               fill={parseInt((weekScore / thisWeekTarget) * 100)}
               size={60}
               width={6}
               fontSize={15}
               fontWeight="normal"
            />
         </View>
      </View>
   );
};
export default Player;
