import { moment } from 'helpers/generalHelpers';;


moment.defineLocale('en', {
   relativeTime: {
      future: 'in %s',
      past: '%s',
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

export const goalDayOf = (serverTimestamp) => {
  const startDate = serverTimestamp && typeof serverTimestamp.toDate === 'function'
    ? serverTimestamp.toDate()
    : moment().toDate();

  const now = moment();
  const start = moment(startDate);

  console.log('startxx', start);
  const days = now.diff(start, 'days');
  return days + 1;
};


export const goalDateEnding = (serverTimestamp, daysTotal) => {

   const startDate = serverTimestamp && typeof serverTimestamp.toDate === 'function'
   ? serverTimestamp.toDate()
   : moment().toDate();
      // const formattedStartDate = moment(startDate).format('Do MM Y'); // Change the format as desired

 // return end date using startDate and adding daysTotal then returning formatted date

   const endDate = moment(startDate).add(daysTotal, 'days');
   const formattedEndDate = moment(endDate).format('ddd Qo MMM'); // Change the format as desired
   return formattedEndDate;
}

export const checkIsSameDay = (unix, dayKey) => { 

   // check if smashStore.todayDateKey is the same day as the unix value from userDay.updatedAt using moment
 // dayKey is 'DDMMYYYY'

   const day = moment(dayKey, 'DDMMYYYY').startOf('day');
   const now = moment(unix, 'X').startOf('day');
   return day.isSame(now, 'day');
   


 


    
}
export const getWeeksAgo = (endWeekKey)=> {
   const endWeek = moment(endWeekKey, 'DDMMYYYY').endOf('isoWeek').endOf('day');
   const now = moment().endOf('day');
   
   if (now.diff(endWeek, 'days') <= 0) {
     return 'This week';
   } else if (now.diff(endWeek, 'weeks') === 0) {
     return 'Last week';
   } else if((now.diff(endWeek, 'weeks') === 1)){

      const weeksAgo = now.diff(endWeek, 'weeks');
      return `${weeksAgo} week ago`;
   }else {
     const weeksAgo = now.diff(endWeek, 'weeks');
     return `${weeksAgo} weeks ago`;
   }
 }

 export const unixToDay = (unix)=> {
  return moment.unix(unix).format('ddd'); // "Fri"

 }

export const convertEndDateKeyToFriendly = (endDateKey) => {
   return moment(endDateKey, 'DDMMYYYY').format('ddd Do MMM YY') || 'loading';
};

export const convertEndDateKeyToFriendlyShort = (endDateKey) => {
   return moment(endDateKey, 'DDMMYYYY').format('ddd Do MMM') || 'loading';
};


export const hasBeenUpdatedRecently = (player) => {
   // console.log('player.updatedAt', player);
   const now = moment().unix();
   const timeToCheckWithin = 86400 * 5;
   const daysAgo = now - timeToCheckWithin;
   return parseInt(player.updatedAt) < daysAgo;
};
export const challengeDaysSmashed = (playerChallenge = {}) => {
   const daily = playerChallenge?.daily || false;
   const { selectedLevel = 1, dailyTargets = {} } = playerChallenge;
   const selectedLevelIndex = parseInt(selectedLevel) - 1;
   const isQty = playerChallenge?.targetType == 'qty';
   const dailyTarget = dailyTargets[selectedLevelIndex];
   return daily
      ? Object.keys(daily).filter(
         (key) => {
           
            return isQty ? parseInt(daily?.[key]?.qty) >= parseInt(dailyTarget) : parseInt(daily?.[key]?.score) >= parseInt(dailyTarget)
         },
      )?.length
      : 0;
};

export const playerChallengeWon = (playerChallenge = {}) => {

   return challengeDaysSmashed(playerChallenge) >= daysInChallenge(playerChallenge)

}

export const challengeDaysActive = (playerChallenge = {}) => {
   const daily = playerChallenge?.daily || false;

   const isQty = playerChallenge?.targetType == 'qty';
   return daily
      ? Object.keys(daily).filter(
           (key) => (isQty ? daily?.[key]?.qty : daily?.[key]?.score) > 0,
        ).length
      : 0;
};
export const challengeConsistency = (playerChallenge = {}) => {
   const daysSmashed = challengeDaysActive(playerChallenge);
   const numDaysInChallenge = dayNumberOfChallenge(playerChallenge);

   return parseInt((daysSmashed / numDaysInChallenge) * 100);
};

export const unixToFromNowShort = (unix) => {
   return unix ? moment(unix, 'X').fromNow() : '...';
};

export const unixToHuman = (unix) => {
   return unix ? moment(unix, 'X').format('ddd Do MMM YY') : '...';
};


export const todayHuman = () => {
   return moment().format('ddd Do');
};

export const todayDateKey = () => {
   return moment().format('DDMMYYYY');
};
export const dayKeyToHuman = (dayKey) => {
   return moment(dayKey, 'DDMMYYYY').format('ddd Do MMM YY');
};

export const dayKeyToShortDay = (dayKey) => {
   return moment(dayKey, 'DDMMYYYY').format('ddd');
};

export const dayKeyToDayDate = (dayKey) => {
   return moment(dayKey, 'DDMMYYYY').format('D');
};

export const thisMonth = () => {
   return moment().format('MMMM');
};

export const dayKeyToStartOfWeek = (dayKey) => {
   return moment(dayKey, 'DDMMYYYY').startOf('isoWeek').format('ddd Do MMM');
};

export const unixToMonth = (unix) => {
   return moment(unix, 'X').format('MMMM');
};

export const unixToM = (unix) => {
   return moment(unix, 'X').format('MMM');
};

export const unixToD = (unix) => {
   return moment(unix, 'X').format('Do');
};

export const endMonthKey = () => {
   return moment().endOf('month').format('DDMMYYYY');
};

export const daysInMonthOfPlayerChallenge = (playerChallenge = {}) => {
   let end = moment(playerChallenge.endDate, 'DDMMYYYY');
   const duration = end.daysInMonth();
   return duration;
};
export const daysInChallenge = (playerChallenge = {}) => {
   const duration =
      playerChallenge.duration > 0 ? playerChallenge.duration : false;
   let start = moment(playerChallenge.startDate, 'DDMMYYYY');
   let end = moment(playerChallenge.endUnix, 'X');

   let monthly = playerChallenge.duration == 'monthly';

   return duration
      ? duration
      : monthly
      ? end.daysInMonth()
      : end.diff(start, 'days') + 1; // =1
};

export const daysLeftInChallenge = (playerChallenge = {}) => {
   let start = moment();
   let end = moment(playerChallenge.endDate, 'DDMMYYYY');
   return end.diff(start, 'days') + 1; // =1
};

export const daysLeftInWeek = () => {
   let start = moment();
   let end = moment().endOf('isoWeek');
   return end.diff(start, 'days'); // =1
};

export const dayNumberOfChallenge = (playerChallenge = {}) => {
   let start = moment(playerChallenge.startDate, 'DDMMYYYY');
   let end = moment();
   return end.diff(start, 'days') + 1; // =1
};;

export const startDateLabel = (playerChallenge)=>{
const {startDateKey} = playerChallenge;
   return moment(startDateKey, 'DDMMYYYY').format('Do MMM YYYY')
}

export const since = (playerChallenge = {}) => {
   const { startDateKey } = playerChallenge;
   return moment(startDateKey, 'DDMMYYYY').fromNow()
}

export const endDateLabel = (playerChallenge)=>{
   const {endDate} = playerChallenge;
      return moment(endDate, 'DDMMYYYY').format('Do MMM YYYY')
   }


   export const dayKeyIsInFuture = (dayKey) => {
      return moment(dayKey, 'DDMMYYYY').isAfter();
   };

export const getDayLabelsForPlayerChallenge = (playerChallenge = {}) => {
   const dayLabels = [];
   let count = playerChallenge.duration || daysInChallenge(playerChallenge);
  
   let i = 0;
   while (i < count) {
      dayLabels.push(
         moment(playerChallenge?.startDate, 'DDMMYYYY')
            .add(i, 'days')
            .startOf('day')
            .format('DDMMYYYY'),
      );

      i++;
   }

   return dayLabels;
};

export const isInFuture = (dayKey) => {
   return moment(dayKey, 'DDMMYYYY').isAfter(moment());
};

export const getDayLabelsForPlayerChallengeSoFar = (playerChallenge = {}) => {
   const dayLabels = [];
   let count = dayNumberOfChallenge(playerChallenge);

   let i = count;
   while (i--) {
      dayLabels.push(
         moment(playerChallenge.startDate, 'DDMMYYYY')
            // .subtract(daysLeft, 'days')
            .add(count, 'days')
            .subtract(i, 'days')
            .startOf('day')
            .format('DDMMYYYY'),
      );
   }

   return dayLabels;
};