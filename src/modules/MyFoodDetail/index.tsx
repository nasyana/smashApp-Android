import Box from "components/Box";
import ButtonLinear from "components/ButtonLinear";
import Header from "./components/Header";
import ItemFoodDetail from "components/ItemFoodDetail";
import { FONTS } from "config/FoundationConfig";
import { bottom, width } from "config/scaleAccordingToDevice";
import useBoolean from "hooks/useBoolean";
import React, { useState } from "react";
import { ImageBackground, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Colors,
  Button,
  Assets,
  Image,
  Dialog,
  PanningProvider,
} from "react-native-ui-lib";
import PieChart from "components/PieChart";
const MyFoodDetail = () => {
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
  const DATA_MEAL = [
    {
      img: Assets.icons.ic_breakfast,
      title: "Breakfast",
    },
    {
      img: Assets.icons.ic_lunch,
      title: "Lunch",
    },
    {
      img: Assets.icons.ic_dinner,
      title: "Dinner",
    },
    {
      img: Assets.icons.ic_snack,
      title: "Snack",
    },
  ];
  const [visible, open, close] = useBoolean(false);
  const [indexSelectMeal, setIndexSelectMeal] = useState(-1);
  return (
    <View flex backgroundColor={Colors.background}>
      <Header />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <ImageBackground
          source={Assets.icons.food_detail}
          style={{
            width: width,
            height: (width / 375) * 300,
            justifyContent: "flex-end",
            paddingLeft: 16,
            paddingBottom: 16,
          }}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.01)", "rgba(0,0,0,0.5)"]}
            style={{
              width: width,
              height: (width / 375) * 300,
              position: "absolute",
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Text M24 white marginB-8>
            Grilled Worcestershire Steak
          </Text>
          <View row centerV>
            <Image source={Assets.icons.ic_level} />
            <Text R14 white marginL-4>
              Meat
            </Text>
          </View>
        </ImageBackground>
        <View height={16} />
        <Box>
          <View row padding-16>
            <View
              flex
              paddingV-8
              paddingH-16
              style={{
                borderRadius: 4,
                borderWidth: 1,
                borderColor: Colors.line,
              }}
            >
              <Text M12 color={Colors.color58}>
                Serving
              </Text>
              <Text H16 color28>
                1
              </Text>
            </View>
            <View width={16} />
            <View
              flex
              paddingV-8
              paddingH-16
              style={{
                borderRadius: 4,
                borderWidth: 1,
                borderColor: Colors.line,
              }}
            >
              <Text M12 color={Colors.color58}>
                Serving Size
              </Text>
              <Text H16 color28>
                Oz (250g)
              </Text>
            </View>
          </View>
          <View row paddingT-8 paddingB-16 paddingH-16 centerV>
            <Text M36 color28 marginL-8>
              1
            </Text>
            <Image source={Assets.icons.ic_x} marginL-8 />
            <Text M36 color28 marginL-8>
              256 Cal
            </Text>
          </View>
        </Box>
        <Box>
          <View flex row>
            <PieChart />
          </View>
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
        <View height={16} />
        <Box>
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

        <ButtonLinear title="add to diary" onPress={() => open()} />
      </ScrollView>

      <Dialog
        panDirection={PanningProvider.Directions.DOWN}
        visible={visible}
        onDismiss={close}
        overlayBackgroundColor={Colors.Black54}
        containerStyle={{
          justifyContent: "flex-end",
          backgroundColor: Colors.white,
          width: "100%",
          paddingBottom: bottom,
        }}
        width="100%"
        bottom
      >
        <View
          row
          paddingH-16
          paddingT-13
          paddingB-11
          style={{
            justifyContent: "space-between",
          }}
        >
          <Text H14 color28 uppercase>
            Select a meal
          </Text>
          <Button
            iconSource={Assets.icons.ic_delete_day}
            link
            color={Colors.buttonLink}
            onPress={() => close()}
          />
        </View>
        <View height={1} backgroundColor={Colors.line} />
        <View
          paddingT-24
          paddingB-32
          paddingH-24
          row
          style={{ justifyContent: "space-between" }}
        >
          {DATA_MEAL.map((item, index) => {
            let active = indexSelectMeal === index;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setIndexSelectMeal(index)}
              >
                <View centerH>
                  <View
                    width={56}
                    height={56}
                    marginB-8
                    style={{
                      borderRadius: 28,
                      borderWidth: 1,
                      borderColor: Colors.line,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image source={item.img} />
                  </View>
                  <Text R14 color={active ? Colors.buttonLink : Colors.color6D}>
                    {item.title}
                  </Text>
                  {active && (
                    <Image
                      source={Assets.icons.selected_mask}
                      style={{
                        position: "absolute",
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <ButtonLinear title="Add" onPress={() => {}} />
      </Dialog>
    </View>
  );
};

export default MyFoodDetail;
