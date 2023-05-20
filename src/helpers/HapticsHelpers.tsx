import * as Haptics from 'expo-haptics';

export const Vibrate = (strength?: any) => {
   if (strength) {
      Haptics.impactAsync(strength);
   } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
   }
};
