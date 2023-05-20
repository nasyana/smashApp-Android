import React, { memo, useCallback,useContext } from "react";
import { Text, View, Colors } from "react-native-ui-lib";
import { CalendarList } from "react-native-calendars";
import { StyleSheet } from "react-native";
import { FONTS } from "config/FoundationConfig";
import ButtonLinear from "components/ButtonLinear";
import { TouchableOpacity } from "react-native";
import Tag from "components/Tag";
import moment from "moment";
import { CalendarContext } from "modules/CreateChallenge";

const toDayString = moment().format("YYYY-MM-DD");
const currentMonthString = moment().format("M");
const daysMark = [
  {
    dateString: "2021-11-02",
    color: [Colors.color5A],
  },
  {
    dateString: "2021-11-03",
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

const CalendarsList = memo(() => {
  const renderHeader = useCallback((date) => {
    const header = date.toString("MMMM yyyy");
    const [month, year] = header.split(" ");
    return (
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Text B36 color28>
          {`${month}`},{year}
        </Text>
      </View>
    );
  }, []);
  const dayComponent = useCallback((props) => {
    let { date } = props;
    const onDayPress = useContext(CalendarContext);
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
              onPress={() => onDayPress(date)}
              style={styles.btnLinear}
              styleLinear={styles.linear}
              styleText={styles.txtLinear}
            />
          </View>
        ) : (
          <TouchableOpacity onPress={()=> onDayPress(date)} style={styles.btnDay}>
            <Text M16 color={state === "extraDay" ? "#E9E9E9" : "#282C37"}>
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
  }, []);
  return (
    <CalendarList
      pastScrollRange={24}
      futureScrollRange={24}
      hideExtraDays={false}
      renderHeader={renderHeader}
      dayComponent={dayComponent}
      theme={{
        "stylesheet.calendar.header": {
          dayHeader: {
            fontWeight: "600",
            color: Colors.color6D,
            fontSize: 16,
            fontFamily: FONTS.medium,
          },
        },
      }}
    />
  );
});

export default CalendarsList;

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
