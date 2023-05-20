import Box from "components/Box";
import ButtonLinear from "components/ButtonLinear";
import ItemFoodDetail from "components/ItemFoodDetail";
import PieChart from "components/PieChart";
import Firebase from "config/Firebase";
import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text, View, Colors, Button, Assets } from "react-native-ui-lib";
import ActivitiesPieChartToday from "../../components/ActivitiesPieChartToday"
import TimelineToday from "../PlayerStats/TimelineToday";
import { Dimensions, TouchableOpacity } from "react-native"
import ChallengesBreakdownList from "./components/ChallengesBreakdownList";
import { inject, observer } from 'mobx-react';
import SmartImage from "../../components/SmartImage/SmartImage"
import Shimmer from "components/Shimmer";
const { width, height } = Dimensions.get("window");

const PlayerToday = (props) => {
    const { navigate } = useNavigation();
    const { date, smashStore, focusUser, close, top } = props;
    const { dayKeyToHuman, todayDateKey } = smashStore;

    const humanDate = focusUser ? dayKeyToHuman(todayDateKey) : dayKeyToHuman(date);


    const uid = focusUser?.uid || false;

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoaded(true)
        }, 500);
        return () => {

        }
    }, [])

    const goToProfile = () => {

        navigate('MyProfile', { user: focusUser })
        smashStore.focusUser = false;
    }

    return (
        <View flex>


            {loaded && <ScrollView>
                {/* <View height={16} /> */}
                {/* <TodayPoints hideDetails />
                <View height={16} /> */}

                {/* <Box>
                    <View
                        row
                        paddingH-16
                        paddingT-13
                        paddingB-11
                        centerV
                        style={{
                            justifyContent: "space-between",
                        }}
                    >
                        <Text H14 color28>
                            Breakdown
                        </Text>
                        <Button
                            label={humanDate}
                            link
                            color={Colors.buttonLink}
                        />
                    </View>
                    <View height={1} backgroundColor={Colors.line} />

                    <ActivitiesPieChartToday date={date || todayDateKey} focusUser={focusUser} />
                </Box> */}

                {/* <Leaders /> */}
                <Box>
                    <ChallengesBreakdownList today date={date || todayDateKey} focusUser={focusUser} />
                </Box>
                {/* <Box>
                    <TimelineToday uid={uid} date={date || todayDateKey} focusUser={focusUser} />
                </Box> */}



            </ScrollView>}
        </View>
    );
};

export default inject("smashStore")(observer(PlayerToday));
