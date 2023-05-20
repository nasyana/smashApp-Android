import {useNavigation} from '@react-navigation/native';
import FooterLinear from 'components/FooterLinear';
import Routes from 'config/Routes';
import {scaleH, width} from 'config/scaleAccordingToDevice';
import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, Colors} from 'react-native-ui-lib';
import SvgArrow from './components/SvgArrow';
import SvgStepSix from './components/SvgStepSix';
const StepSix = () => {
  const {navigate} = useNavigation();
  const onNext = useCallback(() => {
    navigate(Routes.MainTab);
  }, []);
  return (
    <View flex backgroundColor={Colors.contentW}>
      <Text H36 marginL-24>
        Completed!!!
      </Text>
      <Text R18 marginL-24>
        Your new plan.
      </Text>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View
          backgroundColor={'#FFF'}
          marginH-24
          style={{
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#FF6243',
            paddingTop: scaleH(24),
            paddingBottom: scaleH(20),
          }}>
          <Text R18 color28 center marginB-9>
            Your Plan is to reach your goal in
          </Text>
          <Text H36 color28 center marginB-9>
            18 Weeks
          </Text>
          <Text R18 color28 center marginB-9>
            with a daily calorie goal of
          </Text>
          <Text H36 color28 center marginB-9>
            2450 Cal
          </Text>
        </View>
        <View
          backgroundColor={'#FFF'}
          paddingH-24
          paddingV-8
          marginH-24
          row
          style={{
            borderRadius: 100,
            borderWidth: 1,
            borderColor: '#FF6243',
            alignSelf: 'center',
            marginTop: -20,
          }}>
          <Text R18 color28>
            Gain{' '}
          </Text>
          <Text B18 color28>
            0.4kg
          </Text>
          <Text R18 color28>
            /weeks
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SvgArrow />
        </View>
        <View
          style={{
            marginBottom: -((width / 275) * 268) / 2,
          }}>
          <SvgStepSix />
        </View>
      </View>
      <FooterLinear title={'LET’S START YOUR PLAN!'} onPress={onNext} />
    </View>
  );
};

export default StepSix;

const styles = StyleSheet.create({});
