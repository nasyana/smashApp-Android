import React, {ReactElement, useCallback, useMemo} from 'react';

/* native lib */
import {inject, observer} from 'mobx-react';
import {FlatList, View} from 'react-native';
import ItemList from './ItemList';
import CoolNotice from '../Home/components/CoolNotice';
const TargetToday = inject(
   'smashStore',
   'challengesStore',
)(
   observer((props: any): ReactElement => {
      const { challengesStore, smashStore } = props;
      const { myChallenges } = challengesStore;

      const keyExtractor = useCallback((item: any) => item?.id.toString(), []);
      const renderItem = ({ item }) => (
         <ItemList
            playerChallengeId={item?.id}
            challengeId={item?.challengeId}
            smashStore={smashStore}
         />
      );

      const headerCompoent = () => (
         <View style={{ marginTop: 16 }}>
            <CoolNotice />
         </View>
      );

      return useMemo(() => {
         return (
            <FlatList
               data={[] || myChallenges}
               renderItem={renderItem}
               keyExtractor={keyExtractor}
               showsVerticalScrollIndicator={false}
               ListHeaderComponent={headerCompoent}
               onEndReachedThreshold={0.1}
            />
         );
      }, []);
   }),
);

export default TargetToday;
