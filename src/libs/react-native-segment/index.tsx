import React from "react";
import { View, Animated, Easing } from "react-native";

import styles from "./styles";
import Segment from "./Segment";
import { LinearGradient } from "expo-linear-gradient";

/**
 * A custom `SegmentControl` component, pretty much similar to native's SegmentControl but with animation.
 * Animates when changing the segment value.
 */
class SegmentControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: props.selectedIndex,
      segmentDimension: { width: 0, height: 0 },
      activeSegmentPosition: { x: 0, y: 0 },
      positionAnimationValue: new Animated.Value(0),
    };
  }

  /**
   * On segment change event.
   *
   * @param {Number} index
   */
  onSegmentSelection = (index) => {
    const animate = () => {
      Animated.timing(this.state.positionAnimationValue, {
        toValue: this.state.activeSegmentPosition.x,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => this.props.onChange(index));
    };

    this.setState(
      (prevState) => ({
        selectedIndex: index,
        activeSegmentPosition: {
          x: prevState.segmentDimension.width * index,
          y: prevState.activeSegmentPosition.y,
        },
      }),
      animate
    );
  };

  /**
   * Invoked on mount and layout change of `segmentContainer` view.
   *
   * @param {Object} event
   */
  segmentOnLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    const segmentWidth = width / this.props.values.length;

    const animate = () => {
      Animated.timing(this.state.positionAnimationValue, {
        toValue: segmentWidth * this.state.selectedIndex,
        duration: 100,
        useNativeDriver: false,
      }).start();
    };

    this.setState(
      () => ({
        segmentDimension: { width: segmentWidth, height },
      }),
      animate
    );
  };

  render() {
    const {
      style,
      disable,
      activeSegmentStyle,
      segmentControlStyle,
      selectedTextStyle,
      unSelectedTextStyle,
    } = this.props;
    const { width, height } = this.state.segmentDimension;

    const isDisabled = disable ? "none" : "auto";
    const extraStyles = disable ? styles.vivid : {};

    return (
      <View style={[styles.mainContainer, style]} pointerEvents={isDisabled}>
        <View
          style={[
            styles.segmentContainer,
            extraStyles,
            {
              borderRadius: height,
            },
            segmentControlStyle,
          ]}
          onLayout={this.segmentOnLayout}
        >
          {this.props.values.map((segment, index) => (
            <Segment
              title={segment}
              textStyle={
                index !== this.state.selectedIndex
                  ? unSelectedTextStyle
                  : { ...styles.activeText, ...selectedTextStyle }
              }
              onPress={() => this.onSegmentSelection(index)}
              key={index}
            />
          ))}
          <Animated.View
            style={[
              {
                width,
                height: "100%",
                left: this.state.positionAnimationValue,
                // top: this.state.activeSegmentPosition.y,
              },
              styles.segment,
              styles.activeSegment,
              activeSegmentStyle,
            ]}
          >
            {this.props.children}
            <LinearGradient
              colors={["#FF6243", "#FF0072"]}
              style={{ flex: 1, width, height: "100%" }}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
        </View>
      </View>
    );
  }
}

SegmentControl.defaultProps = {
  selectedIndex: 0,
  style: {},
  segmentControlStyle: {},
  activeSegmentStyle: {},
  selectedTextStyle: {},
  unSelectedTextStyle: {},
};

export default SegmentControl;
