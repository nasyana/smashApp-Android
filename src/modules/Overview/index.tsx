import Header from "components/Header";
import { FONTS } from "config/FoundationConfig";
import { shadow, width } from "config/scaleAccordingToDevice";
import React from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { View, Assets, Colors } from "react-native-ui-lib";
import { ScrollView } from "react-native"
import Stats from "./Stats";
import DailyBarChart from '../../components/DailyBarChart';
import Breakdown from "./Breakdown";
import Recent from "./Recent";
import Insights from "./Insights"
import Timeline from "../Timeline"
import Today from "./Today"
import DailyDetail from "modules/DailyDetail";
const Overview = (props) => {
   const [index, setIndex] = React.useState(0);
   const [routes] = React.useState([
      { key: 'Insights', title: 'Insights' },
      { key: 'Recent', title: 'Recent' },
   ]);

   const showHeader = props?.routes?.params?.showHeader;
   const renderScene = SceneMap({
      Breakdown: Breakdown,
      Recent: Recent,
      Stats: Stats,
      Insights: Insights,
      Today: Today,
   });
   const renderTabBar = (props) => (
      <TabBar
         {...props}
         indicatorStyle={{ backgroundColor: Colors.buttonLink }}
         style={{ backgroundColor: Colors.white, ...shadow }}
         activeColor={Colors.buttonLink}
         inactiveColor={Colors.color6D}
         labelStyle={{
            fontFamily: FONTS.heavy,
            fontSize: 14,
         }}
         pressColor={'transparent'}
      />
   );
   return (
      <View flex>
         {/* {showHeader && <Header title="Overview" back noShadow />} */}
         <Header title="Overview" back noShadow />
         <ScrollView>
            <Insights />
            {/* <DailyDetail showHeader={false} /> */}
         </ScrollView>
         {/* <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: width }}
        renderTabBar={renderTabBar}
      /> */}
      </View>
   );
};

export default Overview;
