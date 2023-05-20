
import SegmentedRoundDisplay from "components/SegmentedRoundDisplay";
import Routes from "config/Routes";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity } from "react-native";

import {
    Text,
    View,
    Assets,
    Button,
    Colors,
    PanningProvider,
} from "react-native-ui-lib";

import BarChart from "../../../components/BarChart";

import { inject, observer } from 'mobx-react';
const TodayPoints = (props) => {
    const reference = useRef('nada');
    const { navigate } = useNavigation();

    // useEffect(() => {
    //     props.smashStore.fetchTodayActivity();
    //     return () => {
    //     }
    // }, [])


    const { todayActivity, selectedDayLabel, selectedDay, goForwardDays, goBackDays, isToday } = props.smashStore;
    const goToDailyDetail = () => navigate(Routes.DailyDetail);

    const todayTarget = 5000;

    return (
        <View

            panDirection={PanningProvider.Directions.LEFT}
            marginH-16
            marginB-0
            style={{
                borderRadius: 6,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
            }}
            backgroundColor={Colors.white}
        >
            <View
                padding-16
                row
                style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Button iconSource={Assets.icons.btn_back_day} onPress={goBackDays} />
                <Text R14 color28>
                    {selectedDayLabel || TODAY}
                </Text>
                {isToday ?
                    <TouchableOpacity style={{ opacity: 0.2 }} >< Button iconSource={Assets.icons.btn_next_day} ref={reference} /></TouchableOpacity>
                    :
                    < Button iconSource={Assets.icons.btn_next_day} onPress={goForwardDays} style={{ opacity: 1 }} />}
            </View>
            <View
                row
                paddingB-24
                style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1
                    }}
                >
                    <Text M24 color28>
                        {selectedDay.score || 0}
                    </Text>
                    <Text R14 color6D>
                        Score
                    </Text>
                </View>
                <View height={133} width={133} style={{ flex: 1 }}>
                    <SegmentedRoundDisplay todayActivity={selectedDay || false} smashStore={props.smashStore} todayTarget={todayTarget} />
                    {!props.hideDetails && <TouchableOpacity
                        style={{
                            position: "absolute",
                            borderWidth: 1,
                            borderRadius: 100,
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                            borderColor: Colors.line,
                            bottom: 0,
                            alignSelf: "center",
                        }}
                        onPress={goToDailyDetail}
                    >
                        <Text H10 color6D>
                            Detail
                        </Text>
                    </TouchableOpacity>}
                </View>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1
                    }}
                >
                    <Text M24 color28>
                        {todayTarget || 0}
                    </Text>
                    <Text R14 color6D>
                        Target
                    </Text>
                </View>
            </View>

            {/* {last7Days.map((day) => {

                return <Text>{day.gameScore || 0}</Text>
            })} */}
        </View>
    )
}

export default inject("smashStore", "challengesStore", "challengeArenaStore")(observer(TodayPoints));
