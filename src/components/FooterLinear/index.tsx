import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native-ui-lib";

const FooterLinear = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
    <LinearGradient
      style={styles.container}
      colors={["#FF5E3A", "#FF2A68"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >

        <Text B14 contentW>
          {title}
        </Text>

      </LinearGradient>
    </TouchableOpacity>
  );
};

export default FooterLinear;

const styles = StyleSheet.create({
  container: {
    paddingBottom: getBottomSpace() || 18,
    paddingTop: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
});
