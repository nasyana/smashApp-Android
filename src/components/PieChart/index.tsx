import Tag from "components/Tag";
import React from "react";
import { PieChart as PieChartSvg } from "react-native-svg-charts";
import { View, Text } from "react-native-ui-lib";
const PieChart = () => {
  const data = [
    {
      key: 2,
      amount: 11,
      svg: { fill: "#5AC8FB" },
      label: "Fat",
    },
    {
      key: 3,
      amount: 4,
      svg: { fill: "#5856D6" },
      label: "Carbs",
    },
    {
      key: 4,
      amount: 74,
      svg: { fill: "#FF5E3A" },
      label: "Protein",
    },
    {
      key: 1,
      amount: 10,
      svg: { fill: "#44DB5E" },
      label: "Others",
    },
  ];

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
          data={data}
          outerRadius={"95%"}
          innerRadius={"80%"}
          padAngle={0.01}
        />
        <Text M36 color28>
          256
        </Text>
        <Text R14 color6D>
          Calories
        </Text>
      </View>
      <View centerV marginL-24>
        {data.map((item, index) => {
          return (
            <View row marginB-4 key={index}>
              <Tag size={8} color={item.svg.fill} style={{ marginTop: 6 }} />
              <View marginL-8>
                <Text H14 color28>
                  {item.label}
                </Text>
                <Text R14 color6D>
                  {item.amount}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default PieChart;
