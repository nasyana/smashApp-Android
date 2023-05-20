/* @flow */
import * as _ from 'lodash';
import * as React from 'react';

import {
  View,
  Image as RNImage,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import {BlurView} from 'expo-blur';
import {LinearGradient} from 'expo-linear-gradient';

import CacheManager from './components/CacheManager';

type ImageProps = {
  style?: Style,
  defaultSource?: ImageSource,
  preview?: string,
  uri: string,
  isShowLottie?: boolean,
  lottieViewComponent?: any,
};

type ImageState = {
  uri: ?string,
  intensity: Animated.Value,
};

export default class Image extends React.Component<ImageProps, ImageState> {
  state = {
    uri: undefined,
    intensity: new Animated.Value(100),
    noUri: false,
  };

  async load({uri}: ImageProps): Promise<void> {
    if (uri?.length > 10) {
      const entry = CacheManager.get(uri);
      const path = await entry.getPath();
      if (path) {
        this.setState({uri: path});
      }
    }
  }

  componentDidMount() {
    if (this.props?.uri?.length > 5) {
       this.load(this.props);
    } else {
       this.setState({ noUri: true });
    }
  }

  componentDidUpdate(prevProps: ImageProps, prevState: ImageState) {
    const {preview} = this.props;
    const {uri, intensity} = this.state;
    if (this.props.uri !== prevProps.uri) {
      this.load(this.props);
    } else if (
      uri &&
      preview &&
      uri !== preview &&
      prevState.uri === undefined
    ) {
      Animated.timing(intensity, {
        duration: 300,
        toValue: 0,
        useNativeDriver: Platform.OS === 'android',
      }).start();
    }
  }

  componentWillUnmount() {
    const {uri} = this.props;
    const entry = CacheManager.get(uri);
    entry.cancel();
  }

  render(): React.Node {
    const {
      empty,
      preview,
      style,
      blur,
      defaultSource,
      isShowLottie = false,
      lottieViewComponent,
      ...otherProps
    } = this.props;

    const {uri, intensity} = this.state;
    const hasDefaultSource = !!defaultSource;
    const hasPreview = preview?.length > 30;
    const hasURI = !!uri;
    const emtpyStringUri = uri?.length == 0;
    const isImageReady = uri && uri !== preview && !blur;

    const opacity = intensity.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 0.5],
    });

    const computedStyle = [
       StyleSheet.absoluteFill,
       _.transform(
          _.pickBy(
             StyleSheet.flatten(style),
             (value, key) => propsToCopy.indexOf(key) !== -1,
          ),
          // $FlowFixMe
          (result, value, key) =>
             Object.assign(result, { [key]: value - (style.borderWidth || 0) }),
       ),
       //  { borderRadius: style.borderRadius },
       ,
    ];

    if (this.props?.uri?.length < 10 || this.props?.uri == null) {
      return (
        <View
          style={{
            ...style,
            borderWidth: 1,
            // borderColor: '#fff',
            ...this.props.imgStyle,
          }}
        />
      );
    }
    return (
      <Animated.View {...{style}}>
        {this.props.linear && (
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
            style={{
              ...this.props.imgStyle,
              top: 0,
              borderWidth: 0,
              // borderColor: '#fff',
              zIndex: 9999,
            }}
          />
        )}
        {hasDefaultSource && !hasPreview && !hasURI && (
          <RNImage
            source={defaultSource}
            style={computedStyle}
            {...otherProps}
          />
        )}
        {(hasPreview && !isImageReady) && (
          <RNImage
            source={{uri: preview}}
            resizeMode="cover"
            style={computedStyle}
            // blurRadius={Platform.OS === "android" ? 0.5 : 0}
          />
        )}
        {isImageReady && (
          <>
            <RNImage source={{uri}} style={computedStyle} {...otherProps} />
            {isShowLottie && lottieViewComponent()}
          </>
        )}

        {/* {hasPreview && Platform.OS === 'ios' && (
          <AnimatedBlurView
            tint="dark"
            style={{...computedStyle, ...style.borderRadius}}
            {...{intensity}}
          />
        )}
        {hasPreview && Platform.OS === 'android' && (
          <AnimatedBlurView
            tint="dark"
            style={{...computedStyle}}
            {...{intensity}}
          />
        )} */}
      </Animated.View>
    );
  }
}

const black = 'black';
const propsToCopy = [
  'borderRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderWidth',
];
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
