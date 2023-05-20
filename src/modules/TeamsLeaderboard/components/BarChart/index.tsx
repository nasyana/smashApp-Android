import { FONTS } from "config/FoundationConfig";
import { width } from "config/scaleAccordingToDevice";
import React from "react";
import { View, Colors } from "react-native-ui-lib";
import { VictoryChart, VictoryAxis, VictoryBar } from "victory-native";
class BarChart extends React.PureComponent {
  render() {
    const data = [
      { quarter: 1, earnings: 168 },
      { quarter: 2, earnings: 210 },
      { quarter: 3, earnings: 303 },
      { quarter: 4, earnings: 161 },
    ];
    const colors = [
      Colors.color5A,
      Colors.color58,
      Colors.colorFF,
      Colors.color44,
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
          domainPadding={50}
          height={300}
          width={width - 64}
          padding={{ top: -40, bottom: 40, left: 40, right: 20 }}
        >
          <VictoryAxis
            tickFormat={["Fat", "Carbs", "Protein", "Others"]}
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
            maxDomain={1000}
            tickValues={[0, 200, 400, 600, 800, 1000]}
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

export default BarChart;
