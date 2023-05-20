import { StyleSheet } from 'react-native';
export default StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 24,
   },
   headerViewStyle: {
      marginVertical: 7.5,
      alignItems: 'center',
      justifyContent: 'center',
   },
   headerTextStyle: {
      fontSize: 24,
      fontWeight: '800',
   },
   cardViewStyle: {
      // top: '2.5%',
      // width: '86%',
      height: '60%',
      borderWidth: 0,
      borderRadius: 9.5,
      alignSelf: 'center',
      borderColor: '#aaa',
      // alignItems: 'center',
      // borderColor: 'grey',
      // shadowOpacity: 0.75,
      // shadowRadius: 9.5,
      // shadowColor: 'grey',
      // shadowOffset: { height: 0, width: 0 },
   },
   cardHearderStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
   },
   cardHeaderTextStyle: {
      fontSize: 16,
      fontWeight: '700',
   },
   seprateStyle: {
      height: 0.4,
      width: '90%',
      marginTop: 7.5,
      alignSelf: 'center',
      backgroundColor: 'gray',
   },
   progressBar: {
      marginBottom: 10,
      marginHorizontal: 12,
   },
   styledProgressBar: {
      // backgroundColor: 'red',
      height: 30,
   },
});
