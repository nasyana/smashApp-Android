import VoteRecord from 'components/VoteRecord';
import { shadow } from 'config/scaleAccordingToDevice';
import React from 'react';
import { ScrollView } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { View, Text, Colors, Image, Assets } from 'react-native-ui-lib';
import { moment } from 'helpers/generalHelpers';;
const WeeklyTargetsJourney = () => {
   const DATA = [
      {
         time: moment().format('MMMM YYYY'),
         records: ['10k', '20k'],
      },
      {
         time: 'DEC 15, 2017',
         records: ['30k', '100k'],
      },
      {
         time: 'nov 20, 2017',
         records: ['50k'],
      },
   ];
   return (
      <View flex>
         <ScrollView
            style={{
               backgroundColor: Colors.background,
            }}
            contentContainerStyle={{
               paddingBottom: getBottomSpace() + 16,
            }}>
            {DATA.map((item, index) => (
               <View flex row marginH-16 key={index}>
                  <View>
                     <View
                        width={2}
                        height={'100%'}
                        backgroundColor={Colors.line}
                        marginL-5
                     />
                     <Image
                        source={Assets.icons.point}
                        style={{
                           position: 'absolute',
                           top: 28,
                        }}
                     />
                  </View>
                  <View marginL-20 flex marginT-24>
                     <Text H14 color6D marginB-16 uppercase>
                        {item.time}
                     </Text>
                     <View
                        style={{
                           ...shadow,
                           flex: 1,
                        }}
                        // padding-16
                        paddingB-0
                        backgroundColor={Colors.white}>
                        {item.records.map((item, index) => (
                           <View key={index}>
                              <VoteRecord changeTo={item} />
                              <View height={1} backgroundColor={Colors.line} />
                           </View>
                        ))}
                     </View>
                  </View>
               </View>
            ))}
         </ScrollView>
      </View>
   );
};

export default WeeklyTargetsJourney;
