
import { inject, observer } from 'mobx-react';

import { View} from 'react-native-ui-lib';
import {ScrollView} from 'react-native'

import ChallengeTargetsSectionHeader from './components/ChallengeTargetsSectionHeader';

import MyTodayIncompleteChallenges from 'components/MyTodayIncompleteChallenges';
import MyTodayCompletedChallenges from 'components/MyTodayCompletedChallenges';
const TodaysTargetsList = observer(({navigation}) => {

    console.log('render todayTargetsList');
    return ( <ScrollView flex>
      <ChallengeTargetsSectionHeader />
      
      <View flex >
      
       <MyTodayIncompleteChallenges navigation={navigation}/>

       <MyTodayCompletedChallenges navigation={navigation} />
      </View>
      {/* <SectionDiv /> */}
    </ScrollView>)
});

export default inject('smashStore', 'challengesStore')(TodaysTargetsList);
