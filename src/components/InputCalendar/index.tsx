import React from "react";
import { KeyboardTypeOptions, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "react-native-ui-lib";
import { FONTS } from "config/FoundationConfig";
import { Hoshi } from "libs/react-native-textinput-effects/index";

interface Props {
  keyboardType?: KeyboardTypeOptions;
  label: string;
  parentStyle?: ViewStyle;
  calendar?: () => void;
  value?: string;
}
const InputCalendar = ({
  keyboardType,
  label,
  parentStyle,
  calendar,
  value,
}: Props) => {
  return (
    <Hoshi
      label={label}
      borderColor={"transparent"}
      style={styles.hoshi}
      labelStyle={styles.labelStyle}
      inputStyle={styles.inputStyle}
      height={22}
      keyboardType={keyboardType}
      parentStyle={parentStyle}
      calendar={calendar}
      value={value}
      onChange={(text: string) => {
      }}
    />
  );
};

export default InputCalendar;

const styles = StyleSheet.create({
  hoshi: {
    borderBottomWidth: 0,
  },
  labelStyle: {
    color: Colors.color58,
    fontSize: 16,
    fontFamily: FONTS.medium,
    textAlign: "left",
  },
  inputStyle: {
    color: Colors.color28,
    fontSize: 16,
    fontFamily: FONTS.heavy,
    lineHeight: 0,
  },
});
