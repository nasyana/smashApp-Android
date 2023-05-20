import React from 'react';
import { View, Text } from 'react-native-ui-lib';

const data = {
  "personalityTypes": [
    {
      "type": "ISTJ",
      "percentage": "11-14%",
      "values": ["Duty", "responsibility", "reliability", "tradition", "practicality"],
      "biases": ["Resistance to change", "over-reliance on rules and structure"],
      "healthAvenues": ["Conventional medicine", "general practitioner", "evidence-based medicine"],
      "spirituality": ["Traditional religious practices", "structured belief systems", "emphasis on duty and responsibility"]
    },
  ]
};

const PersonalityTree = () => {
  return (
    <View padding-24>
      {data.personalityTypes.map((typeData, index) => (
        <View key={index}>
          <Text white style={{ fontWeight: 'bold', fontSize: 18 }}>{typeData.type} ({typeData.percentage})</Text>
          <View>
            <Text white>Values:</Text>
            {typeData.values.map((value, i) => (
              <Text white key={i}>- {value}</Text>
            ))}
          </View>
          <View>
            <Text white>Biases:</Text>
            {typeData.biases.map((bias, i) => (
              <Text white key={i}>- {bias}</Text>
            ))}
          </View>
          <View>
            <Text white>Health Avenues:</Text>
            {typeData.healthAvenues.map((avenue, i) => (
              <Text white key={i}>- {avenue}</Text>
            ))}
          </View>
          <View>
            <Text white>Spirituality/Religious Inclination:</Text>
            {typeData.spirituality.map((spirituality, i) => (
              <Text white key={i}>- {spirituality}</Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default PersonalityTree;
