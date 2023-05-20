
import React from 'react';
import { View } from 'react-native-ui-lib';

import { inject, observer } from 'mobx-react';

import FriendsScrollview from '../../components/FriendsScrollview';

import SectionHeader from 'components/SectionHeader';


const HomeHeader = (props) => {

   console.log('check rerenders HomeHeader');

   return (
      <View paddingT-0>
         <SectionHeader title="Accountability Partners (Following)" top={8}  />
            <FriendsScrollview  activeToday />
         </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(HomeHeader));


