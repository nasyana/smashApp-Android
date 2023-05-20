import React, { useState, useRef, useEffect } from 'react';

import { TextInput, Button, Alert } from 'react-native';
import {
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { height, width } from 'config/scaleAccordingToDevice';
import { inject, observer } from 'mobx-react';
import { Incubator, View, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { moderateScale } from 'helpers/scale';

import Routes from 'config/Routes';
import Firebase from 'config/Firebase';
import ButtonLinear from 'components/ButtonLinear';
import { moment } from 'helpers/generalHelpers';;
const EditDynamicFields = ({ docId, collection }) => {
    const [object, setObject] = useState({});
    const [fieldName, setFieldName] = useState('');
    useEffect(() => {
        const unsubscribe = Firebase.firestore
            .collection(collection)
            .doc(docId)
            .onSnapshot((doc) => {
                setObject(doc.data());
            });

        return () => unsubscribe();
    }, [docId]);

    const handleChange = (path, value) => {
        let currentObject = object;
        const pathArray = path.split('.');
        for (let i = 0; i < pathArray.length - 1; i++) {
            currentObject = currentObject[pathArray[i]];
        }
        currentObject[pathArray[pathArray.length - 1]] = value;
        setObject({ ...object });
    };

    const handleAddField = () => {
        if (fieldName) {
            const sanitizedFieldName = fieldName
                .replace(/[^a-zA-Z0-9]/g, '_')
                .toLowerCase();
            Firebase.firestore
                .collection(collection)
                .doc(docId)
                .update({ [sanitizedFieldName]: '' });
            setFieldName('');
        } else {
            Alert.alert('Please enter a field name');
        }
    };


    const handleSave = () => {
        Firebase.firestore
            .collection(collection)
            .doc(docId)
            .update(object);
    };

    const renderField = (field, path) => {
        if (typeof field === 'object') {
            return (
                <View key={path}>
                    {Object.keys(field).map((key) =>
                        renderField(field[key], `${path}.${key}`)
                    )}
                </View>
            );
        } else {
            return typeof field === 'number' ? (
                <View key={path} style={styles.inputContainer}>
                    <Text R12 margin-8>{path}:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={field.toString()}
                        onChangeText={(text) => handleChange(path, parseInt(text, 10))}
                    />
                </View>
            ) : (
                <View key={path} style={styles.inputContainer}>
                    <Text R12 margin-8>{path}:</Text>
                    <TextInput
                        style={styles.input}
                        value={field}
                        onChangeText={(text) => handleChange(path, text)}
                    />
                </View>
            );
        }
    };

    return (
        <View>

            <View row padding-16>
                <View flex><TextInput style={styles.input} value={fieldName} onChangeText={setFieldName} /></View>
                <Button title="Add Field" onPress={handleAddField} />
            </View>


            {Object.keys(object).map((key) => renderField(object[key], key))}
            <ButtonLinear title="Save" onPress={handleSave} style={{ marginTop: 16 }} />



        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        margin: 10,
    },
    label: {
        fontSize: 18,
    },
    input: {
        height: 40,
        borderColor: '#aaa',
        borderWidth: 1,
        padding: 5,
        borderRadius: 7,
        backgroundColor: 'white',
    },
    button: {
        margin: 10,
        backgroundColor: 'lightblue',
    },
});

export default inject('smashStore', 'challengesStore', 'teamsStore')(
    observer(EditDynamicFields)
);