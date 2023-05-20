import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {Assets, Image, Text} from 'react-native-ui-lib';
import {Ionicons} from '@expo/vector-icons';
import { kFormatter } from 'utils/common';

interface ITeamBadgeProps {
   iconName?: any;
   gradientColors?: string[];
   text?: string;
   thisWeekTarget: number;
}

const _gradientColors = ['#192840', '#2440dd'];
const _iconName = 'fitness-outline';
const size = 80;

function TeamBadge(props: ITeamBadgeProps) {
   const {
      iconName = _iconName,
      text = '',
      gradientColors = _gradientColors,
      thisWeekTarget,
   } = props;

   return (
      <LinearGradient
         start={{ x: 0.6, y: 0.1 }}
         colors={gradientColors}
         style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
         }}>
         <Image
            source={Assets.icons.badge1}
            style={{ height: size - 3, width: size - 3, position: 'absolute' }}
         />
         <Ionicons
            name={iconName}
            color="white"
            style={{ fontSize: 20, marginBottom: -2, marginTop: -5 }}
         />
         <Text white B18 style={{ fontSize: 18 }}>
            {kFormatter(thisWeekTarget)}
         </Text>
      </LinearGradient>
   );
}

export default React.memo(TeamBadge);

