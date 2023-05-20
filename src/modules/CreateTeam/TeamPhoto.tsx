import SmartImage from 'components/SmartImage/SmartImage';
import React from 'react';
import {
    ActivityIndicator, StyleSheet,
    Image
} from 'react-native';
import {
    View, TouchableOpacity,
    Colors
} from 'react-native-ui-lib';
import { AntDesign } from '@expo/vector-icons';
import { width } from 'config/scaleAccordingToDevice';

const TeamPhoto = ({ onPressLibrary, picture, imageLoading, result }) => {
  return (
    <TouchableOpacity onPress={onPressLibrary}>
      {picture?.uri && !result && (
        <SmartImage
          uri={picture?.uri}
          preview={picture?.preview}
          isShowLottie={imageLoading}
          // lottieViewComponent={fnReturnLottieView}
          style={styles.smartImage}
        />
      )}

      {result && (
        <Image
          source={{ uri: result?.uri }}
          style={styles.smartImage}
        />
      )}

      {!picture.uri && !result && (
        <View
          style={[
            styles.smartImage,
            {
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            },
          ]}>
          {!imageLoading && (
            <View backgroundColor="white" padding-12 br100>
              <AntDesign
                name={'picture'}
                size={25}
                color={Colors.buttonLink}
              />
            </View>
          )}
          {imageLoading && (
            <ActivityIndicator size="small" color="black" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(TeamPhoto);

const styles = StyleSheet.create({
    smartImage: {
       margin: 16,
       height: 120,
       width: width - 80,
       backgroundColor: '#fafafa',
       borderRadius: 4,
       marginHorizontal: 16
    },
    inputField: { marginHorizontal: 16, width: width - 96 },
 });