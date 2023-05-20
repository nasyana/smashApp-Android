import Tag from "components/Tag";
import React from "react";
import { PieChart as PieChartSvg } from "react-native-svg-charts";
import { View, Text } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
const ActivitiesPieChart = (props) => {

  const colors = ["#5AC8FB", "#5856D6", "#FF5E3A", "#44DB5E", "#C644FC", "#6D819C", "#3333", "#44DB5E"];
  const { smashStore, challengesStore, challengeData } = props;
  const { insightsPlayerChallengeDoc, getPlayerChallengeData } = challengesStore;
  const { libraryActivitiesHash, kFormatter, checkInfinity } = smashStore;


  const unit = insightsPlayerChallengeDoc?.targetType == 'qty' ? challengeData?.unit : 'pts'
  const activityPoints = insightsPlayerChallengeDoc?.targetType == 'qty' ? insightsPlayerChallengeDoc.activityQuantities : insightsPlayerChallengeDoc.activityPoints || false



  const playerChallengeData = getPlayerChallengeData(insightsPlayerChallengeDoc);
  const { selectedScore, selectedTarget } = playerChallengeData;
  let chartData = activityPoints ? Object.keys(activityPoints).filter((k) => k.length > 5).map((key, index) => {

    return {
      amount: activityPoints[key],
      key: index + 1,
      label: libraryActivitiesHash?.[key]?.text?.substring(0, 27),
      svg: { fill: colors[index] },
      percent: checkInfinity(activityPoints[key] / selectedScore) * 100,
      qty: insightsPlayerChallengeDoc.activityQuantities[key]
    }

  }) : []


  if (selectedScore == 0) { return null; }
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
              valueAccessor={({ item }) => item?.amount}
              data={chartData}
              outerRadius={'95%'}
              innerRadius={'80%'}
              padAngle={0.01}
           />
           <Text M36 color28>
              {kFormatter(selectedScore || 0)}
           </Text>
           <Text R14 color6D>
              {unit}
           </Text>
        </View>
        <View centerV marginL-24>
           {chartData.map((item, index) => {
              return (
                 <View row marginB-4 key={index}>
                    <Tag
                       size={8}
                       color={item.svg.fill}
                       style={{ marginTop: 6 }}
                    />
                    <View marginL-8>
                       <Text H14 color28>
                          {item.label} ({item.qty})
                       </Text>
                       <Text R14 color6D>
                          {item?.amount}
                          {} ({item?.percent && parseInt(item?.percent)}%)
                       </Text>
                    </View>
                 </View>
              );
           })}
        </View>
     </View>
  );
};

export default inject("smashStore", "challengesStore", "challengeArenaStore")(observer(ActivitiesPieChart));
