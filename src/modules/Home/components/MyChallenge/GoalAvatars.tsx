import { View, Text, Avatar, Colors } from 'react-native-ui-lib'
import React from 'react'
import SmartImage from 'components/SmartImage/SmartImage'

const GoalAvatars = ({goal}) => {

if(goal?.joined?.length === 1) return null

  return (
    <View row style={{flexWrap: 'wrap'}} paddingL-8>
        {goal?.joined?.map((playerId, index) => {
            const player = goal.usersMap?.[playerId] || {};
            const { picture } = player;
            return (
                <View key={playerId} marginR-5>
                    <SmartImage uri={picture.uri} preview={picture.preview}  style={{height: 20, width: 20, borderRadius: 60,marginLeft: index > 0 ? -10 : 0}}/>
                {/* <Avatar
                    size={30}
                    source={{ uri: picture.uri }}
                    containerStyle={{
                    borderWidth: 0,
                    borderColor: Colors.grey,
                    marginLeft: index > 0 ? -10 : 0,
                    }}
                /> */}
                </View>
            );
            })
        }
    </View>
  )
}

export default GoalAvatars