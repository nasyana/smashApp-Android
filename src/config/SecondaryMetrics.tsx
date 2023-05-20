import {
   Colors,
   Typography,
   Spacings,
   ThemeManager,
} from 'react-native-ui-lib';

import { moment } from 'helpers/generalHelpers';;
import firebase from 'firebase';
import Firebase from 'config/Firebase';

export const METRICS = [
   { NONE: 'NONE', id: 0, value: 'NONE', option: 'NONE' },
   { KMS: 'KMS', id: 1, value: 'KMS', option: 'KMS' },
   { REPS: 'REPS', id: 2, value: 'REPS', option: 'REPS' },
   // { PLANKS: 'PLANKS', id: 3, value: 'PLANKS', option: 'PLANKS' },
   { PLANK_SECONDS: 'PLANK_SECONDS', id: 3, value: 'PLANK_SECONDS', option: 'PLANK SECONDS' },
   { STAR_JUMPS: 'STAR_JUMPS', id: 4, value: 'STAR_JUMPS', option: 'STAR JUMPS' },
   { LITRES_WATER: 'LITRES_WATER', id: 5, value: 'LITRES_WATER', option: 'LITRES WATER' },
   { MINS_TRAINING: 'MINS_TRAINING', id: 6, value: 'MINS_TRAINING', option: 'MINS TRAINING' },
   { MINS_GRATEFUL: 'MINS_GRATEFUL', id: 7, value: 'MINS_GRATEFUL', option: 'MINS GRATEFUL' },
   { MINS_MEDITATION: 'MINS_MEDITATION', id: 8, value: 'MINS_MEDITATION', option: 'MINS MEDITATION' },
   { MINS_STUDY: 'MINS_STUDY', id: 9, value: 'MINS_STUDY', option: 'MINS STUDY' },
   { HOURS_AT_WORK: 'HOURS_AT_WORK', id: 10, value: 'HOURS_AT_WORK', option: 'MINS STUDY' },
   { MINS_BREATHWORK: 'MINS_BREATHWORK', id: 11, value: 'MINS_BREATHWORK', option: 'MINS BREATHWORK' },
   { HOURS_FASTING: 'HOURS_FASTING', id: 12, value: 'HOURS_FASTING', option: 'HOURS FASTING' },
   { TIMES_FOCUSSED_ON_GOALS: 'TIMES_FOCUSSED_ON_GOALS', id: 13, value: 'TIMES_FOCUSSED_ON_GOALS', option: 'TIMES FOCUSSED ON GOALS' },
];

// export const storeSecondaryMetricData = (uid, METRIC, metricMultiplier, qty activityId) => {

//     const dayKey = moment().format('DDMMYYYY');
//     const endOfWeekKey = moment().endOf('isoWeek').format('DDMMYYYY');
//     const endOfMonthKey = moment().endOf('month').format('DDMMYYYY')
//     const yearKey = moment().format('YYYY')

//     const metricQty = qty * metricMultiplier;
//     /// save into day, week, month, year, all time
//     Firebase.firestore.collection('metrics').doc(`${uid}`).set({
//         [activityId]: {
//             days: { [dayKey]: firebase.firestore.FieldValue.increment(qty) },
//             weeks: { [endOfWeekKey]: firebase.firestore.FieldValue.increment(qty) },
//             months: { [endOfMonthKey]: firebase.firestore.FieldValue.increment(qty) },
//             years: { [yearKey]: firebase.firestore.FieldValue.increment(qty) },
//             allTime: firebase.firestore.FieldValue.increment(qty)

//         },
//         [METRIC]: {
//             days: { [dayKey]: firebase.firestore.FieldValue.increment(metricQty) },
//             weeks: { [endOfWeekKey]: firebase.firestore.FieldValue.increment(metricQty) },
//             months: { [endOfMonthKey]: firebase.firestore.FieldValue.increment(metricQty) },
//             years: { [yearKey]: firebase.firestore.FieldValue.increment(metricQty) },
//             allTime: firebase.firestore.FieldValue.increment(metricQty)
//         }
//     }, { merge: true })

// };
