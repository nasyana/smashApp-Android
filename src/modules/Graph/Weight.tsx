import Box from "components/Box";
import ButtonLinear from "components/ButtonLinear";
import Input from "components/Input";
import InputCalendar from "components/InputCalendar";
import LinearChart, { EnumTypeChart } from "components/LinearChart";
import { FONTS } from "config/FoundationConfig";
import { bottom, width } from "config/scaleAccordingToDevice";
import useBoolean from "hooks/useBoolean";
import SegmentControl from "libs/react-native-segment";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import {
  View,
  Text,
  Assets,
  Colors,
  Dialog,
  PanningProvider,
  Button,
} from "react-native-ui-lib";

const Weight = () => {
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

        <View row marginH-24 marginT-24 marginB-8 centerV spread>
          <View>
            <Text color6D M14>
              Latest weight, Jan 22
            </Text>
            <Text color28 B64>
              74
            </Text>
          </View>
          <ButtonLinear
            title="add entry"
            style={{
              width: (width - 48) / 2,
              marginRight: 0,
            }}
            onPress={open}
          />
        </View>

        <View row marginH-24>
          <View flex>
            <Text color6D M14>
              Start weight, Dec 13
            </Text>
            <Text color28 B24>
              72.8 kg
            </Text>
          </View>
          <View flex marginL-10>
            <Text color6D M14>
              Goal weight
            </Text>
            <Text color28 B24>
              80 kg
            </Text>
          </View>
        </View>
        <View row marginH-24 marginT-16>
          <View flex>
            <Text color6D M14>
              Start weight, Dec 13
            </Text>
            <Text color28 B24>
              72.8 kg
            </Text>
          </View>
          <View flex marginL-10>
            <Text color6D M14>
              Goal weight
            </Text>
            <Text color28 B24>
              80 kg
            </Text>
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

export default Weight;
