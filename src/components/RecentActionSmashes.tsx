import React, { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { moment } from 'helpers/generalHelpers';;
import { TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { Text, View } from 'react-native-ui-lib';
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
 import firebaseInstance from 'config/Firebase';
 const firestore = firebaseInstance.firestore;
import SmartImage from 'components/SmartImage/SmartImage';
import AnimatedView from 'components/AnimatedView';
import { Feather as Icon } from '@expo/vector-icons';

import { inject, observer } from 'mobx-react';

const screenWidth = Math.round(Dimensions.get('window').width);

const RecentActionSmashesFinal = inject('smashStore')(observer((props) => {
   const [completionsList, setCompletionsList] = useState([]);
   const { smashStore, actionId, currentUserId } = props;
   const {  currentUser } = smashStore;

   useEffect(() => {
      let subscribeToCompletions;

      async function getSmashes() {
         console.log('run get smashes');
       
         const q = query(
           collection(firestore, "posts"),
           where("activityMasterId", "==", actionId),
           where("followers", "array-contains", currentUser.uid),
           orderBy("timestamp", "desc"),
           limit(5)
         );
         
         subscribeToCompletions = onSnapshot(q, async (snap) => {
           const completions = [];
           snap.forEach((completionDoc) => {
             completions.push({
               ...completionDoc.data(),
               id: completionDoc.id,
             });
           });
           setCompletionsList(completions);
         });
       }

      getSmashes();

      return () => {
         if (subscribeToCompletions) {
            subscribeToCompletions();
         }
      };
   }, []);

   const onPressPost = (post) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      smashStore.setStories([post]);

      smashStore.setCurrentStory(post);
   }
      // const { completionsList } = this.state;

      return (
         <View
            duration={200}
            style={{
               zIndex: 88888888,
               position: 'absolute',
               bottom: 100,
               //    height: 300,
               borderWidth: 0,
               borderColor: '#fff',
               //    backgroundColor: '#fff',
            }}>
            {/* {this.props.title && <View style={{ paddingHorizontal: 15, paddingVertical: 7, backgroundColor: Theme.palette.blackBg }}><Text style={{ ...Theme.typography.header3 }}>Recent Smashes</Text></View>} */}

            <AnimatedView delay={0} duration={0} style={{ paddingBottom: 0 }}>
               <FlatList
                  thumbnail
                  data={completionsList}
                  style={{
                     paddingBottom: 0,
                     backgroundColor: 'transparent',
                     width: screenWidth - 100,
                  }}
                  contentContainerStyle={{paddingLeft: 8}}
                  scrollEnabled={false}
                  renderItem={(item, index) => {
                     const { item: completion } = item;
                     const rank = parseInt(index) + 1;

                     // const { textBelow } = this.props;
              
                     const { levelColors, contacts } = smashStore;

                     const avatarSize = 25;

                     const { level = 0 } = completion;

                     const actionColor = levelColors?.[level];

                     if (!completion) {
                        return;
                     }

                     return (
                        <View
                           key={completion.id}
                           row
                           style={{
                              // height: 50,
                              paddingLeft: 20,
                              padding: 5,
                              backgroundColor: 'transparent',
                              borderBottomWidth: 0,
                              // borderBottomColor: '#777'
                           }}
                           underlayColor={'#000'}>
                           <TouchableOpacity
                              // onPress={() => this.props.smashStore.setSelectedUserId(completion.uid)}
                              style={{}}>
                              <SmartImage
                                 preview={completion?.user?.picture?.preview}
                                 uri={completion?.user?.picture?.uri}
                                 style={{
                                    height: avatarSize,
                                    width: avatarSize,
                                    borderRadius: avatarSize / 2,
                                 }}
                              />
                           </TouchableOpacity>
                           <View style={{ marginLeft: 10, flex: 1 }}>
                              <Text
                                 H14
                                 style={{
                                    color: '#fff',
                                    borderWidth: 0,
                                 }}>
                                 {completion?.user?.name || 'no name'}
                                 <Text
                                    R12
                                    style={{
                                       color: '#fff',
                                    }}>
                                    {' '}
                                    ( x {completion.multiplier || 1} )
                                 </Text>
                              </Text>
                              <Text style={{ color: '#AAAAAA', fontSize: 10 }}>
                                 {moment(completion.timestamp, 'X').fromNow()}
                              </Text>
                           </View>
                        </View>
                     );
                  }}
               />
            </AnimatedView>
         </View>
      );
   }));

   export default RecentActionSmashesFinal;


