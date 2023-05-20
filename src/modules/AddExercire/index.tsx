import ButtonLinear from 'components/ButtonLinear';
import Header from 'components/Header';
import Input from 'components/Input';
import {width} from 'config/scaleAccordingToDevice';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {View, Text, Colors} from 'react-native-ui-lib';

const AddExercire = () => {
  const {control} = useForm({
    defaultValues: {
      name: '',
      calories: '',
      duration: '',
    },
  });

  return (
    <View flex>
      <Header title={'User’s Exercise'} back />
      <View
        paddingT-0
        backgroundColor={Colors.white}
        margin-16
        style={{
          borderRadius: 6,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        }}>
        <Text marginV-12 H14 color28 uppercase marginL-16>
          Basic Infomation
        </Text>
        <View height={1} backgroundColor={Colors.line} marginB-16 />
        <Controller
          control={control}
          name="name"
          render={({field: {value, onChange}}) => (
            <Input
              value={value}
              onChangeText={onChange}
              label={'Exercise Name'}
              parentStyle={{marginHorizontal: 16, width: width - 64}}
            />
          )}
        />
        <Controller
          control={control}
          name="calories"
          render={({field: {value, onChange}}) => (
            <Input
              value={value}
              onChangeText={onChange}
              label={'Calories Burn (cal)'}
              parentStyle={{marginHorizontal: 16, width: width - 64}}
            />
          )}
        />
        <Controller
          control={control}
          name="duration"
          render={({field: {value, onChange}}) => (
            <Input
              value={value}
              onChangeText={onChange}
              label={'Duration'}
              parentStyle={{marginHorizontal: 16, width: width - 64}}
            />
          )}
        />
      </View>
      <ButtonLinear
        title={'add to plan'}
        onPress={() => {}}
        style={{marginTop: 50}}
      />
    </View>
  );
};

export default AddExercire;

const styles = StyleSheet.create({});
