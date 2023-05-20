import React, { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import autobind from 'autobind-decorator';
import { moment } from 'helpers/generalHelpers';;
import { TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';

import { Text, View } from 'react-native-ui-lib';
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";

import SmartImage from 'components/SmartImage/SmartImage';
import firebaseInstance from 'config/Firebase';
const firestore = firebaseInstance.firestore;
import AnimatedView from 'components/AnimatedView';
import { Feather as Icon } from '@expo/vector-icons';

import { inject, observer } from 'mobx-react';
import { width } from 'config/scaleAccordingToDevice';
import Routes from 'config/Routes';
import LoadingIndicator from 'components/LoadingIndicator';

const RecentActivitySmashes = (props) => {
   const [completionsList, setCompletionsList] = useState([]);
   const { smashStore, actionId } = props;

   const { currentUser,showActivityInStory,currentUserId } = smashStore;
   const goToProfile = (playerId) => {
      if (playerId == currentUserId) {
         smashStore.navigation.navigate(Routes.MyProfile);
      } else {
         smashStore.navigation.navigate(Routes.MyProfileHome, {
            user: { uid: playerId },
         });
      }

      smashStore.stories = [];
      smashStore.storyIndex = 0;
   };

   const [loading, setLoading] = useState(false);



   useEffect(() => {

      console.log('run get smashes 2');
     
      if(!showActivityInStory){return}
      // setLoaded(false)
      setLoading(true);
      const queryPosts = query(collection(firestore, "posts"),
      where("activityMasterId", "==", actionId),
      where("followers", "array-contains", currentUserId),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    
    const unsubscribe = onSnapshot(queryPosts, (snap) => {
      const completions = [];
      snap.forEach((completionDoc) =>
        completions.push({
          id: completionDoc.id,
          ...completionDoc.data(),
        })
      );
    
      setLoading(false);
      setCompletionsList(completions);
    });

      return () => {
         if (unsubscribe) {
            unsubscribe();
         }
      };
   }, [actionId,showActivityInStory]);

   // if(!showActivityInStory){return null}
   // if(!loaded){return null}

   // if(loading){

   //    return <ActivityIndicator color={'#fff'} size={'small'}/>
   // }
   return (
      <View
         duration={200}
         style={{
            zIndex: 88888888,
            position: 'absolute',
            bottom: 102,
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
                  width: width - 100,
               }}
               scrollEnabled={true}
               renderItem={(item, index) => {
                  const { item: completion } = item;
           
                  const avatarSize = 20;

                  if (!completion) {
                     return;
                  }

                  return (
                     <View
                        key={completion.id}
                        row
                        style={{
                           // height: 40,
                           paddingLeft: 20,
                           padding: 5,
                           backgroundColor: 'transparent',
                           borderBottomWidth: 0,
                           // borderBottomColor: '#777'
                        }}
                        underlayColor={'#000'}>
                        <TouchableOpacity
                           onPress={() => goToProfile(completion.uid)}
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
                        <View style={{ marginLeft: 10, flex: 1 }} row centerV>
                           <Text
                              H12
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
                           <Text R10 marginL-4 style={{ color: '#AAAAAA', fontSize: 10 }}>
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
};

export default inject(
   'smashStore',
   'challengeArenaStore',
)(observer(RecentActivitySmashes));
