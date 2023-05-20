import {
   useEffect, useState
} from 'react';
import {

   StyleSheet,
   FlatList,
} from 'react-native';
// import BottomSheet from '@gorhom/bottom-sheet';
import { replyListener } from './commentService';
import ReplyItem from './ReplyItem';
import { inject, observer } from 'mobx-react';
import { width } from 'config/scaleAccordingToDevice';
import { Text } from 'react-native-ui-lib';
export const addComment = (postId, createdBy, text) => {
   //body
   const comment = {
      text,
      postId,
      createdBy,
      timestamp: Date.now(),
   };
   alert('comment created');
   //firebase stuff
};

const data = [
   {
      text: 'awesome!',
      id: 'asdsa',
      url: 'https://cdn.vox-cdn.com/thumbor/HME6YC8484Vf48wW0vz9AGRNa3c=/0x0:4200x2600/1200x0/filters:focal(0x0:4200x2600):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/9490719/thor_big.jpg',
   },
   {
      text: 'awesome!',
      id: 'asdssa',
      url: 'https://cdn.vox-cdn.com/thumbor/HME6YC8484Vf48wW0vz9AGRNa3c=/0x0:4200x2600/1200x0/filters:focal(0x0:4200x2600):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/9490719/thor_big.jpg',
   },
];

const RepliesModal = ({ smashStore, notificatonStore, commentId }) => {
   const { currentStory, commentPost } = smashStore;

   const postId = commentPost?.id || false;

   const [repliesList, setRepliesList] = useState([]);

   useEffect(() => {
      const unsub =
         postId && commentId
            ? replyListener(postId, commentId, setRepliesList)
            : () => null;

      return unsub;
   }, [postId, commentId]);

   const renderItem = ({ item }) => <ReplyItem item={item} />;
console.log('repliesList',repliesList)
   return (
      <FlatList
      // ListHeaderComponent={<Text>{commentId}</Text>}
         data={repliesList || []}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}
      />
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 24,
      backgroundColor: 'grey',
   },
   contentContainer: {
      flex: 1,
      justifyContent: 'flex-end',
   },
   containerInput: {
      padding: 10,
      flexDirection: 'row',
      width: width,
      justifyContent: 'space-between',
      alignItems: 'center',
      // borderWidth: 2,
   },
   image: {
      height: 32,
      width: 32,
      borderRadius: 32,
      marginRight: 8,
   },
   // input: {
   //    backgroundColor: 'lightgrey',
   //    flex: 1,
   //    borderRadius: 4,
   //    marginHorizontal: 10,
   //    paddingHorizontal: 10,
   // },
   input: {
      marginTop: 8,
      marginBottom: 10,
      borderRadius: 20,
      fontSize: 14,
      height: 40,
      // lineHeight: 20,
      padding: 8,
      backgroundColor: 'rgba(151, 151, 151, 0.15)',
      flex: 1,
   },
});

export default inject('smashStore', 'notificatonStore')(observer(RepliesModal));
