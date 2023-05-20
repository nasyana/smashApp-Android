import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { inject, observer } from 'mobx-react/native';
// import FocusStatToday from './FocusStatToday';
import autobind from 'autobind-decorator';
import { moment } from 'helpers/generalHelpers';;
import SmartImage from './SmartImage/SmartImage';
import Firebase from 'config/Firebase';
import DayLineChart from './DayLineChart';

import { AnimatedView } from './AnimatedView';

const { width } = Dimensions.get('window');
@inject('smashStore')
@observer
export class ActivitiesToday extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         completions: [],
      };
   }

   componentDidMount() {
      const { smashStore } = this.props;
      const { activeGame, dayActivityKey, day, activity } = smashStore;

      const { selectedDayData } = smashStore;
      const gameId = activeGame?.id;
      const limit = 40;
      const uid = this.props.user?.id;
      const dayKey = day?.startDay
         ? day?.startDay
         : moment().format('DDMMYYYY');
      let queryTwo;
      if (this.props.user) {
         queryTwo = Firebase.firestore
            .collection('feed')
            // .where("teams", "array-contains", gameId)
            .where('gameId', '==', gameId)
            .where('type', '==', 'completion')
            .where('day', '==', dayKey)
            .where('uid', '==', uid)
            .limit(limit);
      } else {
         queryTwo = Firebase.firestore
            .collection('feed')
            .where('gameId', '==', gameId)
            .where('type', '==', 'completion')
            .where('day', '==', dayKey)
            .limit(limit);
      }

      this.subscribeTodayCompletions = queryTwo.onSnapshot(async (snap) => {
         const completions = {};
         snap.forEach((completionDoc) => {
            let completion = completionDoc.data();

            completions[completion.id] = completion;
         });

         this.setState({ completions });
      });
   }

   componentWillUnmount() {
      if (this.subscribeTodayCompletions) {
         this.subscribeTodayCompletions();
      }
   }

   @autobind
   setUser() {
      const { user } = this.props;
      this.props.smashStore.viewUserStatsId = user.id;
   }

   render() {
      // my activity today
      const { user, smashStore, uid, index } = this.props;

      const order = index ? index : 1;
      const {
         numUsers,
         day,
         dayActivityKey,
         checkInfinity,
         kFormatter,
         todayActivity,
         selectedUserId,
         userTodayTarget,
      } = smashStore;

      const selectedDayActivity =
         this.props.day || dayActivityKey ? day : todayActivity;
      const selectedUID = user?.id ? user?.id : selectedUserId || uid;

      const avatarSize = 30;

      const userTodayScores = selectedDayActivity?.userTodayScores;

      const userTodayScore = userTodayScores?.[selectedUID] || 0;
      const userDayTarget =
         selectedDayActivity?.teamDayTarget / numUsers || userTodayTarget;
      const completions = Object.values(this.state.completions) || [];
      return (
         <AnimatedView
            delay={order * 100}
            duration={400}
            style={{
               marginBottom: 0,
               backgroundColor: '#222',
               paddingHorizontal: 20,
               borderWidth: 0,
               borderRadius: 10,
               paddingTop: 20,
               width,
               borderColor: '#aaa',
               paddingBottom: 0,
               marginTop: this.props.multi ? 10 : 10,
            }}>
            {!this.props.singleUser && (
               <TouchableOpacity
                  onPress={this.setUser}
                  style={{
                     flexDirection: 'row',
                     justifyContent: 'flex-start',
                     alignItems: 'center',
                     flex: 1,
                     borderColor: '#333',
                     borderWidth: 0,
                     marginBottom: 20,
                  }}>
                  {this.props.multi && (
                     <SmartImage
                        preview={user?.picture?.preview || ''}
                        uri={user?.picture?.uri || ''}
                        style={{
                           height: avatarSize,
                           width: avatarSize,
                           borderRadius: avatarSize / 2,
                           borderColor: '#333',
                           borderWidth: 0,
                           backgroundColor: '#333',
                           opacity: 1,
                           marginRight: 8,
                        }}
                     />
                  )}

                  <Text
                     style={{
                        color: this.props.dark ? '#fff' : '#000',
                        marginLeft: 0,
                     }}>
                     {user?.name}{' '}
                     <Text style={{ color: this.props.color }}>
                        {userTodayScore && kFormatter(userTodayScore)}
                        {userDayTarget > 0 && (
                           <Text
                              style={{
                                 fontFamily: 'SFProText-Light',
                                 color: this.props.color,
                              }}>
                              {' '}
                              (
                              {true &&
                                 parseInt(
                                    checkInfinity(
                                       userTodayScore / userDayTarget,
                                    ) * 100,
                                 ) + '%'}
                              )
                           </Text>
                        )}
                     </Text>
                  </Text>
               </TouchableOpacity>
            )}

            {this.props.singleUser && (
               <Text style={{ color: '#fff' }}>Today</Text>
            )}

            {userTodayScore > 0 && (
               <DayLineChart
                  singleUser={this.props.singleUser}
                  color={this.props.color}
                  user={this.props.user}
                  completions={this.state.completions}
                  dark={this.props.dark}
                  setState={(state) => this.setState({ ...state })}
               />
            )}

            {/* <View
               style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  paddingLeft: 17,
                  justifyContent: 'flex-start',
                  marginBottom: 0,
                  marginTop: 0,
                  borderBottomWidth: this.props.multi ? 0 : 0,
                  paddingBottom: 30,
                  borderColor: this.props.dark
                     ? 'rgba(255,255,255,0.3)'
                     : '#333',
               }}>
               {completions?.length > 0 &&
                  completions.map((completion, index) => {
                     const quantity = completion.multiplier || 1;

                     return (
                        <FocusStatToday
                           completion={completion}
                           openInModal={this.props.openInModal}
                           dark={this.props.dark}
                           index={index}
                        />
                     );
                  })}

               {completions?.length == 0 && (
                  <View style={{ marginTop: 0, flex: 1 }}>
                     <Text
                        style={{
                           color: '#777',
                           textAlign: 'center',
                           width: '100%',
                        }}>
                        No activities smashed yet today
                     </Text>
                  </View>
               )}
            </View> */}
         </AnimatedView>
      );
   }
}

export default ActivitiesToday;
