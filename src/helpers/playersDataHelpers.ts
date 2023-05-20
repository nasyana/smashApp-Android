import { moment } from 'helpers/generalHelpers';;
import { dayNumberOfChallenge, daysInChallenge, daysLeftInChallenge } from './dateHelpers';

export const getEndDateKey = (challenge: any) => {
   const { duration, endUnix } = challenge;

   let endDateKey = moment(endUnix,'X').format('DDMMYYYY');


   if (duration == 'weekly') {
      endDateKey = moment(endUnix,'X').format('DDMMYYYY');

   } else {
      endDateKey = moment(endUnix,'X').format('DDMMYYYY');
   
   }

   return endDateKey;
};

export const getTodayData = (challenge: any) => {

   const todayKey = moment().format('DDMMYYYY');
   const todayScore = parseInt(challenge?.daily?.[todayKey]?.score || 0);
   const todayQty = parseInt(challenge?.daily?.[todayKey]?.qty || 0);
   const todayTarget = parseInt(challenge?.daily?.[todayKey]?.target || 0);
   const todayProgress = Math.round(
      todayScore > 0 ? (todayScore / todayTarget) * 100 : 0,
   );
      
   const todaySelectedLevel = parseInt(challenge?.selectedLevel) || 1;

   return {todayScore, todayQty, todayTarget, todayProgress, todaySelectedLevel}
}


export const convertEndDateKeyToMonth = (endDateKey) => {
   return moment(endDateKey, 'DDMMYYYY').format('MMM') || 'loading';
};
export const convertEndDateKeyToFriendly = (endDateKey) => {
   return moment(endDateKey, 'DDMMYYYY').format('ddd Do MMM YYYY') || 'loading';
};

export const getChallengeData = (challenge) => {
   const endDateKey = getEndDateKey(challenge);
   const daysLeft = getDaysLeft(challenge);
   const daysLeftWithText = getDaysLeft(challenge, true);

   const shortDateName =
      challenge.duration == 'monthly'
         ? moment().endOf('month').format('MMM')
         : moment().endOf('isoWeek').format('DD/MM');

   const startDateLabel =
      challenge.duration == 'monthly'
         ? moment().startOf('month').format('DD/MM/YYYY')
         : moment().endOf('isoWeek').format('DD/MM/YYYY');
   const endDateLabel =
      challenge.duration == 'monthly'
         ? moment().endOf('month').format('DD/MM/YYYY')
         : moment().endOf('isoWeek').format('DD/MM/YYYY');
   return {
      daysLeft: daysLeft, // days left number
      daysLeftWithText, // days left with text at the end
      endDateKey: endDateKey, // end date key DDMMYYYY
      numberOfActivities: challenge?.masterIds?.length, // number of masterIds added
      numberOfPlayers:
         challenge?.challengeTimeframes?.[endDateKey]?.playing || 0, // number
      shortDateName, // //Short String DD/MM
      startDateLabel,
      endDateLabel,
      ...challenge,
   };
};

export const getDaysLeft = (challenge: any, plusText: boolean = false) => {
   if (!challenge?.duration) {
      return "doesn't work";
   }
   const { duration } = challenge;

   let endDateKey = moment().endOf('isoWeek').format('DDMMYYYY');
   let endUnix = moment().endOf('isoWeek').unix();

   if (duration == 'weekly') {
      endDateKey = moment().endOf('isoWeek').format('DDMMYYYY');
      endUnix = moment().endOf('isoWeek').unix();
   }
   if (duration == 'monthly') {
      endDateKey = moment().endOf('month').format('DDMMYYYY');
      endUnix = moment().endOf('month').unix();
   }

   var todaysdate = moment();
   const eventdate = moment(endDateKey, 'DDMMYYYY');

   const daysLeft = eventdate.diff(todaysdate, 'days') + 1;

   if (plusText) {
      return daysLeft == 1 ? daysLeft + ' day left' : daysLeft + ' days left';
   } else {
      return daysLeft;
   }
};

export const getPlayerChallengeDayData = (playerChallenge, dayKey) => {

   const selectedLevel = parseInt(playerChallenge?.selectedLevel) || 1;
   const isQty = playerChallenge?.targetType == 'qty' ? true : false;
   const dayScore = parseInt(playerChallenge?.daily?.[dayKey]?.score || 0);
   const dayQty = parseInt(playerChallenge?.daily?.[dayKey]?.qty || 0);
   const selectedDayTarget = parseInt(playerChallenge?.daily?.[dayKey]?.target || playerChallenge?.dailyTargets?.[selectedLevel - 1] || 0);
   const selectedDayScore = isQty ? dayQty : dayScore;
   const selectedDayProgress = Math.round(
      selectedDayScore > 0
         ? (selectedDayScore / selectedDayTarget) * 100
         : 0,
   );

   return {selectedDayScore, selectedDayTarget,selectedDayProgress}

}

export const getPlayerChallengeDaysLeft = (
   playerChallenge: any,
   plusText: boolean = false,
) => {
   if (!playerChallenge?.duration) {
      return "doesn't work";
   }
   const { duration } = playerChallenge;

   let endDateKey = moment(playerChallenge.endUnix, 'X').format('DDMMYYYY');
   let endUnix = playerChallenge.endUnix;

   var todaysdate = moment();
   const eventdate = moment(endDateKey, 'DDMMYYYY');

   const daysLeft = eventdate.diff(todaysdate, 'days') + 1;

   if (plusText) {
      return daysLeft == 1 ? daysLeft + ' day left' : daysLeft + ' days left';
   } else {
      return daysLeft;
   }
};

export const getPlayerChallengeData = (
   playerChallenge: any,
   dayKey = false
) => {


   const endType = playerChallenge?.endType || 'daily';
   const isQty = playerChallenge?.type == 'qty' ? true : false;
   const todayKey = dayKey ? dayKey : moment().format('DDMMYYYY');

   const selectedTodayScore =
      playerChallenge?.targetType == 'qty'
         ? playerChallenge?.daily?.[todayKey]?.qty || 0
         : playerChallenge?.daily?.[todayKey]?.score || 0;

   const selectedLevel = playerChallenge?.selectedLevel || 1;
   
   // const dayNumber = dayNumberOfChallenge(playerChallenge);
   // const endOfDay = moment().endOf('day');
   // const dur = moment.duration(moment(endOfDay).diff(moment()));
   // let hoursRemain = dur.hours();

   const todayScore = parseInt(playerChallenge?.daily?.[todayKey]?.score || 0);
   const todayQty = parseInt(playerChallenge?.daily?.[todayKey]?.qty || 0);

   const dailyTargets = playerChallenge?.dailyTargets || {};
   const selectedIndex = selectedLevel ? parseInt(selectedLevel) - 1 : 0;

   let selectedTodayTarget = endType == 'deadline' ? (parseInt(playerChallenge?.target) / playerChallenge?.endDuration) : dailyTargets?.[selectedIndex] || 0;

   const todayProgress = Math.round(
      selectedTodayScore > 0
         ? (selectedTodayScore / selectedTodayTarget) * 100
         : 0,
   );
   
   const remainingToday =
      selectedTodayTarget > 0 ? selectedTodayTarget - selectedTodayScore : 0;


   return {
      ...playerChallenge,
      isQty,
      remainingToday,
      selectedTodayScore,
      selectedTodayTarget,
      // startDateLabel,
      todayScore,
      todayQty,
      todayProgress,
      // timeLeftToday: hoursRemain,
      // dayNumberOfChallenge: dayNumber
   };
};
