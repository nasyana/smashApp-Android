import { Modal } from 'react-native';
import { inject, observer } from 'mobx-react';
import { height, width } from 'config/scaleAccordingToDevice';
import Box from 'components/Box';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { Vibrate } from 'helpers/HapticsHelpers';
import SmartImage from 'components/SmartImage/SmartImage';
import { ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
const UsersWhoReacted = (props) => {
   const { smashStore } = props;

   const { completion, showWhoReacted, whoReacted } = smashStore;


   console.log('render UsersWhoReacted')
   const dismiss = () => {
      // itemsToCelebrate.shift();
      Vibrate();
      //   dismissCelebration(itemToCelebrate);
      smashStore.whoReacted = false;
   };

   const runAndDismiss = () => {
      dismiss();
      if (showWhoReacted?.nextFn) {
         showWhoReacted?.nextFn();
      }
   };

   const listOfUsers = whoReacted ? Object.values(whoReacted) : [];
   return (
      <View>
         <Modal
            visible={whoReacted && !completion ? true : false}
            transparent={true}
            animationType="fade">
            <View
               onPress={dismiss}
               style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  position: 'absolute',
                  height,
                  width,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  zIndex: -1,
               }}>
               <View onPress={() => null}>
                  <Box
                     style={{
                        // height: height / 1.7,
                        width: width,
                        height: height / 2,
                        paddingVertical: 16,

                        paddingHorizontal: 16,
                     }}>
                     <View row spread marginB-16>
                        <View />
                        <Text B14>Reactions</Text>
                        <TouchableOpacity
                           onPress={dismiss}
                           centerV
                           centerH
                           row
                           spread>
                           <AntDesign name={'close'} size={24} />
                        </TouchableOpacity>
                     </View>
                     <ScrollView contentContainerStyle={{ padding: 24 }}>
                        {listOfUsers.map((user) => (
                           <View row spread>
                              <View row centerV centerH>
                                 <SmartImage
                                    uri={user?.picture?.uri}
                                    preview={user?.picture?.preview}
                                    style={{
                                       height: 30,
                                       width: 30,
                                       borderRadius: 30,
                                       backgroundColor: '#333',
                                       marginRight: 8,
                                    }}
                                 />
                                 <Text secondaryContent center>
                                    {user.name}
                                 </Text>
                              </View>
                              <Text secondaryContent center B28>
                                 {user.reaction}
                              </Text>
                           </View>
                        ))}
                     </ScrollView>
                  </Box>
               </View>
            </View>
         </Modal>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(UsersWhoReacted));
