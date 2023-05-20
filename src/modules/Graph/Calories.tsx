import Box from "components/Box";
import ButtonLinear from "components/ButtonLinear";
import Input from "components/Input";
import InputCalendar from "components/InputCalendar";
import LinearChart, { EnumTypeChart } from "components/LinearChart";
import SegmentedRoundDisplay from "components/SegmentedRoundDisplay";
import { FONTS } from "config/FoundationConfig";
import { bottom, width } from "config/scaleAccordingToDevice";
import useBoolean from "hooks/useBoolean";
import SegmentControl from "libs/react-native-segment";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity } from "react-native";
import {
  View,
  Text,
  Assets,
  Colors,
  Dialog,
  PanningProvider,
  Button,
} from "react-native-ui-lib";

const Calories = () => {
  const [type, setType] = useState(EnumTypeChart.week);
  const [visible, open, close] = useBoolean(false);

  const { control } = useForm({
    defaultValues: {
      weight: "",
    },
  });
  return (
    <View flex backgroundColor={Colors.background}>
      <ScrollView>
        <Box
          style={{
            marginHorizontal: 0,
          }}
        >
          <SegmentControl
            values={["Week", "Month", "Year"]}
            onChange={(currentIndex) => {
              if (currentIndex === 0) {
                setType(EnumTypeChart.week);
              }
              if (currentIndex === 1) {
                setType(EnumTypeChart.month);
              }
              if (currentIndex === 2) {
                setType(EnumTypeChart.year);
              }
            }}
            disable={false}
            selectedIndex={0}
            style={{
              marginTop: 24,
              borderRadius: 3,
              width: 150,
              height: 26,
              alignSelf: "flex-end",
            }}
            activeSegmentStyle={{
              borderRadius: 3,
            }}
            segmentControlStyle={{
              borderRadius: 3,
            }}
            unSelectedTextStyle={{
              fontSize: 12,
              fontFamily: FONTS.heavy,
            }}
            selectedTextStyle={{
              fontSize: 12,
              fontFamily: FONTS.heavy,
            }}
          />
          <View row centerV marginL-26>
            <View height={1} backgroundColor={Colors.color6D} width={20} />
            <Text B12 marginL-6>
              GOAL
            </Text>
          </View>
          <LinearChart type={type} />
          <Text B12 marginL-30 marginB-16>
            WEEKS
          </Text>
        </Box>

        <View
          marginH-16
          marginB-16
          style={{
            borderRadius: 6,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
          }}
          backgroundColor={Colors.white}
        >
          <View
            padding-16
            row
            style={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button iconSource={Assets.icons.btn_back_day} />
            <Text R14 color28>
              Jan 6
            </Text>
            <Button iconSource={Assets.icons.btn_next_day} />
          </View>
          <View
            row
            paddingB-24
            style={{
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text M24 color28>
                2048
              </Text>
              <Text R14 color6D>
                Eaten
              </Text>
            </View>
            <View height={133} width={133}>
              <SegmentedRoundDisplay />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  borderWidth: 1,
                  borderRadius: 100,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderColor: Colors.line,
                  bottom: 0,
                  alignSelf: "center",
                }}
              >
                <Text H10 color6D>
                  Detail
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text M24 color28>
                768
              </Text>
              <Text R14 color6D>
                Burned
              </Text>
            </View>
          </View>
        </View>
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
            add entry
          </Text>
          <Button
            iconSource={Assets.icons.ic_delete_day}
            link
            color={Colors.buttonLink}
            onPress={() => close()}
          />
        </View>
        <View height={1} backgroundColor={Colors.line} marginB-16 />
        <InputCalendar calendar={() => {}} label="Date" />
        <Controller
          control={control}
          name="weight"
          render={({ field: { value, onChange } }) => (
            <Input value={value} onChangeText={onChange} label="Weight (kg)" />
          )}
        />
        <ButtonLinear title="Add" onPress={() => {}} />
      </Dialog>
    </View>
  );
};

export default Calories;
