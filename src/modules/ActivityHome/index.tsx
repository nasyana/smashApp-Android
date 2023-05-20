
import React from 'react';
import {
   View
} from 'react-native-ui-lib';

import HomeActivity from 'modules/Home/HomeActivity';
import HomeHeaderWithSearch from 'components/HomeHeaderWithSearch';

console.log('render ActivityHome')

const ActivityHome = (props) => {

   return (
      <View flex>
         <HomeHeaderWithSearch activity />
         <HomeActivity />
      </View>
   );
};

export default ActivityHome;

