import { shadow } from "config/scaleAccordingToDevice";
import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Assets, Colors, Image, Text } from "react-native-ui-lib";
const ItemActivityCategory = ({ item, onPress, selectedActionsSize, totalActions }) => {
  return (
    <TouchableOpacity
      style={{
        ...shadow,
        marginBottom: 16,
        padding: 16,

        backgroundColor: Colors.white,
     
      }}
      onPress={onPress}
    >
      <View row spread marginH-16 centerV>
        <Text  M18 color={Colors.color28} >
          {item}
        </Text>

        <Text R16 color={selectedActionsSize > 0 ? Colors.buttonLink : Colors.grey}>{selectedActionsSize > 0 && selectedActionsSize + ' Selected'} </Text>
        <View style={styles.numberView}>
          <Text R16 secondaryContent  >
             {totalActions}
          </Text>
        </View>

      </View>
    </TouchableOpacity>
  );
};

const styles = {
  numberView: {
    justifySelf: "flex-end",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 40,
    height: 40,
    padding: 4,
    borderRadius: 15
  }
}

export default ItemActivityCategory;
