import { Assets } from 'react-native-ui-lib';


export const textShadow = {
   textShadowColor: 'rgba(0, 0, 0, 0.4)',
   textShadowOffset: { width: 0, height: 0 },
   textShadowRadius: 4,
};
export const badgeLevelStyles = [
   {
      // targetColor: '#287AB7',
      targetColor: '#fff',
      unitColor: '#fff',
      unitStyle: { marginTop: -15, marginBottom: 0, fontSize: 8 },
   },
   {
      // targetColor: '#287AB7',
      targetColor: '#fff',
      unitColor: '#fff',
      unitStyle: { marginTop: -15, marginBottom: 0, fontSize: 8 },
   },
   {
      // targetColor: '#785C9D',
      targetColor: '#fff',
      unitColor: '#fff',
      unitStyle: { marginTop: -15, marginBottom: 0, fontSize: 8 },
   },
];

export const greyBadge = {
   targetColor: '#aaa',
   unitColor: '#aaa',
   unitStyle: { marginTop: -15, marginBottom: 0, fontSize: 8 },
   targetStyle: { marginBottom: 5 },
};

export function getBadgeAsset(selectedLevel) {
   let badgeAsset = Assets.icons.badge1;
   if (selectedLevel == 2) {
      badgeAsset = Assets.icons.badge2;
   }
   if (selectedLevel == 3) {
      badgeAsset = Assets.icons.badge3;
   }
   return badgeAsset;
}
