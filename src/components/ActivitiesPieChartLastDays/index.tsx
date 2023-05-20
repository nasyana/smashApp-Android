import Tag from "components/Tag";
import React from "react";
import { PieChart as PieChartSvg } from "react-native-svg-charts";
import { View, Text } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
const ActivitiesPieChartToday = (props) => {

  // const colors = ["#5AC8FB", "#5856D6", "#FF5E3A", "#44DB5E", "#C644FC", "#6D819C", "#3333", "#44DB5E", "#888", "#222"];
  const { smashStore, selectedDayKey } = props;


  const { libraryActivitiesHash, kFormatter, checkInfinity, selectedDay, activity, last7Days, settings } = smashStore;
  // const activityPoints = activity?.[selectedDayKey]?.activityPoints || {}
  const colors = settings?.colors?.breakdown || ["red", "#5856D6", "#FF5E3A", "#44DB5E", "#C644FC", "#6D819C", "#3333", "#44DB5E", "#ccc", "#222"] 
  const day = activity?.[selectedDayKey] || false;

  // const score = day.score || 0

  const allActivityPoints = {};
  const allActivityQuantities = {};
  let activityPoints = {}
  let activityQuantities = {}
  let score = 0
  /// loop through all days and put each key value pair into an array. 

  for (const _day of last7Days) {

    const _activityPoints = _day.activityPoints;
    const _activityQuantities = _day.activityQuantities;
    score = score + (parseInt(_day.score) || 0)
    if (_activityPoints) {

      Object.keys(_activityPoints).forEach(key => {

        activityPoints[key] = (activityPoints[key] || 0) + _activityPoints[key];

      });
    }

    if (_activityQuantities) {

      Object.keys(_activityQuantities).forEach(key => {

        activityQuantities[key] = (activityQuantities[key] || 0) + _activityQuantities[key]

      });
    }

  }


  // last7Days.forEach(day => {

  //   allActivityPoints = { ...allActivityPoints, ...(day.allActivityPoints || {}) }

  // });




  let chartData = Object.keys(activityPoints).filter((k) => k.length > 5).map((key, index) => {



    return {
      amount: activityPoints[key],
      key: index + 1,
      label: libraryActivitiesHash?.[key]?.text?.substring(0, 18),
      svg: { fill: colors[index] },
      percent: checkInfinity(activityPoints[key] / score) * 100,
      qty: activityQuantities[key]
    }

  });


  if (selectedDay?.score == 0 || !selectedDay?.score) { return null; }
  return (
    <View paddingV-24 paddingL-24 paddingR-16 row>
      <View
        style={{
          height: 180,
          width: 180,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PieChartSvg
          style={{ height: 180, width: 180, position: "absolute" }}
          valueAccessor={({ item }) => item.amount}
          data={chartData}
          outerRadius={"95%"}
          innerRadius={"80%"}
          padAngle={0.01}
        />
        <Text M36 color28>
          {kFormatter(score || 0)}
        </Text>
        <Text R14 color6D>
          Points
        </Text>
      </View>
      <View centerV marginL-24>
        {chartData.map((item, index) => {
          return (
            <View row marginB-4 key={index}>
              <Tag size={8} color={item.svg.fill} style={{ marginTop: 6 }} />
              <View marginL-8>
                <Text H14 color28>
                  ({item.qty}) {item.label}
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
