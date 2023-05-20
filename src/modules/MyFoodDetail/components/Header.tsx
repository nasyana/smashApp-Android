import {useNavigation} from '@react-navigation/core';
import {heightHeader} from 'config/scaleAccordingToDevice';
import React from 'react';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {View, Button, Assets} from 'react-native-ui-lib';
const Header = () => {
  const {goBack} = useNavigation();
  return (
    <View
      height={heightHeader}
      backgroundColor="transparent"
      row
      style={{
        paddingTop: getStatusBarHeight(),
        justifyContent: 'space-between',
        position: 'absolute',
        width: '100%',
        zIndex: 1,
      }}>
      <Button
        iconSource={Assets.icons.ic_back}
        link
        color="#FFF"
        marginL-16
        onPress={goBack}
      />
      <View row>
        <Button
          iconSource={Assets.icons.ic_edit}
          link
          color="#FFF"
          marginR-32
        />
        <Button
          iconSource={Assets.icons.ic_share}
          link
          color="#FFF"
          marginR-16
        />
      </View>
    </View>
  );
};

export default Header;
