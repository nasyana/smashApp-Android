import ActionButton from "libs/react-native-circular-action-menu/ActionButton";
import React from "react";
import { Text, Image, Assets } from "react-native-ui-lib";

interface Props {
  onPress: () => void;
  onShowWater: () => void;
  onShowFood: () => void;
}
const ButtonMainTab = ({ onPress, onShowFood, onShowWater }: Props) => {
  const DATA = [
    {
      img: Assets.icons.ic_add_water,
      title: "Water",
      onPress: () => {
        onShowWater();
        onPress();
      },
    },
    {
      img: Assets.icons.ic_add_food,
      title: "Food",
      onPress: () => {
        onShowFood();
        onPress();
      },
    },
    {
      img: Assets.icons.ic_add_exercise,
      title: "Exercises",
      onPress: () => {
        onPress();
      },
    },
    {
      img: Assets.icons.ic_add_body_index,
      title: "Body Index",
      onPress: () => {
        onPress();
      },
    },
  ];

  return (
    <ActionButton
      onPress={onPress}
      buttonColor="rgba(231,76,60,1)"
      itemSize={100}
      btnOutRange={"rgba(231,76,60,1)"}
      size={40}
    >
      {/* {DATA.map((item, index) => {
        return (
          <ActionButton.Item onPress={item.onPress} itemSize={100} key={index}>
            <Image source={item.img} />
            <Text white M14 style={{ marginTop: -10 }}>
              {item.title}
            </Text>
          </ActionButton.Item>
        );
      })} */}
    </ActionButton>
  );
};

export default ButtonMainTab;
