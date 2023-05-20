import Box from "components/Box";
import ButtonLinear from "components/ButtonLinear";
import ItemFoodDetail from "components/ItemFoodDetail";
import PieChart from "components/PieChart";
import Firebase from "config/Firebase";
import { FONTS } from "config/FoundationConfig";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text, View, Colors, Button } from "react-native-ui-lib";
import ActivitiesPieChartLastDays from "../../components/ActivitiesPieChartLastDays"
import TimelineToday from "../PlayerStats/TimelineToday";
import BarChart from "../../components/BarChart";
import ChallengesBreakdownList from "./components/ChallengesBreakdownList";
const Insights = () => {


    const uid = Firebase.auth.currentUser.uid;
    return (
        <View flex backgroundColor={Colors.background}>



                <View height={16} />



                <Box>
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
                            Stats
                        </Text>
                        <Button
                            label="Last 7 Days"
                            link
                            color={Colors.buttonLink}
                        />
                    </View>
                    <View height={1} backgroundColor={Colors.line} />

                    <BarChart height={300} showVerticalAxis />
                </Box>
                <Box>
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
                            label="Last 7 Days"
                            link
                            color={Colors.buttonLink}
                        />
                    </View>
                    <View height={1} backgroundColor={Colors.line} />

                    <ActivitiesPieChartLastDays />
                </Box>
                <Box>
                    <ChallengesBreakdownList />
                </Box>


        </View>
    );
};

export default Insights;
