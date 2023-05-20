import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const UserCopy = ({ userFrom, userTo }) => {
  const [userFromId, setUserFromId] = useState('');
  const [userToId, setUserToId] = useState('');
  const handleCopy = () => {
    // Get the documents for the "user from" and "user to" users
    const userFromDoc = userFrom.doc(userFromId);
    const userToDoc = userTo.doc(userToId);
  
    // Get the data from the "user from" document
    userFromDoc.get().then((doc) => {
      if (!doc.exists) {
        console.error('User from document does not exist');
        return;
      }
      const data = doc.data();
  
      // Merge the data in the "user to" document
      userToDoc.update(data).then(() => {
        console.log('Data merged successfully');
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <View>
      <TextInput
        value={userFromId}
        style={styles.input}
        onChangeText={(text) => setUserFromId(text)}
        placeholder="User from ID"
      />
      <TextInput
        value={userToId}
        style={styles.input}
        onChangeText={(text) => setUserToId(text)}
        placeholder="User to ID"
      />
      <Button title="Copy" onPress={handleCopy} />
    </View>
  );
};

export default UserCopy;


const styles = StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      padding: 12,
      fontSize: 16,
    },
  });