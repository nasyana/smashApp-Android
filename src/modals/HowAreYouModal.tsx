import { Modal } from 'react-native';
import { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { height, width } from 'config/scaleAccordingToDevice';
import { View } from 'react-native-ui-lib';
import { Vibrate } from 'helpers/HapticsHelpers';
import HowAreYouFeeling from 'components/HowAreYouFeeling';
const HowAreYouModal = (props) => {
   const { smashStore } = props;

   const { showHowAreYouFeelingModal } = smashStore;

   const [loaded, setLoaded] = useState(false);
console.log('render howare you modal');
   useEffect(() => {
      setTimeout(() => {
         setLoaded(true);
      }, 5000);

      return () => {};
   }, []);

   if (!loaded) {
      return null;
   }


   return (
      <View>
         <Modal
            visible={showHowAreYouFeelingModal}
            transparent={true}
            animationType="fade"
            style={{
               alignItems: 'center',
               justifyContent: 'center',
            }}>
            <View
               style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  position: 'absolute',
                  height,
                  width,
                  justifyContent: 'center',
                  alignItems: 'center',
               }}>
               <HowAreYouFeeling />
            </View>
         </Modal>
      </View>
   );
};

export default inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(observer(HowAreYouModal));
