import React from "react";
import PropTypes from "prop-types";
import {
  Animated,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Text } from "react-native-ui-lib";
import BaseInput from "./BaseInput";
import { Assets, Colors, Button } from "react-native-ui-lib";
import { scaleH } from "config/scaleAccordingToDevice";
const widthLabel = 300;
export default class Hoshi extends BaseInput {
  static propTypes = {
    borderColor: PropTypes.string,
    /*
     * this is used to set backgroundColor of label mask.
     * this should be replaced if we can find a better way to mask label animation.
     */
    maskColor: PropTypes.string,
    inputPadding: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    inputPadding: 16,
    height: 48,
    borderHeight: 3,
  };

  render() {
    const {
      label,
      style: containerStyle,
      inputStyle,
      labelStyle,
      inputPadding,
      height: inputHeight,
      parentStyle,
      calendar,
      optional,
      ref,
      onSubmitEditing
    } = this.props;
    const { width, focusedAnim, value, focusedBorder } = this.state;
    const flatStyles = StyleSheet.flatten(containerStyle) || {};
    const containerWidth = flatStyles.width || width;

    return (
      <Animated.View
        style={{
          borderWidth: 1,
          borderRadius: 4,
          borderColor: focusedBorder.interpolate({
            inputRange: [0, 1],
            outputRange: [Colors.line, Colors.color58],
          }),
          paddingVertical: scaleH(8),
          marginHorizontal: 24,
          overflow: "hidden",
          marginBottom: 16,
          width: Dimensions.get("window").width - 48,
          ...parentStyle,
        }}
      >
        <View
          style={[
            styles.container,
            containerStyle,
            {
              height: 44,
              width: containerWidth,
            },
          ]}
          onLayout={this._onLayout}
        >
          <TextInput
            ref={this.input}
            onSubmitEditing={onSubmitEditing}
            {...this.props}
            style={[
              styles.textInput,
              inputStyle,
              {
                width: "70%",
                height: inputHeight,
                left: inputPadding,
              },
            ]}
            value={value}
            onBlur={this._onBlur}
            onChange={this._onChange}
            onFocus={this._onFocus}
            underlineColorAndroid={"transparent"}
            autoCorrect={false}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              if (!calendar) {
                this.focus();
              } else {
                calendar && calendar();
              }
            }}
          >
            <Animated.View
              style={[
                styles.labelContainer,
                {
                  opacity: focusedAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0, 1],
                  }),
                  top: focusedAnim.interpolate({
                    inputRange: [0, 0.5, 0.51, 1],
                    outputRange: [10, 10, 0, 0],
                  }),
                  left: focusedAnim.interpolate({
                    inputRange: [0, 0.5, 0.51, 1],
                    outputRange: [
                      inputPadding,
                      2 * inputPadding,
                      0,
                      inputPadding - widthLabel / 8,
                    ],
                  }),
                  transform: [
                    {
                      scale: focusedAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 0, 0.75],
                      }),
                    },
                  ],
                },
                {
                  height: 22,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  width: widthLabel,
                },
              ]}
            >
              <Animated.Text
                style={[
                  styles.label,
                  labelStyle,
                  {
                    color: focusedAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [Colors.secondaryContent, Colors.color58],
                    }),
                  },
                ]}
              >
                {label}
              </Animated.Text>
            </Animated.View>
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.labelMask,
              {
                backgroundColor: "maskColor",
                width: inputPadding,
              },
            ]}
          />
          {calendar && (
            <Button
              iconSource={Assets.icons.ic_calendar}
              onPress={() => {}}
              style={{
                position: "absolute",
                right: 16,
                bottom: 10,
              }}
              link
            />
          )}
          {optional && (
            <View
              style={{
                position: "absolute",
                right: 16,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text M12 color6D>
                Optional
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: "#b9c1ca",
  },
  labelContainer: {
    position: "absolute",
  },
  label: {
    fontSize: 16,
    color: "#6a7989",
    lineHeight: Platform.OS === "android" ? 28 : 0,
  },
  textInput: {
    position: "absolute",
    bottom: 2,
    padding: 0,
    color: "#6a7989",
    fontSize: 18,
    fontWeight: "bold",
  },
  labelMask: {
    height: 24,
  },
  border: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
