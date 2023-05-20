import { moment } from 'helpers/generalHelpers';;

export const getEndDateKey = (challenge: any) => {
  const {duration} = challenge;

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

export const getDaysLeft = (challenge: any, plusText: boolean = false) => {

  if (!challenge?.duration) { return "doesn't work" }
  const {duration} = challenge;

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
    return daysLeft + 1;
  }
};



export const getPlayerChallengeData = (
  playerChallenge: any,
  level: any = 1,
  challengesStore: any,
  type: any
) => {

  const pinkPurpleGradient = ['#C33764', '#1D2671'];
  const fitnessGradient = ['#192840', '#2440dd'];
  const greyGradient = ['#eee', '#ccc'];
  const goldGradient = ['gold', 'black'];

  const allGradients = [greyGradient, fitnessGradient, pinkPurpleGradient, goldGradient]
  const todayKey = moment().format('DDMMYYYY');

  const targets = playerChallenge?.targets || false;
  const selectedTodayScore = playerChallenge?.targetType == 'qty' ? playerChallenge?.daily?.[todayKey]?.qty : playerChallenge?.daily?.[todayKey]?.score || 0;

  const selectedLevel = level || playerChallenge?.selectedLevel || 1;

  const selectedTarget = targets[selectedLevel] || 0;
  const daysLeft = getDaysLeft(playerChallenge)

  const now = moment();
  const endOfDay = moment().endOf('day')
  const dur = moment.duration(moment(endOfDay).diff(moment()));
  let hoursRemain = dur.hours();

  const startDateLabel =
    playerChallenge?.duration == 'monthly'
      ? moment().startOf('month').format('DD/MM/YYYY')
      : moment().endOf('isoWeek').format('DD/MM/YYYY');
  const endDateLabel =
    playerChallenge?.duration == 'monthly'
      ? moment().endOf('month').format('DD/MM/YYYY')
      : moment().endOf('isoWeek').format('DD/MM/YYYY');
  const selectedScore =
    playerChallenge?.targetType == 'qty'
      ? playerChallenge?.qty
      : playerChallenge?.score;

  const todayScore = parseInt(playerChallenge?.daily?.[todayKey]?.score || 0);
  const todayQty = parseInt(playerChallenge?.daily?.[todayKey]?.qty || 0);
  const hasReachedTarget = selectedScore > selectedTarget;
  const durationLabel = playerChallenge?.duration == 'weekly' ? 'Weekly' : 'Monthly';

  const selectedIndex = selectedTarget ? selectedTarget - 1 : 0;

  let wonTarget = 0;
  let wonGradient = fitnessGradient;
  let wonLevel = false;
  if (selectedScore >= targets?.[1] && selectedScore < targets?.[2]) {
     wonTarget = targets?.[1];
     wonGradient = fitnessGradient;
     wonLevel = 1;
  } else if (selectedScore >= targets?.[2] && selectedScore < targets?.[3]) {
     wonTarget = targets?.[2];
     wonGradient = pinkPurpleGradient;
     wonLevel = 2;
  } else if (selectedScore >= targets?.[3]) {
     wonTarget = targets?.[3];
     wonGradient = goldGradient;
     wonLevel = 3;
  } else {
     wonGradient = greyGradient;
     wonTarget = 0;
  }

  let selectedGradient = fitnessGradient;

  if (selectedLevel == 2) {
     selectedGradient = pinkPurpleGradient;
  }

  if (selectedLevel == 3) {
     selectedGradient = goldGradient;
  }

  let progress = hasReachedTarget
     ? 100
     : (parseInt(selectedScore) / parseInt(selectedTarget)) * 100;

  const selectedTodayTarget =
     selectedTodayScore > 0
        ? parseInt(
             (selectedTarget - selectedScore) / daysLeft + selectedTodayScore,
          )
        : parseInt((selectedTarget - selectedScore) / daysLeft);
  const todayProgress =
     selectedTodayScore > 0
        ? (selectedTodayScore / selectedTodayTarget) * 100
        : 0;
  const badgeDisplayNumber = type == 'won' ? wonTarget : selectedTarget;
  const gradient = type == 'won' ? wonGradient : selectedGradient;

  return {
     selectedTarget,
     selectedScore,
     startDateLabel,
     endDateLabel,
     todayScore,
     todayQty,
     hasReachedTarget,
     todayProgress,
     progress,
     selectedGradient,
     durationLabel,
     selectedTodayScore,
     daysLeft,
     selectedTodayTarget,
     timeLeftToday: hoursRemain,
     badgeDisplayNumber,
     gradient,
     greyGradient,
     allGradients,
     wonLevel,
  };
};
