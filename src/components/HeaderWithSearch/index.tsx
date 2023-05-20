import { useNavigation } from "@react-navigation/native";
import { FONTS } from "config/FoundationConfig";
import React, { ReactNode, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { View, Colors, Text, Assets, Image, Button } from "react-native-ui-lib";

interface Props {
  btnLeft?: ReactNode;
  btnRight?: ReactNode;
  title: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (value: string) => void;
  onClearText?: () => void;
  back?: boolean;
  placeholder?: string;
}
const HeaderWithSearch = ({
  btnLeft,
  btnRight,
  title,
  onPress,
  value,
  onChangeText,
  onClearText,
  back,
  placeholder,
}: Props) => {
  const { goBack } = useNavigation();
  const left = useCallback(() => {
    return back ? (
       <Button
          iconSource={Assets.icons.ic_back}
          link
          color={Colors.black}
          onPress={goBack}
       />
    ) : (
       btnLeft
    );
  }, [btnLeft]);
  return (
    <View style={styles.container}>
      {left && <View
        row
        paddingH-16
        paddingT-12
        paddingB-7
        style={{
          justifyContent: "space-between",
        }}
      >
        <View width={24} height={24}>
          {left()}
        </View>
        <View flex centerH centerV>
          <Text H16 >
            {title}
          </Text>
        </View>
        <View width={24} height={24}>
          {btnRight}
        </View>
      </View>}
      <View padding-16>
        {onPress ? (
          <TouchableOpacity onPress={onPress}>
            <View
              height={44}
              row
              paddingH-16
              paddingV-11
              style={{
                borderWidth: 1,
                borderColor: Colors.line,
                borderRadius: 4,
                alignItems: "center",
              }}
            >
              <Image source={Assets.icons.ic_search_16} />
              <Text R16 color6D marginL-16>
                {placeholder || "Search challenge"}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View
            height={44}
            row
            paddingH-16
            paddingV-11
            style={{
              borderWidth: 1,
              borderColor: Colors.line,
              borderRadius: 4,
              alignItems: "center",
              backgroundColor: Colors.white
            }}
          >
            <Image source={Assets.icons.ic_search_16} />
            <TextInput
              style={{
                fontSize: 16,
                fontFamily: FONTS.heavy,
                marginLeft: 16,
                color: Colors.color28,
                flex: 1,

              }}
              placeholder={placeholder || "Search exercise"}
              placeholderTextColor={Colors.color6D}
              value={value}
              onChangeText={onChangeText}
              underlineColorAndroid={"transparent"}
            />
            <Button
              iconSource={Assets.icons.ic_close_search}
              link
              color={Colors.color28}
              onPress={onClearText}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default HeaderWithSearch;

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
    paddingTop: Platform.OS === "ios" ? getStatusBarHeight(true) : 0,
    // backgroundColor: Colors.black,
    zIndex: 100,
  },
});
