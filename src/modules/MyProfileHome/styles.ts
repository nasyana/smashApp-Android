import { StyleSheet } from 'react-native';
import { FONTS } from '../../config/FoundationConfig';

export const styles = StyleSheet.create({
    btnLinear: {
        width: 32,
        height: 32,
        marginHorizontal: 0,
        alignSelf: 'center',
    },
    linear: {
        paddingHorizontal: 0,
    },
    txtLinear: {
        fontSize: 15,
        fontFamily: FONTS.heavy,
    },
    btnDay: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        marginVertical: 20,
        marginHorizontal: 24,
        borderBottomColor: '#7a7a7a',
        borderBottomWidth: StyleSheet.hairlineWidth,
        opacity: 0.3,
    },
    mainContainer: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subContainer: {
        borderRadius: 20,
        width: '90%',
        height: '90%',
        backgroundColor: '#fff',
        flexDirection: 'column',
        elevation: 12,
        shadowColor: '#000',
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        shadowOffset: {
            width: 0,
            height: 6,
        },
    },
    closableContainer: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        alignSelf: 'flex-end',
    },
    headerContainer: {
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 20,
    },
    headerText: {
        color: '#7484e0',
        fontWeight: '600',
        fontSize: 24,
        letterSpacing: 5,
    },
    subHeaderText: {
        color: '#2a2a2a',
        fontWeight: '600',
        fontSize: 24,
        letterSpacing: 1,
        marginTop: 20,
    },
    imageStyles: {
        height: 150,
        width: 200,
    },
    checkboxContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginLeft: 50,
    },
    checkboxStyles: {
        color: '#7a7a7a',
        fontSize: 18,
        letterSpacing: 1,
        lineHeight: 32,
    },
    btnContainer: {
        backgroundColor: '#7484e0',
        height: 55,
        borderRadius: 5,
    },
    btnTextStyles: {
        textAlign: 'center',
        fontSize: 18,
        letterSpacing: 5,
        color: '#fff',
        fontWeight: 'bold',
        padding: 15,
    },
    touchableStyles: {
        marginTop: 100, marginHorizontal: 24
    }
});
