import React from 'react';
import { getDayChar, isToday } from 'helpers/generalHelpers';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { inject, observer } from 'mobx-react';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import {
   MaterialCommunityIcons,
   AntDesign,
   Fontisto,
   Feather,
   SimpleLineIcons,
} from '@expo/vector-icons';
const Last7DayTargets = (props) => {
   const { item, smashStore, color } = props;

   const { dayLabelsLast7, stringLimit } = smashStore;
   const { daily } = item;
   return (
      <View row spread marginT-16 marginB-8>
         {dayLabelsLast7.map((dayKey, index) => {
            const defaultDailyTarget = item.defaultDailyTarget || 70;
            const dayScore =
               item?.targetType == 'qty'
                  ? daily?.[dayKey]?.qty
                  : daily?.[dayKey]?.score;
            const dayTarget = daily?.[dayKey]?.target || defaultDailyTarget;

            const progress = (dayScore / dayTarget) * 100 || 0;

            const today = isToday(dayKey);
            return (
               <View
                  marginR-4
                  key={dayKey}
                  style={
                     {
                        // backgroundColor: '#333',
                        // borderRadius: 30,
                     }
                  }>
                  <AnimatedCircularProgress
                     size={today ? 37 : 37}
                     fill={progress}
                     rotation={0}
                     width={3}
                     style={{ marginHorizontal: 2 }}
                     fillLineCap="round"
                     tintColor={color ? color : item.colorEnd || '#ccc'}
                     backgroundColor={'#eee'}>
                     {(fill) => (
                        <Text
                           secondaryContent
                           style={{
                              fontWeight: 'bold',
                              textDecorationLine: today ? 'underline' : 'none',
                              fontSize: 12,
                              color: today
                                 ? Colors.green30
                                 : progress > 100
                                 ? item?.colorEnd
                                 : '#ccc',
                           }}>
                           {stringLimit(getDayChar(dayKey), 1, false)}
                        </Text>
                     )}
                  </AnimatedCircularProgress>

                  {today && (
                     <AntDesign
                        name={'star'}
                        size={14}
                        color={item?.colorEnd}
                        style={{ position: 'absolute', right: 0, top: 0 }}
                     />
                  )}
                  {/* <Text>{progress}</Text> */}
               </View>
            );
         })}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(Last7DayTargets));
