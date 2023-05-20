import Header from "components/Header";
import React from "react";
import { View, Text, Colors, Image, Assets } from "react-native-ui-lib";
import { Calendar } from "react-native-calendars";
import ButtonLinear from "components/ButtonLinear";
import { TouchableOpacity, StyleSheet } from "react-native";
import moment from "moment";
import { FONTS } from "config/FoundationConfig";
import Tag from "components/Tag";
import Box from "components/Box";
import { bottom } from "config/scaleAccordingToDevice";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const toDayString = moment().format("YYYY-MM-DD");
const currentMonthString = moment().format("M");
const daysMark = [
  {
    dateString: "2021-03-02",
    color: [Colors.color5A],
  },
  {
    dateString: "2021-03-03",
    color: [Colors.color44],
  },
  {
    dateString: "2021-03-04",
    color: [Colors.colorFF],
  },
  {
    dateString: "2021-03-05",
    color: [Colors.color58, Colors.colorD8, Colors.color44],
  },
  {
    dateString: "2021-03-22",
    color: [Colors.color58, Colors.colorD8, Colors.color44],
  },
];
const getStateDay = (dateString: string, monthString: string): string => {
  if (toDayString === dateString) {
    return "toDay";
  }
  if (monthString !== currentMonthString) {
    return "extraDay";
  }

  return "normal";
};
const data = [
  {
    date: "Today, 17:30 PM",
    title: "Chest, Trap, Tricep, Abs",
    status: "On",
    time: "60 mins",
    color: Colors.color58,
  },
  {
    date: "Today, 18:30 PM",
    title: "Abs, Running",
    status: "On",
    time: "30 mins",
    color: Colors.colorD8,
  },
  {
    date: "Today, 21:00 PM",
    title: "Abs, Chest",
    status: "On",
    time: "10 mins",
    color: Colors.color44,
  },
  {
    date: "Today, 17:30 PM",
    title: "Chest, Trap, Tricep, Abs",
    status: "On",
    time: "60 mins",
    color: Colors.color58,
  },
  {
    date: "Today, 18:30 PM",
    title: "Abs, Running",
    status: "On",
    time: "30 mins",
    color: Colors.colorD8,
  },
  {
    date: "Today, 21:00 PM",
    title: "Abs, Chest",
    status: "On",
    time: "10 mins",
    color: Colors.color44,
  },
];
const WorkoutSchedule = () => {
  const translationY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      translationY.value = event.contentOffset.y;
    },
  });
  const stylez = useAnimatedStyle(() => {
    return {
      height: interpolate(
        translationY.value,
        [0, 370],
        [370, 150],
        Extrapolate.CLAMP
      ),
    };
  });
  return (
    <View flex backgroundColor={Colors.background}>
      <Header back title="" noShadow />
      <Animated.View style={stylez}>
        <Calendar
          minDate={"2018-05-10"}
          maxDate={"2022-05-30"}
          hideArrows={true}
          hideExtraDays={false}
          disableMonthChange={true}
          firstDay={1}
          renderHeader={(date) => {
            let index = date.getMonth();
            return (
              <View flex>
                <Text B36 color28>
                  {months[index]}, {date.getFullYear()}
                </Text>
              </View>
            );
          }}
          enableSwipeMonths={false}
          dayComponent={(props) => {
            let { date } = props;
            let state = getStateDay(date.dateString, `${date.month}`);
            let colorsMark = daysMark.find(
              (e) => e.dateString === date.dateString
            )?.color;
            return (
              <View height={40} width={40} centerH>
                {state === "toDay" ? (
                  <View height={40} width={40}>
                    <ButtonLinear
                      title={`${date.day}`}
                      onPress={() => {}}
                      style={styles.btnLinear}
                      styleLinear={styles.linear}
                      styleText={styles.txtLinear}
                    />
                  </View>
                ) : (
                  <TouchableOpacity style={styles.btnDay}>
                    <Text
                      M16
                      color={state === "extraDay" ? "#E9E9E9" : "#282C37"}
                    >
                      {date.day}
                    </Text>
                  </TouchableOpacity>
                )}
                <View row height={6}>
                  {colorsMark?.length &&
                    colorsMark.map((item, index) => {
                      return (
                        <Tag
                          size={6}
                          color={item}
                          key={index}
                          style={{
                            marginHorizontal: 2,
                          }}
                        />
                      );
                    })}
                </View>
              </View>
            );
          }}
        />
      </Animated.View>
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: Colors.line,
          elevation: 1,
        }}
      />
      <Animated.ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: Colors.background,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {data.map((item, index) => {
          let { color, date, time, status, title } = item;
          return (
            <React.Fragment key={index}>
              <View height={16} />
              <Box>
                <View row centerV marginT-16 marginH-16>
                  <Tag size={6} color={color} />
                  <Text M14 color6D marginL-8>
                    {date}
                  </Text>
                </View>
                <Text M24 color28 marginL-16>
                  {title}
                </Text>
                <View row centerV marginL-16 marginB-16>
                  <Image source={Assets.icons.ic_time_16} />
                  <Text R14 color6D marginL-4>
                    {time}
                  </Text>
                  <Image
                    source={Assets.icons.ic_time_16}
                    tintColor={Colors.color6D}
                    marginL-16
                  />
                  <Text R14 color6D marginL-4>
                    {status}
                  </Text>
                </View>
              </Box>
            </React.Fragment>
          );
        })}
      </Animated.ScrollView>
      <ButtonLinear
        title="add new plan"
        onPress={() => {}}
        style={{
          position: "absolute",
          bottom: bottom,
        }}
      />
    </View>
  );
};

export default WorkoutSchedule;

const styles = StyleSheet.create({
  btnLinear: {
    width: 32,
    height: 32,
    marginHorizontal: 0,
    alignSelf: "center",
  },
  linear: {
    paddingHorizontal: 0,
  },
  txtLinear: {
    fontSize: 15,
    fontFamily: FONTS.heavy,
  },
  btnDay: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
