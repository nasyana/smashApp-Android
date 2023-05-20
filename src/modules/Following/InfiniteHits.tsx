import React, { forwardRef } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Hit as AlgoliaHit } from '@algolia/client-search';
import {
   useInfiniteHits,
   UseInfiniteHitsProps,
} from 'react-instantsearch-hooks';
import { Colors, Image, Text } from 'react-native-ui-lib';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SmartImage from 'components/SmartImage/SmartImage';
import { useNavigation } from '@react-navigation/native';
import Routes from 'config/Routes';
import { hasBeenUpdatedRecently } from 'helpers/dateHelpers';
type InfiniteHitsProps<THit> = UseInfiniteHitsProps;

export const InfiniteHits = forwardRef(
   <THit extends AlgoliaHit<Record<string, unknown>>>(
      { ...props }: InfiniteHitsProps<THit>,
      ref: React.ForwardedRef<FlatList<THit>>,
   ) => {
      const { navigate } = useNavigation();
      const { hits, isLastPage, showMore } = useInfiniteHits(props);

      const goToProfile = (item) => {
         navigate(Routes.MyProfileHome, { user: item });
      };

   
      return (
         <FlatList
            ref={ref}
            numColumns={1}
            data={hits as unknown as THit[]}
            keyExtractor={(item) => item.uid}
            // ItemSeparatorComponent={() => <View style={styles.separator} />}
            onEndReached={() => {
               if (!isLastPage) {
                  if (showMore) {
                     showMore();
                  }
               }
            }}
            renderItem={({ item }) => {
               const hide = hasBeenUpdatedRecently(item);

               if (hide) {
                  return null;
               }
               return (
                  <TouchableOpacity
                     style={[
                        styles.container,
                        styles.padding20Sides,
                        styles.padding10Top,
                     ]}
                     onPress={() => goToProfile(item)}
                     //   onPress={}
                  >
                     {!item.picture ? (
                        <FontAwesome5
                           style={[
                              styles.profileImage,
                              styles.marginBottomSmall,
                           ]}
                           name="user-circle"
                           size={50}
                           color="black"
                        />
                     ) : (
                        <TouchableOpacity onPress={() => goToProfile(item)}>
                           <SmartImage
                              uri={item.picture?.uri}
                              preview={item.picture?.preview}
                              style={[
                                 styles.profileImage,
                                 styles.marginBottomSmall,
                              ]}
                           />
                        </TouchableOpacity>
                     )}

                     <TouchableOpacity
                        onPress={() => goToProfile(item)}
                        style={styles.justifyCenter}>
                        <Text style={styles.username}>{item.name}</Text>
                        <Text style={styles.name}>{item.city}</Text>
                     </TouchableOpacity>
                  </TouchableOpacity>
               );
            }}
         />
      );
   },
);

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      display: 'flex',
   },
   username: {
      fontWeight: '600',
      color: 'black',
   },
   name: {
      color: 'grey',
   },
   marginBottomSmall: {
      marginBottom: 10,
   },

   profileImage: {
      marginRight: 15,
      width: 50,
      height: 50,
      borderRadius: 50 / 2,
   },
   profileImageSmall: {
      marginRight: 15,
      width: 35,
      height: 35,
      borderRadius: 35 / 2,
   },
   justifyCenter: {
      justifyContent: 'center',
   },
   padding10Top: {
      paddingTop: 10,
   },
   padding20Sides: {
      paddingRight: 20,
      paddingLeft: 20,
   },
});

declare module 'react' {
   // eslint-disable-next-line no-shadow
   function forwardRef<TRef, TProps = unknown>(
      render: (
         props: TProps,
         ref: React.Ref<TRef>,
      ) => React.ReactElement | null,
   ): (props: TProps & React.RefAttributes<TRef>) => React.ReactElement | null;
}
