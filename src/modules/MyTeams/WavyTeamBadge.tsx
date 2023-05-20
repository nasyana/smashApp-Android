import React from 'react';
import { Assets, Text, View } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { Image, TouchableOpacity } from 'react-native';
import { kFormatter } from 'utils/common';
import WavyEdgeCircle from 'components/WavyEdgeCircle';

interface ITeamBadgeProps {
   iconName?: any;
   gradientColors?: string[];
   text?: string;
   thisWeekTarget: number;
}

const _iconName = 'fitness-outline';

function WavyTeamBadge(props: ITeamBadgeProps) {
   const { iconName = _iconName, thisWeekTarget, teamsStore } = props;
   const height = 95;
   const openVoting = () => teamsStore.setIsTeamVoteDialogVisible(true);
   return (
      <TouchableOpacity
         flex
         style={{ height: height, width: height }}
         onPress={openVoting}>
         <Image
            source={Assets.icons.badgedefault}
            style={{
               width: height,
               height: height,
               backgroundColor: 'transparent',
               position: 'absolute',
               // top: 0,
               // left: 0,
            }}
         />
         <View centerH centerV center style={{ width: '100%', height: '100%' }}>
            {/* <Ionicons name={iconName} color="white" style={{ fontSize: 20 }} /> */}
            <Text
               B18
               style={{
                  fontSize: 32,
                  width: '100%',
                  textAlign: 'center',
                  letterSpacing: -1,
                  color: '#fff',
                  marginBottom: 5,
                  marginTop: 2,
               }}>
               {kFormatter(thisWeekTarget)}
            </Text>
            {/* <Text
               white
               style={{ fontSize: 10, marginTop: -10, marginBottom: 10 }}>
               POINTS
            </Text> */}
         </View>
      </TouchableOpacity>
   );
}

export default React.memo(WavyTeamBadge);
