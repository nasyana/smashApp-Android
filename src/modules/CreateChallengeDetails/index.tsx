import { useNavigation } from '@react-navigation/core';
import Box from 'components/Box';
import ButtonLinear from 'components/ButtonLinear';
import Header from 'components/Header';
import Input from 'components/Input';
import Tag from 'components/Tag';
import { FONTS } from 'config/FoundationConfig';
import Routes from 'config/Routes';
import { bottom, width } from 'config/scaleAccordingToDevice';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Assets, Colors, Text, Button } from 'react-native-ui-lib';
const AddNewPlanStep2 = () => {
  const DATA_COLOR = [
    { color: '#44DB5E' },
    { color: '#FF9500' },
    { color: '#5856D6' },
    { color: '#5AC8FB' },
    { color: '#D81159' },
    { color: '#FF5E3A' },
    { color: '#3B5998' },
  ];
  const DATA_DAY = [

    { day: 'Mo' },
    { day: 'Tu' },
    { day: 'We' },
    { day: 'Th' },
    { day: 'Fr' },
    { day: 'Sa' },
    { day: 'Su' },
  ];

  const [indexColor, setIndexColor] = useState(-1);
  const [indexDay, setIndexDay] = useState(-1);
  const { navigate } = useNavigation();

  const { control } = useForm({
    defaultValues: {
      name: '',
    },
  });

  return (
    <View flex>
      <Header
        title={'New Challenge - Step 2/2'}
        back
        customRight={
          <Button
            label={'DONE'}
            color={Colors.buttonLink}
            link
            labelStyle={{
              fontFamily: FONTS.heavy,
              fontSize: 16,
              fontWeight: '900',
              textTransform: 'capitalize',
            }}
          />
        }
      />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 150,
        }}>
        <Box style={{ marginTop: 16 }}>
          <View
            row
            paddingH-16
            centerV
            style={{ justifyContent: 'space-between' }}>
            <Text marginT-13 marginB-11 uppercase H14>
              challenge details
            </Text>
            <Button
              iconSource={Assets.icons.ic_delete_day}
              link
              color={Colors.buttonLink}
            />
          </View>
          <View height={1} backgroundColor={Colors.line} marginB-16 />
          {/* <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                label={'Workout Day Name'}
                parentStyle={{ marginHorizontal: 16, width: width - 64 }}
              />
            )}
          /> */}
          <Text marginL-16 R14 color28 marginB-16>
            Challenge Colour
          </Text>
          <View
            row
            paddingH-16
            marginB-24
            style={{ justifyContent: 'space-between' }}>
            {DATA_COLOR.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    borderRadius: 16,
                    width: 32,
                    height: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: Colors.buttonLink,
                    borderWidth: indexColor === index ? 2 : 0,
                  }}
                  onPress={() => setIndexColor(index)}>
                  <Tag size={24} color={item.color} />
                </TouchableOpacity>
              );
            })}
          </View>
          <Text marginL-16 R14 color28 marginB-16>
            Select Days
          </Text>
          <View
            row
            paddingH-16
            marginB-24
            style={{ justifyContent: 'space-between' }}>
            {DATA_DAY.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    borderRadius: 16,
                    width: 32,
                    height: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: Colors.buttonLink,
                    borderWidth: indexDay === index ? 2 : 0,
                  }}
                  onPress={() => setIndexDay(index)}>
                  <Text M14 color28>
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View height={1} backgroundColor={Colors.line} />

          <View height={1} backgroundColor={Colors.line} />

        </Box>
      </ScrollView>
      <ButtonLinear
        title={'create challenge'}
        onPress={() => { }}
        style={{
          position: 'absolute',
          bottom: bottom,
        }}
      />
    </View>
  );
};

export default AddNewPlanStep2;

const styles = StyleSheet.create({});
