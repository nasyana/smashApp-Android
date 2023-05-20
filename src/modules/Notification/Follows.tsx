import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { View, Text, Colors, Assets, Image } from "react-native-ui-lib";
import { inject, observer } from 'mobx-react';
import { formatDistanceToNow } from "date-fns";
import SmartImage from "../../components/SmartImage/SmartImage"

const Follows = (props) => {
   const { notificatonStore } = props;
   const data = notificatonStore.notifications.filter(
      (item) => item.type === 'follow',
   );

   return (
      <View flex>
         <FlatList
            ListEmptyComponent={
               <Text R14 color6D center marginT-32>
                  Oops! No Badges Yet.
               </Text>
            }
            renderItem={({ item, index }) => {
               return (
                  <TouchableOpacity
                     style={{
                        marginHorizontal: 16,
                        marginBottom: 16,
                        borderRadius: 6,
                        backgroundColor: Colors.white,
                        flexDirection: 'row',
                        padding: 16,
                     }}>
                     <SmartImage
                        uri={item?.causeUserPicture?.uri}
                        preview={item?.causeUserPicture?.preview}
                        style={{ height: 50, width: 50, borderRadius: 60 }}
                     />

                     <View marginL-16 flex>
                        <Text H14 color28 marginB-8>
                           {item.title}
                        </Text>

                        <View row centerV>
                           <Image source={Assets.icons.ic_time_16} />
                           <Text R14 color6D marginL-4>
                              {formatDistanceToNow(item.timestamp)}{' '}
                              agoaaaaaaaaaaaaaa
                           </Text>
                        </View>
                     </View>
                  </TouchableOpacity>
               );
            }}
            data={data}
            keyExtractor={(item, index) => item.id.toString()}
            contentContainerStyle={{
               paddingTop: 16,
            }}
         />
      </View>
   );
};

export default inject("notificatonStore")(observer(Follows));
