import Box from "components/Box";
import ButtonLinear from "components/ButtonLinear";
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
import Header from "modules/MyFoodDetail/components/Header";
import ItemFood from "components/ItemFood";
import Input from "components/Input";
import { Controller, useForm } from "react-hook-form";
const MyRecipeDetail = () => {
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

  const { control } = useForm({
    defaultValues: {
      serving: "",
    },
  });

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
          <Text marginT-13 marginB-11 marginL-16 uppercase H14>
            INGREDIENT RECIPE
          </Text>
          <View height={1} backgroundColor={Colors.line} />
          <ItemFood />
          <View height={1} backgroundColor={Colors.line} />
          <ItemFood />
        </Box>
        <Box>
          <Text marginT-13 marginB-11 marginL-16 uppercase H14>
            DIRECTIONS
          </Text>
          <View height={1} backgroundColor={Colors.line} />

          <Text R14 color28 style={{ lineHeight: 21 }} margin-16>
            1. Preheat oven to 400 F.{"\n"}2. Bring sauce ingredients to a boil
            over stovetop, then simmer 30-45 minutes.{"\n"}3. Remove sausage
            casing and brown meat in skillet over medium heat, breaking it up
            with a turner or spatula as it cooks.{"\n"}4. Spray a cookie sheet
            with cooking spray and bake pita for 10 minutes or until slightly
            stiff, but not crispy.{"\n"}5. Take out pita, and turn oven up to
            500 F.{"\n"}6. Place pita on a cookie sheet and cover with sauce,
            cheese, sausage, and veggies, in that order.
            {"\n"}7. Put back in the oven at 500 F for 5-7 minutes, watching
            closely. Pizza is done when crust is crispy and cheese is melted.
            {"\n"}8. Top with parmesan and red pepper. Devour the entire thing!
          </Text>
        </Box>
        <Box>
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
            Option
          </Text>
          <Button
            iconSource={Assets.icons.ic_delete_day}
            link
            color={Colors.buttonLink}
            onPress={() => close()}
          />
        </View>
        <View height={1} backgroundColor={Colors.line} marginB-16 />
        <Controller
          control={control}
          name="serving"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              label="No. of Serving"
              parentStyle={{ marginHorizontal: 16 }}
            />
          )}
        />
        <Text R14 color28 marginL-16>
          Select Meals
        </Text>
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

export default MyRecipeDetail;
