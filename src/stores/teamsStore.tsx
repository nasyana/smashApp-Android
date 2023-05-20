import {action, observable, computed, makeObservable, runInAction} from 'mobx';
import { onSnapshot,collection, doc, setDoc, arrayUnion,getDoc,arrayRemove,updateDoc, where, orderBy, query, getDocs,Timestamp } from "firebase/firestore";




import firebaseInstance from '../config/Firebase';

import { moment } from 'helpers/generalHelpers';
// import firebase from 'firebase';
import {inject} from 'mobx-react';
import {ITeamDoc} from 'modules/CreateTeam';
import ImageUpload from 'helpers/ImageUpload';
import { NotificationType } from 'constants/Type';
import { sendEpicNotification } from 'services/NotificationsService';
import {
   optionMajorityFnMapper,
   updateSelectedOption,
} from 'helpers/VotingHelper';
import { checkIfIHaveVoted, hasSomeoneVoted } from 'helpers/VotingHelpers';
import { getTeamData } from 'helpers/teamDataHelpers';
import {makePersistable} from 'mobx-persist-store'
export enum TEAM_ACTIONS {
   ADD = 'Add',
   REMOVE = 'Remove',
}
import AsyncStorage from '@react-native-async-storage/async-storage';
export enum TEAM_FIELD_TYPE {
   JOINED = 'joined',
   REQUESTED = 'requested',
   INVITED = 'invited',
   ADMINS = 'admins',
}
import { getTeamWeeklyData } from 'helpers/teamDataHelpers';
import { httpsCallable } from 'firebase/functions';

const firestore = firebaseInstance.firestore;
const serverTimestamp = ()=>{

   return moment().unix();
}
 
class TeamsStore {
   notificatonStore;
   smashStore;
   teamSnapShotUnSubscribe: any;
   teamWeeklySnapShotUnSubscribe: any;
   voteDocsSnapshotUnSubscribe: any;
   teamTargetVoteDocSnapUnSubscribe: any;
   
   @observable _selectedWeekKey = moment().endOf('isoWeek').format('DDMMYYYY');
   @observable _selectedDayKey = moment().format('DDMMYYYY');
   @observable _teamLoading = false;
   @observable _playersByTeamId = {};
   @observable _showFollowingDialog = false;
   @observable _currentTeam = {};
   @observable _currentTeamWeekly = {};
   @observable _loadingCurrentTeam = false;
   @observable _selectedActions = [];
   @observable _voteDocs: any[] = [];
   @observable _thisWeekTarget: any = 10000;
   @observable _settings = {};
   @observable _myTeams = [];
   @observable _playersProgressById = {};
   @observable _teamTodayActivityByTeamId = {};
   @observable _teamTargetVoteDoc = {};
   @observable _isTeamVoteDialogVisible = false;
   @observable _weeklyActivityArray = [];
   @observable _legacyActivitiesHash = {};
   @observable _users = {};
   @observable _playerDataByTeamId = {};
   @observable _teamUsersByTeamId = {};
   @observable _teamUnreads = {};
   @observable _manualTeamToVoteOn = false;
   @observable _voteDocsHash = {};
   @observable _playersByTeamUIDHash = {};
   @observable _showLibraryActivitiesModal = false;
   @observable _showSetWeeklyTargetModal = false;
   @observable _subbedToAlready = {};
   @observable _teamPlayersByTeamId = {}
   @observable _activePlayersLocal = []
   @observable _myTeamsLastUpdated = 0
   @observable _teamsWithWeeklyActivity = []
   

   constructor(notificatonStore: any, smashStore: any) {
      this.notificatonStore = notificatonStore;
      this.smashStore = smashStore;
      makeObservable(this);
      makePersistable(this, { name: 'TeamsStore2', properties: [
         '_subbedToAlready',
         '_playersByTeamUIDHash',
         '_teamUsersByTeamId',
         '_voteDocs',
         '_weeklyActivityArray',
         '_myTeams',
         '_teamPlayersByTeamId',
         '_settings',
         '_activePlayersLocal',
         '_teamsWithWeeklyActivity'
      ], storage: AsyncStorage },{ delay: 500, fireImmediately: false  });
   }

   @computed get teamUnreads() {
      return this._teamUnreads;
   }
   set teamUnreads(teamUnreads) {
      this._teamUnreads = teamUnreads;
   }


   lastUpdatedActivePlayerTimestamp = moment().unix()

   @computed get friendsUserHash(){

      /// return a hash of this.activePlayersLocal by uid
      return this.activePlayersLocal.reduce((hash, player) => {
         hash[player.uid] = player;
         return hash;
      }, {});
   

   }

   @computed get activePlayersLocal() {
      return this._activePlayersLocal;
   }
   
   set activePlayersLocal(activePlayersLocal) {
      this._activePlayersLocal = activePlayersLocal;
   }  

   @computed get activePlayers() {
      return this.activePlayersLocal.slice();
    }

   @action.bound
   removePlayerFromActivePlayersLocal(playerId) {

      const newActivePlayersLocal = this.activePlayersLocal.filter((player) => player.uid !== playerId);
      this.activePlayersLocal = newActivePlayersLocal;
   }

   checkIfWasUpdatedRecentlyWithinSeconds(seconds){

      const now = moment().unix();
      const diff = now - this.lastUpdatedActivePlayerTimestamp;

      console.log('diff > seconds',diff,seconds)
      return diff < seconds;
   }

   checkIfLastUpdatedActivePlayerTimestampIsOlderThanSeconds(seconds) {
      const now = moment().unix();
      const diff = now - this.lastUpdatedActivePlayerTimestamp;

      console.log('diff > seconds',diff,seconds)
      return diff > seconds;
   }

   @action.bound
   setActivePlayersLocal(newActivePlayersLocal) {

      this._activePlayersLocal = newActivePlayersLocal;
   }
//    @action.bound
//    setActivePlayersLocal(newActivePlayersLocal) {


  
//       // set this.lastUpdatedActivePlayerTimestamp = moment().unix()
  
// const wasUpdatedRecently = this.checkIfWasUpdatedRecentlyWithinSeconds(1);
  
// console.log('try to setActivePlayersLocal', newActivePlayersLocal.length,this.activePlayersLocal.length, wasUpdatedRecently)

//       // Check if all new players have the same updatedAt as the existing players
//       const allPlayersSame = newActivePlayersLocal.every((newPlayer) => {
//          const existingPlayer = this.activePlayersLocal.find((player) => player.uid === newPlayer.uid);
//          return existingPlayer && existingPlayer.updatedAt === newPlayer.updatedAt;
//       });
      
//       const hasNewPlayersToAdd = newActivePlayersLocal.length > (this.activePlayersLocal.length || 0);

//       const hasPlayersToRemove = newActivePlayersLocal.length < (this.activePlayersLocal.length);      
      
//       const bothSameLength = newActivePlayersLocal.length === (this.activePlayersLocal.length || 0);

//       this.lastUpdatedActivePlayerTimestamp = moment().unix()
//       // If all players have the same updatedAt, return early

//       if(wasUpdatedRecently){
//          console.log("wasUpdatedRecently, skipping setActivePlayersLocal",newActivePlayersLocal.length,this.activePlayersLocal.length,wasUpdatedRecently);
//         return
//       }

//       if(bothSameLength){
//          console.log("new and local players length is the same skipping setActivePlayersLocal",newActivePlayersLocal.length,this.activePlayersLocal.length,wasUpdatedRecently);
//          return
//       }

//       if(allPlayersSame && !hasPlayersToRemove){

//          console.log("allPlayersSame, skipping setActivePlayersLocal",newActivePlayersLocal.length,this.activePlayersLocal.length,wasUpdatedRecently,allPlayersSame);
//          return
//       }

      
//       if (!hasNewPlayersToAdd && !hasPlayersToRemove ) {
         
//          console.log("no new players to add or remove, skipping setActivePlayersLocal",newActivePlayersLocal.length,this.activePlayersLocal.length,wasUpdatedRecently,allPlayersSame,hasNewPlayersToAdd);
//          return;
//       }
   
//       console.log('run setActivePlayersLocal', newActivePlayersLocal);
   
//       // Loop through all of the newActivePlayersLocal and update the existing activePlayersLocal in this._activePlayersLocal
//       newActivePlayersLocal.forEach((newPlayer) => {
//          const currentIdx = this.activePlayersLocal.findIndex((player) => player.uid === newPlayer.uid);
//          if (currentIdx !== -1) {
//             const currentPlayer = this.activePlayersLocal[currentIdx];
//             if (currentPlayer.updatedAt !== newPlayer.updatedAt) {
//                this.activePlayersLocal[currentIdx] = newPlayer;
//             }
//          } else {
//             this.activePlayersLocal.push(newPlayer);
//          }
//       });
   
//     // Check if the player has been removed and then remove from this.activePlayersLocal
// for (let index = this.activePlayersLocal.length - 1; index >= 0; index--) {
//   const player = this.activePlayersLocal[index];
//   const newPlayer = newActivePlayersLocal.find((newPlayer) => newPlayer.uid === player.uid);
//   if (!newPlayer) {
//     this.activePlayersLocal.splice(index, 1);
//   }
// }
//    }
   
   @action.bound
   updateSingleFriendActivePlayerLocal(player) {

      // Check if the player has been removed and then remove from this.activePlayersLocal
      const index = this.activePlayersLocal.findIndex((p) => p.uid === player.uid);
      if (index !== -1) {
         this.activePlayersLocal[index] = player;
      } else {
         this.activePlayersLocal.push(player);
      }

   }

   @computed get subbedToAlready() {
      return this._subbedToAlready;
   }
   set subbedToAlready(subbedToAlready) {
      this._subbedToAlready = subbedToAlready;
   }



   

   @computed get weeklyActivityArray() {
      return this._weeklyActivityArray;
   }
   set weeklyActivityArray(weeklyActivityArray) {
      this._weeklyActivityArray = weeklyActivityArray;
      // set in AsyncyStorage
      
   }


   @computed get showLibraryActivitiesModal() {
      return this._showLibraryActivitiesModal;
   }
   set showLibraryActivitiesModal(showLibraryActivitiesModal) {
      this._showLibraryActivitiesModal = showLibraryActivitiesModal;
   }

   /// Each Team Player Doc by teamId_playerId
   @computed get playersByTeamUIDHash() {
      return this._playersByTeamUIDHash;
   }
   set playersByTeamUIDHash(playersByTeamUIDHash) {
      this._playersByTeamUIDHash = playersByTeamUIDHash;
   }

   @computed get showSetWeeklyTargetModal() {
      return this._showSetWeeklyTargetModal;
   }
   set showSetWeeklyTargetModal(showSetWeeklyTargetModal) {
      this._showSetWeeklyTargetModal = showSetWeeklyTargetModal;
   }

   @computed get manualTeamToVoteOn() {
      return this._manualTeamToVoteOn;
   }
   set manualTeamToVoteOn(manualTeamToVoteOn) {
      this._manualTeamToVoteOn = manualTeamToVoteOn;
   }

   @computed get teamsWithWeeklyActivity() {
      return this._teamsWithWeeklyActivity;
   }
   set teamsWithWeeklyActivity(teamsWithWeeklyActivity) {
      this._teamsWithWeeklyActivity = teamsWithWeeklyActivity;
   }


   @computed get settings() {
      return this._settings;
   }
   set settings(settings) {
      this._settings = settings;
   }


   @computed get teamPlayersByTeamId() {
      return this._teamPlayersByTeamId;
   }
   set teamPlayersByTeamId(teamPlayersByTeamId) {
      this._teamPlayersByTeamId = teamPlayersByTeamId;
   }

   @action.bound
async getFriends() {

   return new Promise(async (resolve, reject) => {

      
  const { setActivePlayersLocal } = this;
  const { uid } = firebaseInstance.auth.currentUser;

const {todayDateKey} = this;
  const fetchFriendsWithDailyActivity = async () => {
   const uid = firebaseInstance.auth.currentUser.uid;

   const getFriendsWithDailyActivity = httpsCallable(firebaseInstance.functions,'GetFriendsWithDailyActivity');
   try {
     const result = await getFriendsWithDailyActivity({ uid, dayKey: todayDateKey });
     resolve(true)
     setActivePlayersLocal(result.data);
   } catch (error) {
      reject(error)
     console.error('Error fetching friends with daily activity:', error);
   }
 };

 fetchFriendsWithDailyActivity();

   });

}


@action.bound
  async getTeams() {
    return new Promise(async (resolve, reject) => {
      const { setTeamsWithWeeklyActivityLocal } = this;
      const { endOfCurrentWeekKey, todayDateKey } = this; // Make sure to define and update `endWeekKey` in your store

      const fetchTeamsWithWeeklyActivity = async () => {
        const uid = firebaseInstance.auth.currentUser.uid;

        const getTeamsWithWeeklyActivity = httpsCallable(firebaseInstance.functions, 'GetTeamsWithWeeklyActivity');
        try {
          
         const result = await getTeamsWithWeeklyActivity({ uid, endWeekKey: endOfCurrentWeekKey, dayKey: todayDateKey });

          runInAction(() => {
            setTeamsWithWeeklyActivityLocal(result.data);
          });
          
          resolve(true);

        } catch (error) {
          console.error('Error fetching teams with weekly activity:', error);
          reject(error);
        }
      };

      fetchTeamsWithWeeklyActivity();
    });
  }

@action.bound
setTeamsWithWeeklyActivityLocal(teamsData) {
  this.teamsWithWeeklyActivity = teamsData;
}


   @action.bound
   async setTeamPlayersByTeamId(teamId, players) {
     this.teamPlayersByTeamId[teamId] = players;
   
   }
 
   @action.bound
   async loadTeamPlayersFromStorage() {
     try {
       const teamPlayersByTeamId = await AsyncStorage.getItem('teamPlayersByTeamId');
       if (teamPlayersByTeamId !== null) {
         this.teamPlayersByTeamId = JSON.parse(teamPlayersByTeamId);
       }
     } catch (error) {
       console.log('Error loading teamPlayersByTeamId from AsyncStorage: ', error);
     }
   }
   

   @computed get voteDocsHash() {
      return this._voteDocsHash;
   }
   set voteDocsHash(voteDocsHash) {
      this._voteDocsHash = voteDocsHash;
   }

   @computed get teamUsersByTeamId() {
      return this._teamUsersByTeamId;
   }
   set teamUsersByTeamId(teamUsersByTeamId) {
      this._teamUsersByTeamId = teamUsersByTeamId;
   }

   @computed get playerDataByTeamId() {
      return this._playerDataByTeamId;
   }
   set playerDataByTeamId(playerDataByTeamId) {
      this._playerDataByTeamId = playerDataByTeamId;
   }

   @action.bound
   removeTeamFromMyTeamsArray(teamId) {

      if(this.myTeams.length == 1){
         this._myTeams = [];

      }else{

         this.myTeams = this.myTeams.filter((item) => item.id !== teamId);
      }
    
      this.fetchMyTeams()

   }
  


   @action.bound
   setCurrentTeam(team) {
      this.currentTeam = team;
   }

   @action.bound
   setShowLibraryActivitiesModal(bool) {
      this.showLibraryActivitiesModal = bool;
   }
   @action.bound
   setPlayersByTeamUIDHash(team, player) {
      this.playersByTeamUIDHash[`${team.id}_${player.uid}`] = player;
   }
   @action.bound
   getAllTeamsUsersFormattedHashByTeamId(teamId) {
      return this.allTeamsUsersFormattedHashByTeamId[teamId] || [];
   }


   @computed
   get allTeamsUsersFormattedHashByTeamId() {
      let teamPlayersHashByTeamId = {};

      this.myTeams.forEach((team) => {
         const { teamTodayActivityByTeamId } = this;
         const teamDailyActivity = teamTodayActivityByTeamId[team.id];
         const todayPlayers = teamDailyActivity?.players || {};

         teamPlayersHashByTeamId[team.id] =
            (this?.teamUsersByTeamId?.[team.id] || [])
               .map((user) => {
                  return { ...user, score: todayPlayers[user.uid]?.score || 0 };
               })
               .sort((b, a) => a.score - b.score) || [];
      });

      return teamPlayersHashByTeamId;
   }

   @computed get allTeamHabitStackIds() {
      let arrayOfMasterIds = [];

      this.myTeams.forEach((team) => {
         let array = team?.habitStackIds || [];

         arrayOfMasterIds = [...arrayOfMasterIds, ...array];
      });

      let unique = [...new Set(arrayOfMasterIds)];
      return unique;
   }

   @computed get myTeamIds() {
      return this.myTeams?.map((team) => team.id)?.sort((a,b)=>b.updatedAt - a.updatedAt) || [];
   }

   @computed get hasTeams() {
      return this.myTeams?.length > 0 || false
   }

   @action.bound
   setShowSetWeeklyTargetModal(team) {

      this.showSetWeeklyTargetModal = team;
   }

   @action.bound
   setVoteDocsHash(voteDoc, teamId) {
      this.voteDocsHash[teamId] = {
         ...voteDoc,
         haveIVoted: checkIfIHaveVoted(voteDoc),
         hasSomeoneVoted: hasSomeoneVoted(voteDoc),
      };
   }
   @computed get allTeamsThatRequireVotes() {
      const {
         weeklyActivityHash,
         voteDocsHash,
         endOfCurrentWeekKey,
         manualTeamToVoteOn,
      } = this;

      const targetReachedFilter = (team) => {
         // console.log('team.mostRecentTarget', team.mostRecentTarget);
         const teamWeekKey = `${team.id}_${endOfCurrentWeekKey}`;

         // alert(teamWeekKey);
         // if (
         //    parseInt(team.mostRecentTarget) <
         //    parseInt(weeklyActivityHash?.[teamWeekKey]?.score || 0)
         // ) {
         //    console.warn(team.name);
         // }
         return (
            parseInt(team.mostRecentTarget) <
            parseInt(weeklyActivityHash?.[teamWeekKey]?.score || 0)
         );
      };

      const someoneHasVotedButNotMeFilter = (team) => {
         return (
            voteDocsHash?.[team.id]?.hasSomeoneVoted &&
            voteDocsHash?.[team.id]?.haveIVoted == false
         );
      };

      const iHaveNotVotedFilter = (team) => {
         console.log(
            'checking',
            team.name,
            voteDocsHash?.[team.id]?.haveIVoted,
         );
         return (
            voteDocsHash?.[team.id]?.haveIVoted == false ||
            voteDocsHash?.[team.id]?.haveIVoted == undefined
         );
      };

      const firstVoteThisWeek = (team) => {
         return (
            voteDocsHash?.[team.id]?.dayKeys?.[endOfCurrentWeekKey] ==
               undefined ||
            voteDocsHash?.[team.id]?.dayKeys?.[endOfCurrentWeekKey] == false
         );
      };

      const teamHasNotVotedToKeepTarget = (team) => {
         return voteDocsHash?.[team.id]?.votedToKeepTheSame?.[
            endOfCurrentWeekKey
         ]
            ? false
            : true;
      };

      const teamsWhereTargetIsReachedAndIHaveNotVoted = this.myTeams
         .filter(targetReachedFilter)
         .filter(iHaveNotVotedFilter)
         .filter(teamHasNotVotedToKeepTarget);
      // .filter(firstVoteThisWeek);

      const teamsWhereIHaveNotVoted = this.myTeams
         .filter(someoneHasVotedButNotMeFilter)
         .filter(firstVoteThisWeek)
         .map((item) => {
            return { ...item, weekNotWon: true };
         });

      return [
         ...teamsWhereTargetIsReachedAndIHaveNotVoted,
         // ...teamsWhereIHaveNotVoted,
         manualTeamToVoteOn && manualTeamToVoteOn,
      ];
   }

   @action.bound
   getWeekTargetForTeam(team) {
      const { weeklyActivityHash } = this;
      return weeklyActivityHash?.[team.id]?.target || 1237;
   }

   @computed get users() {
      return this._users;
   }
   set users(users) {
      this._users = users;
   }

   @computed get playersByTeamId() {
      return this._playersByTeamId;
   }
   set playersByTeamId(playersByTeamId) {
      this._playersByTeamId = playersByTeamId;
   }

   @computed get showFollowingDialog() {
      return this._showFollowingDialog;
   }

   set showFollowingDialog(showFollowingDialog) {
      this._showFollowingDialog = showFollowingDialog;
   }

   @computed get myTeamsHash() {
      const teamsHash = {};
      this.myTeams.forEach(team => {
        teamsHash[team.id] = team;
      });
      return teamsHash;
    }

   // set myTeamsHash(myTeamsHash) {
   //    this._myTeamsHash = myTeamsHash;
   // }

   @computed get legacyActivitiesHash() {
      return this._legacyActivitiesHash;
   }

   set legacyActivitiesHash(legacyActivitiesHash) {
      this._legacyActivitiesHash = legacyActivitiesHash;
   }

   @computed get myTeams() {
      return this._myTeams.filter((team) => team.active);
   }
   @computed get numberOfTeams() {
      return this._myTeams?.length || 0;
   }
  
   set myTeams(newMyTeams) {
      let highestUpdatedAt = this._myTeamsLastUpdated;
    
      newMyTeams.forEach((team) => {
        if (team.updatedAt > highestUpdatedAt) {
          highestUpdatedAt = team.updatedAt;
        }
      });
    
      if (this._myTeamsLastUpdated !== highestUpdatedAt) {
        this._myTeamsLastUpdated = highestUpdatedAt;
      }

      let update = false;
    
      const newToUpdate = newMyTeams.map((newTeam) => {
        console.log('setMyTeams not updated', newTeam.name);
    
        const currentTeam = this._myTeams.find((team) => team.id === newTeam.id);
        if (currentTeam && currentTeam.updatedAt !== newTeam.updatedAt) {
          console.log('setMyTeams', currentTeam.name);
          return newTeam;
        }
        update = true
        return currentTeam || newTeam;
      });

      if(update){

         this._myTeams = newToUpdate;
      }
    }
    
   @computed get weeklyActivityHash() {

      const hash = {}; 
      
      this.weeklyActivityArray?.forEach((w)=>{

         hash[`${w.teamId}_${w.endWeekKey}`] = w
      })
      return hash
   }



   // set weeklyActivityHash(weeklyActivityHash) {
   //    this._weeklyActivityHash = weeklyActivityHash;
   // }

   @computed get teamTodayActivityByTeamId() {
      return this._teamTodayActivityByTeamId;
   }

   set teamTodayActivityByTeamId(teamTodayActivityByTeamId) {
      this._teamTodayActivityByTeamId = teamTodayActivityByTeamId;
   }

   @computed get playersProgressById() {
      return this._playersProgressById;
   }

   set playersProgressById(playersProgressById) {
      this._playersProgressById = playersProgressById;
   }

   @computed get selectedDayKey() {
      return this._selectedDayKey;
   }

   set selectedDayKey(selectedDayKey) {
      this._selectedDayKey = selectedDayKey;
   }

   @computed get selectedWeekKey() {
      return this._selectedWeekKey;
   }

   set selectedWeekKey(selectedWeekKey) {
      this._selectedWeekKey = selectedWeekKey;
   }

   @computed get teamLoading() {
      return this._teamLoading;
   }

   set teamLoading(teamLoading) {
      this._teamLoading = teamLoading;
   }

   @computed get teamTargetVoteDoc() {
      return this._teamTargetVoteDoc;
   }

   set teamTargetVoteDoc(teamTargetVoteDoc) {
      this._teamTargetVoteDoc = teamTargetVoteDoc;
   }

   @computed get thisWeekTarget() {
      const longEndDate = moment().endOf('isoWeek').format('ddd Do MMM YYYY');
      const endDateKey = moment().endOf('isoWeek').format('DDMMYYYY');
      return this.currentTeam?.targets
         ? this.currentTeam?.targets[endDateKey] ||
              this.currentTeam?.mostRecentTarget ||
              10000
         : 10000;
   }

   @computed
   get allUserIds() {
      let allUserIds = [];
      this.myTeams?.forEach(
         (team) => (allUserIds = [...allUserIds, ...(team.joined || [])]),
      );
      return allUserIds;
   }

   @computed
   get currentTeamWeeklyActivity() {
      const endWeekKey = moment().endOf('isoWeek').format('DDMMYYYY');
      const teamWeeklyKey = `${this.currentTeam.id}_${endWeekKey}`;

      return this.weeklyActivityHash?.[teamWeeklyKey] || false;
   }

   @computed
   get currentTeamWeeklyProgress() {
      return (
         ((this.currentTeamWeeklyActivity?.score || 0) /
            (this.currentTeam?.mostRecentTarget || 0)) *
         100
      );
   }
   
   @computed get todayDateKey() {
      const debug = false;
      const debugDateKey = '12072022';
      return debug ? debugDateKey : moment().format('DDMMYYYY');
   }

   @computed get selectedTargetLevel() {
      return this.currentTeam?.selectedTargetLevel
         ? this.currentTeam?.selectedTargetLevel[
              moment().endOf('isoWeek').format('DDMMYYYY')
           ] || 1
         : 1;
   }

   @action.bound
   checkIfIHaveVoted = (voteDoc) => {
      const { uid } = firebaseInstance.auth.currentUser;

      const add10k = voteDoc?.add10k || [];
      const add20k = voteDoc?.add20k || [];
      const remove10k = voteDoc?.remove10k || [];
      const keepTheSameTarget = voteDoc?.keepTheSameTarget || [];

      const allVotes = [
         ...add10k,
         ...remove10k,
         ...keepTheSameTarget,
         ...remove10k,
      ];

      return allVotes.includes(uid) || false;
   };

   getThisWeekTarget(team) {
      return team?.targets
         ? team?.targets[moment().endOf('isoWeek').format('DDMMYYYY')] || 10000
         : 10000;
   }
   unsubAll = [];
   getDaysUntilEndWeek() {
      var todaysdate = moment();
      const eventdate = moment().endOf('isoWeek');

      const daysLeft = eventdate.diff(todaysdate, 'days');

      return daysLeft;
   }
   @action.bound
   setPlayersByTeamId(players, teamId) {
      if (!teamId || !players) {
         return;
      }
      this.playersByTeamId[teamId] = players;
   }
   getSelectedTargetLevel(team) {
      return team?.selectedTargetLevel
         ? team?.selectedTargetLevel[
              moment().endOf('isoWeek').format('DDMMYYYY')
           ] || 10000
         : 10000;
   }

   @action.bound
   setShowFollowingDialog(val: boolean) {
      this.showFollowingDialog = val;
   }

   @action.bound
   setUnreads(uid, streamId, count) {
      const key = `${streamId}_${uid}`;

      this.teamUnreads[key] = count;
   }

   @computed get currentTeam() {
      return this._currentTeam;
   }

   set currentTeam(currentTeam) {
      this._currentTeam = currentTeam;
   }

   @computed get currentTeamPlayers() {
      return this.teamUsersByTeamId[this.currentTeam.id] || [];
   }

   @computed get currentTeamPlayersHash() {
      let teamHash = {};
      this.currentTeamPlayers.forEach((player) => {
         teamHash[player.id] = player;
      });

      return teamHash;
   }

   @computed get loadingCurrentTeam() {
      return this._loadingCurrentTeam;
   }

   set loadingCurrentTeam(loadingCurrentTeam) {
      this._loadingCurrentTeam = loadingCurrentTeam;
   }

   @computed get currentTeamWeekly() {
      return this._currentTeamWeekly;
   }

   set currentTeamWeekly(currentTeamWeekly) {
      this._currentTeamWeekly = currentTeamWeekly;
   }

   @computed get selectedActions() {
      console.log('this._selectedActions;', this._selectedActions);
      return this._selectedActions;
   }

   set selectedActions(selectedActions) {
      this._selectedActions = selectedActions;
   }

   @action.bound
   setSelectedActions(val: any) {
      this.selectedActions = val;
   }

   @computed get voteDocs() {
      return this._voteDocs;
   }

   set voteDocs(voteDocs) {
      this._voteDocs = voteDocs;
   }

   @action.bound
   setVoteDocs(val: any[]) {
      this.voteDocs = val;
   }

   @computed get isTeamVoteDialogVisible() {
      return this._isTeamVoteDialogVisible;
   }

   set isTeamVoteDialogVisible(isTeamVoteDialogVisible) {
      this._isTeamVoteDialogVisible = isTeamVoteDialogVisible;
   }

   @action.bound
   setIsTeamVoteDialogVisible(bool) {
      this.isTeamVoteDialogVisible = this.manualTeamToVoteOn || bool;
   }

   /********** FIREBASE CALLS ***********/

   @action.bound
   getVoteDocsSnapShot(teamId: string, endDateKey: string) {
     if (this.voteDocsSnapshotUnSubscribe) this.voteDocsSnapshotUnSubscribe();
     this.voteDocsSnapshotUnSubscribe = onSnapshot(
       query(
         collection(firestore, "votes"),
         where("teamId", "==", teamId),
         where("endDateKey", "==", endDateKey)
       ),
       (snaps) => {
         console.log("Inside getVoteDocs");
         if (!snaps.empty) {
           let voteDocs: any[] = [];
           snaps.forEach((snap: any) => {
             if (snap.exists) {
               voteDocs.push(snap.data());
             }
           });
           this.voteDocs = voteDocs;
           console.log("Inside getVoteDocs", voteDocs);
         } else {
           this.voteDocs = [];
         }
       }
     );
   }
   @action.bound
   clearStore() {
      this.myTeams = [];
      // this.weeklyActivityHash = {};
   }

   @action.bound
   clearVoteDocsSnapShot() {
      if (this.voteDocsSnapshotUnSubscribe) this.voteDocsSnapshotUnSubscribe();
   }

   @action.bound
   storeUser(user) {
      this.users[user.uid] = user;
   }


   @action.bound
    joinTeamToChallenge = async (challengeId, teamId, teamJoinedUsers, challengeTarget) => {
   
      try {
        // Check if the team is already in the challenge
        const challengeDocs = await getDocs(query(collection(firestore, 'teamChallenges'), where('challengeId', '==', challengeId), where('teamId', '==', teamId)));
    
        if (challengeDocs.empty) {
          // If the team is not already in the challenge, create a new document
          const startDate = Timestamp.now();
          const newChallengeDoc = doc(collection(firestore, 'teamChallenges'));
          await setDoc(newChallengeDoc, {
            challengeId: challengeId,
            teamId: teamId,
            active: true,
            joinedUsers: teamJoinedUsers,
            startDate: startDate,
            target: challengeTarget,
          });
          console.log('Team joined the challenge successfully');
        } else {
          console.log('Team is already in the challenge');
        }
      } catch (e) {
        console.log('Error joining team to challenge:', e);
      }
    };


   @action.bound
   getTeamTargetVoteDocsSnapShot(teamId: string) {
     this.clearTeamTargetVoteDocsSnapShot();
     const teamTargetVoteDocRef = doc(firestore, "votes", teamId);
     this.teamTargetVoteDocSnapUnSubscribe = onSnapshot(teamTargetVoteDocRef, (doc) => {
       console.log('Inside Snapshot');
       if (doc.exists()) {
         this.teamTargetVoteDoc = doc.data();
       }
     });
   }

   @action.bound
   clearTeamTargetVoteDocsSnapShot() {
      console.log('Inside clearTeamTargetVoteDocsSnapShot');
      if (this.teamTargetVoteDocSnapUnSubscribe)
         this.teamTargetVoteDocSnapUnSubscribe();
   }

   @action.bound
   getCurrentTeamSnapShot(teamId: string) {
     this.teamLoading = true;
     if (this.teamSnapShotUnSubscribe) this.teamSnapShotUnSubscribe();
     this.loadingCurrentTeam = true;
     this.teamSnapShotUnSubscribe = onSnapshot(doc(collection(firestore, 'teams'), teamId), (snap: any) => {
       if (snap.exists()) {
         this.currentTeam = snap.data();
       } else {
         this.currentTeam = {};
       }
       this.loadingCurrentTeam = false;
     });
   }

   async  updateTargetVoteMajorityLog(
      teamId: string,
      selectedOption: string,
      majorityNumber: number,
      joinedLength: number,
      isKeepTheSame: boolean
    ) {
      const oldVoteDoc = this?.voteDocsHash[teamId] || {};
    
      const { endOfCurrentWeekKey } = this;
      try {
         await setDoc(doc(collection(firestore, "votes"), teamId), {
            add10k: [],
            add20k: [],
            remove10k: [],
            teamId: teamId || false,
            keepTheSameTarget: [],
            majorityLog: arrayUnion({
              selectedOption,
              majorityNumber,
              joinedLength,
              timestamp: serverTimestamp(),
            }),
            votedToKeepTheSame: {
              [endOfCurrentWeekKey]: isKeepTheSame || false,
            },
            snapshot: oldVoteDoc,
            updatedAt: serverTimestamp(),
            dayKeys: {
              [endOfCurrentWeekKey]: arrayUnion({
                selectedOption,
                majorityNumber,
                joinedLength,
                timestamp: serverTimestamp(),
              }),
            },
          }, { merge: true });
      } catch (error) {
        console.error("Error updating target vote majority log:", error);
      }
    }
    
    async  updateTeamTarget(teamId: string, newTarget: number) {
      const endWeekKey = moment().endOf("isoWeek").format("DDMMYYYY");
      try {
        await setDoc(doc(collection(firestore, "teams"), teamId), {
          targets: { [endWeekKey]: newTarget },
          mostRecentTarget: newTarget,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (error) {
        console.error("Error updating team target:", error);
      }
    }

   @action.bound
   onClickTeamTargetVotingOption(selectedOption, team) {
      const { id: teamId, joined = [] } = team;
      const joinedLength = joined.length;

      if (!teamId) return;

      let newTargetLevel = 0;
      const options = ['add10k', 'add20k', 'remove10k', 'keepTheSameTarget'];
      const optionMajorityFnMapper: optionMajorityFnMapper = {
         add10k: async (majorityNumber = 0) => {
            newTargetLevel = this.selectedTargetLevel + 1 || 1;

            const newTarget = parseInt(team.mostRecentTarget) + 10000;
            await this.updateTeamTarget(teamId, newTarget);
            this.updateTargetVoteMajorityLog(
               teamId,
               selectedOption,
               majorityNumber,
               joinedLength,
               false,
            );
            this.setIsTeamVoteDialogVisible(false);
         },
         add20k: async (majorityNumber = 0) => {
            newTargetLevel = this.selectedTargetLevel + 2 || 2;

            const newTarget = parseInt(team.mostRecentTarget) + 20000;

            await this.updateTeamTarget(teamId, newTarget);
            this.updateTargetVoteMajorityLog(
               teamId,
               selectedOption,
               majorityNumber,
               joinedLength,
               false,
            );
            this.setIsTeamVoteDialogVisible(false);
         },
         remove10k: async (majorityNumber = 0) => {
            newTargetLevel = Math.max(this.selectedTargetLevel - 1, 0);
            const newTarget = parseInt(team.mostRecentTarget) + -10000;
            await this.updateTeamTarget(teamId, newTarget);
            this.updateTargetVoteMajorityLog(
               teamId,
               selectedOption,
               majorityNumber,
               joinedLength,
               false,
            );
            this.setIsTeamVoteDialogVisible(false);
         },
         keepTheSameTarget: (majorityNumber = 0) => {
            this.updateTargetVoteMajorityLog(
               teamId,
               selectedOption,
               majorityNumber,
               joinedLength,
               true,
            );
            this.setIsTeamVoteDialogVisible(false);
         },
      };

      updateSelectedOption(
         teamId,
         selectedOption,
         options,
         optionMajorityFnMapper,
         joinedLength,
      );

      this.manualTeamToVoteOn = false;
   }

   @computed get joinedUsers() {
      return this.currentTeam?.joined || [];
   }

   @computed get allTeamsTodayScore() {


      let value = 0;
      const activityQuantities = this.myTeams?.map((team) => {

         // console.log('this.weeklyActivityHash[`${team?.id}_${this.endOfCurrentWeekKey}`]?.daily?.[this.todayDateKey].score', this.weeklyActivityHash[`${team?.id}_${this.endOfCurrentWeekKey}`]?.daily?.[this.todayDateKey].score)

         return this.weeklyActivityHash?.[`${team?.id}_${this.endOfCurrentWeekKey}`]?.daily?.[this.todayDateKey]?.activityQuantities || { ['blah']: 0 };




      })

      return this.sumObjectValues(activityQuantities)
   }


   sumObjectValues(array) {
      let sum = 0;
      for (const object of array) {
         for (const value of Object.values(object)) {
            sum += value;
         }
      }
      return sum;
   }
   //// get all teams

   /// all weekly

   @action.bound
   async saveMyTeamsToAsyncStorage(){

      // save this.myTeams to async storage
      await AsyncStorage.setItem('myTeams', JSON.stringify(this.myTeams));
   }

   


   @action.bound
async fetchMyTeams() {

   return new Promise(async (resolve, reject) => { 
  try {
    const { uid } = firebaseInstance.auth.currentUser;

    const q = query(
      collection(firestore, "teams"),
      where("active", "==", true),
      where("joined", "array-contains", uid)
    );

    const snaps = await getDocs(q);

    const newTeams = snaps.docs
      .map((doc) => doc.data())
      .filter((team) => team != null)

    console.log("set myTeams in teamsStore TeamsTodayTargetsList");
    this.myTeams = newTeams;
   //  this.saveMyTeamsToAsyncStorage();

   resolve(this.myTeams);
  } catch (error) {
   reject();
    console.error("Error fetching my teams:", error);
    return [];
  }



});
}
   
   checkArrayOrderAndIds(array1, array2) {
      // If the arrays have different lengths, return true
      if (array1.length !== array2.length) {
        return true;
      }
    
      // Create a set of IDs from array1
      const idSet = new Set(array1.map((obj) => obj.id));
    
      // Check if any ID in array2 is not in the ID set
      return array2.some((obj) => !idSet.has(obj.id));
    }

   @action.bound
   async loadLocalWeeklyActivity() {

      const storedData = await AsyncStorage.getItem('weeklyActivityHash');
      if (storedData) {
        const weeklyActivityHash = JSON.parse(storedData);
      this.weeklyActivityHash = weeklyActivityHash;
      }
   }
   @action.bound
   setWeeklyActivityHash(weeklyActivityHash, setInAsync = true) {


      this.weeklyActivityHash = weeklyActivityHash;
      
      // if(setInAsync){
      //    AsyncStorage.setItem('weeklyActivityHash', JSON.stringify(weeklyActivityHash));
         
      // }
    

   }
   
   @action.bound
   async saveTeamWeeklyDocsToAsyncStorage() {

      AsyncStorage.setItem('weeklyActivityArray', JSON.stringify(this.weeklyActivityArray));
   }
   @action.bound
async subscribeToMyTeamWeeklyDocs() {
  const { uid } = firebaseInstance.auth.currentUser;
  const endWeekKey = this.endOfCurrentWeekKey;

  const unsubWeekly = onSnapshot(query(
    collection(firestore,"weeklyActivity"),
    where("endWeekKey", "==", endWeekKey),
    where("playerIds", "array-contains", uid)
  ), (snaps) => {
    let weeklyActivityHash = {};
    const weeklyActivityDocs = snaps.docs.map((doc) => doc.data());
    this.weeklyActivityArray = weeklyActivityDocs;
    this.saveTeamWeeklyDocsToAsyncStorage();
  });
  
  this.unsubAll.push(unsubWeekly);
}


   @action.bound
   clearCurrentTeamSnapShot() {
      this.currentTeam = {};
      if (this.teamSnapShotUnSubscribe) this.teamSnapShotUnSubscribe();
   }

   

   getTeamDailyActivity(id) {
      console.log('trysolve id', id);
    
      if (this?.unsubTeamDaily?.[id]) {
        this.unsubTeamDaily[id]();
      }
    
      const unsubscribe = onSnapshot(doc(collection(firestore, "dailyActivity"), `${id}_${moment().format('DDMMYYYY')}`), (doc) => {
        if (doc.exists()) {
          const dailyDoc = doc.data();
    
          console.log('trysolve dailyDoc', dailyDoc);
    
          this.teamTodayActivityByTeamId[id] = dailyDoc;
    
          console.log(
            'trysolve this.teamTodayActivityByTeamId[id]',
            this.teamTodayActivityByTeamId[id],
          );
        }
      });
    
      this.unsubTeamDaily[id] = unsubscribe;
    }

   @computed get numTeamTargetsCompletedToday() {
      const endWeekKey = moment().endOf('isoWeek').format('DDMMYYYY');
      return this.myTeams?.filter((team) => {
         const weeklyActivity =
            this.weeklyActivityHash?.[`${team.id}_${endWeekKey}`] || 0;

         return (
            weeklyActivity?.myScoreToday > weeklyActivity?.myTargetToday ||
            weeklyActivity?.score > weeklyActivity?.thisWeekTarget
         );
      }).length;
   }

   @computed get numTeamTargetsToday() {
      return this.myTeams.length || 0;
   }

   @computed get numTeamTargetsCompleted() {
      return (
         this.myTeams.filter(
            (t) => t?.scores?.[this.endOfCurrentWeekKey] > t?.mostRecentTarget,
         ).length || 0
      );
   }

   @action.bound
   setTeamUsersByTeamId(teamId, playersArray) {
      this.teamUsersByTeamId[teamId] = playersArray;

      /// setAsyncStorage this.teamUsersByTeamId[teamId]
      AsyncStorage.setItem('teamUsersByTeamId', JSON.stringify(this.teamUsersByTeamId));
   }

   @action.bound
   setWeeklyActivityInHash(weeklyTeamKey, weeklyActivityData) {
      this.weeklyActivityHash[weeklyTeamKey] = weeklyActivityData;
   }
   @action.bound
   setTeamTodayActivityByTeamId(id, dailyDoc) {
      this.teamTodayActivityByTeamId[id] = dailyDoc;
   }

   @action.bound
   getWeeklyActivityOnce(team) {
      const endOfCurrentWeekKey = moment().endOf("isoWeek").format("DDMMYYYY");
      const weeklyTeamKey = `${team.id}_${endOfCurrentWeekKey}`;
    
      getDoc(doc(collection(firestore,"weeklyActivity"), weeklyTeamKey)).then((snap) => {
        if (snap.exists) {
          const weeklyActivityData = getTeamWeeklyData(snap.data(), team);
    
          this.weeklyActivityHash[weeklyTeamKey] = weeklyActivityData;
        }
      });
    }
   // @action.bound
   // getCurrentTeamWeeklySnapShot(teamId: string) {
   //    if (this.teamWeeklySnapShotUnSubscribe)
   //       this.teamWeeklySnapShotUnSubscribe();
   //    const endOfCurrentWeekKey = moment().endOf('isoWeek').format('DDMMYYYY');
   //    this.teamSnapShotUnSubscribe = Firebase.firestore
   //       .collection('weeklyActivity')
   //       .doc(`${teamId}_${endOfCurrentWeekKey}`)
   //       .onSnapshot((snap: any) => {
   //          if (snap.exists) {
   //             this.currentTeamWeekly = snap.data();
   //             this.generatePlayersProgressById();
   //          } else {
   //             this.currentTeamWeekly = {};
   //          }
   //       });
   // }

   @computed get endOfCurrentWeekKey() {
      return moment().endOf('isoWeek').format('DDMMYYYY');
   }

   @action.bound
   clearCurrentWeeklyTeamSnapShot() {
      if (this.teamWeeklySnapShotUnSubscribe)
         this.teamWeeklySnapShotUnSubscribe();
   }

   @action.bound
   async createTeam(team, currentUser) {
     this.allTeamsUsersFormattedHashByTeamId[team.id] = [
       {
         uid: currentUser.uid,
         score: 0,
         picture: currentUser?.picture || {},
       },
     ];
   
     try {
       await setDoc(doc(collection(firestore, "teams"), team.id), {
         ...team,
       });
       await setDoc(
         doc(collection(firestore, "users"), currentUser.uid),
         { createdAteam: true },
         { merge: true }
       );
     } catch (error) {
       console.error("Error creating team:", error);
     }
   }
   
   @action.bound
   async createTeamWeeklyActivity(team, currentUser) {
     const endWeekKey = moment().endOf("isoWeek").format("DDMMYYYY");
     const timestamp = Date.now() / 1000;
     try {
       await setDoc(
         doc(
           collection(firestore, "weeklyActivity"),
           `${team.id}_${endWeekKey}`
         ),
         {
           target: parseInt(team.mostRecentTarget),
           score: 0,
           timestamp: serverTimestamp(),
           teamName: team.name,
           teamId: team.id,
           playerIds: currentUser ? [currentUser.uid] : [],
         }
       );
     } catch (error) {
       console.error("Error creating team weekly activity:", error);
     }
   }
   
   @action.bound
   async updateTeam(team) {
     const teamDoc = doc(firestore, "teams", team.id);
     try {
       await setDoc(teamDoc, { ...team }, { merge: true });
     } catch (error) {
       console.error("Error updating team:", error);
     }
   }
   

  @computed get thisWeekKeys() {
    const startOfDays = [];

    let count = 7;

    let i = count;
    while (i > 0) {
      startOfDays.push(
        moment()
          .endOf('isoWeek')
          .subtract(7 - i, 'days')
          .format('DDMMYYYY'),
      );

      i--;
    }

    return startOfDays.reverse();
  }

  weeksDayKeys(endWeekKey: string) {
    if (!endWeekKey) {
      return [];
    }
    const startOfDays = [];

    let count = 7;

    let i = count;
    while (i > 0) {
      startOfDays.push(
        moment(endWeekKey, 'DDMMYYYY')
          .endOf('isoWeek')
          .subtract(7 - i, 'days')
          .format('DDMMYYYY'),
      );

      i--;
    }

    return startOfDays.reverse();
  }

  returnActivityIdsForTeam(team = {},libraryActivitiesHash, habitStacksHash) {

   const {singleMasterIds = [], actions = {}} = team;

   let allHabitStackMasterIdsInArray = [];

   team?.habitStackIds?.forEach((stackId) => {
      const stackActivities = habitStacksHash?.[stackId]?.masterIds || [];

      allHabitStackMasterIdsInArray = [
         ...allHabitStackMasterIdsInArray,
         ...stackActivities,
      ];
   });

   const allHabitMasterIds =
      [...new Set(allHabitStackMasterIdsInArray.flat(1))] || [];

   const activities =
      allHabitMasterIds?.length > 0
         ? [...(singleMasterIds || []),...allHabitMasterIds].map((id) => libraryActivitiesHash?.[id])
         : Object.values(actions);

   return activities;
}



  @action.bound
  async addRemoveTeamInUserDoc(
    action: TEAM_ACTIONS,
    teamID: string,
    externalUserUID: string = '',
  ) {
    let { uid } = firebaseInstance.auth.currentUser;
    uid = externalUserUID ? externalUserUID : uid;
    const userDoc = doc(collection(firestore, "users"), uid);
    await setDoc(
      userDoc,
      {
        teams:
          action === TEAM_ACTIONS.ADD
            ? arrayUnion(teamID)
            : arrayRemove(teamID),
            updatedAt: serverTimestamp()
      },
      { merge: true },
    );
  }
   // adds or removes current userId to team doc
   // If externalUserUID is present, externalUserUID is added or removed from team doc
   @action.bound
async addRemoveUserInTeamDoc(action, field, teamID, externalUserUID = '', currentUser = false) {
  let uid = firebaseInstance.auth.currentUser.uid;
  uid = externalUserUID ? externalUserUID : uid;


  const teamDocRef = doc(firestore, 'teams', teamID);

  if (currentUser) {
    const player = {
      uid: uid,
      picture: currentUser.picture || {},
      name: currentUser.name,
    };

    try {
      await setDoc(teamDocRef, {
        allPlayers: action === TEAM_ACTIONS.ADD ? arrayUnion(player) : arrayRemove(player),
        [field]: action === TEAM_ACTIONS.ADD ? arrayUnion(uid) : arrayRemove(uid),
        requestedUsersMap: {
          [currentUser.uid]: {
            picture: currentUser.picture || {},
            name: currentUser.name,
          },
        },
        updatedAt: serverTimestamp(),
      }, { merge: true });

      const weeklyActivityDocRef = doc(firestore, 'weeklyActivity', `${teamID}_${this.endOfCurrentWeekKey}`);
      await setDoc(weeklyActivityDocRef, {
        playerIds: action === TEAM_ACTIONS.ADD ? arrayUnion(uid) : arrayRemove(uid),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const teamDoc = await getDoc(teamDocRef);
      const team = teamDoc.data();

      let newRequestedUsersMap = team.requestedUsersMap || {};
      delete newRequestedUsersMap?.[externalUserUID];

      await setDoc(teamDocRef, {
        [field]: action === TEAM_ACTIONS.ADD ? arrayUnion(uid) : arrayRemove(uid),
        requestedUsersMap: newRequestedUsersMap,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.log(error);
    }
  }
}


   @action.bound
   requestToAddToTeam(team, currentUser) {
      const teamId = team.id;
      const message = `${currentUser.name} wants to join ${team.name}`;
      if (team.admins) {
         team?.admins?.forEach((adminId) => {
            sendEpicNotification(
               adminId,
               message,
               {
                  teamId,
                  type: 'requestToJoin',
               },
               team.name,
            );
         });
      } else {
         sendEpicNotification(
            team.uid,
            message,
            {
               teamId,
               type: 'requestToJoin',
            },
            team.name,
         );
      }

      this.addRemoveUserInTeamDoc(
         TEAM_ACTIONS.ADD,
         TEAM_FIELD_TYPE.REQUESTED,
         teamId,
         false,
         currentUser,
      );
   }

   @action.bound
   cancelRequestToAddToTeam(teamId: string) {
      this.addRemoveUserInTeamDoc(
         TEAM_ACTIONS.REMOVE,
         TEAM_FIELD_TYPE.REQUESTED,
         teamId,
      );
   }

   // if externalUserID is not given, current userId is considered.
   @action.bound
   acceptInviteToTeam(
      teamId: string,
      externalUserUID: string,
      team = this.myTeamsHash?.[teamId] || false,
      userWhoAccepted,
   ) {
      const teamCreator = team?.createdBy || team?.uid || 'No team owner';

      this.addRemoveUserInTeamDoc(
         TEAM_ACTIONS.REMOVE,
         TEAM_FIELD_TYPE.INVITED,
         teamId,
         externalUserUID,
      );
      this.addRemoveUserInTeamDoc(
         TEAM_ACTIONS.REMOVE,
         TEAM_FIELD_TYPE.REQUESTED,
         teamId,
         externalUserUID,
      );
      this.addRemoveUserInTeamDoc(
         TEAM_ACTIONS.ADD,
         TEAM_FIELD_TYPE.JOINED,
         teamId,
         externalUserUID,
      );
      this.addRemoveTeamInUserDoc(TEAM_ACTIONS.ADD, teamId, externalUserUID);

      sendEpicNotification(
         externalUserUID,
         `Congrats! You were accepted into a team!`,
         { teamId },
         team.name,
      );
      // if (userWhoAccepted) {
      //    sendEpicNotification(
      //       teamCreator,
      //       `${userWhoAccepted?.name} accepted your invite to ${team?.name}!`,
      //    );
      // } else {
      //    sendEpicNotification(
      //       externalUserUID,
      //       `Congrats! You were accepted your into a team!`,
      //    );
      // }
   }


   @action.bound
   joinTeamInstantly(
      teamId: string,
      externalUserUID: string,
      team
   ) {

      this.addRemoveTeamInUserDoc(TEAM_ACTIONS.ADD, teamId, externalUserUID);
      // Firebase.firestore.collection('users').doc(externalUserUID).set({ teams: firebase.firestore.FieldValue.arrayUnion(teamId) }, { merge: true })
      // let team = this?.myTeamsHash?.[teamId] || false;


      // this.addRemoveUserInTeamDoc(
      //    TEAM_ACTIONS.REMOVE,
      //    TEAM_FIELD_TYPE.INVITED,
      //    teamId,
      //    externalUserUID,
      // );
      // this.addRemoveUserInTeamDoc(
      //    TEAM_ACTIONS.REMOVE,
      //    TEAM_FIELD_TYPE.REQUESTED,
      //    teamId,
      //    externalUserUID,
      // );
      this.addRemoveUserInTeamDoc(
         TEAM_ACTIONS.ADD,
         TEAM_FIELD_TYPE.JOINED,
         teamId,
         externalUserUID,
      );
 
      // this.addRemoveTeamInUserDoc(TEAM_ACTIONS.ADD, teamId, externalUserUID);

      sendEpicNotification(
         externalUserUID,
         `Congrats! You joined a team!`,
         { teamId },
         team.name,
      );

      setTimeout(() => {this.fetchMyTeams()}, 2000)
      // if (userWhoAccepted) {
      //    sendEpicNotification(
      //       teamCreator,
      //       `${userWhoAccepted?.name} accepted your invite to ${team?.name}!`,
      //    );
      // } else {
      //    sendEpicNotification(
      //       externalUserUID,
      //       `Congrats! You were accepted your into a team!`,
      //    );
      // }
   }


   @action.bound
   approvePlayerIntoTeam(
      teamId: string,
      externalUserUID: string,
      theTeam,
      userWhoAccepted,
   ) {

      this.addRemoveTeamInUserDoc(TEAM_ACTIONS.ADD, teamId, externalUserUID);
      // Firebase.firestore.collection('users').doc(externalUserUID).set({ teams: firebase.firestore.FieldValue.arrayUnion(teamId) }, { merge: true })
      let team = this?.myTeamsHash?.[teamId] || false;


      this.addRemoveUserInTeamDoc(
         TEAM_ACTIONS.REMOVE,
         TEAM_FIELD_TYPE.INVITED,
         teamId,
         externalUserUID,
      );
      this.addRemoveUserInTeamDoc(
         TEAM_ACTIONS.REMOVE,
         TEAM_FIELD_TYPE.REQUESTED,
         teamId,
         externalUserUID,
      );
      this.addRemoveUserInTeamDoc(
         TEAM_ACTIONS.ADD,
         TEAM_FIELD_TYPE.JOINED,
         teamId,
         externalUserUID,
      );
      console.log('approvePlayerIntoTeam2', teamId, externalUserUID)


      // this.addRemoveTeamInUserDoc(TEAM_ACTIONS.ADD, teamId, externalUserUID);

      sendEpicNotification(
         externalUserUID,
         `Congrats! You were accepted into a team!`,
         { teamId },
         team.name,
      );
      // if (userWhoAccepted) {
      //    sendEpicNotification(
      //       teamCreator,
      //       `${userWhoAccepted?.name} accepted your invite to ${team?.name}!`,
      //    );
      // } else {
      //    sendEpicNotification(
      //       externalUserUID,
      //       `Congrats! You were accepted your into a team!`,
      //    );
      // }
   }

   // if externalUserID is not given, current userId is considered.
   @action.bound
   leaveFromTeam(teamId: string, externalUserUID: string) {

      this.smashStore.setUniversalLoading(true);
      this.addRemoveUserInTeamDoc(
         TEAM_ACTIONS.REMOVE,
         TEAM_FIELD_TYPE.JOINED,
         teamId,
         externalUserUID,
      );
      this.addRemoveUserInTeamDoc(
         TEAM_ACTIONS.REMOVE,
         TEAM_FIELD_TYPE.ADMINS,
         teamId,
         externalUserUID,
      );
      this.addRemoveTeamInUserDoc(TEAM_ACTIONS.REMOVE, teamId, externalUserUID);

      this.removeTeamFromMyTeamsArray(teamId);
      this.smashStore.setUniversalLoading(false);
   }

   @action
  async getSettings() {
    this.unsubscribeToSettings = await getDoc(doc(firestore, "generalSettings", "smashAppSettings")).then((snap) => {
      this.settings = snap.data();
    });
  }
   @computed get teamTargets() {
      return this.settings?.teamTargets || {};
   }

   @action.bound
   createAccountabiltySpace(
      invitedUser: any,
      currentUser: any,
      actions = [],
      masterIds = [],
   ) {
      return new Promise((res, rej) => {
         const { endOfCurrentWeekKey } = this;
         const teamId = ImageUpload?.uid();

         const team: ITeamDoc = {
            id: teamId,
            active: true,
            name: `${currentUser?.name} Vs ${invitedUser?.name}`,
            motto: `The best ever...`,
            battle: true,
            joined: [currentUser?.uid],
            admins: [currentUser?.uid],
            picture: '',
            updatedAt: parseInt(Date.now() / 1000),
            actions,
            masterIds,
            targets: { [endOfCurrentWeekKey]: 20000 },
            mostRecentTarget: 20000,
            teamIsPublic: false,
            uid: currentUser.uid,
            createdBy: currentUser.uid,
         };
         /// create team space

         this.allTeamsUsersFormattedHashByTeamId[team.id] = [
            {
               uid: currentUser.uid,
               score: 0,
               picture: currentUser?.picture || {},
            },
         ];

         // this.myTeams = [...this.myTeams, team];

         const teamsRef = collection(firestore, "teams");
         const teamDoc = doc(teamsRef, team.id);
         
         setDoc(teamDoc, { ...team }).then(async () => {
           // invite user to space
           this.inviteUserToTeam(invitedUser, currentUser, team);
           await this.createTeamWeeklyActivity(team, currentUser);
           await setDoc(doc(firestore, "users", currentUser.uid), {
             teams: arrayUnion(team.id),
           }, { merge: true });
           this.getWeeklyActivityOnce(team);
           res(team);
         });
      });
   }
   @action.bound
   inviteUserToTeam(inviteUser: any, currentUser: any, teamData: any) {
      const { uid } = firebaseInstance.auth.currentUser;
      const title = `${currentUser.name} has invited you to ${teamData.name}`;

      sendEpicNotification(inviteUser.uid, title, { teamId: teamData.id });

      const notiDoc = {
         causeUser: uid,
         causeUserPicture: currentUser?.picture || {},
         receiverUser: inviteUser.uid,
         timestamp: Date.now(),
         type: 'invite',
         title,
         subtitle: '',
         teamData,
      };
      this.notificatonStore.addNewNotificationDoc(notiDoc);
      this.notificatonStore.incrementNotificationCounter(
         NotificationType.Invite,
         inviteUser.uid,
      );
      this.addRemoveUserInTeamDoc(
         TEAM_ACTIONS.ADD,
         TEAM_FIELD_TYPE.INVITED,
         teamData.id,
         inviteUser.uid,
      );
   }
}

export default TeamsStore;
