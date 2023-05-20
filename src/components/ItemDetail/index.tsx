import ButtonLinear from "components/ButtonLinear";
import Tag from "components/Tag";
import { FONTS } from "config/FoundationConfig";
import React from "react";
import { View, Text, Colors, Button, Assets, Image } from "react-native-ui-lib";
interface Props {
  item: {
    colorTag: string;
    title: string;
    items: string[];
    value: string;
  };
}
const ItemFoodDetail = ({ item }: Props) => {
  return (
    <View padding-16 paddingB-0>
      <View row centerV marginB-16>
        <Tag size={16} color={item.colorTag} />
        <Text marginL-16 H18 color28 flex>
          {item.title}
        </Text>
        <Text marginL-16 H18 color28>
          {item.value}
        </Text>
      </View>
      {item.items.map((item, index) => {
        return (
          <View row centerV marginB-16 key={index}>
            <Tag size={16} color={"transparent"} />
            <Text marginL-16 R14 color28 flex>
              {item}
            </Text>
            <ButtonLinear
              title="Pro"
              onPress={() => { }}
              style={{ height: 21, width: 37, marginHorizontal: 0 }}
              styleLinear={{
                paddingHorizontal: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
              styleText={{ fontSize: 10, fontFamily: FONTS.heavy }}
            />
          </View>
        );
      })}
    </View>
  );
};

export default ItemFoodDetail;
