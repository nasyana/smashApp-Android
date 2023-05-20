import { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import {
   View, Colors, TouchableOpacity
} from 'react-native-ui-lib';
import Routes from '../../../../config/Routes';

import { ActivityIndicator } from 'react-native';
import MyGoalHeader from './MyGoalHeader';
import MyGoalDeadline from './MyGoalDeadline';
import Activities from 'components/Challenge/Activities';
const MyGoal = inject(
   'smashStore',
   'challengesStore',
)(
   observer((props: any) => {
      const { navigate } = useNavigation();
      const {
         smashStore,
         challengesStore,
         index,
         goalId
      } = props;

   
      const {
      } = smashStore;
     
  
      const [loaded, setLoaded] = useState(true);
      useEffect(() => {
         const loadTime = (index + 1) * 200;

         setTimeout(() => {
            setLoaded(true);
         }, loadTime + 200);

         return () => {};
      }, []);

      const goal = challengesStore?.goals?.find(goal => goal.id == goalId) || {};

      const goToArena = () => {
         smashStore.smashEffects();
            navigate(Routes.GoalArena, { goalDoc:goal });
      };


     
      if (!loaded) {
         return <ActivityIndicator />;
      }
      
console.log('render MyGoal')
  
      return (
         <View style={{ borderBottomWidth: 0, paddingHorizontal: 8, marginBottom: 8 }}>
            <TouchableOpacity
               onPress={goToArena}
               // onLongPress={goToEditGoal}
               marginT-16
               marginB-0
               paddingV-16
               paddingT-8
               paddingB-16
               centerV
               style={{
                  borderRadius: 6,
                  shadowColor: '#ccc',
                  shadowOffset: {
                     height: 1,
                     width: 1,
                  },
                  shadowOpacity: 0.52,
                  shadowRadius: 12.22,
                  elevation: 3,
               }}
               backgroundColor={Colors.white}>
               
             <MyGoalHeader goalId={goal.id} />
                  
<MyGoalDeadline goalId={goal.id} />

       <View paddingH-24 marginT-16>              
<Activities masterIds={goal.masterIds} notPressable={false} />
</View>
            </TouchableOpacity>
         </View>
      );
   }),
);

export default MyGoal;
