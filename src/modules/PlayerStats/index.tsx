import { useNavigation } from "@react-navigation/core";
import ButtonLinear from "components/ButtonLinear";
import Header from "components/Header";
import Tag from "components/Tag";
import Routes from "config/Routes";
import { shadow } from "config/scaleAccordingToDevice";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Dimensions } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { View, Colors, Button, Assets, Text, Image } from "react-native-ui-lib";
import ActivitiesPieChart from "../../components/ActivitiesPieChart"
import ActivitiesBarChart from "../../components/ActivitiesBarChart"
import DailyBarChart from "../../components/DailyBarChart"

import AnimatedAppearance from "../../components/AnimatedAppearance"
import Firebase from '../../config/Firebase'
import PlayerChallengeTimeline from './PlayerChallengeTimeline'
import { moment } from 'helpers/generalHelpers';;
import { inject, observer } from 'mobx-react';
import NewChartBar from "components/NewChartBar";
const _ = require('lodash');


const setStep = 8000;
const stepMonday = 4000;
const stepTuesday = 5700;
const stepWednesday = 3284;
const stepThursday = 4500;
const stepFriday = 9000;
const stepSaturday = setStep;
const stepSunday = 2000;
const data = [

  { x: 1, y: 1, y0: stepSunday, date: "S" },
  { x: 2, y: 1, y0: stepMonday, date: "M" },
  { x: 3, y: 1, y0: stepTuesday, date: "T" },
  { x: 4, y: 1, y0: stepWednesday, date: "W" },
  { x: 5, y: 1, y0: stepThursday, date: "T" },
  { x: 6, y: 1, y0: stepFriday, date: "F" },
  { x: 7, y: 1, y0: stepSaturday, date: "S" },
  { x: 8, y: 1, y0: stepSunday, date: "S" },
  { x: 9, y: 1, y0: stepSunday, date: "S" },
  { x: 10, y: 1, y0: stepSunday, date: "S" },
];
const dataSetStep = [
  { x: 1, y: 1, y0: setStep, date: "S" },
  { x: 2, y: 1, y0: setStep, date: "M" },
  { x: 3, y: 1, y0: setStep, date: "T" },
  { x: 4, y: 1, y0: setStep, date: "W" },
  { x: 5, y: 1, y0: setStep, date: "T" },
  { x: 6, y: 1, y0: setStep, date: "F" },
  { x: 7, y: 1, y0: setStep, date: "S" },
];
export enum EnumTypeChart {
  week = 0,
  month = 1,
  year = 2,
  all = 3,
}
interface Props {
  type: EnumTypeChart;
}
const PlayerStats = (props) => {

  const { close, challengeId, uid, endDateKey, challengeArenaStore, inModal, challengesStore, focusUser } = props;

  const { activePlayerChallengeDoc } = challengesStore;
  let visible = false;
  if (props.challengeArenaStore.challengeArenaIndex == 2) { visible = true }
  if (inModal) { visible = true }


  const { navigate } = useNavigation();
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)




  // if (!visible) { return null }



  return (
    <View flex>
      {inModal && !props.noheader && <View
        row
        paddingH-16
        paddingT-13
        paddingB-11
        style={{
          justifyContent: "space-between",
          height: 400
        }}
      >
        <Text H14 color28 uppercase>
          Player Stats! ({activePlayerChallengeDoc?.user?.name})
        </Text>
        <Button
          iconSource={Assets.icons.ic_delete_day}
          link
          color={Colors.buttonLink}
          onPress={close}
        />
      </View>}
      {/* <Header title={"Records History"} back /> */}
      <ScrollView
        style={{
          backgroundColor: Colors.background,
          flex: 1,

        }}
        contentContainerStyle={{
          paddingBottom: getBottomSpace() + 16,
        }}
      >
        {/* <PieChart playerChallengeDoc={playerChallengeDoc} /> */}
        {/* <LinearChart type={EnumTypeChart.all} /> */}



        {/* <ActivitiesBarChart playerChallengeDoc={playerChallengeDoc} /> */}
        {/* <DailyBarChart playerChallengeDoc={playerChallengeDoc} /> */}
        {/* <NewChartBar graphView={props.smashStore.graphView} smashStore={props.smashStore} data={data} setStep={setStep} dataSetStep={dataSetStep} playerChallengeDoc={playerChallengeDoc} /> */}

        <PlayerChallengeTimeline {...props} />

      </ScrollView>

    </View>
  );
};

export default inject("smashStore", "challengeArenaStore", "challengesStore",)(observer(PlayerStats));

const styles = StyleSheet.create({});
