import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Feather as Icon } from '@expo/vector-icons';
import { moment } from 'helpers/generalHelpers';;
@inject('smashStore')
@observer
export class FocusStatTodayt extends Component {
   render() {
      const { smashStore, actionId, completion } = this.props;
      const { levelColors } = smashStore;

      return (
         <TouchableOpacity
            onPress={() =>
               this.props.openInModal
                  ? (this.props.smashStore.activityId = actionId)
                  : this.props.setAction
                  ? this.props.setAction(actionId)
                  : null
            }>
            <View
               style={{
                  padding: 5,
                  paddingHorizontal: 7,
                  marginTop: 5,
                  marginRight: 15,
                  borderRadius: 70,
                  borderWidth: 0,
                  backgroundColor: this.props.dark
                     ? 'rgba(255,255,255,0.1)'
                     : '#eee',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               {/* <View style={{ height: 10, width: 10, borderRadius: 20, backgroundColor: levelColors[actions[actionId]?.level || 0], marginRight: 7 }} /> */}
               <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <View
                     style={{
                        height: 15,
                        width: 15,
                        borderRadius: 30,
                        backgroundColor:
                           levelColors[completion?.actionLevel || 0],
                        marginRight: 7,
                        alignItems: 'center',
                        justifyContent: 'center',
                     }}>
                     <Icon color={'#fff'} size={12} name="check" />
                  </View>
               </View>
               <View>
                  <Text
                     style={{
                        color: this.props.dark ? '#fff' : '#000',
                        fontSize: 12,
                     }}>
                     {(completion.multiplier || 1) + ' x '}
                     {completion.actionName}
                  </Text>

                  {/* <Text >{numberOfCompletionsTodayByActivityId[actionId]?.map((completion) => <Text style={{ fontSize: 10, marginRight: 5, color: '#777' }}>{moment(completion.timestamp, 'X').format('h:mma') || 'n/a'} </Text>)}</Text> */}
               </View>
            </View>

            <Text
               style={{
                  color: this.props.dark ? '#fff' : '#aaa',
                  position: 'absolute',
                  fontSize: 8,
                  transform: [{ rotateZ: '-90deg' }],
                  left: -15,
                  top: 12,
               }}>
               {moment(completion.timestamp, 'X').format('ha')}
            </Text>
         </TouchableOpacity>
      );
   }
}

export default FocusStatTodayt;
