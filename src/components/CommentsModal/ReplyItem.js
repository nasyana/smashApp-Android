import { StyleSheet, Image } from 'react-native';
import React from 'react';
import SmartImage from 'components/SmartImage/SmartImage';
import { View, Text } from 'react-native-ui-lib';
import ReplyComments from './ReplyComments';
const ReplyItem = ({ item }) => {
   const comment = item;
   console.log('comment', comment);
   return (
      <View>
         <View style={styles.container}>
            <SmartImage
               style={styles.image}
               uri={comment?.picture?.uri}
               //  source={{
               //     uri: 'https://cdn.vox-cdn.com/thumbor/HME6YC8484Vf48wW0vz9AGRNa3c=/0x0:4200x2600/1200x0/filters:focal(0x0:4200x2600):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/9490719/thor_big.jpg',
               //  }}
            />
            <View
               style={[
                  styles.containerText,
                  {
                     backgroundColor: '#F0F1F5',
                     padding: 7,
                     paddingHorizontal: 10,

                     borderRadius: 20,
                  },
               ]}>
               {comment?.commentOwnerName && (
                  <Text style={styles.userName}>
                     {comment?.commentOwnerName || ''}
                  </Text>
               )}
               <Text secondaryContent R12>
                  {item.text}
               </Text>
            </View>
         </View>
         {/* <ReplyComments commentId={comment.id} /> */}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      paddingHorizontal: 32,
      paddingLeft: 64,
      flexDirection: 'row',
      flex: 1,
      marginBottom: 4,
   },
   image: {
      height: 15,
      width: 15,
      borderRadius: 32,
   },
   containerText: {
      marginHorizontal: 5,
   },
   userName: {
      color: 'black',
      fontSize: 12,
   },
});

export default ReplyItem;
