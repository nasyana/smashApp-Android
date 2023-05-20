import { FONTS } from 'config/FoundationConfig';
import { width } from 'config/scaleAccordingToDevice';
import React, { memo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Text, View } from 'react-native-ui-lib';
import { moment } from 'helpers/generalHelpers';;
import { inject, observer } from 'mobx-react';
import {
   VictoryArea,
   VictoryAxis,
   VictoryChart,
   VictoryScatter,
} from 'victory-native';
import SectionHeader from 'components/SectionHeader';
// export const dataWeek = [
//    { x: 0, y: 74 },
//    { x: 1, y: 23 },
//    { x: 2, y: 58 },
//    { x: 3, y: 82 },
// ];
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
const LinearChart = ({
   type = EnumTypeChart.week,
   height,
   chartColor,
   smashStore,
   activityMasterId = '',
   teamsStore,
   baseActivityId = false,
}: Props) => {
   let hours = {};

   const { kFormatter } = smashStore;

   const { last7Days, last7DaysShort, currentUser, libraryActivitiesHash } = smashStore;

   const baseActivity = libraryActivitiesHash?.[baseActivityId] || false;
   let data = last7Days.map((d, index) => {
      const dayKey = d?.dayKey;

      if(baseActivityId){

         return {
            x:
               last7DaysShort[index] +
                  (currentUser?.feelings?.[dayKey]?.emoji || '') || 'nope',
            y: d?.baseActivityQuantities?.[activityMasterId] || 0,
         };
      }
      return {
         x:
            last7DaysShort[index] +
               (currentUser?.feelings?.[dayKey]?.emoji || '') || 'nope',
         y: d?.activityQuantities?.[activityMasterId] || 0,
      };
   });

   const highest = Math.max(...data.map((d) => d.y || 0));

   // get lowest number
   const lowest = Math.min(...data.map((d) => d.y || 0));

   const middle = highest / 2;
   return (
      <>

      {baseActivityId && <SectionHeader
               title={`${baseActivity.text}`}
               style={{ marginTop: 16 }}
            />}
         <View>
            <VictoryChart
               domainPadding={20}
               height={100}
               width={width - 44}
               padding={{ top: 0, bottom: 30, left: 42, right: 10 }}>
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
                           stopColor={chartColor || baseActivityId ? Colors.smashPink : '#5856D6'}
                           stopOpacity={0.17}
                        />
                     </LinearGradient>
                  )}
                  {(type === EnumTypeChart.month ||
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
                  )}
                  {(type === EnumTypeChart.year ||
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
                  )}
               </Defs>
               <VictoryAxis
                  tickFormat={(x) => `${x}`}
                  // tickValues={data.map((h) => {
                  //    return { x: h?.time || '2' };
                  // })}
                  style={styleAxisX}
               />
               <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => `${kFormatter(x)}`}
                  maxDomain={1000}
                  // tickValues={data.map((h) => h.y)}
                  tickValues={[lowest, middle, highest]}
                  style={styleAxisY}
               />
               {(type === EnumTypeChart.week || type === EnumTypeChart.all) && (
                  <VictoryArea
                     style={{
                        data: {
                           stroke: chartColor || baseActivityId ? Colors.smashPink : '#5856D6',
                           strokeWidth: baseActivityId ? 2 : 2,
                           fill: 'url(#myGradient)',
                           zIndex: 1,
                        },
                     }}
                     data={data}
                  />
               )}
               {(type === EnumTypeChart.month ||
                  type === EnumTypeChart.all) && (
                  <VictoryArea
                     style={{
                        data: {
                           stroke: '#44DB5E',
                           strokeWidth: 2,
                           fill: 'url(#myGradient1)',
                           zIndex: 1,
                        },
                     }}
                     data={dataMonth}
                  />
               )}
               {(type === EnumTypeChart.year || type === EnumTypeChart.all) && (
                  <VictoryArea
                     style={{
                        data: {
                           stroke: '#FF5E3A',
                           strokeWidth: 2,
                           fill: 'url(#myGradient2)',
                           zIndex: 0,
                        },
                     }}
                     data={dataYear}
                  />
               )}
               {(type === EnumTypeChart.week || type === EnumTypeChart.all) && (
                  <VictoryScatter
                     style={{
                        data: {
                           stroke: chartColor || baseActivityId ? Colors.smashPink : '#5856D6',
                           fill: '#FFF',
                           strokeWidth: baseActivityId ? 2 : 2,
                        },
                     }}
                     size={4}
                     data={data}
                  />
               )}
               {(type === EnumTypeChart.month ||
                  type === EnumTypeChart.all) && (
                  <VictoryScatter
                     style={{
                        data: {
                           stroke: '#44DB5E',
                           fill: '#FFF',
                           strokeWidth: baseActivityId ? 2 : 2,
                        },
                     }}
                     size={4}
                     data={dataMonth}
                  />
               )}
               {(type === EnumTypeChart.year || type === EnumTypeChart.all) && (
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
      </>
   );
};
export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(LinearChart));
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
