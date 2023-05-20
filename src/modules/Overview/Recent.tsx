import Box from "components/Box";
import ButtonLinear from "components/ButtonLinear";
import ItemFoodDetail from "components/ItemFoodDetail";
import PieChart from "components/PieChart";
import Firebase from "config/Firebase";
import { FONTS } from "config/FoundationConfig";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text, View, Colors, Button } from "react-native-ui-lib";
import ActivitiesPieChartToday from "../../components/ActivitiesPieChartToday"
import TimelineFull from "../PlayerStats/TimelineFull";
import BarChart from "../../components/BarChart";
import ChallengesBreakdownList from "./components/ChallengesBreakdownList";
const Recent = (props) => {
   const DATA = [
      {
         colorTag: Colors.color5A,
         title: 'Fat',
         value: '10.3 g',
         items: ['Saturated fat', 'Unsaturated fat'],
      },
      {
         colorTag: Colors.color58,
         title: 'Carbs',
         value: '0.8 g',
         items: ['Fiber', 'Sugars'],
      },
      {
         colorTag: Colors.buttonLink,
         title: 'Protein',
         value: '52.9 g',
         items: [],
      },
      {
         colorTag: Colors.color44,
         title: 'Others',
         value: '10.3 g',
         items: ['Cholesterol', 'Sodium', 'Potassium'],
      },
   ];

   const uid = Firebase.auth.currentUser.uid;

   const { hideHeader = false, inModal = false } = props;
   return (
      <View flex backgroundColor={inModal ? '#fff' : Colors.background}>
         <ScrollView
            contentContainerStyle={{ paddingBottom: hideHeader ? 0 : 140 }}>
            {/* <View height={16} /> */}

            <View>
               {!hideHeader && (
                  <View
                     row
                     paddingH-16
                     paddingB-11
                     centerV
                     style={{
                        justifyContent: 'space-between',
                     }}>
                     <Text H14 color28>
                        Recent Activity
                     </Text>
                  </View>
               )}
               {!hideHeader && (
                  <View height={1} backgroundColor={Colors.line} />
               )}
               <TimelineFull uid={uid} team={props.team} />
            </View>
         </ScrollView>
      </View>
   );
};

export default Recent;
 