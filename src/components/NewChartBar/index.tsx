import React, { memo } from "react";
import { TouchableOpacity, Dimensions } from "react-native";

import { FONTS } from "config/FoundationConfig";
import { View, Colors } from "react-native-ui-lib";
import Text from "../Text";
import {
  VictoryBar,
  VictoryGroup,
  VictoryLabel,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryAxis
} from "victory-native";
import moment from "moment";
import SegmentControl from 'libs/react-native-segment';
const { width, height } = Dimensions.get("window");



const NewChartBar = memo(({ graphView, data, setStep, dataSetStep, playerChallengeDoc, smashStore }: DataProps) => {


  const dayLabels = smashStore.dayLabels[graphView]

  const screens = ['Last 7', 'Last 14']
  const daily = playerChallengeDoc.daily || false;
  const newData = dayLabels.map((dayKey, index) => {

    const day = daily?.[dayKey] || false;
    const score = day?.score || 0;

    return { x: index + 1, y: 1, y0: score, date: moment(dayKey, 'DDMMYYYY').format('dd') }

  })


  const newDataStep = dayLabels.map((dayKey, index) => {

    return { x: index + 1, y: 1, y0: 2000, date: moment(dayKey, 'DDMMYYYY').format('dd') }

  })

  const colors = [
    Colors.color5A,
    Colors.color58,
    Colors.colorFF,
    Colors.color44,
  ];

  const handleArenaChange = (index) => {

    smashStore.graphView = index;

  }

  let barWidth = 24;
  let labelSize = 14
  if (smashStore.graphView == 1) {

    barWidth = 17;
    labelSize = 12;
  }

  if (smashStore.graphView == 2) {

    barWidth = 8;
    labelSize = 7
  }


  return (
    <View backgroundColor="#eee" >

      <View style={{ borderWidth: 0 }}>
        <VictoryGroup colorScale={"qualitative"} height={320} padding={56}>
          <VictoryBar
            data={newDataStep}
            cornerRadius={{ bottom: 4, top: 0 }}
            barWidth={barWidth}
            width={width}
            style={{
              labels: {
                fill: '#333',
                fontSize: labelSize
              },
              data: { fill: 'rgba(0,0,0,0.02)' },
            }}
            labels={({ datum }) => datum.date.substring(0, 1)}
            labelComponent={<VictoryLabel dy={28} />}
          />

          <VictoryBar
            data={newData}
            cornerRadius={{ bottom: 4, top: 0 }}
            barWidth={barWidth}
            style={{
              labels: {
                fill: colors[0],
              },
              data: {
                fill: ({ datum }) => {
                  if (datum.type === "setStep") {
                    return colors[0];
                  } else if (datum.y0 >= setStep) {
                    return colors[0];
                  } else if (datum.y0 > setStep / 2) {
                    return colors[0];
                  } else {
                    return colors[0];
                  }
                },
              },
            }}
            labels={({ datum }) => `${datum.y0}`}
            labelComponent={
              <VictoryTooltip
                activateData={true}
                renderInPortal={false}
                flyoutWidth={56}
                flyoutHeight={32}
                cornerRadius={4}
                pointerLength={6}
                flyoutStyle={{
                  strokeWidth: 0,
                  fill: "#FFFFFF",
                }}
                style={{
                  fill: "#1A051D",
                  fontSize: 24,
                  fontWeight: "400",
                  lineHeight: 17,
                }}
                y={80}
                dx={1}
              />
            }
          />
        </VictoryGroup>
      </View>
      <View centerH marginB-16>
        <SegmentControl
          values={screens}
          disable={false}
          backgroundColor={'#333'}
          style={{
            marginTop: 24,
            borderRadius: 10,
            width: 250,
            height: 26,
            alignSelf: "center",

          }}
          selectedIndex={smashStore.graphView}
          onChange={handleArenaChange}
        />
      </View>
    </View>
  );
});

export default NewChartBar;
