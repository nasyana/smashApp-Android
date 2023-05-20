import Box from "components/Box";
import ButtonLinear from "components/ButtonLinear";
import ItemFoodDetail from "components/ItemFoodDetail";
import PieChart from "components/PieChart";
import { FONTS } from "config/FoundationConfig";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text, View, Colors, Button } from "react-native-ui-lib";

const Goal = () => {
  const DATA = [
    {
      colorTag: Colors.color5A,
      title: "Fat",
      value: "10.3 g",
      items: ["Saturated fat", "Unsaturated fat"],
    },
    {
      colorTag: Colors.color58,
      title: "Carbs",
      value: "0.8 g",
      items: ["Fiber", "Sugars"],
    },
    {
      colorTag: Colors.buttonLink,
      title: "Protein",
      value: "52.9 g",
      items: [],
    },
    {
      colorTag: Colors.color44,
      title: "Others",
      value: "10.3 g",
      items: ["Cholesterol", "Sodium", "Potassium"],
    },
  ];
  return (
    <View flex backgroundColor={Colors.background}>
      <ScrollView>
        <View height={16} />
        <Box>
          <Text M14 color6D marginH-24 marginT-24 center>
            Your current nutrition ratio
          </Text>
          <PieChart />
        </Box>
        <Box>
          <View
            row
            paddingH-16
            paddingT-13
            paddingB-11
            centerV
            style={{
              justifyContent: "space-between",
            }}
          >
            <Text H14 color28>
              Nutrition Detail
            </Text>
            <Button
              label="More Nutrition Facts"
              link
              color={Colors.buttonLink}
            />
          </View>
          <View height={1} backgroundColor={Colors.line} />
          {DATA.map((item, index) => {
            return <ItemFoodDetail item={item} key={index} />;
          })}
        </Box>
        <Box>
          <Text margin-16 M16 buttonLink>
            What's the ideal macronutrient ratio for Gain weight?
          </Text>
          <View height={1} backgroundColor={Colors.line} />
          <View row paddingH-16 paddingV-24>
            <ButtonLinear
              title="Pro"
              onPress={() => {}}
              style={{ height: 21, width: 37, marginHorizontal: 0 }}
              styleLinear={{
                paddingHorizontal: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
              styleText={{ fontSize: 10, fontFamily: FONTS.heavy }}
            />
            <View marginL-16>
              <Text R14 color28>
                More nutrition detail need Pro account.{"\n"}
                <Text buttonLink onPress={() => {}}>
                  Upgrade Now.
                </Text>
              </Text>
            </View>
          </View>
        </Box>
      </ScrollView>
    </View>
  );
};

export default Goal;
