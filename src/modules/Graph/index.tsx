import Header from 'components/Header';
import React from 'react';
import {View, Colors} from 'react-native-ui-lib';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {shadow, width} from 'config/scaleAccordingToDevice';
import {FONTS} from 'config/FoundationConfig';
import Weight from './Weight';
import Calories from './Calories';
import Body from './Body';
const Graph = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'Weight', title: 'weight'},
    {key: 'Calories', title: 'calories'},
    {key: 'Body', title: 'body'},
  ]);
  const renderScene = SceneMap({
    Weight: Weight,
    Calories: Calories,
    Body: Body,
  });
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: Colors.buttonLink}}
      style={{backgroundColor: Colors.white, ...shadow}}
      activeColor={Colors.buttonLink}
      inactiveColor={Colors.color6D}
      labelStyle={{
        fontFamily: FONTS.heavy,
        fontSize: 14,
      }}
      pressColor={'transparent'}
    />
  );
  return (
    <View flex backgroundColor={Colors.background}>
      <Header title="Graph" back noShadow />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: width}}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default Graph;
