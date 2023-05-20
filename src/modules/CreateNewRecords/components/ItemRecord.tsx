import React from 'react';
import {View, Text, Button, Assets, Colors} from 'react-native-ui-lib';
interface Props {
  item: {
    title: string;
    kg: string;
    rep: string;
  };
  onPressEdit: () => void;
}
const ItemRecord = ({item, onPressEdit}: Props) => {
  return (
    <View
      marginH-16
      marginB-16
      style={{
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        backgroundColor: Colors.white,
        borderRadius: 6,
      }}>
      <View
        row
        paddingV-12
        paddingH-16
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text H14 color28>
          {item.title}
        </Text>
        <Button
          iconSource={Assets.icons.ic_edit}
          link
          color={Colors.buttonLink}
          onPress={onPressEdit}
        />
      </View>
      <View height={1} backgroundColor={Colors.line} />
      <View
        paddingV-16
        paddingH-16
        row
        style={{justifyContent: 'space-around'}}>
        <Text M36 color28>
          {item.kg}
          <Text R18> kg</Text>
        </Text>
        <Button
          iconSource={Assets.icons.ic_x}
          style={{
            backgroundColor: 'transparent',
          }}
        />
        <Text M36 color28>
          {item.rep}
          <Text R18> rep</Text>
        </Text>
      </View>
    </View>
  );
};

export default ItemRecord;
