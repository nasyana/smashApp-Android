import { Video, Audio } from 'expo-av';

export const pluckSound = async () => {
   const { sound } = await Audio.Sound.createAsync(
      require('../sounds/pluck1.wav'),
   );
   // setSound(sound);
   await sound.playAsync();
};
