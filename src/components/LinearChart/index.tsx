import { FONTS } from "config/FoundationConfig";
import { width } from "config/scaleAccordingToDevice";
import React, { memo } from "react";
import { StyleSheet, Dimensions } from 'react-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Text, View } from 'react-native-ui-lib';
import { moment } from 'helpers/generalHelpers';;
import SmashItemLog from 'components/SmashItemLog';
import SelectedHour from './SelectedHour';
import {
   VictoryArea,
   VictoryAxis,
   VictoryChart,
   VictoryScatter,
   VictoryLabel
} from 'victory-native';
export const dataWeek = [
   { x: 0, y: 74 },
   { x: 1, y: 23 },
   { x: 2, y: 58 },
   { x: 3, y: 82 },
   { x: 4, y: 58 },
   { x: 5, y: 74 },
   { x: 6, y: 74 },
   { x: 7, y: 83 },
   { x: 8, y: 58 },
   { x: 9, y: 82 },
   { x: 10, y: 58 },
   { x: 11, y: 74 },
   { x: 12, y: 74 },
   { x: 13, y: 70 },
   { x: 14, y: 58 },
   { x: 15, y: 82 },
   { x: 16, y: 58 },
   { x: 17, y: 74 },
   { x: 18, y: 54 },
   { x: 19, y: 60 },
   { x: 20, y: 74 },
   { x: 21, y: 44 },
   { x: 22, y: 64 },
   { x: 23, y: 14 },
   { x: 24, y: 114 },
];
export const dataMonth = [
   { x: 0, y: 70 },
   { x: 1, y: 60 },
   { x: 2, y: 50 },
   { x: 3, y: 10 },
   { x: 4, y: 50 },
   { x: 5, y: 70 },
];
export const dataYear = [
   { x: 0, y: 80 },
   { x: 1, y: 70 },
   { x: 2, y: 68 },
   { x: 3, y: 90 },
   { x: 4, y: 60 },
   { x: 5, y: 80 },
];

export enum EnumTypeChart {
   week = 0,
   month = 1,
   year = 2,
   all = 3,
}
interface Props {
   type: EnumTypeChart;
}
const LinearChartThisWeek = memo(
   ({
      type,
      height,
      chartColor,
      smashes,
      smashStore,
      isToday
      
   }: Props) => {

      let hours = {};

      const { levelColors,selectedHour,setSelectedHour } = smashStore;

      let nowHourKey = isToday ? moment().format('H') : moment().endOf('day').format('H');

      for (let index = 0; index < 24; index++) {
         hours[index] = {
            x: index,
            y: 0,
            time: moment(index, 'H').format('ha'),
         };
      }

      const MyCustomComponent = ({ datum }) => {
         return (
           <Text>`x: ${datum.x}, y: ${datum.y}`</Text>
         );
       };


      if (smashes) {
         smashes.forEach((completion, index) => {
            const pointsEarned =
               parseInt(completion.multiplier) * parseInt(completion.points);
            let hourKey = moment(completion.timestamp, 'X').format('H');
            let hourKeyTwo = moment(completion.timestamp, 'X').format('ha');
            hours[hourKey].y = parseInt(hours[hourKey]?.y) + pointsEarned || 0;
            hours[hourKey].x = hourKeyTwo;
            hours[hourKey].timestamp = completion?.timestamp;
            hours[hourKey].uid = completion?.uid;
         });
      } 

      const data = smashes
         ? Object.keys(hours).map((k, i) => {
              return {
                 x: k || hours[k].x,
                 y: i > nowHourKey ? null : hours[k].y || 0,
                 time: hours[k]?.x,
                 size: k === selectedHour ? 5 : 3,
              };
           })
         : dataWeek;

      return (
         <>
            <View style={[styles.container, { height: height / 2 }]}>
               <VictoryChart
                  domainPadding={10}
                  height={height / 2}
                  width={width - 44}
                  padding={{ top: 0, bottom: 30, left: 24, right: 10 }}>
                  <Defs>
                     {(type === EnumTypeChart.week ||
                        type === EnumTypeChart.all) && (
                        <LinearGradient
                           id="myGradient"
                           x1="0%"
                           y1="0%"
                           x2="0%"
                           y2="100%">
                           <Stop
                              offset="100%"
                              stopColor={chartColor || Colors.meToday}
                              stopOpacity={0.17}
                           />
                        </LinearGradient>
                     )}
                     {/* {(type === EnumTypeChart.month ||
                        type === EnumTypeChart.all) && (
                        <LinearGradient
                           id="myGradient1"
                           x1="0%"
                           y1="0%"
                           x2="0%"
                           y2="100%">
                           <Stop
                              offset="100%"
                              stopColor="#44DB5E"
                              stopOpacity={0.17}
                           />
                        </LinearGradient>
                     )} */}
                     {/* {(type === EnumTypeChart.year ||
                        type === EnumTypeChart.all) && (
                        <LinearGradient
                           id="myGradient2"
                           x1="0%"
                           y1="0%"
                           x2="0%"
                           y2="100%">
                           <Stop
                              offset="100%"
                              stopColor="#FF5E3A"
                              stopOpacity={0.17}
                           />
                        </LinearGradient>
                     )} */}
                  </Defs>
                  <VictoryAxis
                     tickFormat={(x) => `${moment(x, 'H').format('ha')}`}
                     tickCount={8}
                     // tickValues={data.map((h) => {
                     //    return { x: h?.time || '2' };
                     // })}
                     style={styleAxisX}
                  />

               
                  {(type === EnumTypeChart.week ||
                     type === EnumTypeChart.all) && (
                     <VictoryArea
                        style={{
                           data: {
                              stroke: chartColor || Colors.meToday,
                              strokeWidth: 2,
                              fill: 'url(#myGradient)',
                              zIndex: 1,
                           },
                        }}
                        data={data}
                     />
                  )}
                

                  {/* Dots for hours */}
                  {(type === EnumTypeChart.week ||
                     type === EnumTypeChart.all) && (
                     <VictoryScatter
                     // labels={({ datum }) => datum.x}
                     // labelComponent={<VictoryLabel backgroundStyle={[{ fill: "orange" }, { fill: "gold" }]} />}
                     // dataComponent={<SelectedHour/>}
                     // labelComponent={<VictoryLabel />}
                        style={{
                           data: {
                              stroke: chartColor || Colors.meToday,
                              fill: '#FFF',
                              strokeWidth: 2,
                           },
                        }}
                        size={4}
                        data={data}
                        // events={[
                        //    {
                        //       target: "data",
                        //       eventHandlers: {
                        //          onPressIn: (event, datum) => {
                        //             setSelectedHour(datum.datum.x)
                        //          },
                        //          onPressOut: (event, datum) => {
                        //             setSelectedHour(false)
                        //          }
                        //       }
                        //    }
                        // ]}
                     />
                  )}


                  {(type === EnumTypeChart.month ||
                     type === EnumTypeChart.all) && (
                     <VictoryScatter
                        style={{
                           data: {
                              stroke: '#44DB5E',
                              fill: '#FFF',
                              strokeWidth: 2,
                           },
                        }}
                        size={4}
                        data={dataMonth}
                     />
                  )}
                  {(type === EnumTypeChart.year ||
                     type === EnumTypeChart.all) && (
                     <VictoryScatter
                        style={{
                           data: {
                              stroke: '#FF5E3A',
                              fill: '#FFF',
                              strokeWidth: 2,
                           },
                        }}
                        size={4}
                        data={dataYear}
                     />
                  )}
               </VictoryChart>
            </View>
          
            <SelectedHour />
         </>
      );
   },
);
export default LinearChartThisWeek;
const styleAxisX = {
   axis: { stroke: '#E9E9E9' },
   axisLabel: { fontSize: 20, padding: 20 },
   tickLabels: {
      fontSize: 10,
      padding: 8,
      fill: '#6D819C',
      fontFamily: FONTS.medium,
   },
};
const styleAxisY = {
   axis: { stroke: 'transparent' },
   axisLabel: { fontSize: 20, padding: 30 },
   grid: { stroke: '#E9E9E9' },
   tickLabels: {
      fontSize: 10,
      padding: 8,
      fill: '#6D819C',
      fontFamily: FONTS.medium,
   },
};
const styles = StyleSheet.create({
   container: {
      justifyContent: 'center',

      width: width,
   },
   chartStyle: {
      backgroundColor: Colors.white,
      flex: 1,
   },
});
