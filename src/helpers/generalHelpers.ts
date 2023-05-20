import moment from 'moment-timezone';
import firebaseInstance from 'config/Firebase';
import { Timestamp } from 'firebase/firestore';


import { Assets } from 'react-native-ui-lib';
export const getDayChar = (date) => {
   return moment(date, 'DDMMYYYY').format('dd');
};

export const getDayShort = (date) => {
   return moment(date, 'DDMMYYYY').format('ddd');
};

export { moment };
export const getDayNum = (date) => {
   return moment(date, 'DDMMYYYY').format('D');
};

export const boxShadow = {
   shadowRadius: 3,
   shadowOpacity: 0.,
   shadowColor: '#171717',
   shadowOffset: { width: 0, height: 2 },
};



export const challengeDaysSmashed = (playerChallenge) => {
   const daily = playerChallenge?.daily || false;

   const { selectedLevel = 1, dailyTargets = {} } = playerChallenge;
   const selectedLevelIndex = parseInt(selectedLevel) - 1;
   const isQty = playerChallenge?.targetType == 'qty';
   const dailyTarget = dailyTargets[selectedLevelIndex];

   const numDaysSmashed = daily
      ? Object.keys(daily).filter(
         (key) => {
          
            return isQty ? parseInt(daily?.[key]?.qty) >= parseInt(dailyTarget) : parseInt(daily?.[key]?.score) >= parseInt(dailyTarget)
         },
      )?.length
      : 0;

   return numDaysSmashed
};

export const challengeDaysActive = (playerChallenge) => {
   const daily = playerChallenge?.daily || false;

   const { selectedLevel = 1, dailyTargets = {} } = playerChallenge;
   const selectedLevelIndex = parseInt(selectedLevel) - 1;
   const isQty = playerChallenge?.targetType == 'qty';
   const dailyTarget = dailyTargets[selectedLevelIndex];

   const numDaysActive = daily
      ? Object.keys(daily).filter(
         (key) => {
         
            return isQty ? parseInt(daily?.[key]?.qty) > 0 : parseInt(daily?.[key]?.score) > 0
         },
      )?.length
      : 0;

   return numDaysActive
};

export const getCompareChallengeDaysSmashed = (playerChallenge) => {
   const daily = playerChallenge?.daily || false;

   const {selectedLevel = 1, dailyTargets = {}} = playerChallenge;
const selectedLevelIndex = parseInt(selectedLevel) - 1;
   const isQty = playerChallenge?.targetType == 'qty';
const dailyTarget = dailyTargets[selectedLevelIndex];

   const numDaysSmashed = daily
      ? Object.keys(daily).filter(
         (key) => {
            
            return isQty ? parseInt(daily?.[key]?.qty) >= parseInt(dailyTarget) : parseInt(daily?.[key]?.score) >= parseInt(dailyTarget)
         },
        )?.length
      : 0;
         const duration = parseInt(playerChallenge?.duration);
      return [numDaysSmashed, duration] || [0,0]
};

export const challengeImages = ['focus', 'meditation', 'vaccuum', 'household','pushups','squats', 'training','fire', 'bodyweight', 'distance', 'water', 'gratitude']

export const stringLimit = (str, length, showDots = true)=> {
   let newstr = '';
   if (str?.length > length) {
      newstr = str?.substring(0, length);
   } else {
      newstr = str;
   }

   let end = newstr?.length >= length && showDots ? '..' : '';

   return newstr + end;
}
export const hexToRgbA = (hex, opacity = 1) => {
   var c;
   if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
         c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return (
         'rgba(' +
         [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
         ',' +
         opacity +
         ')'
      );
   }
   // throw new Error('Bad Hex');
   return 'rgba(0,0,0,1)';
};

moment.defineLocale('en', {
   relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: 'seconds',
      ss: '%ss',
      m: 'a minute',
      mm: '%dm',
      h: 'an hour',
      hh: '%dh',
      d: 'a day',
      dd: '%dd',
      M: 'a month',
      MM: '%dM',
      y: 'a year',
      yy: '%dY',
   },
});

export const isDateInPast = (date) => {
   return moment(date, 'DDMMYYYY').isBefore(moment());
};
export const isToday = (date) => {
   return (
      moment(date, 'DDMMYYYY').format('DDMMYYYY') == moment().format('DDMMYYYY')
   );
};

export const unixToFromNow = (timestamp) => {

   if (timestamp) {

      return moment(timestamp, 'X').fromNow();
   //   const momentTimestamp = (timestamp instanceof Timestamp && timestamp?.toDate()) ? moment(timestamp.toDate()).unix() : timestamp;
   //   return moment(momentTimestamp, 'X').fromNow();
   } else {
     return '...';
   }
   
 };
 

export const unixToHuman = (unix) => {
   return unix ? moment(unix, 'X').format('Do MMM YYYY') : '...';
};


export const uid = () => {
   return firebaseInstance.auth.currentUser.uid;
};

export   const  kFormatter = (num) =>{
   if (Math.abs(num) >= 1000000) {
     return Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + 'm';
   } else if (Math.abs(num) > 999) {
     return Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k';
   } else {
     return Math.sign(num) * Math.abs(num).toFixed(1);
   }
 }
 

export const dayStatusTextFromPoints = (points = 0, showPoints = false) => {
 
      let text;

  //case
      if (points === 0) {
         text = null;
      }
      else if (points > 0 && points < 800) {
         text = 'Ok';
      }
      else if (points > 800 && points <= 1500) {
         text = 'Good';
      }
      else if (points > 1500 && points <= 2500) {
         text = 'Great';
      }
      else if (points > 2500 && points <= 3500) {
         text = 'Amazing';
      }
      else if (points > 3500) {
         text = 'Epic';
      }

      if(showPoints){
         return text ? text.toUpperCase() + '\n' + kFormatter(points) : null;

      }else{
         return text ? text.toUpperCase() : null;

      }


  
};


export const achievements = [

   { handle: 'ADDED_CITY', text: 'Complete Sign-Up' },
   { handle: 'JOINED_FIRST_CHALLENGE', text: 'Join First Challenge' },
   { handle: 'SMASH_FIRST_ACTIVITY', text: 'Earn Some Points!' },
   { handle: 'FOLLOWED_A_PLAYER', text: 'Followed Someone' },
   { handle: 'THREE_DAY_STREAK', text: '3 Day Streak' },
   { handle: 'SEVEN_DAY_STREAK', text: '7 Day Streak' },
   { handle: 'TEN_DAY_STREAK', text: '10 Day Streak' },
   { handle: 'REACHED_1K', text: 'Reached 1,000 Points' },
   { handle: 'REACHED_10K', text: 'Reached 10,000 Points' },
   { handle: 'REACHED_100K', text: 'Reached 100,000 Points' },
   // { handle: 'WON_A_CHALLENGE', text: 'Won a Challenge' },
   { handle: 'ADDED_REVIEW', text: 'Added A Review' },

   // { handle: 'THREE_CHALLENGES', text: 'Won 3 Challenges' },
   { handle: 'CREATE_A_TEAM', text: 'Create A Team' },
   { handle: 'WON_TEAM_TARGET', text: 'Won A Team Weekly Target' },



]

export const  numberWithCommas =(x)=> {
   return (x && x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')) || 0;
}

export const  getWeekDayKeys = (sundayDate)=> {
   const days = [];
   const sunday = new Date(
     parseInt(sundayDate.slice(4, 8)),
     parseInt(sundayDate.slice(2, 4)) - 1,
     parseInt(sundayDate.slice(0, 2))
   );
   for (let i = 1; i <= 7; i++) {
     const date = new Date(sunday.getTime() - (7 - i) * 24 * 60 * 60 * 1000);
     const dayKey = `${('0' + date.getDate()).slice(-2)}${('0' + (date.getMonth() + 1)).slice(-2)}${date.getFullYear()}`;
     days.push(dayKey);
   }
   return days;
 }
export const durationImages = [
   {
      key: 3,
      text: '3 days',
      subText: '3 DAY SMASH',
      startDate: moment().format('DDMMYYYY'),
      endDate: moment().add(2, 'days').format('DDMMYYYY'),
      icon: Assets.icons.threeDays,
      color: '#FF7F00'
   },
   {
      key: 7,
      text: '7 days',
      subText: `LET'S GO`,
      startDate: moment().format('DDMMYYYY'),
      endDate: moment().add(6, 'days').format('DDMMYYYY'),
      icon: Assets.icons.sevenDays,
      color: '#FFBA00'
   },
   {
      key: 10,
      text: '10 days',
      subText: 'WARMING UP',
      startDate: moment().format('DDMMYYYY'),
      endDate: moment().add(9, 'days').format('DDMMYYYY'),
      icon: Assets.icons.tenDays,
      color: '#30A2DE'
   },
   {
      key: 14,
      text: '14 days',
      subText: 'FIYAAAH!',
      startDate: moment().format('DDMMYYYY'),
      endDate: moment().add(13, 'days').format('DDMMYYYY'),
      icon: Assets.icons.fourteenDays,
      color: '#35AC00'
   },
   {
      key: 21,
      text: '21 days',
      subText: 'BUILD HABITS',
      startDate: moment().format('DDMMYYYY'),
      endDate: moment().add(20, 'days').format('DDMMYYYY'),
      icon: Assets.icons.twentyOneDays,
      color: '#633895'
   },
   {
      key: 30,
      text: '30 days',
      subText: 'A NEW YOU',
      startDate: moment().format('DDMMYYYY'),
      endDate: moment().add(29, 'days').format('DDMMYYYY'),
      icon: Assets.icons.thirtyDays,
      color: '#F62C62'
   },
   // {
   //    key: 60,
   //    text: '30 days',
   //    subText: 'A NEW YOU',
   //    startDate: moment().format('DDMMYYYY'),
   //    endDate: moment().add(29, 'days').format('DDMMYYYY'),
   //    icon: Assets.icons.thirtyDays,
   //    color: '#F62C62'
   // },
   // {
   //    key: 90,
   //    text: '30 days',
   //    subText: 'A NEW YOU',
   //    startDate: moment().format('DDMMYYYY'),
   //    endDate: moment().add(29, 'days').format('DDMMYYYY'),
   //    icon: Assets.icons.thirtyDays,
   //    color: '#F62C62'
   // },
   // {
   //    key: 120,
   //    text: '30 days',
   //    subText: 'A NEW YOU',
   //    startDate: moment().format('DDMMYYYY'),
   //    endDate: moment().add(29, 'days').format('DDMMYYYY'),
   //    icon: Assets.icons.thirtyDays,
   //    color: '#F62C62'
   // }
];


export const getDurationImages = () => {

return durationImages;
}