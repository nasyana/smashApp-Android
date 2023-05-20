import { FONTS } from "config/FoundationConfig";
import { width } from "config/scaleAccordingToDevice";
import React, { memo } from "react";
import { StyleSheet, Dimensions } from 'react-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Text, View } from 'react-native-ui-lib';
import { moment } from 'helpers/generalHelpers';;

import {
   VictoryArea,
   VictoryAxis,
   VictoryChart,
   VictoryScatter,
} from 'victory-native';
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
const LinearChart = memo(
   ({
      type,
      height,
      chartColor,
      smashStore,
      thisWeekKeys,
      teamsStore,
      player,
      teamWeeksHash,
      isLegacy,
      playerWeekData,
      weekDoc = false
   }: Props) => {
      let hours = {};

      const { kFormatter, activity, levelColors, libraryActivitiesHash } =
         smashStore;

      const { selectedWeekKey } = teamsStore;

      const thisWeekDoc = weekDoc || teamWeeksHash[selectedWeekKey];

      const players = thisWeekDoc?.players || false;
      const playerWeek = players ? players?.[player?.uid] : playerWeekData;

      const daily = playerWeek?.daily || false;
      const smashes = playerWeek?.smashes || false;

      const activityPoints =
         thisWeekDoc?.players?.[player?.uid]?.activityPoints || {};
      const activityQuantities =
         thisWeekDoc?.players?.[player?.uid]?.activityQuantities || {};
      const _smashes = Object.keys(activityQuantities).map((activityId) => {
         const activity = libraryActivitiesHash?.[activityId] || false;
         return {
            activityMasterId: activityId,
            activityName: activity.text || 'noname',
            id: activityId,
            level: activity.level,
            multiplier: activityQuantities?.[activityId] || 0,
            points: activityPoints?.[activityId] || 0,
         };
      });

      const dataWeek = thisWeekKeys.map((key, index) => {
         return {
            x: moment(key, 'DDMMYYYY').format('dd') || 'y',
            y: daily?.[key]?.score || playerWeekData?.[key]?.userTotal || null,
         };
      });

      const data = dataWeek;
      // get highest number
      const highest = Math.max(...data.map((d) => d.y || 0));

      // get lowest number
      const lowest = Math.min(...data.map((d) => d.y || 0));

      const middle = highest / 2;
      return (
         <>
            <View>
               <VictoryChart
                  domainPadding={30}
                  height={height}
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
                              stopColor={chartColor || '#5856D6'}
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
                  {(type === EnumTypeChart.week ||
                     type === EnumTypeChart.all) && (
                     <VictoryArea
                        style={{
                           data: {
                              stroke: chartColor || '#5856D6',
                              strokeWidth: 2,
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
                  {(type === EnumTypeChart.year ||
                     type === EnumTypeChart.all) && (
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
                  {(type === EnumTypeChart.week ||
                     type === EnumTypeChart.all) && (
                     <VictoryScatter
                        style={{
                           data: {
                              stroke: chartColor || '#5856D6',
                              fill: '#FFF',
                              strokeWidth: 2,
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
            <View row margin-16 style={{ flexWrap: 'wrap' }}>
               {_smashes &&
                  _smashes
                     .sort((a, b) => a.level - b.level)
                     .map((s) => {
                        const color = levelColors[s.level || 0];

                        return (
                           <View
                              row
                              centerV
                              marginR-8
                              backgroundColor={'transparent'}
                              style={{
                                 borderWidth: 0.5,
                                 borderColor: Colors.color6D,
                                 borderRadius: 20,
                                 paddingVertical: 4,
                                 paddingHorizontal: 7,
                                 marginBottom: 7,
                              }}>
                              <View
                                 style={{
                                    height: 5,
                                    width: 5,
                                    backgroundColor: color || '#333',
                                    borderRadius: 4,
                                    marginRight: 4,
                                 }}
                              />
                              <Text secondaryContent R12>
                                 {s.activityName || 'nope'} x {s.multiplier}
                              </Text>
                           </View>
                        );
                     })}
            </View>
         </>
      );
   },
);
export default LinearChart;
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
