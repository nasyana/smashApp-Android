import Header from 'components/Header';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import {
   View,
   Text,
   Button,
   Assets,
   Colors,
   TouchableOpacity,
} from 'react-native-ui-lib';
import { inject, observer } from 'mobx-react';
import HomeHeaderWithSearch from 'components/HomeHeaderWithSearch';
import ListTeams from '../Home/ListTeams'

const TeamMainScreen = (props) => {


   const [loaded, setLoaded] = useState(false);
   // delay loading of screen for 500 ms
   useEffect(() => {
      setTimeout(() => {
       setLoaded(true)
      }, 200);
   }, []);

   // console.warn(loaded);
   
   return (
      <View flex>
         <HomeHeaderWithSearch
            back={false}
            team
         />
     
        {loaded ? <ListTeams /> : <View flex center><ActivityIndicator size={'large'} /></View>}
         {/* <HomeTeamScreensNew /> */}
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(TeamMainScreen));

const styles = StyleSheet.create({});
