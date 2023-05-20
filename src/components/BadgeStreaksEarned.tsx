import { View, Text, ScrollView, TouchableOpacity } from 'react-native-ui-lib'
import React from 'react';

import { durationImages } from 'helpers/generalHelpers';

const BadgeStreaksEarned = () => {


    return (<ScrollView contentContainerStyle={{ paddingTop: 16 }}>
        <View style={{ flexWrap: 'wrap' }} row center>
            {achievements.map((achievement, index) => {
                const image = Assets.achievements[`${achievement.handle}`];
                const type = achievement?.handle;


                return (
                    <TouchableOpacity
                        active
                        key={index}
                        style={{
                            ...boxShadow,
                            width: '30%',
                            margin: '1%',
                            borderRadius: 10,
                            height: height / 7,
                            paddingHorizontal: 8,
                            backgroundColor: '#fff',
                        }}
                        onPress={() => onTouchActions(achievement?.handle)}>
                        <View center>
                            <Image
                                source={image}
                                style={[
                                    {
                                        height: 50,
                                        width: '100%',
                                        marginTop: 12,
                                        marginBottom: 8,
                                    },
                                    colorHanlderAchivement(achievement?.handle),
                                ]}
                            />
                            <Text center M14>{achievement.text}</Text>
                        </View>
                    </TouchableOpacity>
                );

            })}

        </View>
    </ScrollView>
    )
}

export default BadgeStreaksEarned