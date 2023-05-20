import SmoothPicker from 'react-native-smooth-picker';
import React, { useRef, useEffect, Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
export default class App extends Component {
   state = {
      selected: null,
   };

   handleChange = (index) => {
      this.setState({
         selected: index,
      });
   };

   render() {
      const { selected } = this.state;
      return (
         <SmoothPicker
            offsetSelection={40}
            magnet
            scrollAnimation
            data={Array.from({ length: 16 }, (_, i) => i)}
            onSelected={({ item, index }) => this.handleChange(index)}
            renderItem={({ item, index }) => (
               <Text selected={index === selected}>{item}</Text>
            )}
         />
      );
   }
}
