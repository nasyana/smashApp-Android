import Tag from "components/Tag";
import React from "react";
import { PieChart as PieChartSvg } from "react-native-svg-charts";
import { View, Text } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
const ActivitiesPieChartToday = (props) => {

  // const colors = ["#5AC8FB", "#5856D6", "#FF5E3A", "#44DB5E", "#C644FC", "#6D819C", "#3333", "#44DB5E", "#ccc", "#222"];
  const { smashStore, date } = props;


  const {
     libraryActivitiesHash,
     kFormatter,
     checkInfinity,
     selectedDay,
     activity,
     settings,
     stringLimit,
  } = smashStore;

  const colors = settings?.colors?.breakdown || [
     'red',
     '#5856D6',
     '#FF5E3A',
     '#44DB5E',
     '#C644FC',
     '#6D819C',
     '#3333',
     '#44DB5E',
     '#ccc',
     '#222',
  ];
  const activityPoints = activity?.[date]?.activityPoints || {};
  const activityQuantities = activity?.[date]?.activityQuantities || {};

  const day = activity?.[date] || false;

  const score = day.score || 0;

  let chartData = Object.keys(activityPoints)
     .filter((k) => k.length > 5)
     .map((key, index) => {
        return {
           amount: activityPoints[key],
           key: index + 1,
           label: libraryActivitiesHash?.[key]?.text?.substring(0, 15),
           svg: { fill: colors[index] },
           percent: checkInfinity(activityPoints[key] / score) * 100,
           qty: activityQuantities[key],
        };
     });

  if (!day?.score) {
     return (
        <View paddingV-24 paddingL-24 paddingR-16 row>
           <View
              style={{
                 height: 180,
                 flex: 1,
                 alignItems: 'center',
                 justifyContent: 'center',
              }}>
              {/* 
        <Text M36 color28>
          Nothing smashed yet today...
        </Text> */}
              <Text R14 color6D center>
                 Nothing smashed...
              </Text>
           </View>
        </View>
     );
  }

  return (
     <View paddingV-24 paddingL-24 paddingR-16 row>
        <View
           style={{
              height: 180,
              width: 180,
              alignItems: 'center',
              justifyContent: 'center',
           }}>
           <PieChartSvg
              style={{ height: 180, width: 180, position: 'absolute' }}
              valueAccessor={({ item }) => item.amount}
              data={chartData}
              outerRadius={'95%'}
              innerRadius={'80%'}
              padAngle={0.01}
           />
           <Text M36 color28>
              {kFormatter(day?.score || 0)}
           </Text>
           <Text R14 color6D>
              Points
           </Text>
        </View>
        <View centerV marginL-24>
           {chartData
              .sort((b, a) => a.percent - b.percent)
              .map((item, index) => {
                 return (
                    <View row marginB-4 key={index}>
                       <Tag
                          size={8}
                          color={item.svg.fill}
                          style={{ marginTop: 6 }}
                       />
                       <View marginL-8>
                          <Text H14 color28>
                             {item.qty > 0 ? item.qty : 1} x{' '}
                             {stringLimit(item.label, 8)}
                          </Text>
                          <Text R14 color6D>
                             {item.amount}pts ({parseInt(item.percent)}%)
                          </Text>
                       </View>
                    </View>
                 );
              })}
        </View>
     </View>
  );
};

export default inject("smashStore", "challengesStore", "challengeArenaStore")(observer(ActivitiesPieChartToday));
