import { FONTS } from "config/FoundationConfig";
import { width } from "config/scaleAccordingToDevice";
import React, { useEffect, useState } from "react";
import { View, Colors, Text } from "react-native-ui-lib";
import { VictoryChart, VictoryAxis, VictoryBar, VictoryLabel, VictoryTooltip } from "victory-native";
import { inject, observer } from 'mobx-react';
import XAxis from "./XAxis";
import { Alert } from "react-native";
import { dayStatusTextFromPoints } from 'helpers/generalHelpers'
class UserLast7 extends React.PureComponent {
   render() {
      const { smashStore, showVerticalAxis, goToDailyDetail = () => null, user = {}, last7Days } = this.props;
      const {  last7DaysShort, kFormatter, currentUser, getLast7ForUser } = smashStore;

   
      
      let data = [
         { quarter: 1, earnings: 168 },
         { quarter: 2, earnings: 210 },
         { quarter: 3, earnings: 303 },
         { quarter: 4, earnings: 161 },
         { quarter: 5, earnings: 161 },
         { quarter: 6, earnings: 161 },
         { quarter: 7, earnings: 210 },
      ];

      data = last7Days.map((d, index) => {
         const dayKey = d.dayKey;
         return {
            quarter:
               last7DaysShort[index] +
               (currentUser?.feelings?.[dayKey]?.emoji || '') || 'nope',
            earnings: d.score || 0,
            dayKey: dayKey
         };
      });

      const colors = [
         Colors.meToday,
         Colors.meToday,
         Colors.meToday,
         Colors.meToday,
         Colors.meToday,
         Colors.meToday,
         Colors.meToday,
      ];
      const graphHeight = this.props.height || 70;
      const chartWidth = this.props.showVerticalAxis ? width - 32 : width - 32;
      // const [loaded, setLoaded] = useState(false);
      // useEffect(() => {
      //    setTimeout(() => {
      //       setLoaded(true);
      //    }, 1000);

      //    return () => {};
      // }, []);
      // get highest number
      // const highest = Math.max(...data.map((d) => d.earnings || 0));

      // // get lowest number
      // const lowest = Math.min(...data.map((d) => d.earnings || 0));

      // const middle = highest / 2;


      const labels = data.map((d) => dayStatusTextFromPoints(d.earnings, true)) //["great", "good", "okay", "great", "good", null, null, null];
      return (
         <View

            key={data.quarter}
            style={{
               width: chartWidth,
               // height: graphHeight + 46,
               marginHorizontal: 0,
               marginTop: showVerticalAxis ? 16 : 16,
               // paddingTop: 16
            }}>
            <VictoryChart
               // animate={{
               //    duration: 500,
               //    onLoad: { duration: 200 }
               //  }}
               domainPadding={20}
               height={graphHeight + 30}
               width={chartWidth}
               padding={{
                  top: 10,
                  bottom: 40,
                  left: showVerticalAxis ? 45 : 16,
                  right: 30,
               }}>

               <VictoryAxis
                  tickFormat={(x) => `${x}`}
                  style={{
                     axis: { stroke: '#E9E9E9' },
                     axisLabel: { fontSize: 20, padding: 20 },
                     ticks: { stroke: '#E9E9E9', size: 7 },
                     tickLabels: {
                        fontSize: 12,
                        padding: 5,
                        fill: '#282C37',
                        fontFamily: FONTS.roman,
                     },
                  }}
               />


               <VictoryBar
                  cornerRadius={12}
                  labels={labels}
                  alignment="middle"
                  labelComponent={
                     <VictoryLabel backgroundPadding={4} style={[{ fontFamily: FONTS.roman, fontSize: 8 }, { color: '#ccc' }]} angle={0} />
                  }
              
                  data={data}
                  x="quarter"
                  y="earnings"
                  barWidth={width / 14}
                  events={[
                     {
                        target: "data",
                        eventHandlers: {
                           onPressIn: (event, datum) => {
                              goToDailyDetail(datum.datum.dayKey, user.uid)
                           }
                        }
                     }
                  ]}
                  style={{
                     data: {
                        fill: ({ datum }) => {
                           return colors[datum._x - 1];
                        },
                     },
                  }}
               />
            </VictoryChart>
         </View>
      );
   }
}

export default inject("smashStore", "challengesStore")(observer(UserLast7));
