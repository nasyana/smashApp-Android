import { FONTS } from 'config/FoundationConfig';
import { width } from 'config/scaleAccordingToDevice';
import React from 'react';
import { View, Colors, Text } from 'react-native-ui-lib';
import { VictoryChart, VictoryAxis, VictoryBar } from 'victory-native';
import { inject, observer } from 'mobx-react';
import { ScrollView } from 'react-native';
class ActivitiesBarChartSingle extends React.PureComponent {
   render() {
      const { smashStore, showVerticalAxis, activityId, color, last7 = false } = this.props;
      const {
         last7Days,
         last14Days,
         last14DaysShortWithNumber,
         last7DaysShort,
         thisMonthDaysShort,
         kFormatter,
         thisMonthDays,

      } = smashStore;
      let data = [];


      const dayToShow = last7 ? last7Days : last14Days;
      const shortLabels = last7 ? last7DaysShort : last14DaysShortWithNumber;

      data = dayToShow.map((d, index) => {
      
         return {
            quarter: index + 1 || 'nope',
            earnings: d?.activityPoints?.[activityId] || 0,
         };
      });



      const colors = [
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
         Colors.color58,
      ];
      const graphHeight = this.props.graphHeight || 60;
      const chartWidth = width - 32;
      return (
         <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={(ref) => {
               this.scrollView = ref;
            }}
            onContentSizeChange={() =>
               this.scrollView.scrollToEnd({ animated: true })
            }
            style={{
               // width: chartWidth,

               height: graphHeight,
               paddingHorizontal: 0,
               marginTop: 0,
            }}>
            <VictoryChart
               domainPadding={16}
               height={graphHeight}
               width={chartWidth * 1}
               padding={{
                  top: -40,
                  bottom: 40,
                  left: showVerticalAxis ? 45 : 0,
                  right: 30,
               }}>
               <VictoryAxis
                  tickFormat={shortLabels}
                  style={{
                     axis: { stroke: '#E9E9E9' },
                     axisLabel: {
                        fontSize: 20,
                        padding: 20,
                        transform: [{ rotate: '90deg' }],
                     },
                     ticks: { stroke: '#E9E9E9', size: 7 },
                     tickLabels: {
                        fontSize: 10,
                        padding: 5,
                        fill: '#282C37',
                        fontFamily: FONTS.black,
                     },
                  }}
               />

               {/* <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => `${kFormatter(x)}`}
                  maxDomain={1000}
                  tickValues={thisMonthDays.map((d) => d.score || 0)}
                  style={{
                     axis: { stroke: 'transparent' },
                     axisLabel: { fontSize: 20, padding: 30 },
                     grid: { stroke: '#E9E9E9' },
                     tickLabels: {
                        fontSize: 10,
                        padding: 16,
                        fill: color || '#6D819C',
                        fontFamily: FONTS.medium,
                     },
                  }}
               /> */}

               <VictoryBar
                  data={data}
                  x="quarter"
                  y="earnings"
                  barWidth={width / 22}
                  style={{
                     data: {
                        fill: ({ datum }) => {
                           return color || colors[datum._x - 1];
                        },
                     },
                  }}
               />
            </VictoryChart>

            {/* {last14DaysShort.map((r, i) => (
               <Text style={{ margin: 7 }}>{i + 1}</Text>
            ))} */}
         </ScrollView>
      );
   }
}

export default inject(
   'smashStore',
   'challengesStore',
)(observer(ActivitiesBarChartSingle));
