import { FONTS } from "config/FoundationConfig";
import { width } from "config/scaleAccordingToDevice";
import React from "react";
import { View, Colors } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
import { VictoryChart, VictoryAxis, VictoryBar } from "victory-native";
class ActivitiesBarChart extends React.PureComponent {
  render() {

    const { smashStore, challengesStore } = this.props;

    const { libraryActivitiesHash, dayLabels } = smashStore;
    const { insightsPlayerChallengeDoc } = challengesStore;
    const activityPoints = insightsPlayerChallengeDoc.activityPoints || false;
    let labels = activityPoints ? Object.keys(activityPoints).map((key) => libraryActivitiesHash?.[key]?.text.substring(0, 7)) : ['nada', 'nada2'];
    let values = activityPoints ? Object.values(activityPoints).map((value) => value) : [222, 322]

    delete activityPoints.score;
    const data = Object.keys(activityPoints).map((key, index) => {

      return {

        quarter: index + 1,
        earnings: activityPoints[key]
      }
    })

    const colors = [
      Colors.color5A,
      Colors.color58,
      Colors.colorFF,
      Colors.color44,
      Colors.colorD8,
      Colors.color40,
    ];

    return (
      <View
        style={{
          width: width - 64,
          height: 300,
          marginHorizontal: 16,
          marginTop: 24,
        }}
      >
        <VictoryChart
          domainPadding={15}
          height={300}
          width={width - 64}
          padding={{ top: -40, bottom: 40, left: 40, right: 20 }}
        >
          <VictoryAxis
            tickFormat={labels}
            style={{
              axis: { stroke: "#E9E9E9" },
              axisLabel: { fontSize: 20, padding: 20 },
              ticks: { stroke: "#E9E9E9", size: 5 },
              tickLabels: {
                fontSize: 12,
                padding: 5,
                fill: "#282C37",
                fontFamily: FONTS.black,
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => `${x}`}
            maxDomain={2000}
            tickValues={values}
            style={{
              axis: { stroke: "transparent" },
              axisLabel: { fontSize: 20, padding: 30 },
              grid: { stroke: "#E9E9E9" },
              tickLabels: {
                fontSize: 10,
                padding: 16,
                fill: "#6D819C",
                fontFamily: FONTS.medium,
              },
            }}
          />
          <VictoryBar
            data={data}
            x="quarter"
            y="earnings"
            barWidth={44}
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

export default inject("smashStore", "challengesStore")(observer(ActivitiesBarChart));
