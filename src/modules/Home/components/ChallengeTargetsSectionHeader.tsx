import { View, Text, Colors } from 'react-native-ui-lib'
import React from 'react'
import { inject, observer } from 'mobx-react';
import SectionHeader from 'components/SectionHeader';
import AnimatedView from 'components/AnimatedView';
import { LinearGradient } from 'expo-linear-gradient';
const ChallengeTargetsSectionHeader = ({ challengesStore }) => {
    const { numUserChallengeTargetsCompletedToday, numUserChallengeTargetsToday } = challengesStore;
    const smashedAllTargetsToday =
        numUserChallengeTargetsCompletedToday >= numUserChallengeTargetsToday;

if(numUserChallengeTargetsToday == 0)return null
    return (
        <View>
            {true && (
                <SectionHeader

                    title={"Your Challenge Targets".toUpperCase()}
                    bottomText={'Today'}
                    style={{ marginTop: 16 }}
                    subtitle={
                        <AnimatedView loop={!smashedAllTargetsToday}>
                            <LinearGradient
                                colors={
                                    smashedAllTargetsToday
                                        ? [Colors.green30, Colors.green50]
                                        : ['#FF6243', '#FF0072']
                                }
                                style={{
                                    padding: 4,
                                    borderRadius: 16,
                                    paddingHorizontal: 8,
                                }}>
                                <Text B18 white>
                                    {numUserChallengeTargetsCompletedToday} /{' '}
                                    {numUserChallengeTargetsToday}
                                </Text>
                            </LinearGradient>
                        </AnimatedView>
                    }
                />
            )}
        </View>
    )
}

export default inject(
    'smashStore',
    'challengesStore',
    'teamsStore',
)(observer(ChallengeTargetsSectionHeader));