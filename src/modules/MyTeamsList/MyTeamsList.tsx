import { View, Text } from 'react-native-ui-lib';
import React from 'react';
import { ScrollView } from 'react-native';
import Header from 'components/Header';
import MyTeams from 'modules/MyTeams';
import TeamsTodayTargetsList from 'modules/Home/TeamsTodayTargetsList';
const MyTeamsList = () => {
   return (
      <View flex backgroundColor={'#333'}>
         <Header back title="My Teams" />
         {/* <MyTeams full /> */}
         {/* <ScrollView contentContainerStyle={{ paddingTop: 16 }}> */}
         <TeamsTodayTargetsList />
         {/* </ScrollView> */}
      </View>
   );
};

export default MyTeamsList;
