import React, { useState, useEffect } from "react";
import moment from "moment";
import { inject, observer } from 'mobx-react';
import SmartImage from "../../components/SmartImage/SmartImage"
import { View, Colors, Image, Assets, Text } from "react-native-ui-lib";

const FeedItem = (props) => {
    const { smashStore, item} = props;
    const { kFormatter, actionLevels } = smashStore;
    const hasImage = item?.picture?.uri?.length > 10;
    const pointsEarned = item.value * item.multiplier;
    const level = item.level;
    const levelData = actionLevels?.[level] || false;
    const color = levelData ? levelData?.color : false;
    const label = levelData ? levelData?.label : false;
    const shadow = {
    shadowColor: "#ccc",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    }
    return (
    <View style={{ ...shadow }}>
        {hasImage && <View style={{ marginHorizontal: 16 }}><SmartImage uri={item?.picture?.uri} style={{ width: '100%', height: 400, backgroundColor: '#aaa' }} /></View>}
        <View
          row
          style={{
            borderRadius: 6,
            marginHorizontal: 16,
            backgroundColor: "#FFF",
            paddingBottom: 16,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <View marginT-16 paddingL-16>
            <SmartImage uri={item?.user?.picture?.uri} preview={item?.user?.picture?.preview} style={{ width: 50, height: 50, backgroundColor: '#aaa', borderRadius: 10 }} />
          </View>
          <View paddingL-16 flex>
            <Text H14 color28 marginT-16 marginB-8>
              {item?.user?.name} {item.multiplier || 1} x <Text style={{ color }}>{item.activityName}</Text> ({kFormatter(pointsEarned)}pts)
            </Text>
            <View row centerV>
              <Image source={Assets.icons.ic_time_16} />
              <Text R14 color6D marginL-4>
                {moment(item.timestamp, "X").fromNow()}
              </Text>
              {label && <Image
                source={Assets.icons.ic_level}
                tintColor={Colors.color6D}
                marginL-16
              />}
              <Text R14 marginL-4 color6D>
                {label}
              </Text>
            </View>
          </View>
        </View>
    </View>
    );
    
}

export default inject("smashStore")(observer(FeedItem))