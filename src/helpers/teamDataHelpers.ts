import { moment } from 'helpers/generalHelpers';;
import firebaseInstance from '../config/Firebase';
export const getEndDateKey = (challenge: any) => {
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

   return endDateKey;
};

export const convertEndDateKeyToMonth = (endDateKey) => {
   return moment(endDateKey, 'DDMMYYYY').format('MMM');
};

export const getDaysLeft = (challenge: any, plusText: boolean = false) => {
   const endDateKey = moment().endOf('isoWeek').format('DDMMYYYY');
   const endUnix = moment().endOf('isoWeek').unix();
   // if (duration == 'monthly') {
   //    endDateKey = moment().endOf('month').format('DDMMYYYY');
   //    endUnix = moment().endOf('month').unix();
   // }

   var todaysdate = moment();
   const eventdate = moment(endDateKey, 'DDMMYYYY');

   const daysLeft = eventdate.diff(todaysdate, 'days') + 1;

   if (plusText) {
      return daysLeft == 1 ? daysLeft + ' day left' : daysLeft + ' days left';
   } else {
      return daysLeft;
   }
};

export const checkInfinity = (num) => {
   const X = 2;

   if (isFinite(num)) {
      return +(Math.round(num + 'e+' + X) + 'e-' + X);
   } else {
      return 0;
   }
};

export const getThisWeekTarget = (team) => {
   return team?.mostRecentTarget || 10000;
};

export const getTeamDaysLeft = (team: any, plusText: boolean = false) => {
   //    if (!team?.duration) {
   //       return "doesn't work";
   //    }

   let endDateKey = moment().endOf('isoWeek').format('DDMMYYYY');

   var todaysdate = moment();
   const eventdate = moment(endDateKey, 'DDMMYYYY');

   const daysLeft = eventdate.diff(todaysdate, 'days') + 1;

   if (plusText) {
      return daysLeft == 1 ? daysLeft + ' day left' : daysLeft + ' days left';
   } else {
      return daysLeft;
   }
};
export const endOfCurrentWeekKey = () =>
   moment().endOf('isoWeek').format('DDMMYYYY');

export const getDefaultWeeklyActivity = (team) => {
   const defaultTeamWeeklyTarget = parseInt(team?.mostRecentTarget) || 10000;
   const numberOfPlayers = team?.joined?.length;
   const daysLeft = getTeamDaysLeft();
   const score = 0;
   const todayKey = moment().format('DDMMYYYY');

   return {
      myScoreToday: 0,
      myTargetToday: defaultTeamWeeklyTarget / daysLeft / numberOfPlayers,
      teamTodayProgress: 0,
      thisWeekTarget: defaultTeamWeeklyTarget,
      daysLeft,
      numberOfPlayers,
      score,
   };
};

export const thisWeekTarget = (team) => {
   const longEndDate = moment().endOf('isoWeek').format('ddd Do MMM YYYY');
   const endDateKey = moment().endOf('isoWeek').format('DDMMYYYY');
   return team?.targets
      ? team?.targets[endDateKey] || team?.mostRecentTarget || 10000
      : 10000;
};
export const getTeamWeeklyData = (weeklyDoc, team) => {
   if (!weeklyDoc) {
      // alert('No weekly doc!');
      return getDefaultWeeklyActivity(team);
   }
   const { uid } = firebaseInstance.auth.currentUser;
   const todayKey = moment().format('DDMMYYYY');
   const numberOfplayers = team?.joined?.length || 1;
   const teamTodayScore = weeklyDoc?.daily?.[todayKey]?.score || 0;

   const myScoreToday =
      weeklyDoc?.players?.[uid]?.daily?.[todayKey]?.score || 0;
   const score = weeklyDoc?.score || 0;
   const thisWeekTarget = parseInt(weeklyDoc?.target) || 10000;

   const scoreAsOfYesterday = score > 0 ? score - teamTodayScore : 0;
   const daysLeft = getTeamDaysLeft();
   const alreadyWonWeek = score > thisWeekTarget;

   const teamTargetToday = parseFloat(
      (thisWeekTarget - scoreAsOfYesterday) / daysLeft,
   ).toFixed(0);
   const myTargetToday = checkInfinity(
      parseFloat(teamTargetToday / numberOfplayers).toFixed(0),
   );

   const teamTodayProgress = checkInfinity(
      parseFloat((teamTodayScore / teamTargetToday) * 100).toFixed(2),
   );

   const teamWeekProgress = checkInfinity(
      parseFloat((score / thisWeekTarget) * 100).toFixed(2),
   );

   const teamWeekScore = score;

   const myTodayProgress = checkInfinity(
      parseFloat((myScoreToday / myTargetToday) * 100).toFixed(0),
   );

   const wDoc = weeklyDoc || {};

   return {
      ...weeklyDoc,
      teamTodayScore,
      teamWeekProgress,
      thisWeekTarget,
      teamTargetToday,
      teamTodayTarget: teamTargetToday,
      myTargetToday,
      myScoreToday,
      numberOfplayers,
      daysLeft,
      scoreAsOfYesterday,
      teamTodayProgress,
      teamWeekScore,
      myTodayProgress,
      alreadyWonWeek,
      // ...wDoc,
   };
};
export const getTeamData = (
   team: any,
   level: any = 1,
   challengesStore: any,
   type: any,
) => {
   const todayKey = moment().format('DDMMYYYY');
   const numberOfplayers = team?.joined?.length || 0;
   const selectedTarget = getThisWeekTarget(team);
   const daysLeft = getTeamDaysLeft(team);

   const daysLeftWithText = getTeamDaysLeft(team) + ' days left';

   const endOfDay = moment().endOf('day');
   const dur = moment.duration(moment(endOfDay).diff(moment()));
   let hoursRemain = dur.hours();

   const startDateLabel = moment().endOf('isoWeek').format('DD/MM/YYYY');
   const endDateLabel = moment().endOf('isoWeek').format('DD/MM/YYYY');
   const endWeekKey = moment().endOf('isoWeek').format('DDMMYYYY');

   return { todayKey, endWeekKey, numberOfplayers, ...team };
};


export const playerColors = [
   '#3972F6',
   '#318CD4',
   '#41CDEB',
   '#31D4C7',
   '#3EF8B7',
   '#F639C3',
   '#C031D4',
   '#AA42EB',
   '#6A31D4',
   '#4E3EF8',
   '#F63B22',
   '#D41E2C',
   '#59F678',
   '#59D44C',
   '#9CEB60',
   '#B5D44C',
   '#4D8000',
   '#F8F35E',
   '#CC80CC',
   '#66664D',
   '#991AFF',
   '#E666FF',
   '#4DB3FF',
   '#1AB399',
   '#3972F6',
   '#318CD4',
   '#41CDEB',
   '#31D4C7',
   '#3EF8B7',
   '#F639C3',
   '#C031D4',
   '#AA42EB',
   '#3972F6',
   '#318CD4',
   '#41CDEB',
   '#31D4C7',
   '#3EF8B7',
   '#F639C3',
   '#C031D4',
   '#AA42EB',
   '#6A31D4',
   '#4E3EF8',
   '#F63B22',
   '#D41E2C',
   '#59F678',
   '#59D44C',
   '#9CEB60',
   '#B5D44C',
   '#4D8000',
   '#F8F35E',
   '#CC80CC',
   '#66664D',
   '#991AFF',
   '#E666FF',
   '#4DB3FF',
   '#1AB399',
   '#3972F6',
   '#318CD4',
   '#41CDEB',
   '#31D4C7',
   '#3EF8B7',
   '#F639C3',
   '#C031D4',
   '#AA42EB',
   '#3972F6',
   '#318CD4',
   '#41CDEB',
   '#31D4C7',
   '#3EF8B7',
   '#F639C3',
   '#C031D4',
   '#AA42EB',
   '#6A31D4',
   '#4E3EF8',
   '#F63B22',
   '#D41E2C',
   '#59F678',
   '#59D44C',
   '#9CEB60',
   '#B5D44C',
   '#4D8000',
   '#F8F35E',
   '#CC80CC',
   '#66664D',
   '#991AFF',
   '#E666FF',
   '#4DB3FF',
   '#1AB399',
   '#3972F6',
   '#318CD4',
   '#41CDEB',
   '#31D4C7',
   '#3EF8B7',
   '#F639C3',
   '#C031D4',
   '#AA42EB',
];