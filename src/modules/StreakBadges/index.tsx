import Header from 'components/Header';
import React from 'react';
import { Colors, View } from 'react-native-ui-lib';
import StreakBadgesTab from './StreakBadgesTab';

function StreakBadges() {
   return (
      <View flex backgroundColor={Colors.white}>
         <Header title={'Monthly Badges'} noShadow back />
         <StreakBadgesTab />
      </View>
   );
}

export default StreakBadges;
