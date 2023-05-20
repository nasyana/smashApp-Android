import React, { useMemo, useState, useEffect } from 'react';

import { inject, observer } from 'mobx-react';

import { View, Text, Colors } from 'react-native-ui-lib';

import SectionHeader from 'components/SectionHeader';
import AnimatedView from 'components/AnimatedView';
import { LinearGradient } from 'expo-linear-gradient';

const TeamTargetSectionHeader = (props) => {

    const { teamsStore } = props;
    const { numberOfTeams, numTeamTargetsCompletedToday, smashedAllTargetsToday } = teamsStore;

    return (
        <View>
            {numberOfTeams > 0 && (
                <SectionHeader
                    title={"My Teams".toUpperCase()}
                    style={{ marginTop: 16, paddingBottom: 0 }}
                    subtitle={
                        <AnimatedView loop={!smashedAllTargetsToday}>
                            <LinearGradient
                                colors={
                                    smashedAllTargetsToday
                                        ? [Colors.green30, Colors.green50]
                                        : [Colors.buttonLink, Colors.buttonLink]
                                }
                                style={{
                                    padding: 4,
                                    borderRadius: 16,
                                    paddingHorizontal: 8,
                                    minWidth: 32,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Text B18 white>
                                    {numberOfTeams}
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
)(observer(TeamTargetSectionHeader));
