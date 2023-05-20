import Header from "components/Header";
import { FONTS } from "config/FoundationConfig";
import { shadow, width } from "config/scaleAccordingToDevice";
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { View, Assets, Colors } from 'react-native-ui-lib';
import {ScrollView} from 'react-native';
import Stats from './Stats';
import DailyBarChart from '../../components/DailyBarChart';
import Breakdown from './Breakdown';
import Recent from './Recent';
import MeToday from './MeToday';
import Timeline from '../Timeline';
import Leaders from './Leaders';
import TabControllerScreen from './TabControllerScreen';
import Firebase from "config/Firebase";
import TimelineToday from "modules/PlayerStats/TimelineToday";
import { dayKeyToHuman } from "helpers/dateHelpers";
import SectionDiv from "components/SectionDiv";
import firebaseInstance from "config/Firebase";
const DailyDetail = (props) => {
   const { params } = useRoute();
   const [index, setIndex] = React.useState(0);

   const [loaded, setLoaded] = useState(false);
   const [routes] = React.useState([
      { key: 'MeToday', title: 'Me Today' },
      { key: 'Leaders', title: 'Leaders' },
   ]);
   const focusUser = params?.focusUser || false;
   const showHeader = props?.routes?.params?.showHeader;
   const user = props?.routes?.params?.user;
   const dayKey = params?.dayKey || 'nadda';

   const otherUid = params?.uid || false;


   // get uid from Firebase.auth.currentUser.uid
   const { uid } = firebaseInstance.auth.currentUser;  

   const renderScene = SceneMap({
      MeToday: MeToday,
      Leaders: Leaders,
   });

   useEffect(() => {
      const timout = setTimeout(() => {
         setLoaded(true);
      }, 400);

      return () => {
         if (timout) {
            clearTimeout(timout);
         }
      };
   }, []);



   return (
      <View flex>
         <Header
            title={'Single Day View'}
            back
            
         />
         <ScrollView>
            <SectionDiv transparent height={24} />
         <MeToday
            date={dayKey}
            key={dayKey}
            // focusUser={focusUser}
            uid={otherUid || uid}
         />
      
         {/* <TimelineToday uid={uid} /> */}
         {/* {loaded && (
            <TabControllerScreen
               showHeader={showHeader}
               focusUser={focusUser}
            />
         )} */}
         </ScrollView>
      </View>
   );
};

export default DailyDetail;
