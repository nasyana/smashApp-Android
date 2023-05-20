import { FONTS } from 'config/FoundationConfig';
import { width } from 'config/scaleAccordingToDevice';
import React, { memo, useRef, useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
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
import Shimmer from 'components/Shimmer';
import AnimatedView from 'components/AnimatedView';
import {
   dayKeyToShortDay,
   getDayLabelsForPlayerChallenge,
   isInFuture,
} from 'helpers/dateHelpers';
// export const dataWeek = [
//    { x: 0, y: 74 },
//    { x: 1, y: 23 },
//    { x: 2, y: 58 },
//    { x: 3, y: 82 },
// ];
// export const dataMonth = [
//    { x: 0, y: 70 },
//    { x: 1, y: 60 },
//    { x: 2, y: 50 },
//    { x: 3, y: 10 },
//    { x: 4, y: 50 },
//    { x: 5, y: 70 },
// ];
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
const LinearChartChallengeLast7 = ({
   type = 0,
   height,
   chartColor,
   smashStore,
   graphHeight = 100,
   thisWeekKeys,
   teamsStore,
   playerChallenge,
   player,
   teamWeeksHash,
   isLegacy,
   playerWeekData,
}: Props) => {
   let hours = {};

   const {
      kFormatter,
      thisMonthSoFarKeys,
      levelColors,
      libraryActivitiesHash,
      last7Keys,
      last14Keys
   } = smashStore;

   const [loaded, setLoaded] = useState(false);

   useEffect(() => {
      setTimeout(() => {
         setLoaded(true);
      }, 400);

      return () => { };
   }, []);

   const scrollViewRef = useRef();
   const daily = playerChallenge?.daily || false;

   const dataWeek = last7Keys.map(
      (key, index) => {
         const inFuture = isInFuture(key);
         const dayNumber = index + 1;

         const dayName = dayKeyToShortDay(key)


         return {
            dayNumber,
            x: dayName,
            y:
               daily?.[key]?.qty > 0
                  ? daily?.[key]?.qty
                  : 0 || inFuture
                     ? null
                     : 0,
         };
      },
   );

   const data = dataWeek;



   let challengeColor = playerChallenge.colorStart;
   let challengeColor2 = playerChallenge.colorEnd;

   if (!loaded) {
      return (
         <Shimmer
            style={{
               height: graphHeight - 8,
               width: width - 32,
               marginHorizontal: 16,
               opacity: 0.4,
               marginBottom: 8,
               borderRadius: 7,
            }}
         />
      );
   }

   const showAxis = true;

   // get highest number
   const highest = Math.max(...data.map((d) => d.y || 0));

   // get lowest number
   const lowest = Math.min(...data.map((d) => d.y || 0));

   const middle = highest / 2;
   const horizontalTickCount = playerChallenge.duration;
   return (
      <AnimatedView fade>
         <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
         // onContentSizeChange={() =>
         //    scrollViewRef.current.scrollToEnd({ animated: true })
         // }
         >
            <View>
               <VictoryChart
                  domainPadding={8}
                  height={graphHeight}
                  width={data?.length > 21 ? width * 2 : width - 24}
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
                                 stopColor={challengeColor2}
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
                  {showAxis && (
                     <VictoryAxis
                        tickFormat={(x) =>
                           `${x}`
                        }
                        // tickValues={data.map((h) => {
                        //    return { x: h?.time || '2' };
                        // })}
                        style={styleAxisX}

                        tickCount={horizontalTickCount}
                     />
                  )}
                  {showAxis && (
                     <VictoryAxis
                        dependentAxis
                        tickFormat={(x) => `${kFormatter(x)}`}
                        maxDomain={1000}
                        tickValues={[lowest, middle, highest,]}
                        style={styleAxisY}
                        tickCount={3}
                     />
                  )}
                  {(type === EnumTypeChart.week ||
                     type === EnumTypeChart.all) && (
                        <VictoryArea
                           style={{
                              data: {
                                 stroke: challengeColor || '#5856D6',
                                 strokeWidth: 2,
                                 fill: 'url(#myGradient)',
                                 zIndex: 1,
                              },
                           }}
                           data={data}
                        />
                     )}

                  {(type === EnumTypeChart.week ||
                     type === EnumTypeChart.all) && (
                        <VictoryScatter
                           style={{
                              data: {
                                 stroke: challengeColor || '#5856D6',
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
                                 stroke: challengeColor2 || '#44DB5E',
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
                                 stroke: challengeColor || '#FF5E3A',
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
         </ScrollView>
      </AnimatedView>
   );
};
export default inject(
   'smashStore',
   'challengesStore',
)(observer(LinearChartChallengeLast7));
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
