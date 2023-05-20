import {useNavigation} from '@react-navigation/core';
import Box from 'components/Box';
import ButtonLinear from 'components/ButtonLinear';
import CalendarsList from 'components/CalendarsList';
import Header from 'components/Header';
import Input from 'components/Input';
import Routes from 'config/Routes';
import {bottom, height, width} from 'config/scaleAccordingToDevice';
import React, {useCallback, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {View, Colors, Text, Image, Assets} from 'react-native-ui-lib';
const AddNewPlan = () => {
  const {navigate} = useNavigation();
  // const [visible, open, close] = useBoolean(false);
  const [visible, setVisible] = useState('');
  const top = useRef(0);
  const topCurrent = useRef(0);

  const {control} = useForm({
    defaultValues: {
      name: '',
    },
  });

  const transY = useSharedValue(height);

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(transY.value, {
            duration: 350,
            easing: Easing.linear,
          }),
        },
      ],
    };
  });
  const onPress = useCallback(
    (position: string) => {
      if (visible) {
        transY.value = height;
        setTimeout(() => {
          setVisible('');
        }, 350);
      } else {
        setVisible(position);
        transY.value = 0;
      }
    },
    [visible],
  );
  return (
    <View flex>
      <Header title={'New Plan - Step 1/2'} back />
      <ScrollView
        onScroll={(e) => {
          topCurrent.current = top.current - e.nativeEvent.contentOffset.y;
        }}>
        <Box style={{marginTop: 16}}>
          <Text marginT-13 marginB-11 marginL-16 uppercase H14>
            basic information
          </Text>
          <View height={1} backgroundColor={Colors.line} marginB-16 />
          <Controller
            control={control}
            name="name"
            render={({field: {value, onChange}}) => (
              <Input
                value={value}
                onChangeText={onChange}
                label={'Workout Plan Name'}
                parentStyle={{marginHorizontal: 16, width: width - 64}}
              />
            )}
          />
          <View
            marginH-16
            marginB-16
            style={{
              borderRadius: 4,
              borderWidth: 1,
              borderColor: Colors.line,
            }}
            onLayout={(e) => {
              e.target.measure((x, y, width, height, pageX, pageY) => {
                top.current = pageY + height;
                topCurrent.current = pageY + height;
              });
            }}>
            <Text M12 color58 marginT-8 marginL-16 marginB-10>
              Select your date range
            </Text>
            <View row marginH-16 centerV marginB-11>
              <View flex>
                <TouchableOpacity onPress={() => onPress('start')}>
                  <Text M16 color6D>
                    Start Date
                  </Text>
                </TouchableOpacity>
              </View>
              <Image
                source={Assets.icons.ic_arr_right}
                tintColor={Colors.color28}
              />
              <View flex paddingL-16>
                <TouchableOpacity onPress={() => onPress('end')}>
                  <Text M16 color6D>
                    End Date
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Box>
        <Box>
          <Text marginT-13 marginB-11 marginL-16 uppercase H14>
            Plan Introduction
          </Text>
          <View height={1} backgroundColor={Colors.line} />

          <View
            margin-16
            paddingH-16
            paddingV-19
            style={{borderRadius: 4, borderWidth: 1, borderColor: Colors.line}}>
            <Text R14 color28 style={{lineHeight: 21}}>
              When it comes to pumping up your pecs, a mix of bench press and
              flye variations has been the go-to formula for the past 50 years.
              And we’re not about to mess with a good thing. If you want to
              change things up, you can reorder the exercises or add a fourth
              and fifth movement to the routine. This modernized version of the
              classic chest routine subs in a standard barbell bench press for
              the dumbbell bench press, adds a Hammer Strength incline press,
              swaps out cable flyes for pec deck flyes, and utilizes a few
              different set/rep schemes. It’s slightly different from the
              tried-and-true formula, but overall it’s just more of a good
              thing.
            </Text>
          </View>
        </Box>

        <ButtonLinear
          title={'next'}
          onPress={() => {
            navigate(Routes.AddNewPlanStep2);
          }}
          style={{
            marginBottom: bottom,
          }}
        />
      </ScrollView>
      <Animated.View
        style={[
          {
            width: width,
            height: height - topCurrent.current - getStatusBarHeight(),
            position: 'absolute',
            top: topCurrent.current,
          },
          style,
        ]}>
        <Image
          source={Assets.icons.arr_up}
          style={{marginLeft: visible === 'start' ? 48 : width / 2 + 16}}
        />
        <View height={2} backgroundColor={Colors.color58} />
        <CalendarsList />
      </Animated.View>
    </View>
  );
};

export default AddNewPlan;

const styles = StyleSheet.create({});
