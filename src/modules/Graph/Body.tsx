import Box from "components/Box";
import ButtonLinear from "components/ButtonLinear";
import Input from "components/Input";
import InputCalendar from "components/InputCalendar";
import LinearChart, { EnumTypeChart } from "components/LinearChart";
import Tag from "components/Tag";
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

const Body = () => {
  const [type, setType] = useState(EnumTypeChart.week);
  const [visible, open, close] = useBoolean(false);

  const { control } = useForm({
    defaultValues: {
      neck: "",
      waist: "",
      hip: "",
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
            values={["All", "Neck", "Hip", "Waist"]}
            onChange={(currentIndex) => {
              if (currentIndex === 0) {
                setType(EnumTypeChart.all);
              }
              if (currentIndex === 1) {
                setType(EnumTypeChart.week);
              }
              if (currentIndex === 2) {
                setType(EnumTypeChart.month);
              }
              if (currentIndex === 3) {
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

        <View marginH-24 marginT-24 marginB-8 centerV spread>
          <Text color6D M14>
            Latest update: Jan 12, 2018
          </Text>
          <View row>
            <View flex>
              <View row centerV>
                <Tag size={6} color={Colors.color44} />
                <Text marginL-8 M14 color6D>
                  Neck
                </Text>
              </View>
              <Text H36>
                108 <Text M18>cm</Text>
              </Text>
            </View>
            <View flex>
              <View row centerV>
                <Tag size={6} color={Colors.colorFF} />
                <Text marginL-8 M14 color6D>
                  Waist
                </Text>
              </View>
              <Text H36>
                78 <Text M18>cm</Text>
              </Text>
            </View>
            <View flex>
              <View row centerV>
                <Tag size={6} color={Colors.color58} />
                <Text marginL-8 M14 color6D>
                  Hip
                </Text>
              </View>
              <Text H36>
                105 <Text M18>cm</Text>
              </Text>
            </View>
          </View>
        </View>

        <ButtonLinear
          title="add entry"
          style={{
            // width: (width - 48) / 2,
            marginBottom: bottom,
          }}
          onPress={open}
        />
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
          name="neck"
          render={({ field: { value, onChange } }) => (
            <Input value={value} onChangeText={onChange} label="Neck (cm)" />
          )}
        />
        <Controller
          control={control}
          name="waist"
          render={({ field: { value, onChange } }) => (
            <Input value={value} onChangeText={onChange} label="Waist (cm)" />
          )}
        />
        <Controller
          control={control}
          name="hip"
          render={({ field: { value, onChange } }) => (
            <Input value={value} onChangeText={onChange} label="Hip (cm)" />
          )}
        />
        <ButtonLinear title="save entry" onPress={() => {}} />
      </Dialog>
    </View>
  );
};

export default Body;
