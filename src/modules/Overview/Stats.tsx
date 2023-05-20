import Box from "components/Box";
import ButtonLinear from "components/ButtonLinear";
import ItemFoodDetail from "components/ItemFoodDetail";
import PieChart from "components/PieChart";
import { FONTS } from "config/FoundationConfig";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text, View, Colors, Button } from "react-native-ui-lib";
import DailyBarChart from "components/DailyBarChart";
const Stats = () => {
    const DATA = [
        {
            colorTag: Colors.color5A,
            title: "Fat",
            value: "10.3 g",
            items: ["Saturated fat", "Unsaturated fat"],
        },
        {
            colorTag: Colors.color58,
            title: "Carbs",
            value: "0.8 g",
            items: ["Fiber", "Sugars"],
        },
        {
            colorTag: Colors.buttonLink,
            title: "Protein",
            value: "52.9 g",
            items: [],
        },
        {
            colorTag: Colors.color44,
            title: "Others",
            value: "10.3 g",
            items: ["Cholesterol", "Sodium", "Potassium"],
        },
    ];
    return (
        <View flex backgroundColor={Colors.background}>



            <ScrollView>
                <DailyBarChart />
            </ScrollView>
        </View>
    );
};

export default Stats;
