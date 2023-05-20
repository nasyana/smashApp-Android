import { FONTS } from "config/FoundationConfig";
import { width } from "config/scaleAccordingToDevice";
import React from "react";
import { View, Colors, Text, Button } from "react-native-ui-lib";
import { VictoryChart, VictoryAxis, VictoryBar } from "victory-native";
import { inject, observer } from 'mobx-react';
import moment from "moment";
import Box from "components/Box";
class DailyChallengeBarChart extends React.PureComponent {
  render() {
     const { smashStore, insightsPlayerChallengeDoc } = this.props;
     const { dayLabels, challengesStore } = smashStore;

     const daily = insightsPlayerChallengeDoc.daily || false;

     const data = dayLabels[0].map((dayKey, index) => {
        return { quarter: index + 1, earnings: daily?.[dayKey]?.score || 0 };
     });

     const highestValue = Math.max.apply(
        Math,
        data.map(function (o) {
           return o.earnings;
        }),
     );

     let labels = dayLabels[0].map((key) =>
        moment(key, 'DDMMYYYY')?.format('dd')?.substring(0, 2),
     ) || ['nada', 'nada2'];

     let yValues = [];

     const blah = data.filter((o) => o > 0).map((o) => o.earnings);
     const nearestHundred = Math.ceil(highestValue / 100) * 100;
     let i = 0;

     let numberToAdd = nearestHundred > 2400 ? 300 : 200;
     while (i < nearestHundred) {
        yValues.push(i);

        i = i + numberToAdd;
     }

     const colors = [
        Colors.color5A,
        Colors.color58,
        Colors.colorFF,
        Colors.color44,
        Colors.colorFF,
        Colors.color44,
        Colors.colorFF,
        Colors.color44,
     ];

     return (
        <Box style={{ marginTop: 32 }}>
           <View
              row
              paddingH-16
              paddingV-12
              style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Text H14 color28 uppercase>
                 Stats
              </Text>
              <Button label="Last 7 Days" link color={Colors.buttonLink} />
           </View>
           <View height={1} backgroundColor={Colors.line} marginB-16 />
           <View
              style={{
                 width: width - 24,
                 height: 400,
                 marginHorizontal: 16,
                 marginTop: 24,
              }}>
              <VictoryChart
                 domainPadding={45}
                 height={400}
                 width={width - 44}
                 padding={{ top: -40, bottom: 40, left: 40, right: 20 }}>
                 <VictoryAxis
                    tickValues={labels}
                    tickFormat={(x) => `${x}`}
                    style={{
                       axis: { stroke: '#E9E9E9' },
                       axisLabel: { fontSize: 20, padding: 20 },
                       ticks: { stroke: '#E9E9E9', size: 5 },
                       tickLabels: {
                          fontSize: 12,
                          padding: 5,
                          fill: '#282C37',
                          fontFamily: FONTS.black,
                       },
                    }}
                 />
                 <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => `${x}`}
                    maxDomain={2000}
                    // tickValues={blah}
                    style={{
                       axis: { stroke: 'transparent' },
                       axisLabel: { fontSize: 20, padding: 30 },
                       grid: { stroke: '#E9E9E9' },
                       tickLabels: {
                          fontSize: 10,
                          padding: 16,
                          fill: '#6D819C',
                          fontFamily: FONTS.medium,
                       },
                    }}
                 />
                 <VictoryBar
                    data={data}
                    x="quarter"
                    y="earnings"
                    barWidth={30}
                    style={{
                       data: {
                          fill: ({ datum }) => {
                             return colors[0];
                          },
                       },
                    }}
                 />
              </VictoryChart>

              {/* <Button label="All Data" small outline center /> */}
           </View>
        </Box>
     );
  }
}

export default inject("smashStore", "challengesStore")(observer(DailyChallengeBarChart));
