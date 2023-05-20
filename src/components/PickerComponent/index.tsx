import React from 'react';

import {
   View,
   Text,
   Colors,
   Picker,
   Incubator,
   PanningProvider,
} from 'react-native-ui-lib';
import { ScrollView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Controller } from 'react-hook-form';
import { FONTS } from 'config/FoundationConfig';
import { METRICS } from 'config/SecondaryMetrics';

type dataTypes = {
   id: string | number;
   value: string | number;
   option: string | number;
};

type PropTypes = {
   control?: any;
   title?: string;
   visible?: boolean;
   data?: Array<dataTypes>;
   value?: string;
   ref?: any;
   onChange?: (_value: any) => void;
   setVisible?: (_value: boolean) => void;
};

const PickerComponent = (props: PropTypes) => {
   const dropdownIcon = <Entypo size={24} color="black" name="chevron-down" />;
   const { control, visible, setVisible, data = [], title = '', ref, value, onChange } = props;

   return (
      <View marginB-16>
         {/* <Controller
            control={control}
            name="secondaryMetric"
            render={({ field: { value, onChange, ref } }) => ( */}
               <View
                  style={{
                     maxHeight: 70,
                     paddingTop: 10,
                     borderWidth: 1,
                     borderRadius: 4,
                     marginHorizontal: 16,
                     paddingHorizontal: 15,
                     borderColor: Colors.color58,
                  }}>
                  <Picker
                     ref={ref}
                     value={value}
                     migrateTextField
                     onChange={onChange}
                     label={
                        <Text
                           style={{
                              fontSize: 12,
                              color: Colors.color58,
                              fontFamily: FONTS.medium,
                           }}>
                           {title}
                        </Text>
                     }
                     onPress={() => setVisible(true)}
                     trailingAccessory={dropdownIcon}
                     renderCustomModal={({ children }: any) => {
                        return (
                           <Incubator.Dialog
                              visible={visible}
                              width="100%"
                              height="45%"
                              bottom
                              useSafeArea
                              containerStyle={{
                                 width: '100%',
                                 backgroundColor: Colors.$backgroundDefault,
                              }}
                              headerProps={{ title }}
                              onDismiss={() => setVisible(false)}
                              direction={PanningProvider.Directions.DOWN}>
                              <ScrollView>{children}</ScrollView>
                           </Incubator.Dialog>
                        );
                     }}>
                     {data.map((item: any) => {
                        return (
                           <Picker.Item
                              key={item.id}
                              value={item.value}
                              label={item.option}
                           />
                        );
                     })}
                  </Picker>
               </View>
            {/* )}
         /> */}
      </View>
   );
};

export default PickerComponent;
