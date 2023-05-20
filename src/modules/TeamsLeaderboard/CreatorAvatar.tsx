import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import SmartImage from 'components/SmartImage/SmartImage';
import Firebase from 'config/Firebase';

const CreatorAvatar = (props) => {
   const [user, setUser] = useState({});
   useEffect(() => {
      Firebase.firestore
         .collection('users')
         .doc(props.id)
         .get()
         .then((snap) => {
            const user = snap.data();
            setUser(user);
         });

      return null;
   }, []);

   return (
      <View>
         <SmartImage
            uri={user?.picture?.uri}
            preview={user?.picture?.preview}
            style={{ height: 20, widht: 20 }}
         />
         <Text>{user?.name}</Text>
      </View>
   );
};

export default CreatorAvatar;
