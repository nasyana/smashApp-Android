import { action, observable, computed, makeObservable, runInAction } from 'mobx';
// import Firebase from '../config/Firebase';
import moment from 'moment-timezone';
import { Share, Platform, Alert } from "react-native"
// import firebase from 'firebase';
import { makePersistable } from 'mobx-persist-store'
import { inject, observer } from 'mobx-react';
import { forEach, identity } from 'lodash';
import { Keyboard } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import ImageUpload from '../helpers/ImageUpload';
import { sendNotification } from 'services/NotificationsService';
import * as Haptics from 'expo-haptics';
import { Vibrate } from 'helpers/HapticsHelpers';
import { NotificationType } from 'constants/Type';
import { getPlayerChallengeData } from 'helpers/playersDataHelpers';
import { getTeamWeeklyData } from 'helpers/teamDataHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as _ from "lodash";
import { durationImages } from 'helpers/generalHelpers';
import {
   teamNotificationOnSmashDailyTargetComplete,
   teamNotificationOnSmashDailyTeamTargetComplete,
   teamNotificationOnSmashWeeklyTeamTargetComplete,
   challengeNotificationOnSmashDailyTargetComplete,
   notifyTeamMemberIfOvertaken,
   combinedTeamNotification,
} from 'helpers/NotificationHelpers';


import {
   collection, query, where, onSnapshot, getDocs, getDoc, increment, arrayRemove,
   arrayUnion, getFirestore, orderBy,
   doc,
   setDoc,
   writeBatch,
   updateDoc,
   limit,
   startAfter, endBefore
} from 'firebase/firestore';


import firebaseInstance from '../config/Firebase'; // import the firebaseInstance you created

const firestore = firebaseInstance.firestore;
// import {makePersistable} from 'mobx-persist-store'
import * as Linking from 'expo-linking';
import { dayNumberOfChallenge, todayDateKey } from 'helpers/dateHelpers';
import Purchases from 'react-native-purchases';
import { Camera, CameraType, FlashMode } from 'expo-camera';




const DEFAULT_PAGE_SIZE = 5;

const DEFAULT_PROFILE: Profile = {
   name: "John Doe",
   outline: "React Native",
   picture: {
      // eslint-disable-next-line max-len
      uri: "https://firebasestorage.googleapis.com/v0/b/react-native-ting.appspot.com/o/fiber%2Fprofile%2FJ0k2SZiI9V9KoYZK7Enru5e8CbqFxdzjkHCmzd2yZ1dyR22Vcjc0PXDPslhgH1JSEOKMMOnDcubGv8s4ZxA.jpg?alt=media&token=6d5a2309-cf94-4b8e-a405-65f8c5c6c87c",
      preview: "data:image/gif;base64,R0lGODlhAQABAPAAAKyhmP///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
   }
};
const isAndroid = Platform.OS === 'android';


const debugNormalUser = false;
const debugNewUser = false;

const debugUserNoFollowers = false
class SmashStore {
   notificatonStore;
   @observable _homeTabsIndex = 0;
   @observable _serverTimestamp;
   @observable _activityListLastUpdated = 0;
   @observable _capturedMedia = null;
   @observable _zoom = 0;
   @observable _selectMultiplier = false;
   @observable _debugLog = false;
   @observable _challengesView = 'today';
   @observable _teamsView = 'today';
   @observable _loadingUserStories = false;
   @observable _firstTime = false;
   @observable _endWeekKey = moment().endOf('isoWeek').format('DDMMYYYY');
   @observable _hypePost = false;
   @observable _flashMode = Camera.Constants.FlashMode.on;
   @observable _activeChallengeDoc = false;
   @observable _playersInActiveChallenge = [];
   @observable _currentUser = {};
   @observable _findChallenge = false;
   @observable _settings = {};
   @observable _currentStory = false;
   @observable _selectedDayKey = moment().format('DDMMYYYY');
   @observable _activityCategoryLabels = [];
   @observable _libraryActionsList = [];
   @observable _habitStacksList = [];
   @observable _myLibraryActivities = [];
   @observable _selectedActions = [];
   @observable _focusUser = false;
   @observable _activtyWeAreSmashing = null;
   @observable _capturedPicture = null;
   @observable _capturedVideo = null;
   @observable _targetView = 0;
   @observable _graphView = 0;
   @observable _todayActivity = false;
   @observable _activityList = [];
   @observable _dailyActivityOfUsersImFollowing = [];
   @observable _completion = false;
   @observable _completionChallenges = [];
   @observable _imageUploading = false;
   @observable _headerGradient = ['#FF5E3A', '#FF2A68'];
   @observable _recordingProgress = 0;
   @observable _universalLoading = false;
   @observable _multiplier = 1;
   @observable _recording = false;
   @observable _masterIdsToSmash = false;
   @observable _masterIdsToSmashFromTeam = false;
   @observable _homeScreenTab = false;
   @observable _completionTeams = false;
   @observable _stories = [];
   @observable _storyIndex = 0;
   @observable _completionsHash = {};
   @observable _myStories = [];
   @observable _userDayDoc = {};
   @observable _userTemporaryStories = {};
   @observable _teamUserTemporaryStories = {};
   @observable _myCelebrations = [];
   @observable _completionsTeamsAndChallenges = [];
   @observable _smashing = false;
   @observable _showRocket = false;
   @observable _simpleCelebrate = false;
   @observable _userStoriesHash = {};
   @observable _subscribedToUsers = {};
   @observable _showCommentsModal = false;
   @observable _commentsModalRef = false;
   @observable _commentPost = false;
   @observable _replyComment = false;
   @observable _coolComment = '';
   @observable _showChatReactionsModal = false;
   @observable _activeChatMessage = null;
   @observable _allUsersHash = {};
   @observable _quickViewTeam = false;
   @observable _editingActivity = false;
   @observable _changeMood = false;
   @observable _yesCheckCamPermissions = false;
   @observable _tutorialVideo = false;
   @observable _cameraType = CameraType.back;
   @observable _whoReacted = false;
   @observable _clearTimer = null;
   @observable _checkPermissions = false;
   @observable _gotPermissions = false;
   @observable _dismissWizard = true;
   @observable _uploadProgress = 0;
   @observable _manuallySkipped = false;
   @observable _homeActionsVisible = false;
   @observable _customerInfo = false;
   @observable _allUsersStoriesCount = 0
   @observable _journeySettings = {}
   @observable _activePlayers = [];
   @observable feedData = [];
   @observable lastVisible = null;
   @observable _upgradeModal = false;
   @observable _feed = [];
   @observable _selectedHour = false;
   @observable _loadingFeed = false;
   @observable _teamActionsVisible = false;
   @observable _searchText = '';
   @observable _friendsTodayDocsHash = {};
   @observable _showFeed = false;
   @observable _showActivityInStory = false;
   @observable _refreshing = false;
   @observable _currentStoryUser = false
   @observable _menuState = { index: 0 }
   @observable _durationImages = durationImages;
   @observable _actionMenuPost = false;







   // eslint-disable-next-line flowtype/no-weak-types
   cursor: any;
   // eslint-disable-next-line flowtype/no-weak-types
   lastKnownEntry: any;
   // eslint-disable-next-line flowtype/no-weak-types
   query: any;

   profiles: { [uid: string]: Profile } = {};



   @computed get feed() { return this._feed; }
   set feed(feed) { this._feed = feed; }

   // eslint-disable-next-line flowtype/no-weak-types

   @action.bound
   initFeed(query: any) {

      console.log('debug feedItems 1 initFeed')
      this.query = query;
      console.log('debug feedItems 2 this.query ')
      this.loadFeed();
   }

   @action.bound
   setFriendsTodayDocsHash(friendDoc) {

      this.friendsTodayDocsHash[friendDoc.uid] = friendDoc;

   }

   @action.bound
   setActionMenuPost(post) {

      this.actionMenuPost = post;
   }

   @action.bound
   setWholeFriendsTodayHash(friendDocHash) {



      this.friendsTodayDocsHash = { ...this.friendsTodayDocsHash, ...friendDocHash };
   }

   @computed
   get serverTimestamp() {

      return moment().unix();
   }


   @action.bound
   async joinProfiles(posts) {

      console.log('debug feedItems joinProfiles 1');
      const uids = posts.map(post => post.uid).filter(uid => this.profiles[uid] === undefined);

      //   console.log('debug feedItems joinProfiles 2 uids',uids);
      const profilePromises = _.uniq(uids).map(uid => (async () => {
         try {
            const docRef = doc(collection(firestore, "users"), uid);
            const profileDoc = await getDoc(docRef);
            this.profiles[uid] = profileDoc.data();
         } catch (e) {
            this.profiles[uid] = DEFAULT_PROFILE;
         }
      })());

      console.log('debug feedItems joinProfiles 3 profilePromises');
      await Promise.all(profilePromises);

      console.log('debug feedItems joinProfiles 4');
      return posts.map(post => {
         const profile = this.profiles[post.uid];
         return { profile, post };
      });
   }

   @action.bound
   async checkForNewEntriesInFeed(): Promise<void> {

      // console.log('feedItem this.lastKnownEntry',this.query)

      if (this.lastKnownEntry) {

         const snap = await getDocs(query(this.query, endBefore(this.lastKnownEntry)));

         if (snap.docs.length === 0) {
            if (!this.feed) {
               this.feed = [];
            }
            return;
         }

         const posts: Post[] = [];
         snap.forEach(postDoc => {
            posts.push(postDoc.data());
         });
         // const feed = await this.joinProfiles(posts);
         this.addToFeed(feed);
         // eslint-disable-next-line prefer-destructuring
         this.lastKnownEntry = snap.docs[0];
      }
   }
   @action.bound
   async loadFeed(): Promise<void> {

      // eslint-disable-next-line prefer-destructuring
      let theQuery = this.query;


      if (this.cursor) {
         console.log("debug feedItems 4 this.cursor is true");
         theQuery = query(theQuery, startAfter(this.cursor));
      }

      const snap = await getDocs(query(theQuery, limit(DEFAULT_PAGE_SIZE)));
      console.log("debug feedItems 5 after run default query");

      if (snap.docs.length === 0) {
         console.log("debug feedItems 6 we have no docs");

         if (!this.feed) {
            this.feed = [];
         }

         return;
      }

      const posts = [];
      snap.forEach(postDoc => {
         posts.push(postDoc.data());
      });



      const feed = posts //await this.joinProfiles(posts);



      if (this.feed?.length == 0) {
         this.feed = [];
         // eslint-disable-next-line prefer-destructuring
         this.lastKnownEntry = snap.docs[0];
      }

      this.addToFeed(feed);
      this.cursor = _.last(snap.docs);
      //   this.lastKnownEntry = snap.docs[0];


   }
   @action.bound
   addToFeed(feedItems) {
      const feed = _.uniqBy([...this.feed.slice(), ...feedItems], feedItem => feedItem.id);
      this.feed = _.orderBy(feed, feedItem => feedItem.timestamp, ["desc"]);
   }

   @action.bound

   toggleFlash = () => {
      const { on, off } = Camera.Constants.FlashMode;
      this.flashMode === on ? off : on;
   };



   @action.bound
   updateSinglePostInFeed(post) {

      const feed = this.feed.map(feedItem => {
         if (feedItem.id === post.id) {
            return post;
         }
         return feedItem;
      });
      this.feed = feed;
   }





   @action.bound
   setZoom(zoom) {

      this.zoom = zoom;
   }

   /// End FeedStore
   addData(newData) {
      this.data = [...this.data, ...newData];
   }

   setLastVisible(doc) {
      this.lastVisible = doc;
   }
   unsubscribeToSettings = null;
   unsubscribeMyLibraryActions = null;
   unsubscribeToLibraryActions = null;

   constructor(notificatonStore) {
      this.notificatonStore = notificatonStore;
      makeObservable(this);
      makePersistable(this, {
         name: 'SmashStore2', properties: [
            '_friendsTodayDocsHash',
            '_todayActivity',
            // '_feed',
            '_activityList',
            '_durationImages',
            // '_userStoriesHash',
            '_libraryActionsList',
            '_settings',
            '_currentUser',
            '_myLibraryActivities'
         ], storage: AsyncStorage
      }, { delay: 500, fireImmediately: false });
   }



   /// Start FeedStore

   cameraRef = null;

   @action.bound
   setCameraRef(ref) {
      this.cameraRef = ref;
   }

   getCameraRef(ref) {
      return this.cameraRef;
   }

   isLongPressRef = null;

   @action.bound
   setLongPressRef(ref) {
      this.isLongPressRef = ref;
   }


   getLongPressRef(ref) {
      return this.isLongPressRef;
   }


   timerIdRef = null;

   @action.bound
   setTimerIdRef(ref) {
      this.timerIdRef = ref;
   }

   getTimerIdRef(ref) {
      return this.timerIdRef;
   }

   videoTimerId = null;

   @action.bound
   setVideoTimerId(ref) {
      this.videoTimerId = ref;
   }

   getVideoTimerId(ref) {
      return this.videoTimerId;
   }


   adminId = 'droPx1suwYMRoQPmYfVtgUmlNY63';
   adminIds = ['droPx1suwYMRoQPmYfVtgUmlNY63', '2JHK02sr6TNy3WeoOuOnKWJog9J2', 'JrYwOpjdjYOZdkdmXJSTmiQs22J3'];

   @computed get friendsTodayDocsHash() {
      return this._friendsTodayDocsHash;
   }
   set friendsTodayDocsHash(friendsTodayDocsHash) {
      this._friendsTodayDocsHash = friendsTodayDocsHash;
   }


   @computed get userStoriesHash() {
      return this._userStoriesHash;
   }
   set userStoriesHash(userStoriesHash) {
      this._userStoriesHash = userStoriesHash;
   }


   // getter and setter for capturedMedia
   @computed get capturedMedia() {
      return this._capturedMedia;
   }
   set capturedMedia(capturedMedia) {
      this._capturedMedia = capturedMedia;
   }

   @computed get clearTimer() {
      return this._clearTimer;
   }
   set clearTimer(clearTimer) {
      this._clearTimer = clearTimer;
   }


   @computed get refreshing() {
      return this._refreshing;
   }
   set refreshing(refreshing) {
      this._refreshing = refreshing;
   }




   @computed get upgradeModal() {
      return this._upgradeModal;
   }
   set upgradeModal(upgradeModal) {
      this._upgradeModal = upgradeModal;
   }


   @computed get selectMultiplier() {
      return this._selectMultiplier;
   }
   set selectMultiplier(selectMultiplier) {
      this._selectMultiplier = selectMultiplier;
   }

   @computed get actionMenuPost() {
      return this._actionMenuPost;
   }
   set actionMenuPost(actionMenuPost) {
      this._actionMenuPost = actionMenuPost;
   }




   @action.bound
   setSelectMultiplier(bool) {

      this.selectMultiplier = bool
   }

   @computed get allUsersStoriesCount() {
      return this._allUsersStoriesCount;
   }
   set allUsersStoriesCount(allUsersStoriesCount) {
      this._allUsersStoriesCount = allUsersStoriesCount;
   }


   @computed get manuallySkipped() {
      return this._manuallySkipped;
   }
   set manuallySkipped(manuallySkipped) {
      this._manuallySkipped = manuallySkipped;
   }

   @computed get gotPermissions() {
      return this._gotPermissions;
   }
   set gotPermissions(gotPermissions) {
      this._gotPermissions = gotPermissions;
   }


   @computed get showActivityInStory() {
      return this._showActivityInStory;
   }
   set showActivityInStory(showActivityInStory) {
      this._showActivityInStory = showActivityInStory;
   }


   @computed get zoom() {
      return this._zoom;
   }
   set zoom(zoom) {
      this._zoom = zoom;
   }


   @computed get flashMode() {
      return this._flashMode;
   }
   set flashMode(flashMode) {
      this._flashMode = flashMode;
   }


   @computed get dImages() {
      return this._durationImages.map((d, index) => durationImages[index]);
   }
   // set durationImages(durationImages) {
   //    this._durationImages = durationImages;
   // }





   @computed get dismissWizard() {
      return this._dismissWizard;
   }
   set dismissWizard(dismissWizard) {
      this._dismissWizard = dismissWizard;
   }

   @computed get checkPermissions() {
      return this._checkPermissions;
   }
   set checkPermissions(checkPermissions) {
      this._checkPermissions = checkPermissions;
   }

   @computed get menuState() {
      return this._menuState;
   }
   set menuState(menuState) {
      this._menuState = menuState;
   }


   @action.bound
   setMenuState(menuState) {
      this._menuState = menuState;
   }

   @computed get uploadProgress() {
      return this._uploadProgress;
   }
   set uploadProgress(uploadProgress) {
      this._uploadProgress = uploadProgress;
   }

   @computed get editingActivity() {
      return this._editingActivity;
   }
   set editingActivity(editingActivity) {
      this._editingActivity = editingActivity;
   }

   @computed get showFeed() {
      return this._showFeed;
   }
   set showFeed(showFeed) {
      this._showFeed = showFeed;
   }

   @computed get cameraType() {
      return this._cameraType;
   }
   set cameraType(cameraType) {
      this._cameraType = cameraType;
   }

   @action.bound
   setCameraType(cameraType) {
      this._cameraType = cameraType;
   }


   @computed get whoReacted() {
      return this._whoReacted;
   }
   set whoReacted(whoReacted) {
      this._whoReacted = whoReacted;
   }

   @computed get selectedHour() {
      return this._selectedHour;
   }
   set selectedHour(selectedHour) {
      this._selectedHour = selectedHour;
   }




   @computed get yesCheckCamPermissions() {
      return this._yesCheckCamPermissions;
   }
   set yesCheckCamPermissions(yesCheckCamPermissions) {
      this._yesCheckCamPermissions = yesCheckCamPermissions;
   }

   @computed get debugLog() {
      return this._debugLog;
   }
   set debugLog(debugLog) {
      this._debugLog = debugLog;
   }



   @computed get currentStoryUser() {
      return this._currentStoryUser;
   }
   set currentStoryUser(currentStoryUser) {
      this._currentStoryUser = currentStoryUser;
   }





   @computed get journeySettings() {
      return this._journeySettings;
   }
   set journeySettings(journeySettings) {
      this._journeySettings = journeySettings;
   }

   @computed get customerInfo() {
      return this._customerInfo;
   }
   set customerInfo(customerInfo) {
      this._customerInfo = customerInfo;
   }





   @computed get quickViewTeam() {
      return this._quickViewTeam;
   }
   set quickViewTeam(quickViewTeam) {
      this._quickViewTeam = quickViewTeam;
   }

   @computed get changeMood() {
      return this._changeMood;
   }
   set changeMood(changeMood) {
      this._changeMood = changeMood;
   }

   @computed get allUsersHash() {
      return this._allUsersHash;
   }
   set allUsersHash(allUsersHash) {
      this._allUsersHash = allUsersHash;
   }

   @computed get coolComment() {
      return this._coolComment;
   }
   set coolComment(coolComment) {
      this._coolComment = coolComment;
   }

   @computed get hasImage() {

      return this.capturedPicture || this.capturedVideo || this.manuallySkipped;
   }

   @computed get simpleCelebrate() {
      return this.completion ? false : this._simpleCelebrate;
   }
   set simpleCelebrate(simpleCelebrate) {
      this._simpleCelebrate = simpleCelebrate;
   }

   @computed get searchText() {
      return this._searchText;
   }
   set searchText(searchText) {
      this._searchText = searchText;
   }



   @computed get replyComment() {
      return this._replyComment;
   }
   set replyComment(replyComment) {
      this._replyComment = replyComment;
   }


   @computed get challengesView() {
      return this._challengesView;
   }
   set challengesView(challengesView) {
      this._challengesView = challengesView;
   }

   @computed get teamsView() {
      return this._teamsView;
   }
   set teamsView(teamsView) {
      this._teamsView = teamsView;
   }
   @computed get tutorialVideo() {
      return this._tutorialVideo;
   }
   set tutorialVideo(tutorialVideo) {
      this._tutorialVideo = tutorialVideo;
   }

   @computed get homeActionsVisible() {
      return this._homeActionsVisible;
   }
   set homeActionsVisible(homeActionsVisible) {
      this._homeActionsVisible = homeActionsVisible;
   }




   @computed get commentsModalRef() {
      return this._commentsModalRef;
   }
   set commentsModalRef(commentsModalRef) {
      this._commentsModalRef = commentsModalRef;
   }


   @computed get teamActionsVisible() {
      return this._teamActionsVisible;
   }
   set teamActionsVisible(teamActionsVisible) {
      this._teamActionsVisible = teamActionsVisible;
   }




   @computed get subscribedToUsers() {
      return this._subscribedToUsers;
   }
   set subscribedToUsers(subscribedToUsers) {
      this._subscribedToUsers = subscribedToUsers;
   }

   @computed get userTemporaryStories() {
      return this._userTemporaryStories;
   }
   set userTemporaryStories(userTemporaryStories) {
      this._userTemporaryStories = userTemporaryStories;
   }

   @computed get smashing() {
      return this._smashing;
   }
   set smashing(smashing) {
      this._smashing = smashing;
   }


   @computed get activePlayers() {
      return this._activePlayers;
   }
   set activePlayers(activePlayers) {
      this._activePlayers = activePlayers;
   }

   @computed get allPlayersExceptMe() {

      const { uid } = this.currentUser;

      return this.activePlayers.filter((player) => player.uid !== uid);
   }

   @computed get completionsTeamsAndChallenges() {
      return this._completionsTeamsAndChallenges;
   }
   set completionsTeamsAndChallenges(completionsTeamsAndChallenges) {
      this._completionsTeamsAndChallenges = completionsTeamsAndChallenges;
   }



   @computed get myCelebrations() {
      return this._myCelebrations;
   }
   set myCelebrations(myCelebrations) {
      this._myCelebrations = myCelebrations;
   }

   @computed get itemToCelebrate() {

      return this.completion ? false : this.myCelebrations?.[0] || false
   }

   @computed get teamUserTemporaryStories() {
      return this._teamUserTemporaryStories;
   }
   set teamUserTemporaryStories(teamUserTemporaryStories) {
      this._teamUserTemporaryStories = teamUserTemporaryStories;
   }

   @computed get playersInActiveChallenge() {
      return this._playersInActiveChallenge;
   }
   set playersInActiveChallenge(playersInActiveChallenge) {
      this._playersInActiveChallenge = playersInActiveChallenge;
   }
   @computed get showRocket() {
      return this._showRocket;
   }
   set showRocket(showRocket) {
      this._showRocket = showRocket;
   }

   @computed get masterIdsToSmash() {
      return this._masterIdsToSmash;
   }
   set masterIdsToSmash(masterIdsToSmash) {
      this._masterIdsToSmash = masterIdsToSmash;
   }

   @computed get userDayDoc() {
      return this._userDayDoc;
   }
   set userDayDoc(userDayDoc) {
      this._userDayDoc = userDayDoc;
   }

   @computed get stories() {
      return this._stories;
   }
   set stories(stories) {
      this._stories = stories;
   }

   @computed get storyIndex() {
      return this._storyIndex;
   }
   set storyIndex(storyIndex) {
      this._storyIndex = storyIndex;
   }

   @computed get tempStory() {
      return this.stories?.[this.storyIndex];
   }

   @computed get masterIdsToSmashFromTeam() {
      return this._masterIdsToSmashFromTeam;
   }
   set masterIdsToSmashFromTeam(masterIdsToSmashFromTeam) {
      this._masterIdsToSmashFromTeam = masterIdsToSmashFromTeam;
   }

   @computed get recording() {
      return this._recording;
   }
   set recording(recording) {
      this._recording = recording;
   }

   @computed get completionsHash() {
      return this._completionsHash;
   }
   set completionsHash(completionsHash) {
      this._completionsHash = completionsHash;
   }

   @computed get homeTabsIndex() {
      return this._homeTabsIndex;
   }
   set homeTabsIndex(homeTabsIndex) {
      this._homeTabsIndex = homeTabsIndex;
   }

   @computed get universalLoading() {
      return this._universalLoading;
   }
   set universalLoading(universalLoading) {
      this._universalLoading = universalLoading;
   }

   @computed get myStories() {
      return this._myStories;
   }
   set myStories(myStories) {
      this._myStories = myStories;
   }

   @computed get loadingUserStories() {
      return this._loadingUserStories;
   }
   set loadingUserStories(loadingUserStories) {
      this._loadingUserStories = loadingUserStories;
   }

   @computed get activeChallengeDoc() {
      return this._activeChallengeDoc;
   }
   set activeChallengeDoc(activeChallengeDoc) {
      this._activeChallengeDoc = activeChallengeDoc;
   }

   @computed get activity() {
      const activity = {};

      this.activityList?.forEach((a) => {

         activity[a?.dayKey] = a
      });

      return activity;
   }
   // set activity(activity) {
   //    this._activity = activity;
   // }

   @computed get endWeekKey() {
      return this._endWeekKey;
   }

   @computed get dailyActivityOfUsersImFollowing() {
      return this._dailyActivityOfUsersImFollowing;
   }
   set dailyActivityOfUsersImFollowing(dailyActivityOfUsersImFollowing) {
      this._dailyActivityOfUsersImFollowing = dailyActivityOfUsersImFollowing;
   }

   @computed get activityList() {
      return this._activityList;
   }
   set activityList(newActivityList) {
      // let highestUpdatedAt = this._activityListLastUpdated;

      this._activityList = newActivityList;

      // newActivityList.forEach((activity) => {
      //   if (activity.updatedAt > highestUpdatedAt) {
      //     highestUpdatedAt = activity.updatedAt;
      //   }
      // });

      // if (this._activityListLastUpdated !== highestUpdatedAt) {
      //   this._activityListLastUpdated = highestUpdatedAt;
      // }

      // this._activityList = newActivityList.map((newActivity, index) => {
      //   const currentActivity = this._activityList[index];
      //   if (currentActivity && currentActivity.id === newActivity.id && currentActivity.updatedAt !== newActivity.updatedAt) {
      //     return newActivity;
      //   }
      //   return currentActivity || newActivity;
      // });
   }

   @computed get completionTeams() {
      return this._completionTeams;
   }
   set completionTeams(completionTeams) {
      this._completionTeams = completionTeams;
   }

   @computed get commentPost() {
      return this._commentPost;
   }
   set commentPost(commentPost) {
      this._commentPost = commentPost;
   }

   @computed get currentStory() {
      // const story = this.stories?.[this.storyIndex] || false;
      // const alreadyInHash = story
      //    ? this.userStoriesHash?.[story.id] || false
      //    : false;
      return this.storyIndex > -1 ? this.stories?.[this.storyIndex] : false;
   }


   @computed get storyToRender() {
      const story = this.stories?.[this.storyIndex] || false;
      const alreadyInHash = story
         ? this.userStoriesHash?.[story.id] || false
         : false;
      return alreadyInHash
         ? alreadyInHash
         : this.stories?.[this.storyIndex] || 'nope';
   }

   @computed get nextCurrentStory() {
      const story = this.stories?.[this.storyIndex + 1] || false;
      const alreadyInHash = story
         ? this.userStoriesHash?.[story.id] || false
         : false;
      return alreadyInHash
         ? alreadyInHash
         : this.stories?.[this.storyIndex + 1] || false;
   }
   // set currentStory(currentStory) {
   //    this._currentStory = currentStory;
   // }

   @computed get homeScreenTab() {
      return this._homeScreenTab;
   }
   set homeScreenTab(homeScreenTab) {
      this._homeScreenTab = homeScreenTab;
   }

   @computed get headerGradient() {
      return this._headerGradient;
   }
   set headerGradient(headerGradient) {
      this._headerGradient = headerGradient;
   }

   @computed get findChallenge() {
      return this._findChallenge;
   }
   set findChallenge(findChallenge) {
      this._findChallenge = findChallenge;
   }

   @computed get imageUploading() {
      return this._imageUploading;
   }
   set imageUploading(imageUploading) {
      this._imageUploading = imageUploading;
   }

   @computed get targetView() {
      return this._targetView;
   }
   set targetView(targetView) {
      this._targetView = targetView;
   }

   @computed get graphView() {
      return this._graphView;
   }
   set graphView(graphView) {
      this._graphView = graphView;
   }

   @computed get currentUserHasPointsEver() {

      return this.currentUser?.allPointsEver || false;
   }

   @computed get hasUserGotFeelingsToday() {

      const todayFeelings = this?.currentUser?.feelings ? this?.currentUser?.feelings?.[todayDateKey()] : false;

      return todayFeelings;
   }

   @computed get showHowAreYouFeelingModal() {



      return !this.simpleCelebrate &&
         this.changeMood &&
         !this.completion &&
         !this.itemToCelebrate &&
         this.currentUser.dailyScores
         ? true // shows it changeMood is true and not anything else. 
         :
         this.currentUser.dailyScores &&
            !this.completion &&
            !this.simpleCelebrate &&
            !this.itemToCelebrate &&
            this.currentUserId &&
            (this.currentUser.inChallengeArray || this.currentUser.teams) &&
            !this.hasUserGotFeelingsToday
            ? true
            : false;
   }

   @action.bound
   getCurrentUserMood(dayKey) {

      return this?.currentUser?.feelings?.[dayKey]?.emoji

   }
   @computed get currentUserMoodToday() {

      return this.todayDateKey ? this?.currentUser?.feelings?.[this.todayDateKey]?.emoji || '' : '';
   }

   @computed get currentUser() {

      return this._currentUser;

      if (debugNormalUser) {

         return { ...this._currentUser, superUser: false, activityManager: false }
      }
      if (debugNewUser) {

         return { name: 'New Guy', picture: { uri: 'pic', preview: 'preview' } }
      }

      if (debugUserNoFollowers) {


         return { name: 'New Guy', inChallengeMap: true, challengesArray: true, teams: true, picture: { uri: 'pic', preview: 'preview' } }



      }

   }

   @computed get uid() {

      return this.currentUser?.uid || false
   }

   @computed get currentUserId() {

      return this.currentUser?.uid || false
   }

   @computed get currentUserEmoji() {

      return this.currentUser?.feelings?.[this.todayDateKey]?.emoji || false
   }


   @computed get currentUserFollowing() {

      return this.currentUser?.following || false
   }

   @computed get currentUserFollowers() {

      return this.currentUser?.followers || false
   }


   @computed get currentUserPicture() {

      return this.currentUser?.picture || {}
   }


   @computed get currentUserName() {

      return this.currentUser?.name || 'Noname'
   }


   @computed get isSuperUser() {

      return this.currentUser?.superUser || false
   }

   @computed get currentUserInChallengeMap() {

      return this.currentUser?.inChallengeMap || false
   }
   set currentUser(currentUser) {
      this._currentUser = currentUser;
   }

   @computed get settings() {
      return this._settings;
   }
   set settings(settings) {
      this._settings = settings;
   }

   @computed get focusUser() {
      return this._focusUser;
   }
   set focusUser(focusUser) {
      this._focusUser = focusUser;
   }

   @computed get recordingProgress() {
      return this._recordingProgress;
   }
   set recordingProgress(recordingProgress) {
      this._recordingProgress = recordingProgress;
   }




   @computed get loadingFeed() {
      return this._loadingFeed;
   }
   set loadingFeed(loadingFeed) {
      this._loadingFeed = loadingFeed;
   }



   @computed get multiplier() {
      return this._multiplier;
   }
   set multiplier(multiplier) {
      this._multiplier = multiplier;
   }

   @computed get selectedDayKey() {
      return this._selectedDayKey;
   }
   set selectedDayKey(selectedDayKey) {
      this._selectedDayKey = selectedDayKey;
   }

   @computed get selectedDayLabel() {
      return this.isToday
         ? 'TODAY'
         : moment(this.selectedDayKey, 'DMMYYYY')
            .format('dddd MMM Do YYYY')
            .toUpperCase();
   }

   @computed get isToday() {
      return this.selectedDayKey == this.todayDateKey;
   }

   @computed get selectedDay() {
      return this.activity?.[this._selectedDayKey] || false;
   }

   @computed get actionLevels() {
      return this.settings?.actionLevels;
   }

   @computed get activityCategoryLabels() {
      return this._activityCategoryLabels;
   }
   set activityCategoryLabels(activityCategoryLabels) {
      this._activityCategoryLabels = activityCategoryLabels;
   }

   @computed get firstTime() {
      return this._firstTime;
   }
   set firstTime(firstTime) {
      this._firstTime = firstTime;
   }

   @computed get myLibraryActivities() {
      return this._myLibraryActivities;
   }
   set myLibraryActivities(myLibraryActivities) {
      this._myLibraryActivities = myLibraryActivities;
   }

   @computed get hypePost() {
      return this._hypePost;
   }
   set hypePost(hypePost) {
      this._hypePost = hypePost;
   }

   @computed get showCommentsModal() {
      return this._showCommentsModal;
   }
   set showCommentsModal(showCommentsModal) {
      this._showCommentsModal = showCommentsModal;
   }

   @computed get showChatReactionsModal() {
      return this._showChatReactionsModal;
   }
   set showChatReactionsModal(showChatReactionsModal) {
      this._showChatReactionsModal = showChatReactionsModal;
   }

   @computed get activeChatMessage() {
      return this._activeChatMessage;
   }
   set activeChatMessage(activeChatMessage) {
      this._activeChatMessage = activeChatMessage;
   }

   @computed get noTeamsOrChallenges() {
      return !this.currentUser.inChallengeMap && !this.currentUser.teams;
   }


   @computed get challengesSimulatedArray() {



      const { journeySettings } = this;
      const { durations = {} } = journeySettings;
      if (Object.keys(durations)?.length == 0) {

         return
      }
      const durationsArray = Object.values(durations);

      const numForArray = parseInt((durationsArray.length * 2) - 1)

      const simulateFullArrayLength = Array.from(Array(numForArray).keys());

      let counter = 0;
      const combinedArray = simulateFullArrayLength.map((item, index) => {

         const number = index + 1;
         if (number % 2 == 0) {


            return { placeholder: true }

            //The number is even
         } else {

            // when number == 3 index should be 1 when index is 5 index should be 2 when number is 7 index should be 3


            counter++

            return { ...durationsArray[counter > 0 ? counter - 1 : 0], refIndex: counter > 0 ? counter - 1 : 0 };

         }

      })

      return combinedArray
   }

   @action.bound
   setShowRocket(bool) {
      this.showRocket = bool;
   }


   @action.bound
   setSearchText(text) {

      this.searchText = text;
   }

   @action.bound
   setReplyComment(comment) {
      this.replyComment = comment;
   }

   @action.bound
   showWhoReacted(message) {
      Vibrate();
      this.whoReacted = message.userReactions;
   }

   @action.bound
   setActivePlayers(players) {


      this.activePlayers = players;

   }

   @action.bound
   hideChatReactionsModal() {
      this.showChatReactionsModal = false;
   }

   navigation = () => null;

   @action.bound
   nextStory() {
      Vibrate();

      this.setCoolComment('');
      if (this.showCommentsModal) {
         this.showCommentsModal = false;
         this.commentsModalRef?.current?.close();
         Keyboard.dismiss();
      } else {
         if (this.storyIndex < this.stories.length - 1) {
            this.storyIndex = this.storyIndex + 1;
            // this.currentStory = this?.stories[this.stories.length - 1] || false;
         } else {
            // this.currentStory = false;
            this.stories = false;
         }
      }
   }

   @computed get showStoryModal() {
      return this.stories?.length > 0 || false;
   }

   @computed get userStoriesCount() {

      return Object.keys(this.userStoriesHash).length || 0;
   }


   @action.bound
   async getUserStories(uid, dayKey) {
      const postsCollection = collection(firestore, 'posts');
      const subQuery = query(postsCollection, where('uid', '==', uid), where('dayKey', '==', dayKey));

      const postsSnap = await getDocs(subQuery);
      const userPosts = {};

      postsSnap.forEach((snap) => {
         const post = snap.data();
         if (post.id) {
            userPosts[post.id] = post;
         }
      });

      runInAction(() => {
         this.userStoriesHash = userPosts;
      });
   }

   unSub = [];


   @action.bound
   sethHomeActionsVisible(bool) {

      this.homeActionsVisible = bool;

   }
   @action.bound
   setManuallySkipped(bool) {
      this.manuallySkipped = bool;
   }
   @action.bound
   manualSetUserStoriesHash(p) {

      if (!p) { return }
      this.userStoriesHash[p.id] = p;
   }

   @action.bound
   savePostToHash(post) {
      this.userStoriesHash[post.id] = post;
   }

   @action.bound
   subscribeToPost(id) {

      if (!id) { return }
      const postsCollection = collection(firestore, 'posts');
      const postDoc = doc(postsCollection, id);

      const unsub = onSnapshot(postDoc, (snap) => {
         const post = snap.data();

         if (post?.id) {
            runInAction(() => {
               this.userStoriesHash[post.id] = post;
            });
         }
      });

      return unsub;
   }

   @action.bound
   async getUsers(uid, dayKey) {
      const usersCollection = collection(firestore, 'users');
      const userDoc = doc(usersCollection, uid);

      const snap = await getDoc(userDoc);
      if (snap.exists) {
         runInAction(() => {
            this.allUsersHash[uid] = snap.data();
         });
      }
   }


   @action.bound
   setTeamActionsVisible(bool) {

      this.teamActionsVisible = bool;

   }


   @action.bound
   setShowFeed(bool) {

      this.showFeed = bool;

   }


   @action.bound
   setAllUsersStoriesCount(num) {

      this.allUsersStoriesCount = num;
   }


   @action.bound
   addData(newData) {
      this.feedData = [...this.feedData, ...newData];
   }
   @action.bound
   setLastVisible(doc) {
      this.lastVisible = doc;
   }


   @action.bound
   setTeamsView(view) {

      this.teamsView = view;
   }

   @action.bound
   setChallengesView(view) {

      this.challengesView = view;
   }

   setUniversalLoading(bool) {

      if (bool == false) {

         setTimeout(() => {
            this.universalLoading = bool;
         }, 1500);
      } else {
         this.universalLoading = bool;

      }


   }

   @action.bound
   async subscribeToUserStories(uid, dayKey) {


      // alert(dayKey)

      // return 
      const { todayDateKey } = this;
      // alert('subscribeToUserStories',uid,dayKey)
      this.subscribedToUsers[uid] = true;
      await this.getUserStories(uid, todayDateKey);

      const postsCollection = collection(firestore, 'posts');
      const postsQuery = query(postsCollection, where('uid', '==', uid), where('dayKey', '==', todayDateKey));

      const setUserStoriesHash = (p) => {
         runInAction(() => {
            this.userStoriesHash[p.id] = p;
         });
      };

      const unsub = onSnapshot(postsQuery, (querySnapshot) => {
         querySnapshot.docChanges().forEach(function (change) {
            const post = change.doc.data();

            if (post) {
               if (change.type === 'added' || change.type === 'modified') {
                  setUserStoriesHash(post);
               }
               //  else if (change.type === 'removed') {
               //    runInAction(() => {
               //      delete this.userStoriesHash[post.id];
               //    });
               //  }
            }
         });
      });

      runInAction(() => {
         this.unSub.push(unsub);
      });
   }


   @action.bound
   setShowActivityInStory(bool) {

      this.showActivityInStory = bool;

   }

   @action.bound
   prevStory() {
      Vibrate();

      this.setCoolComment('');
      if (this.showCommentsModal) {
         this.showCommentsModal = false;
         this.commentsModalRef?.current?.close();
         Keyboard.dismiss();
      } else {
         if (this.storyIndex > 0) {
            this.storyIndex = this.storyIndex - 1;
            // this.currentStory = this?.stories[this.storyIndex - 1] || false;
         } else {
            // this.currentStory = false;
            this.stories = false;
         }
      }
   }

   // @action.bound
   // addToCompletionsHash(){

   // }
   @action.bound
   getMyStories() {
      const { uid } = firebaseInstance.auth.currentUser;

      const postsCollection = collection(firestore, 'posts');
      const postsQuery = query(postsCollection, where('dayKey', '==', this.todayDateKey), where('uid', '==', uid));

      const unSubMyStories = onSnapshot(postsQuery, (snaps) => {
         let postsArray = [];
         if (!snaps.empty) {
            snaps.forEach((snap) => {
               const post = snap.data();
               postsArray.push(post);
            });
         }

         this.myStories = postsArray;
      });
   }
   @action.bound
   fetchMyCelebrations() {
      const { uid } = firebaseInstance.auth.currentUser;

      const celebrationsCollection = collection(firestore, 'celebrations');
      const celebrationsQuery = query(celebrationsCollection, where('active', '==', true), where('uid', '==', uid));

      this.unSubMyStories = onSnapshot(celebrationsQuery, (snaps) => {
         let postsArray = [];
         if (!snaps.empty) {
            snaps.forEach((snap) => {
               const post = snap.data();
               postsArray.push(post);
            });
         }

         this.myCelebrations = postsArray;
      });
   }
   @action.bound
   showMyStories() {
      this.stories = this.myStories;
      this.storyIndex = 0;
      // this.currentStory = this.myStories[0];
   }

   @action.bound
   setCurrentStory(story) {
      this.stories = [story];
      this.storyIndex = 0;
   }

   @action.bound
   setCommentPost(post) {
      this.commentPost = post;
   }

   @action.bound
   setStoryIndex(index) {

      this.storyIndex = index;
   }



   @action.bound
   loadAndSetUserStories(uid, team, temporarySmashes, startWithThisPostId) {
      Vibrate();
      this.storyIndex = 0;


      if (temporarySmashes) {
         this.stories = temporarySmashes;
      }

   }

   doTimout(func, time) {
      if (this.timeout) {
         clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
         if (func) {
            func();
         }
      }, time);
   }
   setHypePost(post) {
      this.hypePost = this.hypePost ? { ...this.hypePost, ...post } : post;
   }

   @action.bound
   getLabelAndColor(obj) {
      let points = obj.activityValue;
      let level = obj.level;
      let label, color;

      if (!points && level) {
         switch (level) {
            case 1:
               label = "Quick";
               color = "#2FA2DE";
               break;
            case 2:
               label = "Easy";
               color = "#3366E6";
               break;
            case 3:
               label = "Medium";
               color = "#643895";
               break;
            case 4:
               label = "Hard";
               color = "#C90035";
               break;
            case 5:
               label = "Crazy";
               color = "#93063E";
               break;
            default:
               label = "Unknown";
               color = "#000000";
               break;
         }
      } else if (points) {
         if (points >= 1 && points <= 20) {
            label = "Quick";
            color = "#2FA2DE";
         } else if (points > 20 && points <= 150) {
            label = "Easy";
            color = "#3366E6";
         } else if (points > 150 && points <= 500) {
            label = "Medium";
            color = "#643895";
         } else if (points > 500 && points <= 2000) {
            label = "Hard";
            color = "#C90035";
         } else if (points > 2000) {
            label = "Crazy";
            color = "#93063E";
         }
      }

      return { label, color };
   }


   @action.bound
   setQuickViewTeam(team) {
      this.quickViewTeam = team;
   }

   @action.bound
   setMasterIdsToSmash(masterIds) {
      this.setActivtyWeAreSmashing(false);
      this.multiplier = 1;
      this.masterIdsToSmash = masterIds;
   }

   @action.bound
   setMasterIdsToSmashFromTeam(masterIds) {
      this.masterIdsToSmashFromTeam = masterIds;
   }

   @action.bound
   setCoolComment(text) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      this.coolComment = text;
   }

   async smash(
      comp,
      capturedPicture,
      remove,
      capturedVideo,
      weeklyActivityHash,
   ) {

      const goals = [];
      const { serverTimestamp } = this;

      console.log('smash check 1')
      const batch = writeBatch(firestore);
      let challenges = [];
      let challengeIds = [];
      let teams = [];
      let teamPlayersHashByTeamId = {};
      const bypassUpdateCommunityDocs = false;
      let pointsToAdd = parseInt(comp.value) * parseInt(comp.multiplier);
      let completion;
      let itemToRemove;
      let itemToAdd;
      let todayDateKey = moment().format('DDMMYYYY');
      const endWeekKey = moment().endOf('isoWeek').format('DDMMYYYY');

      const { uid } = firebaseInstance.auth.currentUser;


      console.log('debug smash 1');
      if (remove) {
         completion = {
            ...comp,
            active: false,
            multiplier: comp.multiplier - comp.multiplier * 2,
         };
         itemToRemove = {
            timestamp: comp.timestamp,
            multiplier: comp.multiplier,
            points: pointsToAdd,
            activityName: comp.activityName,
            uid: uid,
            level: comp.level,
            activityMasterId: comp.activityMasterId,
         };
         pointsToAdd = pointsToAdd - pointsToAdd * 2;
      } else {
         completion = {

            timeZone: moment.tz.guess(true),
            ...comp,
            uid,
            hasVideo: capturedVideo?.uri ? true : false,
            points: pointsToAdd,
            isPrivate: this?.currentUser?.isPrivate || false,
            followers: this?.currentUser?.followers
               ? [...this?.currentUser?.followers, this?.currentUser?.uid]
               : [this?.currentUser?.uid],
         };

         itemToAdd = {
            id: completion?.id || false,
            timestamp: completion.timestamp,
            multiplier: completion.multiplier,
            points: pointsToAdd,
            activityMasterId: completion.activityMasterId,
            activityName: completion.activityName,
            uid: uid,
            level: completion.level,
            activityMasterId: comp.activityMasterId,
         };
      }

      const activityMasterId = comp.activityMasterId || 'nope';
      const multiplier = completion.multiplier || 1;
      const postRef = doc(firestore, 'posts', completion.id);

      if (capturedPicture?.uri) {

         this.capturedMedia = {...capturedPicture};
         this.uploadProgress = 5;
         this.uploadImage(this.capturedMedia, completion.id).then((picture) => {
            const postRef = doc(firestore, 'posts', completion.id);
            setDoc(postRef, { picture }, { merge: true });
         });
      }

      if (capturedVideo?.uri) {

         this.capturedMedia = {...capturedVideo};
         this.uploadProgress = 5;
         this.uploadVideo(this.capturedMedia, completion.id, () => { }, true).then(
            (video) => {
               const postRef = doc(firestore, 'posts', completion.id);
               setDoc(postRef, { video }, { merge: true });
            },
         );
      }

      this.capturedPicture = null;
      this.capturedVideo = null;


      const dayRef = doc(collection(firestore, "dailyActivity"), `${uid}_${completion.dayKey}`);
      const daysRef = doc(collection(firestore, "users", uid, "days"), completion.dayKey);


      ///// start goals
      console.log('start goals', uid, activityMasterId)
      const playerGoalsQuery = query(
         collection(firestore, "playerGoals"),
         where("uid", "==", uid),
         where("active", "==", true),
         where("masterIds", "array-contains", activityMasterId)
      );

      const playerGoalsSnapshot = await getDocs(playerGoalsQuery);
      /// increment the goals doc with contributionScore and contributionQty. get goals doc from goals collection with 

      // Iterate through the playerGoals and add updates to the batch
      playerGoalsSnapshot.forEach(async (playerGoalDoc) => {
         const playerGoalData = playerGoalDoc.data();

         console.log("playerGoalData", playerGoalData);
         const playerGoalRef = playerGoalDoc.ref;
         const goalRef = doc(firestore, "goals", playerGoalData.goalId);

         goals.push(playerGoalData.goalId);
         // Convert the Firebase Timestamp to a Moment.js object
         const startDate = moment(playerGoalData.start.toDate());

         // Calculate the days since start
         const daysSinceStart = Math.max(moment().diff(startDate, "days"), 1);
         const todayDateKey = moment().tz((completion.timeZone || 'Australia/Sydney')).format("DDMMYYYY");

         if (playerGoalData?.joinType == 'contributor') {

            /// update goal doc with contributionScore and contributionQty if joinType is contributor

            batch.update(goalRef, {
               contributionScore: increment(pointsToAdd),
               contributionQty: increment(multiplier),
               updatedAt: parseInt(Date.now() / 1000),
               dailyAverage: increment(pointsToAdd / daysSinceStart),
               dailyAverageQty: increment(multiplier / daysSinceStart),
               activityQuantities: {
                  [activityMasterId]: increment(parseInt(multiplier)),
               },
               activityPoints: {
                  [activityMasterId]: increment(parseInt(pointsToAdd)),
               },
               playerScores: { [uid]: increment(pointsToAdd) },
               playerQtys: { [uid]: increment(multiplier) },
               daily: {
                  [todayDateKey]: {
                     score: increment(parseInt(pointsToAdd)),
                     qty: increment(parseInt(multiplier)),
                     activityQuantities: {
                        [activityMasterId]: increment(parseInt(multiplier)),
                     },
                     activityPoints: {
                        [activityMasterId]: increment(parseInt(pointsToAdd)),
                     },
                     playerScores: { [uid]: increment(pointsToAdd) },
                     playerQtys: { [uid]: increment(multiplier) },
                  },
               },
            });

         }


         //   Update the score, qty, dailyAverage, and dailyAverageQty
         batch.update(playerGoalRef, {
            score: increment(pointsToAdd),
            qty: increment(multiplier),
            updatedAt: parseInt(Date.now() / 1000),
            dailyAverage: increment(pointsToAdd / daysSinceStart),
            dailyAverageQty: increment(multiplier / daysSinceStart),
            activityQuantities: {
               [activityMasterId]: increment(parseInt(multiplier)),
            },
            activityPoints: {
               [activityMasterId]: increment(parseInt(pointsToAdd)),
            },
            daily: {
               [todayDateKey]: {
                  score: increment(parseInt(pointsToAdd)),
                  qty: increment(parseInt(multiplier)),
                  activityQuantities: {
                     [activityMasterId]: increment(parseInt(multiplier)),
                  },
                  activityPoints: {
                     [activityMasterId]: increment(parseInt(pointsToAdd)),
                  },
               },
            },
         });


         batch.set(
            daysRef,
            {
               dayKey: todayDateKey,

               goals: {
                  [playerGoalData?.goalId]: {
                     goalName: playerGoalData.goalName,
                     score: increment(parseInt(pointsToAdd)),
                     qty: increment(parseInt(multiplier)),
                     activityQuantities: {
                        [activityMasterId]: increment(parseInt(multiplier))
                     },
                     activityPoints: {
                        [activityMasterId]: increment(parseInt(completion.value))
                     },
                     smashes: remove ? arrayRemove(itemToRemove) : arrayUnion(itemToAdd),
                  },

               },
            },
            { merge: true }
         );


         batch.set(
            dayRef,
            {
               dayKey: todayDateKey,
               smashes: remove ? arrayRemove(itemToRemove) : arrayUnion(itemToAdd),
               goals: {
                  [playerGoalData?.goalId]: {
                     goalName: playerGoalData.goalName,
                     score: increment(parseInt(pointsToAdd)),
                     qty: increment(parseInt(multiplier)),
                     activityQuantities: {
                        [activityMasterId]: increment(parseInt(multiplier))
                     },
                     activityPoints: {
                        [activityMasterId]: increment(parseInt(completion.value))
                     },
                     smashes: remove ? arrayRemove(itemToRemove) : arrayUnion(itemToAdd),
                  },
               },
            },
            { merge: true }
         );






      });


      /// end goals


      console.log('smash check 2')
      if (!remove) {
         // this.setCompletion({ ...completion, pointsToAdd });
         // this.completion = {
         //    ...completion,
         //    pointsToAdd,
         //    picture: capturedPicture,
         // };
      }


      const playerTeamsRef = query(
         collection(firestore, "teams"),
         where("joined", "array-contains", uid),
         where("active", "==", true)
      );

      const playerChallengesRef = query(
         collection(firestore, "playerChallenges"),
         where("masterIds", "array-contains", completion.activityMasterId),
         where("uid", "==", uid),
         where("active", "==", true),
         where("dailyTargets", "!=", null)
      );

      console.log('smash check 3')

      console.log('smash check 3.2')
      const userRef = doc(collection(firestore, "users"), uid);
      const playerChallengesSnap = await getDocs(playerChallengesRef);
      const allChallengesForCelebrationScreen = [];
      const allTeamsForCelebrationScreen = [];
      // let playerTeamChallengesSnap = await playerTeamChallengesRef.get();
      console.log('smash check 3.3')
      playerChallengesSnap.forEach((playerChallengeSnap) => {
         let playerChallenge = playerChallengeSnap.data();

         const playerChallengeData = getPlayerChallengeData(playerChallenge);

         challengeNotificationOnSmashDailyTargetComplete(
            { ...playerChallenge, ...playerChallengeData },
            completion,
            pointsToAdd,
            this.currentUser?.followers || [],
         );
         allChallengesForCelebrationScreen.push(playerChallengeData);
         const { selectedTodayTarget = 77 } = playerChallengeData;

         challengeIds.push(playerChallenge?.challengeId);

         if (playerChallenge?.challengeType == 'team') {
            challenges.push(playerChallenge);
            challengeIds.push(playerChallenge?.challengeId);

            batch.set(
               playerChallengeSnap.ref,
               {
                  uid: uid,
                  timeZone: moment.tz.guess(true),
                  smashes: remove ? arrayRemove(itemToRemove) : arrayUnion(itemToAdd),
                  qty: increment(parseInt(multiplier)),
                  activityQuantities: {
                     [activityMasterId]: increment(parseInt(multiplier))
                  },
                  activityPoints: {
                     [activityMasterId]: increment(parseInt(completion.value))
                  },
                  score: increment(parseInt(pointsToAdd)),
                  updatedAt: completion.timestamp,
                  timestamp: completion.timestamp,
                  pointsUpdatedAt: completion.timestamp,
                  daily: {
                     [todayDateKey]: {
                        target: selectedTodayTarget || false,
                        score: increment(parseInt(pointsToAdd)),
                        qty: increment(parseInt(multiplier)),
                        activityQuantities: {
                           [activityMasterId]: increment(parseInt(multiplier))
                        },
                        activityPoints: {
                           [activityMasterId]: increment(parseInt(completion.value))
                        },
                     },
                  },
               },
               { merge: true }
            );

            batch.set(
               dayRef,
               {
                  dayKey: todayDateKey,
                  smashes: remove ? arrayRemove(itemToRemove) : arrayUnion(itemToAdd),
                  challenges: {
                     [playerChallenge?.challengeId]: {
                        challengeName: playerChallenge.challengeName,
                        score: increment(parseInt(pointsToAdd)),
                        qty: increment(parseInt(multiplier)),
                        activityQuantities: {
                           [activityMasterId]: increment(parseInt(multiplier))
                        },
                        activityPoints: {
                           [activityMasterId]: increment(parseInt(completion.value))
                        },
                     },
                  },
               },
               { merge: true }
            );
         } else {
            challenges.push(playerChallenge);
            batch.set(
               playerChallengeSnap.ref,
               {
                  uid: uid,
                  timeZone: moment.tz.guess(true),
                  smashes: remove ? arrayRemove(itemToRemove) : arrayUnion(itemToAdd),
                  qty: increment(parseInt(completion.multiplier)),
                  activityQuantities: {
                     [completion.activityMasterId]: increment(parseInt(completion.multiplier))
                  },
                  activityPoints: {
                     [completion.activityMasterId]: increment(parseInt(completion.value))
                  },
                  score: increment(parseInt(pointsToAdd)),
                  updatedAt: serverTimestamp,
                  timestamp: serverTimestamp,
                  pointsUpdatedAt: serverTimestamp,
                  daily: {
                     [todayDateKey]: {
                        target: selectedTodayTarget || false,
                        score: increment(parseInt(pointsToAdd)),
                        qty: increment(parseInt(completion.multiplier)),
                        activityQuantities: {
                           [completion.activityMasterId]: increment(parseInt(completion.multiplier))
                        },
                        activityPoints: {
                           [completion.activityMasterId]: increment(parseInt(completion.value))
                        },
                     },
                  },
               },
               { merge: true }
            );

            batch.set(
               dayRef,
               {
                  dayKey: todayDateKey,
                  smashes: remove ? arrayRemove(itemToRemove) : arrayUnion(itemToAdd),
                  challenges: {
                     [playerChallenge?.challengeId]: {
                        challengeName: playerChallenge.challengeName,
                        score: increment(parseInt(pointsToAdd)),
                        qty: increment(parseInt(completion.multiplier)),
                        activityQuantities: {
                           [completion.activityMasterId]: increment(parseInt(completion.multiplier))
                        },
                        activityPoints: {
                           [completion.activityMasterId]: increment(parseInt(completion.value))
                        },
                     },
                  },

               },
               { merge: true }
            );

         }
      });


      console.log('smash check 3.2')


      if (!bypassUpdateCommunityDocs) {



         try {
            console.log('smash check 3.22')
            const playerTeamsSnap = await getDocs(playerTeamsRef);
            console.log('smash check 3.3')
            playerTeamsSnap.forEach(async (playerTeamSnap) => {
               console.log('smash check 3.4')




               let playerTeam = playerTeamSnap.data();

               const existsInHideMasterIds = playerTeam?.hideMasterIds?.includes(completion.activityMasterId);


               if ((playerTeam?.masterIds?.includes(completion.activityMasterId || playerTeam?.singleMasterIds?.includes(completion.activityMasterId)) && !existsInHideMasterIds) || (playerTeam?.singleMasterIds?.includes(completion.activityMasterId) && !existsInHideMasterIds)) {

                  batch.set(playerTeamSnap.ref, {
                     scores: {
                        [endWeekKey]: increment(pointsToAdd),
                     },
                     lastUpdated: { [uid]: completion.timestamp },
                  }, { merge: true });

                  allTeamsForCelebrationScreen.push(playerTeam);
                  const weeklyActivityId = `${playerTeam.id}_${endWeekKey}`;

                  const weeklyActivity =
                     weeklyActivityHash?.[weeklyActivityId] || false;

                  const weeklyActivityData = weeklyActivity;
                  const {
                     myTargetToday = 0,
                     teamTargetToday = 0,
                     myScoreToday = 0,
                  } = weeklyActivityData;

                  batch.set(
                     userRef,
                     {
                        teamScores: {
                           [playerTeam.id]: increment(pointsToAdd)
                        }
                     },
                     { merge: true }
                  );


                  combinedTeamNotification(
                     playerTeam,
                     completion,
                     weeklyActivityData,
                     pointsToAdd,
                     this.currentUser
                  );



                  /// If this smash means I won my team target for the day
                  // teamNotificationOnSmashDailyTargetComplete(
                  //    playerTeam,
                  //    completion,
                  //    weeklyActivityData,
                  //    pointsToAdd,
                  // );

                  /// Notify Team if Winning Shot for the day
                  // teamNotificationOnSmashDailyTeamTargetComplete(
                  //    playerTeam,
                  //    completion,
                  //    weeklyActivityData,
                  //    pointsToAdd,
                  // );

                  /// Notify Team if Winning Shot for the week
                  // teamNotificationOnSmashWeeklyTeamTargetComplete(
                  //    playerTeam,
                  //    completion,
                  //    weeklyActivityData,
                  //    pointsToAdd,
                  // );

                  // notifyTeamMemberIfOvertaken(
                  //    playerTeam,
                  //    completion,
                  //    weeklyActivityData,
                  //    pointsToAdd,
                  //    this.currentUser
                  // );

                  if (playerTeam?.masterIds?.includes(completion.activityMasterId) || true) {
                     console.log('found playerTeamsX again');
                     const teamId = playerTeam?.id;
                     const endOfCurrentWeekKey = moment()
                        .endOf('isoWeek')
                        .format('DDMMYYYY');
                     const teamWeeklyActivityRef = doc(
                        firestore,
                        "weeklyActivity",
                        `${teamId}_${endOfCurrentWeekKey}`
                     );
                     const teamDayRef = doc(firestore, "dailyActivity", `${teamId}_${completion.dayKey}`);

                     teamPlayersHashByTeamId[playerTeam.id] = playerTeam.joined;

                     batch.set(
                        teamWeeklyActivityRef,
                        {
                           lastSmashedBy: { name: this.currentUser.name, uid: this.currentUser.uid },
                           lastSmashedInTeamByUser: { [uid]: completion.timestamp },
                           endWeekKey: endOfCurrentWeekKey,
                           teamName: playerTeam?.name,
                           teamId: playerTeam.id,
                           target: playerTeam?.mostRecentTarget || 0,
                           lastUpdated: { [uid]: completion.timestamp },
                           userWeekScores: {
                              [uid]: increment(parseInt(pointsToAdd)),
                           },
                           allPlayers: {
                              [uid]: {
                                 name: this.currentUser?.name || "notsure",
                                 picture: this.currentUser?.picture || false,
                              },
                           },
                           playerIds: arrayUnion(uid),
                           players: {
                              [uid]: {
                                 smashes: remove ? arrayRemove(itemToRemove) : arrayUnion(itemToAdd),
                                 score: increment(parseInt(pointsToAdd)),
                                 qty: increment(parseInt(completion.multiplier)),
                                 activityQuantities: {
                                    [completion.activityMasterId]: increment(
                                       parseInt(completion.multiplier)
                                    ),
                                 },
                                 activityPoints: {
                                    [completion.activityMasterId]: increment(parseInt(completion.value)),
                                 },
                                 daily: {
                                    [todayDateKey]: {
                                       target: myTargetToday,
                                       score: increment(parseInt(pointsToAdd)),
                                       qty: increment(parseInt(completion.multiplier)),
                                       activityQuantities: {
                                          [completion.activityMasterId]: increment(
                                             parseInt(completion.multiplier)
                                          ),
                                       },
                                       activityPoints: {
                                          [completion.activityMasterId]: increment(parseInt(completion.value)),
                                       },
                                    },
                                 },
                                 updatedAt: completion.timestamp,
                                 picture: this?.currentUser?.picture || {},
                                 name: this.currentUser?.name || "notsure",
                              },
                           },
                           qty: increment(parseInt(completion.multiplier)),
                           activityQuantities: {
                              [completion.activityMasterId]: increment(parseInt(completion.multiplier)),
                           },
                           activityPoints: {
                              [completion.activityMasterId]: increment(parseInt(completion.value)),
                           },
                           score: increment(parseInt(pointsToAdd)),
                           updatedAt: completion.timestamp,
                           timestamp: completion.timestamp,
                           pointsUpdatedAt: completion.timestamp,
                           daily: {
                              [todayDateKey]: {
                                 players: {
                                    [uid]: {
                                       target: myTargetToday,
                                       smashes: remove ? arrayRemove(itemToRemove) : arrayUnion(itemToAdd),
                                       score: increment(parseInt(pointsToAdd)),
                                       qty: increment(parseInt(completion.multiplier)),
                                       activityQuantities: {
                                          [completion.activityMasterId]: increment(
                                             parseInt(completion.multiplier)
                                          ),
                                       },
                                       activityPoints: {
                                          [completion.activityMasterId]: increment(parseInt(completion.value)),
                                       },
                                    },
                                 },
                                 teamTarget: teamTargetToday,
                                 score: increment(parseInt(pointsToAdd)),
                                 qty: increment(parseInt(completion.multiplier)),
                                 activityQuantities: {
                                    [completion.activityMasterId]: increment(parseInt(completion.multiplier)),
                                 },
                                 activityPoints: {
                                    [completion.activityMasterId]: increment(parseInt(completion.value)),
                                 },
                              },
                           },
                        },
                        { merge: true }
                     );

                     batch.set(
                        teamDayRef,
                        {
                           dayKey: todayDateKey,
                           teamName: playerTeam.name,
                           teamId: playerTeam.id,
                           type: 'Team',
                           updatedAt: serverTimestamp,
                           timestamp: serverTimestamp,
                           score: increment(parseInt(pointsToAdd)),
                           qty: increment(parseInt(completion.multiplier)),
                           activityQuantities: {
                              [completion.activityMasterId]: increment(
                                 parseInt(completion.multiplier)
                              ),
                           },
                           activityPoints: {
                              [completion.activityMasterId]: increment(parseInt(completion.value)),
                           },
                           players: {
                              [uid]: {
                                 smashes: remove ? arrayRemove(itemToRemove) : arrayUnion(itemToAdd),
                                 score: increment(parseInt(pointsToAdd)),
                                 qty: increment(parseInt(completion.multiplier)),
                                 activityQuantities: {
                                    [completion.activityMasterId]: increment(
                                       parseInt(completion.multiplier)
                                    ),
                                 },
                                 activityPoints: {
                                    [completion.activityMasterId]: increment(
                                       parseInt(completion.value)
                                    ),
                                 },
                                 updatedAt: serverTimestamp,
                                 picture: this?.currentUser?.picture || {},
                                 name: this.currentUser?.name || 'notsure',
                              },
                           },
                        },
                        { merge: true }
                     );
                  }
               }
            });
         } catch (e) {
            console.warn('error', e);
         }
         ///// End Teams

      }
      console.log('smash check 4')
      batch.set(
         dayRef,
         {
            score: increment(parseInt(pointsToAdd)),
            qty: increment(parseInt(completion.multiplier)),
            activityQuantities: {
               [completion.activityMasterId]: increment(
                  parseInt(completion.multiplier)
               ),
            },
            activityPoints: {
               [completion.activityMasterId]: increment(parseInt(completion.value)),
            },
            updatedAt: serverTimestamp,
            timestamp: serverTimestamp,
            startDay: completion.dayKey,
            type: "User",
            uid: uid,
         },
         { merge: true }
      );

      batch.set(
         daysRef,
         {
            dayKey: this.todayDateKey,
            following: this?.currentUser?.following || [],
            followers: this?.currentUser?.followers || [],
            smashes: remove ? arrayRemove(itemToRemove) : arrayUnion(itemToAdd),
            timestamp: parseInt(Date.now() / 1000),
            updatedAt: parseInt(Date.now() / 1000),
            score: increment(parseInt(pointsToAdd)),
            activityQuantities: {
               [completion.activityMasterId]: increment(
                  parseInt(completion.multiplier)
               ),
            },
            activityPoints: {
               [completion.activityMasterId]: increment(parseInt(completion.value)),
            },
         },
         { merge: true }
      );

      console.log('smash check 5')
      batch.set(
         userRef,
         {
            activityQuantities: {
               [completion.activityMasterId]:
                  increment(parseInt(completion.multiplier))
            },
            timestamp: serverTimestamp,
            updatedAt: serverTimestamp,
            allPointsEver: increment(parseInt(pointsToAdd)),
            dailyScores: {
               [completion.dayKey]: increment(parseInt(pointsToAdd))
            },
            daily: {
               [completion.dayKey]: {
                  activityQuantities: {
                     [completion.activityMasterId]:
                        increment(parseInt(completion.multiplier))
                  },
                  activityScores: {
                     [completion.activityMasterId]:
                        increment(parseInt(pointsToAdd))
                  }
               }
            },
            weeklyScores: {
               [endWeekKey]: increment(parseInt(pointsToAdd))
            },
            monthlyScores: {
               [moment().endOf('month').format('DDMMYYYY')]:
                  increment(parseInt(pointsToAdd))
            }
         },
         { merge: true }
      );

      console.log('smash check 6', completion)

      console.log('smash check 7')
      if (!remove) {
         // this.setCompletionChallenges(challenges);
         // this.setCompletionTeamAndChallenges(challenges, allTeamsForCelebrationScreen);
         // this.completionTeams = allTeamsForCelebrationScreen;
         // setTimeout(() => {
         //    this.smashing = false;
         // }, 4000);
      }

      this.setCameraType(CameraType.back)
      this.setManuallySkipped(false);
      await batch.commit();



      await setDoc(postRef, { ...completion, challenges, challengeIds, goals }, { merge: true });
      // setTimeout(() => {
      //    this.showRocket = false;
      // }, 500);


      // this.sendNoficationToPersonIOvertook(challenges, pointsToAdd);
      // this.sendNotificationToAllPeopleFollowingMe(completion, pointsToAdd);

      // this.refreshHomeActivity()
   }

   @action.bound
   setHomeTabsIndex(index) {
      // this.homeTabsIndex = index;

      this.homeScreenTab.current?.setTab(index);
   }

   notifyTeamISmashedMyTeamTarget = async (team, completion) => {
      const smasherUserId = completion?.uid;
      team.joined.forEach(async (uid) => {
         const userDocRef = doc(firestore, "users", uid);
         const userSnap = await getDoc(userDocRef);
         const userData = userSnap.data();

         if (userData.expoPushToken) {
            let messageTitle = `${completion?.user?.name || 'noname'
               } smashed their Daily Target!`;

            if (uid == smasherUserId) {
               messageTitle = `${'Nice! You'} smashed your Daily Target!`;
            }
            const body = {
               to: userData.expoPushToken,
               sound: 'default',
               title: messageTitle,
               subtitle: `Completely... to pieces!! - ${team.name || 'no team name'
                  }`,
            };

            // !userData.followingNotificationsDisabled &&
            sendNotification(body);
         }
      });
   };
   sendNoficationToPersonIOvertook = async (
      challenges: any[],
      pointsToAdd: number,
   ) => {
      const userName = this.currentUser.name;
      /// 1. get person who is above in index,
      /// 2. check their doc to see what their score is.
      /// 3. if my score + new pointsEarned > their points. Send notification.
      console.log('sendNoficationToPersonIOvertook1');
      // For each playerchallenge of current user.
      challenges.forEach(async (challenge) => {
         console.log(
            'sendNoficationToPersonIOvertook2',
            challenge.challengeName,
         );
         const { challengeId, endDateKey } = challenge;
         const prevScore =
            challenge.targetType == 'qty'
               ? challenge?.dailyAverageQty || 0
               : challenge.dailyAverage || 0;

         const newDailyAverage =
            (challenge?.score + pointsToAdd) / dayNumberOfChallenge(challenge);
         const dAverage = Math.ceil(newDailyAverage || 0);

         const newDailyAverageQty =
            (challenge?.qty + pointsToAdd) / dayNumberOfChallenge(challenge);
         const dAverageQty = Math.ceil(newDailyAverageQty || 0);

         const currScore =
            challenge.targetType == 'qty'
               ? newDailyAverageQty
               : newDailyAverage;

         let theQuery = query(
            collection(firestore, 'playerChallenges'),
            where('following', 'array-contains', this.currentUser.uid),
            where('active', '==', true),
            where('dailyAverage', '>', prevScore),
            where('dailyAverage', '<', currScore),
            where('challengeId', '==', challengeId)
         );

         if (challenge.targetType == 'qty') {
            theQuery = query(
               collection(firestore, 'playerChallenges'),
               where('following', 'array-contains', this.currentUser.uid),
               where('active', '==', true),
               where('dailyAverageQty', '>', prevScore),
               where('dailyAverageQty', '<', currScore),
               where('challengeId', '==', challengeId)
            );
         }

         //get the player challenges of the followers whom current user has overtaken
         const playerChallengesRef = collection(firestore, 'playerChallenges');
         const followers = await getDocs(query(playerChallengesRef, where('following', 'array-contains', this.currentUser.uid), where('active', '==', true), where(challenge.targetType == 'qty' ? 'dailyAverageQty' : 'dailyAverage', '>', prevScore), where(challenge.targetType == 'qty' ? 'dailyAverageQty' : 'dailyAverage', '<', currScore), where('challengeId', '==', challengeId)));

         followers.forEach(async (playerChallengeDoc) => {
            //for every playerChallenge doc of follower
            if (!playerChallengeDoc.exists()) return;

            //get follower score
            const playerChallenge = playerChallengeDoc.data();
            const {
               dailyAverage = 0,
               dailyAverageQty = 0,
               uid,
            } = playerChallenge;

            const followerScore =
               challenge.targetType == 'qty' ? dailyAverageQty : dailyAverage;

            console.log(
               'sendNoficationToPersonIOvertook4',
               playerChallenge.uid,
               followerScore,
               prevScore,
               currScore,
            );
            //if prevScore of user is less than score of follower and
            //if currScore of user is greater than score of follower then
            //user has overtaken the follower
            //Follower will receive notification for the same
            if (prevScore <= followerScore && currScore > followerScore) {
               const pointsToLead = currScore - followerScore;
               const userSnap = await getDoc(doc(firestore, 'users', uid));
               const userData = userSnap.data();
               if (userData.expoPushToken) {
                  const body = {
                     to: userData.expoPushToken,
                     sound: 'default',
                     title: `${userName} has overtaken you! `,
                     subtitle: `${playerChallenge.challengeName || ''}`,
                     body: `You need ${pointsToLead} more ${playerChallenge.unit || 'pts'
                        } to take the lead for daily average.`,
                  };

                  let notice = {
                     text: `${userName} overtook you!`,
                     challengeName: playerChallenge.challengeName || '',
                     uid,
                     timestamp: Date.now(),
                     active: true,
                     user: {
                        name: this.currentUser.name,
                        picture: this.currentUser.picture || {},
                     },
                  };
                  const noticeRef = doc(collection(firestore, 'notices'));

                  notice.id = noticeRef.id;
                  setDoc(noticeRef, notice);
                  // !userData.followingNotificationsDisabled &&
                  sendNotification(body);
               }
            }
         });
      });
   };

   sendNotificationToAllPeopleFollowingMe = async (completion, pointsToAdd) => {
      const userName = this.currentUser.name;
      const pointsEarned = pointsToAdd;
      const activityName = completion.activityName;
      const multiplier = completion.multiplier;
      let hypeMessage = "Let's go team!";

      /// get all uids of users who are following me.  this.currentUser.followers
      const followers = this.currentUser?.followers || [];
      const { uid } = this.currentUser;

      //// send notification to all of them.
      let notificationBodies = [];

      for (_uid of followers) {
         if (_uid != uid) {
            console.log('blah', _uid);

            const userDocRef = doc(collection(firestore, 'users'), _uid);
            const userDocSnap = await getDoc(userDocRef);
            const userData = userDocSnap.data();

            // console.log('userData', userData);
            let userScore = 0;

            if (userData.expoPushToken) {
               const body = {
                  to: userData.expoPushToken,
                  sound: 'default',
                  title: `${userName} smashed ${multiplier} x ${activityName}`,
                  // subtitle: `You need another 'blah blah' to rank #1! `,
               };
               notificationBodies.push(body);
            }
         }
      }

      // notificationBodies.forEach(_body => {
      //     sendNotification(_body)
      // })
   };
   @action.bound
   setChangeMood(bool) {
      this.changeMood = bool;
   }

   // @action.bound
   // async postHypeMessage(challengeId){
   //    if (this.hypePost.text) {
   //      const id = ImageUpload.uid();
   //      const uid = this.currentUser?.uid;

   //      const post = {
   //        id,
   //        uid,
   //        active: true,
   //        showInFeed: true,
   //        showPicture: true,
   //        challengeId: challengeId || false,
   //        type: 'post',
   //        dayKey: this.todayDateKey,
   //        ...this.hypePost,
   //        updatedAt: parseInt(Date.now() / 1000),
   //        timestamp: parseInt(Date.now() / 1000),
   //        user: {
   //          picture: this.currentUser?.picture || {},
   //          name: this.currentUser?.name,
   //        },
   //      };

   //      console.log('postpost', post);
   //      this.hypePost = { text: '' };

   //      const postRef = doc(collection(firestore, 'posts'), post.id);
   //      await setDoc(postRef, post, { merge: true });

   //      const result = capturedPicture;
   //      const picture = await uploadImage(result);

   //      await setDoc(postRef, { picture }, { merge: true });

   //      this.capturedPicture = false;
   //    } else {
   //      alert('Ooops! No Post!');
   //    }
   //  }


   @action.bound
   removeHabitStackFromStoreHash(id) {
      // this.habitStacksList = this.habitStacksList.filter(
      //    (stack) => stack.id != id,
      // );
   }

   @action.bound
   setHypePostPicture(post) {
      this.hypePost = this.hypePost ? { ...this.hypePost, ...post } : post;
   }
   @computed get libraryActionsList() {
      return this._libraryActionsList;
   }

   @computed get habitStacksList() {
      return this._habitStacksList;
   }

   @computed get habitStacksHash() {
      let hash = {};

      this.habitStacksList.forEach((stack) => {
         // if (!stack.id) {
         //    return;
         // }
         hash[stack.id] = stack;
      });
      return hash;
   }
   // @action.bound
   // addLegacyActionsToActivityLibraryHash(allActivities) {
   //    this.libraryActionsList = [...this.libraryActionsList, ...allActivities];
   // }

   @computed get libraryActivitiesHash() {
      let hash = {};

      this._libraryActionsList.forEach((a) =>
         a?.id != undefined ? (hash[a.id] = a) : null,
      );

      return hash;
   }

   set libraryActionsList(libraryActionsList) {
      this._libraryActionsList = libraryActionsList;
      //  AsyncStorage.setItem('libraryActionsList', JSON.stringify(libraryActionsList));
   }

   set habitStacksList(habitStacksList) {
      this._habitStacksList = habitStacksList;
   }

   @computed get selectedActions() {
      return this._selectedActions;
   }
   set selectedActions(selectedActions) {
      this._selectedActions = selectedActions;
   }

   @computed get activtyWeAreSmashing() {
      return this._activtyWeAreSmashing;
   }
   set activtyWeAreSmashing(activtyWeAreSmashing) {
      this._activtyWeAreSmashing = activtyWeAreSmashing;
   }

   @computed get capturedPicture() {
      return this._capturedPicture;
   }
   set capturedPicture(capturedPicture) {
      this._capturedPicture = capturedPicture;
   }

   @computed get capturedVideo() {
      return this._capturedVideo;
   }
   set capturedVideo(capturedVideo) {
      this._capturedVideo = capturedVideo;
   }

   @computed get completion() {
      return this._completion;
   }
   set completion(completion) {
      this._completion = completion;
   }

   @computed get completionChallenges() {
      return this._completionChallenges;
   }
   set completionChallenges(completionChallenges) {
      this._completionChallenges = completionChallenges;
   }

   @computed get todayActivity() {
      return this._todayActivity;
   }
   set todayActivity(todayActivity) {

      this._todayActivity = todayActivity;
      // AsyncStorage.setItem('todayActivity', JSON.stringify(todayActivity));
   }

   @computed get todayActivityUserTodayScores() {

      return this.todayActivity?.userTodayScores || {}
   }

   @computed get todayActivityActivityPoints() {

      return this.todayActivity?.activityPoints || {}
   }


   @computed get todayActivityActivityQuantities() {

      return this.todayActivity?.activityQuantities || {}
   }


   @computed get last7Keys() {
      const startOfDays = [];

      let count = 7;

      let i = count;
      while (i--) {
         startOfDays.push(
            moment().subtract(i, 'days').startOf('day').format('DDMMYYYY'),
         );
      }

      return startOfDays;
   }

   @computed get last14Keys() {
      const startOfDays = [];

      let count = 14;

      let i = count;
      while (i--) {
         startOfDays.push(
            moment().subtract(i, 'days').startOf('day').format('DDMMYYYY'),
         );
      }

      return startOfDays;
   }



   @computed get last14Days() {
      const { activity } = this;

      return (
         this.last14Keys.map((date) => {
            return activity?.[date] || false;
         }) || []
      );
   }

   @computed get last14DaysShort() {
      return (
         this.last14Keys.map((date) => {
            return moment(date, 'DDMMYYYY').format('dd');
         }) || []
      );
   }

   @computed get last14DaysShortWithNumber() {
      return (
         this.last14Keys.map((date) => {
            return moment(date, 'DDMMYYYY').format('Do');
         }) || []
      );
   }
   @computed get last30Keys() {
      const startOfDays = [];

      let count = 30;

      let i = count;
      while (i--) {
         startOfDays.push(
            moment().subtract(i, 'days').startOf('day').format('DDMMYYYY'),
         );
      }

      return startOfDays;
   }

   @computed get thisMonthKeys() {
      const startOfDays = [];

      let count = moment().daysInMonth();

      let i = count;
      while (i--) {
         startOfDays.push(
            moment()
               .endOf('month')
               .subtract(i, 'days')
               .startOf('day')
               .format('DDMMYYYY'),
         );
      }

      return startOfDays;
   }

   @computed get thisMonthSoFarKeys() {
      const startOfDays = [];

      let count = moment().daysInMonth();
      const dayOfTheMonth = moment().format('D');

      let i = parseInt(dayOfTheMonth);
      while (i--) {
         startOfDays.push(
            moment()
               // .endOf('month')
               .subtract(i, 'days')
               .startOf('day')
               .format('DDMMYYYY'),
         );
      }

      return startOfDays;
   }

   @computed get last7DaysShort() {
      return (
         this.last7Keys.map((date) => {
            return moment(date, 'DDMMYYYY').format('dd');
         }) || []
      );
   }

   @computed get last7Days() {
      const { activity } = this;
      // console.log('activityactivity',activity)
      return this.last7Keys.map((date) => {
         return activity?.[date] || false;
      }) || []

   }

   @computed get hasActivity() {

      // true if any of the items in last4Days has an object in the array

      let bool = false;
      this.last7Days.forEach((item) => {
         if (item.dayKey) {
            bool = true;
         }
      }
      )
      return bool;

   }

   @computed get thisMonthDays() {
      const { activity } = this;

      return (
         this.thisMonthKeys.map((date) => {
            return activity?.[date] || false;
         }) || []
      );
   }

   @computed get thisMonthDaysShort() {
      return (
         this.thisMonthKeys.map((date) => {
            return moment(date, 'DDMMYYYY').format('dd');
         }) || []
      );
   }

   @action.bound
   goBackDays() {
      let i = 1;

      const newDayKey = moment(this.selectedDayKey, 'DDMMYYYY')
         .subtract(1, 'days')
         .format('DDMMYYYY');
      this.setSelectedDayKey(newDayKey);
   }

   dayKeyToHuman(dayKey) {
      return moment(dayKey, 'DDMMYYYY').format('ddd Do MMM YYYY');
   }

   @action.bound
   goForwardDays() {
      if (this.isToday) {
         return;
      }
      let i = 1;

      const newDayKey = moment(this.selectedDayKey, 'DDMMYYYY')
         .add(i, 'days')
         .format('DDMMYYYY');
      this.setSelectedDayKey(newDayKey);
   }

   @computed get todayDateKey() {

      // return date in format DDMMYYYY without using moment

      return todayDateKey();
      const debug = false;
      const debugDateKey = '12072022';
      return debug
         ? debugDateKey
         : moment()
            // .subtract(1, 'days')
            .format('DDMMYYYY');

      // subtract(1, 'days').
   }

   @computed get todayName() {
      return moment().format('dddd');
   }

   @action
   setCompletion(completion) {
      this.completion = completion;
   }

   @action
   setSmashing(bool) {
      this.smashing = bool;
   }

   @action.bound
   setCompletionsTeamsAndChallenges(allFormatted) {
      // console.warn('allFormatted', allFormatted);
      // alert(JSON.stringify(allFormatted))
      this.completionsTeamsAndChallenges = allFormatted;
      // this.showRocket = false;
   }

   @action
   setSelectedDayKey(newDayKey) {
      this.selectedDayKey = newDayKey;
   }

   @action
   setFindChallenge(bool) {
      this.smashEffects();
      if (bool == false) {
         this.headerGradient = ['#FF5E3A', '#FF2A68'];
      }
      this.findChallenge = bool;
   }

   @action
   setActivtyWeAreSmashing(activity) {
      this.activtyWeAreSmashing = activity;
   }

   @action
   setCapturedPicture(pic) {
      this.capturedPicture = pic;
   }

   @action
   setCapturedVideo(video) {
      this.capturedVideo = video;
   }

   @action
   setSelectedActions(actions) {
      this.selectedActions = actions;
   }

   @action
   pushAction(action) {
      const actions = [...this._selectedActions, action];
      this.selectedActions = actions;
   }

   @action.bound
   removeAction(index) {
      this.selectedActions.splice(index, 1);
   }



   @action.bound
   setFirstTime(bool) {
      this.firstTime = bool;
   }
   @action.bound
   async setActiveChallenge(id) {
      /// Subscribe to challenge docs
      this.setActiveChallengeDoc(id);

      /// Subscribe to all Players that are in that challenge.
      this.setPlayersInChallenge(id);

      return this.clearStore;
   }

   @action.bound
   async setActiveChallengeDoc(id) {
      try {
         this.subscribeToActiveChallengeDoc = onSnapshot(doc(firestore, 'challenges', id), (snap) => {
            if (snap.exists()) {
               const challengeDoc = snap.data();
               this.activeChallengeDoc = challengeDoc;
            } else {
            }
         });
      } catch (e) {
         console.log('setActiveChallengeDoc', e);
      }
   }

   @action.bound
   async fetchTodayActivity() {

      let unsub = [];
      const uid = firebaseInstance.auth.currentUser.uid;
      try {
         unsub = onSnapshot(
            doc(collection(firestore, "users"), uid, "days", this.todayDateKey),
            (snap) => {
               if (snap.exists()) {
                  const dailyActivityDoc = snap.data();
                  this.todayActivity = dailyActivityDoc;

                  // save it in AsyncStorage
               } else {
                  this.todayActivity = {};
               }
            }
         );

         this.unSub.push(unsub);
      } catch (e) {
         console.log("fetchTodayActivity", e);
      }


   }

   sendNotifications = async (uid, title, body, badgeData, extraData) => {
      // const user = this.users[uid];

      // get userDoc using uid from firestore
      const userDoc = doc(collection(firestore, "users"), uid);
      // getDoc


      // store user doc in user const 
      const user = await getDoc(userDoc);


      const notification = {
         to: user.expoPushToken,
         token: {
            value: user.expoPushToken,
         },
         title: (title && title) || '',
         body,
         ios: { _displayInForeground: true },
         badge: badgeData,
         sound: 'default',
         vibrate: true,
         data: { reciveUserId: uid, notify: body, extraData },
         // body,
      };

      fetch('https://exp.host/--/api/v2/push/send', {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(notification),
      });
   };

   whatLevelDidUserWin(challenge) {
      let level = 0;

      if (parseInt(challenge.score) > parseInt(challenge.target)) {
         level = 1;
      }
      if (parseInt(challenge.score) > parseInt(challenge.targetTwo)) {
         level = 2;
      }
      if (parseInt(challenge.score) > parseInt(challenge.targetThree)) {
         level = 3;
      }

      return level;
   }

   @action
   async setPlayersInChallenge(id) {
      try {
         const q = query(collection(firestore, "playerChallenges"), where("challengeId", "==", id), orderBy("qty", "desc"));
         this.subscribeToPlayersInChallenge = onSnapshot(q, (snaps) => {
            let playersArray = [];
            if (!snaps.empty) {
               snaps.forEach((snap) => {
                  const player = snap.data();

                  if (player.challengeId) {
                     playersArray.push(player);
                  }
               });

               this.playersInActiveChallenge = playersArray;
            } else {
            }
         });
      } catch (e) {
         console.log("setPlayersInChallenge", e);
      }
   }

   @action.bound
   async subscribeToCurrentUser(userDoc) {
      const { uid } = userDoc;
      this.currentUser = userDoc;


      const unsub = onSnapshot(
         doc(firestore, "users", uid),
         async (snap) => {
            if (snap.exists()) {

               let userDoc = snap.data();

               if (this.currentUser.updatedAt != userDoc.updatedAt) {
                  console.log('update')
                  this.currentUser = userDoc;

               }


            } else {
            }
         }
      );

      this.unSub.push(unsub);
   }

   @action.bound
   hideFocusUser() {
      this.focusUser = false;
   }

   @action.bound
   setFocusUser(user) {
      this.smashEffects();
      this.focusUser = user;
   }

   @action.bound
   setSelectedHour(hour) {

      this.selectedHour = hour;

   }


   @action.bound
   setLoadingFeed(bool) {

      this.loadingFeed = bool;


   }
   @action.bound
   shortUniversalLoading(seconds = 100, afterCallFunc = () => null) {
      this.universalLoading = true;

      setTimeout(() => {
         this.universalLoading = false;
         afterCallFunc();
      }, seconds);

      clearTimeout(this.clearTimer);
   }
   async uploadImageFromLibrary(
      setLoadingToTrue,
      size = 'full',
      allowsEditing = false
   ): Promise<void> {

      if (setLoadingToTrue) {
         setLoadingToTrue('getting');
      }

      return new Promise(async (res, rej) => {
         const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
         const { uid } = firebaseInstance.auth.currentUser;

         setLoadingToTrue('uploading');
         let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: allowsEditing,
            aspect: [4, 3],
            quality: 1,
         });

         if (result.canceled) {

            if (setLoadingToTrue) {
               setLoadingToTrue(false);
            }
         }


         if (!result.canceled) {
            // if (setLoadingToTrue) {
            //    setLoadingToTrue('uploading');
            // }

            const theResult = result.assets[0] || {};
            const { uri, width, height } = theResult;

            const picture: Picture = {
               uri,
               width,
               height,
               local: true,
            };
            this.setCapturedPicture(picture);
            const uploadedPreview = await ImageUpload.preview(picture);
            const uploadedUri = await ImageUpload.upload(
               picture,
               false,
               false,
               false,
               size,
            );
            const userPicture = { preview: uploadedPreview, uri: uploadedUri };

            setTimeout(() => {
               this.setCapturedPicture(false);
            }, 1000);
            setLoadingToTrue(false);
            res(userPicture);
         } else {
            setLoadingToTrue(false);
         }
      });
   }

   @action.bound
   checkCameraPermissions(bool) {
      this.yesCheckCamPermissions = bool;
   }

   @action.bound
   toggleInviteUser(user, challengeData) {
      const { currentUser } = this;

      const title = `${currentUser.name} invited you to a Challenge!`;

      const notiDoc = {
         causeUser: firebaseInstance.auth.currentUser.uid,
         causeUserPicture: currentUser?.picture || {},
         receiverUser: user.uid,
         timestamp: Date.now(),
         type: 'invite',
         title,
         subtitle: '',
         itemId: challengeData.id,
         challenge: challengeData,
      };
      this.notificatonStore.addNewNotificationDoc(notiDoc);
      this.notificatonStore.incrementNotificationCounter(
         NotificationType.Invite,
         user.uid,
      );
   }

   smashEffects(buzz, sound) {
      if (buzz == 'Medium') {
         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (buzz == 'Heavy') {
         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
   }
   // createCohersionNotice(text, uid, subtitle) {
   //    let notice = {
   //       text,
   //       challengeName: 'SmashApp',
   //       uid: uid,
   //       timestamp: Date.now(),
   //       subtitle: subtitle || false,
   //       active: true,

   //    };
   //    const noticeRef = firestore.collection('notices').doc();

   //    notice.id = noticeRef.id;
   //    noticeRef.set(notice);
   // }

   @action.bound
   async postLike(post) {
      const { uid } = firebaseInstance.auth.currentUser;
      // this.smashEffects();

      if (post.likes?.includes(uid)) {
         await updateDoc(doc(collection(firestore, 'posts'), post.id), {
            like: increment(-1),
            likes: arrayRemove(uid),
         });
      } else {
         await updateDoc(doc(collection(firestore, 'posts'), post.id), {
            like: increment(1),
            likes: arrayUnion(uid),
         });

         const userSnap = await getDoc(collection(firestore, 'users'), post.uid);
         if (post.uid == this.currentUser?.uid) {
            return;
         }
         const userData = userSnap.data();
         const { currentUser } = this;
         const title = `${currentUser.name} sent rockets!`;

         // PushNotification
         if (userData.expoPushToken) {
            const body = {
               to: userData.expoPushToken,
               sound: 'default',
               title: title,
               body: post?.type == 'challengeStreak' ? `Your ${post.name} ${post.streak} day streak!` : post.activityName || 'xx',
               data: { postId: post.id },
            };
            sendNotification(body);
         }
         console.log('In App Notification');
         // In App Notification
         const notiDoc = {
            causeUser: firebaseInstance.auth.currentUser.uid,
            causeUserPicture: currentUser?.picture || {},
            receiverUser: post.uid,
            timestamp: Date.now(),
            itemPicture: post?.picture || {},
            itemName: post?.type == 'challengeStreak' ? `Your ${post.name} ${post.streak} day streak!` : post.activityName ? post.activityName : false,
            multiplier: post?.multiplier || 1,
            type: 'like',
            streakMessage: `${post.streak} day streak!`,
            itemType: post.type,
            title,
            subtitle: '',
            itemId: post.id,
         };
         await this.notificatonStore.addNewNotificationDoc(notiDoc);
         await this.notificatonStore.incrementNotificationCounter(NotificationType.Activity, post.uid);
      }
   }

   @action.bound
   async commentLike(comment) {
      const { uid } = firebaseInstance.auth.currentUser;
      const { currentUser, currentStory, commentPost } = this;
      console.warn(comment);

      const { picture = {} } = currentUser;
      const { postId, id, likes } = comment;
      const commentId = id;

      if (likes?.includes(uid)) {
         console.warn(1);
         await updateDoc(doc(firestore, `posts/${postId}/comments/${commentId}`), {
            like: increment(-1),
            likes: arrayRemove(uid),
            // avatars: {[uid]: arrayRemove(picture)}
         });
      } else {
         console.warn(2);
         await updateDoc(doc(firestore, `posts/${postId}/comments/${commentId}`), {
            like: increment(1),
            likes: arrayUnion(uid),
            avatars: {
               [uid]: picture,
            },
         });
         console.warn(3);
         const userDocRef = doc(firestore, "users", comment.uid);
         const userSnap = await getDoc(userDocRef);
         console.warn(4);
         const userData = userSnap.data();
         console.warn(5);
         const { currentUser } = this;
         const title = `${currentUser.name} likes your comment!`;
         console.warn(6);
         //PushNotification
         if (userData.expoPushToken) {
            const body = {
               to: userData.expoPushToken,
               sound: 'default',
               title: title,
               subtitle: `"${comment.text}"` || 'nada',
               data: { postId: postId },
            };

            console.warn(7);
            sendNotification(body);
         }

         console.warn(8);
         console.log('In App Notification');
         //In App Notification
         const notiDoc = {
            causeUser: firebaseInstance.auth.currentUser.uid,
            causeUserPicture: currentUser?.picture || {},
            receiverUser: comment.uid,
            timestamp: Date.now(),
            type: 'like',
            title,
            subtitle: `"${comment.text}"`,
            itemId: currentStory?.id || commentPost?.id || false,
         };

         console.warn(9);

         // if is not me
         if (comment.uid != currentUser.uid) {
            this.notificatonStore.addNewNotificationDoc(notiDoc);
            this.notificatonStore.incrementNotificationCounter(
               NotificationType.Activity,
               comment.uid,
            );
         }


         console.warn(1);
      }
   }

   @action.bound
   async playerGoalLike(item) {
      console.log('like');
      const playerChallengeRef = doc(firestore, 'playerGoals', item.id);
      await setDoc(playerChallengeRef, { like: increment(1), updatedAt: this.serverTimestamp }, { merge: true });

      const userSnap = await getDoc(doc(firestore, 'users', item.uid));
      const userData = userSnap.data();

      const goalId = item.goalId;
      const goalName = item.goalName;

      const { currentUser } = this;
      const title = `${currentUser.name} sent rockets to you for your ${goalName || 'No Goal Name'
         } goal progress 🚀 `;


      const uid = firebaseInstance?.auth?.currentUser?.uid
      if (uid == item.uid) {

         return // do nothing because we don't need to be notified. 
      }
      //PushNotification
      if (userData.expoPushToken) {
         const body = {
            to: userData.expoPushToken,
            sound: 'default',
            title: title,
            data: { playerChallengeId: item.id },
         };
         sendNotification(body);
      }
      console.log('In App Notification');
      //In App Notification
      const notiDoc = {
         causeUser: firebaseInstance.auth.currentUser.uid,
         causeUserPicture: currentUser?.picture || {},
         receiverUser: item.uid,
         timestamp: Date.now(),
         type: 'like',
         goalId: goalId,
         title,
         subtitle: '',
         itemId: goalId,
      };
      this.notificatonStore.addNewNotificationDoc(notiDoc);
      this.notificatonStore.incrementNotificationCounter(
         NotificationType.Activity,
         item.uid,
      );
   }

   @action.bound
   async like(item) {
      console.log('like');
      const playerChallengeRef = doc(firestore, 'playerChallenges', item.id);
      await updateDoc(playerChallengeRef, { like: increment(1) });

      const userSnap = await getDoc(doc(firestore, 'users', item.uid));
      const userData = userSnap.data();
      const challengeSnap = await getDoc(doc(firestore, 'challenges', item.challengeId));
      const challengeData = challengeSnap.data();

      const { currentUser } = this;
      const title = `${currentUser.name} likes your progress ♥ ${challengeData.name || 'challenge'
         }! `;

      //PushNotification
      if (userData.expoPushToken) {
         const body = {
            to: userData.expoPushToken,
            sound: 'default',
            title: title,
            data: { playerChallengeId: item.id },
         };
         sendNotification(body);
      }
      console.log('In App Notification');
      //In App Notification
      const notiDoc = {
         causeUser: firebaseInstance.auth.currentUser.uid,
         causeUserPicture: currentUser?.picture || {},
         receiverUser: item.uid,
         timestamp: Date.now(),
         type: 'like',
         playerChallengeId: item.id,
         title,
         subtitle: '',
         itemId: challengeData.id,
      };
      this.notificatonStore.addNewNotificationDoc(notiDoc);
      this.notificatonStore.incrementNotificationCounter(
         NotificationType.Activity,
         item.uid,
      );
   }

   async invite() {
      alert('invite from smashstore');
   }
   async onShare(inviteInfo) {
      try {
         const result = await Share.share({
            message: inviteInfo,
         });

         if (result.action === Share.sharedAction) {
            if (result.activityType) {
               // shared with activity type of result.activityType
            } else {
               // shared
            }
         } else if (result.action === Share.dismissedAction) {
            // dismissed
         }
      } catch (error) {
         //   alert(error.message);
      }
   }

   dismissSubscribeModal() {
      this.subscribeModal = false;
   }

   @action.bound
   async createProfileLink() {
      const fetchParams = {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            dynamicLinkInfo: {
               domainUriPrefix: 'smashappchallenges.page.link',
               link: `https://smashappchallenges.page.link/challenge`,
               androidInfo: {
                  androidPackageName: 'com.smashapp.challenges',
               },
               iosInfo: {
                  iosBundleId: 'com.smashapp.challenges',
                  iosAppStoreId: '1597318214',
                  iosCustomScheme: 'smashappchallenges',
               },
            },
         }),
      };

      //   alert('fetch' + JSON.stringify(fetchParams));

      const apikey =
         Platform.OS === 'ios'
            ? 'AIzaSyDXFHlXwRd-2QOu_p7Cq06klZKtSJKXGqU'
            : 'AIzaSyDXFHlXwRd-2QOu_p7Cq06klZKtSJKXGqU';

      return fetch(
         'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=' +
         apikey,
         fetchParams,
      )
         .then((response) => {
            return response.json();
         })
         .catch((error) => {
            console.error(error);
         });
   }

   @action.bound
   setCheckPermissions(bool) {
      this.checkPermissions = bool;
   }

   @action.bound
   async shareProfile() {
      let profileLink = await this.createProfileLink();

      const { currentUser } = this;
      const userName = currentUser.name || 'noname';

      const inviteInfo = `Let's Connect Up! Here's my SmashApp Profile: https://smashapp.com.au/`;
      // ${profileLink.shortLink}/?playerId=${currentUser?.id}`;

      this.onShare(inviteInfo);
   }

   @action.bound
   async shareChallenge(challenge) {
      let teamLink = await this.createChallengeLink(challenge.id);
      const challengeName =
         challenge.name || challenge.challengeName || 'noname';
      const { currentUser } = this;

      const inviteInfo = `I'm in (${challengeName}) on SmashApp. Here's the link to join the challenge: ${teamLink.shortLink}/?challengeId=${challenge?.id}`;

      this.onShare(inviteInfo);
   }

   @action.bound
   async createChallengeLink(teamId) {
      const fetchParams = {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            dynamicLinkInfo: {
               domainUriPrefix: 'smashappchallenges.page.link',
               link: `https://smashappchallenges.page.link/challenge`,
               androidInfo: {
                  androidPackageName: 'com.smashapp.challenges',
               },
               iosInfo: {
                  iosBundleId: 'com.smashapp.challenges',
                  iosAppStoreId: '1597318214',
                  iosCustomScheme: 'smashappchallenges',
               },
            },
         }),
      };

      //   alert('fetch' + JSON.stringify(fetchParams));

      const apikey =
         Platform.OS === 'ios'
            ? 'AIzaSyDXFHlXwRd-2QOu_p7Cq06klZKtSJKXGqU'
            : 'AIzaSyDXFHlXwRd-2QOu_p7Cq06klZKtSJKXGqU';

      return fetch(
         'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=' +
         apikey,
         fetchParams,
      )
         .then((response) => {
            return response.json();
         })
         .catch((error) => {
            console.error(error);
         });
   }

   @action.bound
   async createTeamLink(teamId) {
      const fetchParams = {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            dynamicLinkInfo: {
               domainUriPrefix: 'smashappchallenges.page.link',
               link: `https://smashappchallenges.page.link/team`,
               androidInfo: {
                  androidPackageName: 'com.smashapp.challenges',
               },
               iosInfo: {
                  iosBundleId: 'com.smashapp.challenges',
                  iosAppStoreId: '1597318214',
                  iosCustomScheme: 'smashappchallenges',
               },
            },
         }),
      };

      //   alert('fetch' + JSON.stringify(fetchParams));

      const apikey =
         Platform.OS === 'ios'
            ? 'AIzaSyDXFHlXwRd-2QOu_p7Cq06klZKtSJKXGqU'
            : 'AIzaSyDXFHlXwRd-2QOu_p7Cq06klZKtSJKXGqU';

      return fetch(
         'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=' +
         apikey,
         fetchParams,
      )
         .then((response) => {
            return response.json();
         })
         .catch((error) => {
            console.error(error);
         });
   }


   @action.bound
   getLevelColor(value) {

      if (!value || !this?.settings?.actionLevels) { return '#fff' }
      const colorsArray = this?.settings?.actionLevels;

      // console.warn(this?.settings);

      if (value >= 0 && value < 80) {
         return colorsArray[0]?.color;
      } else if (value >= 80 && value < 200) {
         return colorsArray[1]?.color;
      } else if (value >= 200 && value < 900) {
         return colorsArray[2]?.color;
      } else if (value >= 900 && value < 1700) {
         return colorsArray[3]?.color;
      } else {
         return colorsArray[4]?.color;
      }
   }



   @action.bound
   async shareTeam(team) {
      try {
         // let teamLink = await this.createTeamLink(team.id);

         const { currentUser } = this;
         const teamName = team.name || 'noname';

         // let redirectUrl = Linking.makeUrl(
         //    '/',
         //    { teamId: `${team?.id}` },
         //    'smashappchallenges',
         // );
         //   ${teamLink.shortLink}/?teamId=${team.id}
         const inviteInfo = `Come join me on SmashApp! (${teamName}) -  ${team?.code ? 'Team Code is: ' + team?.code : ' | '
            }. Get the app here: https://smashapp.com.au/`;
         // ${teamLink.shortLink}/?teamId=${team?.id}`;

         this.onShare(inviteInfo);
      } catch (error) {
         // Handle the error here
         console.error(error);
      } finally {
         this.universalLoading = false;
      }
   }

   @action.bound
   async requestFollow(id) {
      const { currentUser } = this;
      const title = `${currentUser.name} requested to follow you!`;
      const uid = currentUser?.uid;

      const userRef = doc(firestore, 'users', id);

      setDoc(userRef, { followRequests: arrayUnion(uid) }, { merge: true });

      const notiDoc = {
         causeUser: firebaseInstance.auth.currentUser.uid,
         causeUserPicture: currentUser?.picture || {},
         causeUserName: currentUser?.name || '',
         receiverUser: id,
         timestamp: Date.now(),
         type: 'followRequest',
         title,
         subtitle: '',
      };
      this.notificatonStore.addNewNotificationDoc(notiDoc);
      this.notificatonStore.incrementNotificationCounter(
         NotificationType.Invite,
         id,
      );

      const data = { uid: notiDoc.causeUser };
      const body = {
         sound: 'default',
         title: title,
         data,
      };

      this.sendPushNotificationToUser(id, body);
   }

   @action.bound
   async acceptFollow(id, otherUserName, otherUserPicture, notificationId) {
      const { currentUser, currentUserId } = this;
      const title = `${currentUser.name} accepted your request!`;
      const uid = currentUserId;

      await setDoc(doc(collection(firestore, 'users'), uid), {
         followRequests: arrayRemove(id),
         followers: arrayUnion(id),
      }, { merge: true });

      await setDoc(doc(collection(firestore, 'users'), id), {
         following: arrayUnion(uid),
      }, { merge: true });

      const playerChallengesQuery = query(
         collection(firestore, 'playerChallenges'),
         where('active', '==', true),
         where('endUnix', '>', moment().unix()),
      );

      const playerChallengesSnaps = await getDocs(playerChallengesQuery);

      playerChallengesSnaps.forEach((snap) => {
         const playerChallengeRef = doc(collection(firestore, 'playerChallenges'), snap.id);
         updateDoc(playerChallengeRef, {
            followers: arrayUnion(id),
         }, { merge: true });

         if (snap.data().uid === id) {
            updateDoc(playerChallengeRef, {
               following: arrayUnion(uid),
            }, { merge: true });
         }
      });

      const notiDoc = {
         causeUser: firebaseInstance.auth.currentUser.uid,
         causeUserPicture: currentUser?.picture || {},
         receiverUser: id,
         timestamp: Date.now(),
         type: 'followRequest',
         title,
         subtitle: '',
      };
      this.notificatonStore.addNewNotificationDoc(notiDoc);
      this.notificatonStore.incrementNotificationCounter(NotificationType.Invite, id);

      const data = { uid: notiDoc.causeUser };
      const body = {
         sound: 'default',
         title: title,
         data,
      };

      this.sendPushNotificationToUser(id, body);

      const notiDoc2 = {
         causeUser: id,
         causeUserPicture: otherUserPicture || {},
         receiverUser: firebaseInstance.auth.currentUser.uid,
         timestamp: Date.now(),
         type: 'follow',
         title: `${otherUserName} followed you!`,
         subtitle: '',
      };
      this.notificatonStore.addNewNotificationDoc(notiDoc2);
      this.notificatonStore.incrementNotificationCounter(NotificationType.Activity, id);

      // await setDoc(doc(collection(firestore, 'Notifications'), notificationId), {
      //   active: false,
      // }, { merge: true });
   }

   @action.bound
   async toggleFollowUnfollow(id, getFriends) {

      this.setUniversalLoading(true);
      const { currentUser, currentUserId, serverTimestamp } = this;
      const title = `${currentUser.name} followed you!`;
      const uid = currentUser?.uid;
      const firstBatch = writeBatch(firestore);
      const batch = writeBatch(firestore);
      const isFollowing = currentUser.following && currentUser.following.includes(id);

      if (isFollowing) {
         // Already Following so Unfollow!
         const meRef = doc(firestore, 'users', uid);
         const personToFollowUnfollowRef = doc(firestore, 'users', id);

         firstBatch.update(meRef, { following: arrayRemove(id), updatedAt: serverTimestamp });
         firstBatch.update(personToFollowUnfollowRef, { followers: arrayRemove(uid), updatedAt: serverTimestamp });

      } else {
         // Follow the player!
         const meRef = doc(firestore, 'users', uid);
         const personToFollowUnfollowRef = doc(firestore, 'users', id);

         firstBatch.update(meRef, { following: arrayUnion(id), updatedAt: serverTimestamp });
         firstBatch.update(personToFollowUnfollowRef, { followers: arrayUnion(uid), updatedAt: serverTimestamp });
      }
      firstBatch.commit();
      const [playerChallengesFollowingSnaps, playerChallengesFollowerSnaps] = await Promise.all([
         getDocs(query(collection(firestore, 'playerChallenges'), where('active', '==', true), where('dailyTargets', '!=', null), where('uid', '==', id))),
         getDocs(query(collection(firestore, 'playerChallenges'), where('active', '==', true), where('dailyTargets', '!=', null), where('uid', '==', uid)))
      ]);

      if (isFollowing) {

         playerChallengesFollowingSnaps.forEach((snap) => {
            batch.update(snap.ref, { followers: arrayRemove(uid) });
         });

         playerChallengesFollowerSnaps.forEach((snap) => {
            batch.update(snap.ref, { following: arrayRemove(id) });
         });

      } else {


         playerChallengesFollowingSnaps.forEach((snap) => {
            batch.update(snap.ref, { followers: arrayUnion(uid) });
         });

         playerChallengesFollowerSnaps.forEach((snap) => {
            batch.update(snap.ref, { following: arrayUnion(id) });
         });

         const notiDoc = {
            causeUser: firebaseInstance.auth.currentUser.uid,
            causeUserPicture: currentUser?.picture || {},
            receiverUser: id,
            timestamp: Date.now(),
            type: 'follow',
            title,
            subtitle: 'Link up and follow back!',
            itemId: `${currentUserId}_${id}_follow`
         };

         this.notificatonStore.addNewNotificationDoc(notiDoc);
         this.notificatonStore.incrementNotificationCounter(NotificationType.Activity, id);

         const data = { userId: notiDoc.causeUser };
         const body = { sound: 'default', title: title, data };
         this.sendPushNotificationToUser(id, body);
      }

      try {
         await batch.commit();
         getFriends();
         this.setUniversalLoading(false);
         console.log('Batch write operations completed successfully');
      } catch (error) {
         getFriends();
         this.setUniversalLoading(false);
         console.log('Error committing batch write operations:', error);
      }
   }


   @action.bound
   async sendPushNotificationToUser(
      receiverUid: string,
      body: { sound: string; title: string; to?: string }
   ) {
      const userSnap = await getDoc(doc(firestore, "users", receiverUid));
      const userData = userSnap.data();
      if (userData?.expoPushToken) {
         body.to = userData.expoPushToken;
         sendNotification(body);
      }
   }
   @action.bound
   setUploadProgress(progress) {
      this.uploadProgress = progress;
   }

   @action.bound
   async uploadImage(image, postId): Promise<void> {
      // this.imageUploading = true;
      return new Promise(async (res, rej) => {
         // const { status } =
         //    await ImagePicker.requestMediaLibraryPermissionsAsync();
         const { uid } = firebaseInstance.auth.currentUser;

         if (image) {
            const { uri, width, height } = image;

            const picture: Picture = {
               uri,
               width,
               height,
            };

            const uploadedPreview = await ImageUpload.preview(picture);
            const uploadedUri = await ImageUpload.upload(
               picture,
               postId,
               this.setUploadProgress,
            );
            console.log('picupload', uploadedUri);

            const uploadedPicture = {
               preview: uploadedPreview,
               uri: uploadedUri,
            };

            res(uploadedPicture);
            this.imageUploading = 0;
         }
      });
   }

   @action.bound
   setStreakBadgeCelebration(celebration) {

      this.myCelebrations = [celebration];
   }


   @action.bound
   async uploadVideo(video, completionId, func, bool): Promise<void> {
      this.imageUploading = true;

      return new Promise(async (res, rej) => {
         const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
         const { uid } = firebaseInstance.auth.currentUser;

         if (video) {
            const { uri, width, height } = video;

            const picture: Picture = {
               uri,
               width,
               height,
            };

            const uploadedPreview = ''; // await ImageUpload.preview(picture);
            const uploadedUri = await ImageUpload.upload(
               video,
               completionId,
               this.setUploadProgress,
               true,
            );
            // const uploadedVideo = {preview: uploadedPreview, uri: uploadedUri};

            res(uploadedUri);
            this.imageUploading = false;
         }
      });
   }


   // async checkForLocalUser(uid) {


   //    const userJson = await AsyncStorage.getItem('user')
   //    const storedUser = userJson != null ? JSON.parse(userJson) : null;


   //    if (storedUser?.uid) {

   //       this.currentUser = storedUser;


   //    } 

   // }



   @action.bound
   fetchHabitStacks() {
      const q = query(
         collection(firestore, 'habitStacks'),
         where('active', '==', true),
         orderBy('updatedAt', 'desc')
      );

      this.unsubscribeToHabitStacks = onSnapshot(q, (snaps) => {
         const stacks = [];

         if (!snaps.empty) {
            snaps.forEach((stack) => {
               stacks.push(stack.data());
            });
         }

         this.habitStacksList = stacks?.sort((a, b) => a.updatedAt - b.updatedAt);
         // this.setHabitStacksList(stacks?.sort((a, b) => a.updatedAt - b.updatedAt));
      });
   }


   @action.bound
   getLibraryActions() {


      try {
         // this.clearStore();
         // this.unsubscribeMyLibraryActions = firestore
         //         .collection("feed")
         //         .where("type", "==", "Action")
         //         .where("inUserLibrary", "array-contains", uid)
         //         .where("active", "==", true)
         //         .onSnapshot((snaps) => {
         //             const libraryActions = {};

         //             if (!snaps.empty) {
         //                 snaps.forEach((action) => {
         //                     libraryActions[action.data().id] = action.data();
         //                 });
         //             }

         //             this.setMyLibraryActivities(libraryActions);
         //         });

         const q = query(
            collection(firestore, 'feed'),
            where('type', '==', 'Action'),
            where('isLibraryAction', '==', true),
            where('active', '==', true),
            orderBy('level', 'asc')
         );

         this.unsubscribeToLibraryActions = onSnapshot(q, (snaps) => {
            const libraryActions = [];

            if (!snaps.empty) {
               snaps.forEach((action) => {
                  libraryActions.push(action.data());
               });
            }
            this.setLibraryActionsList(libraryActions);
         });


      } catch (e) {
         console.log('subscribeToCurrentUser', e);
      }

   }
   @action.bound
   async init(userDoc = false) {


      const uid = userDoc || firebaseInstance?.auth?.currentUser?.uid;


      this.subscribeToCurrentUser(userDoc);
      this.fetchTodayActivity();
      //  this.getDailyActivity(uid);
      this.fetchMyCelebrations();

   }





   @action.bound
   setRefreshing(bool) {

      this.refreshing = bool
   }
   // @action.bound
   // refreshHomeActivity = () => {
   //    this.setRefreshing(true);

   //    const { uid } = firebaseInstance.auth.currentUser;
   //    const userIds = this.activePlayers.map((player) => player.uid);
   //    const promises = userIds.map((uid) =>
   //       getDoc(
   //          doc(
   //             collection(
   //                collection(doc(firestore, "users"), uid),
   //                "days"
   //             ),
   //             this.todayDateKey
   //          )
   //       )
   //          .then((snap) => snap.data())
   //          .catch((error) => console.log(error))
   //    );

   //    Promise.all(promises).then((activityList) => {
   //       const activityHash = {};
   //       activityList.forEach((activity, i) => {
   //          if (activity) {
   //             activityHash[userIds[i]] = activity;
   //          }
   //       });
   //       this.setWholeFriendsTodayHash(activityHash);
   //       this.setRefreshing(false);
   //    });
   // };

   @action.bound
   async setDailyActivity(activityList) {
      this.activityList = activityList;

   }

   @action.bound
   getLast7ForUser = async (uid) => {

      return new Promise (async (res, rej)=>{

      const activityListQuery = query(collection(firestore, 'users', uid, 'days'), orderBy('timestamp', 'desc'), limit(7));
      const last7DocsHash = {};
      // const last7Days = [];
      try {
         const snaps = await getDocs(activityListQuery);
         const activityList = [];

         if (!snaps.empty) {
            snaps.forEach((post) => {
               const id = post?.id;
               post = post.data();
               activityList.push(post);
               last7DocsHash[post.dayKey] = post;
            });

            // return activityList;

            const days = this.last7Keys?.map((key)=>{

               return last7DocsHash[key] || false

            })

            res(days)
         }
      } catch (error) {
         rej(error)
         console.error('Error fetching daily activities:', error);
      }


      })



   }

   @action.bound
   async getDailyActivity() {
      const uid = firebaseInstance.auth.currentUser.uid;

      const activityListQuery = query(collection(firestore, 'users', uid, 'days'), orderBy('timestamp', 'desc'), limit(7));

      try {
         const snaps = await getDocs(activityListQuery);
         const activityList = [];

         if (!snaps.empty) {
            snaps.forEach((post) => {
               const id = post?.id;
               post = post.data();
               activityList.push(post);
            });

            this.activityList = activityList;
         }
      } catch (error) {
         console.error('Error fetching daily activities:', error);
      }
   }


   @action
   setMyLibraryActivities(libraryActions) {
      // console.log('setMyLibraryActivities', libraryActions)

      this.myLibraryActivities = libraryActions;
   }

   // @computed get libraryActivitiesHash() {
   //    const hash = {};

   //    this.myLibraryActivities.forEach((a) => {
   //       hash[a.id] = a;
   //    });
   //    return hash;
   // }
   @action.bound
   async setLibraryActionsList(actions) {
      this.libraryActionsList = actions;
      // try {
      //   await AsyncStorage.setItem('libraryActionsList', JSON.stringify(actions));
      // } catch (error) {
      //   console.log('Error saving libraryActionsList:', error);
      // }
   }



   @action.bound
   async saveAllToAsyncStorage() {

      const { actions, stacks, activityList } = this;
      try {
         await AsyncStorage.setItem('activityList', JSON.stringify(activityList));
         await AsyncStorage.setItem('libraryActionsList', JSON.stringify(actions));
         await AsyncStorage.setItem('habitStacksList', JSON.stringify(stacks));
      } catch (error) {
         console.log('Error saving habitStacksList:', error);
      }

   }


   @action
   async setHabitStacksList(stacks) {
      this.habitStacksList = stacks;

      try {
         // await AsyncStorage.setItem('habitStacksList', JSON.stringify(stacks));
      } catch (error) {
         console.log('Error saving habitStacksList:', error);
      }
   }

   @computed get freeQuotas() {

      return this?.settings?.freeQuotas;
   }


   @action.bound
   willExceedQuota(currentVal, type) {



      let quota = this?.freeQuotas?.[type];


      if (this.isPremiumMember) {

         return false
      } else {

         return currentVal >= quota;
      }

   }

   @action.bound
   showUpgradeModal(bool) {


      Alert.alert('Oops!', 'You have reached your quota for this feature. Upgrade to Premium to unlock unlimited access to all features.');
      // this.upgradeModal = bool;

   }

   @action.bound
   async getSettings() {
      try {

         const settingsRef = doc(firestore, "generalSettings", "smashAppSettings");
         this.unsubscribeToSettings = onSnapshot(settingsRef, (snap) => {
            this.settings = snap.data();

            if (this.settings?.activityCategoryLabels) {
               this.setActivityCategoryLabels(this.settings.activityCategoryLabels);
            }

            //  AsyncStorage.setItem("settings", JSON.stringify(this.settings));
         });

         const journeySettingsRef = doc(firestore, "generalSettings", "journeySettings");
         this.unsubscribeToJourney = onSnapshot(journeySettingsRef, (snap) => {
            this.journeySettings = snap.data();

            //  AsyncStorage.setItem("journeySettings", JSON.stringify(this.journeySettings));
         });

         return Promise.resolve(true);
      } catch (error) {
         return Promise.reject(error);
      }
   }

   @action
   setActivityCategoryLabels(activityCategoryLabels) {
      this.activityCategoryLabels = activityCategoryLabels;
   }

   @action.bound
   async getTodayActivityForUsersImFollowing() {
      const todayKey = this.todayDateKey;
      const following = this.currentUser.following || [];
      const promises = following.map((id) =>
         getDoc(doc(collection(firestore, 'dailyActivity'), `${id}_${todayKey}`))
      );


   }
   @action.bound
   clearStore() {



      AsyncStorage.setItem('user', '')
      AsyncStorage.setItem('challenges', '')
      AsyncStorage.setItem('myChallenges', '')
      AsyncStorage.setItem('activePlayers', '')
      if (this.unSubMyStories) {
         this.unSubMyStories();
      }
      if (this.subscribeToPlayersInChallenge) {
         this.subscribeToPlayersInChallenge();
      }
      if (this.unSubscribeToCurrentUser) {
         this.unSubscribeToCurrentUser();
      }
      if (this.unsubscribeMyLibraryActions) {
         this.unsubscribeMyLibraryActions();
      }
      if (this.unsubscribeToLibraryActions) {
         this.unsubscribeToLibraryActions();
      }
      if (this.subscribeToTodayPointsDoc) {
         this.subscribeToTodayPointsDoc();
      }
      if (this.unsubscribeToHabitStacks) {
         this.unsubscribeToHabitStacks();
      }

      this.currentUser = { name: 'noone' };
   }

   @action.bound
   difficultyModifier(difficulty) {
      if (difficulty == 0) {
         return 2.6;
      } else if (difficulty == 1) {
         return 2.3;
      } else if (difficulty == 2) {
         return 2.0;
      } else if (difficulty == 3) {
         return 1.7;
      } else if (difficulty == 4) {
         return 1.4;
      } else if (difficulty == 5) {
         return 1.1;
      } else if (difficulty == 6) {
         return 0.9;
      } else if (difficulty == 7) {
         return 0.6;
      } else if (difficulty == 8) {
         return 0.4;
      } else if (difficulty == 9) {
         return 0.2;
      } else if (difficulty == 10) {
         return 0.1;
      }

      return 1;
   }


   @computed get isPremiumMember() {


      // return false;
      const isAndroid = Platform.OS === 'android';


      const iosProductId = 'premium';

      const androidProductId = 'premium';
      const selectedProductId = Platform.OS === 'android' ? androidProductId : iosProductId;



      return this?.customerInfo?.allPurchasedProductIdentifiers?.includes(selectedProductId);
   }

   @action.bound
   getCustomerData = async () => {


      return new Promise(async (resolve, reject) => {





         // if(isAndroid){return}
         const APIKeys = {
            apple: "appl_PskkcvuGKwqjUPRrQbTYwNIVhrw",
            google: "goog_mZxJOGFWmKxarTbaYVhkjTiHXmE",
         };

         const androidProductId = 'premium';

         const iosProductId = 'premium';

         const selectedProductId = Platform.OS === 'android' ? androidProductId : iosProductId;
         const textColor = '#fff';

         // setLoading(true)
         // getCustomerInfo();
         try {





            // Purchases.setDebugLogsEnabled(true);

            if (Platform.OS == "android") {
               await Purchases.configure({ apiKey: (APIKeys.google) });
            } else {
               await Purchases.configure({ apiKey: APIKeys.apple });
            }

            const customerInfo = await Purchases.getCustomerInfo();

            const isPremium = customerInfo?.allPurchasedProductIdentifiers?.includes(selectedProductId)
            // this.isPremiumMember = isPremium;
            const { uid } = firebaseInstance.auth.currentUser;
            if (this.currentUser?.premium && !isPremium) {
               // User has cancelled
               const userRef = doc(firestore, 'users', uid);
               setDoc(userRef, { premium: false, cancelledPremium: true }, { merge: true });
            }

            if (!this.currentUser?.premium && isPremium) {
               const userRef = doc(firestore, 'users', uid);
               setDoc(userRef, { premium: true, cancelledPremium: false }, { merge: true });
            }


            /// if currentUser.premium && !isPremium
            // then we add currentUser.premium = false, currentUser.cancelledPremium = true

            // if !currentUser.premium && !isPremium then add currentUser.premium = true;


            this.customerInfo = customerInfo

            resolve(customerInfo)

            /// if not premium member but was premium member before


            /// add field in user object - 


            // if someone purchases a product, we need to update the user object


            // setCustomerInfo(false)


            // const prods = await Purchases.getProducts(isAndroid ? [androidProductId] : [iosProductId]);

            // setCurrentOffering(prods);
            // alert('1')
            // const offerings = await Purchases.getOfferings();


            // setCurrentOffering(prods)

            // setLoading(false)
            // const offerings = await Purchases.getOfferings();

            // if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
            // Display packages for sale  

            // setCurrentOffering({tiko: true});
            // }

            // setCurrentOffering(prods);
            // alert(JSON.stringify(prods))

         } catch (e) {

            this.customerInfo = false
            reject()
            // setLoading(false)
            // setCustomerInfo(false)
            // setCurrentOffering(false);
            console.log(e);
         }

      })
   }

   @action.bound
   returnActionPointsValue(activity) {
      const actionLevelDividers = [150, 15, 7, 2, 1];

      // const { difficulty } = game;

      const difficulty = 5;

      const action = activity;

      const isBad = action?.actionType == 'bad';

      const { level, bonus } = action;

      const pointsTarget = 30000;
      let bonusMuliply = 0;

      bonusMuliply = (bonus && parseInt(bonus) / 10 + 1) || 0;

      const target = pointsTarget || 0;
      const totalDays = 7;

      const numOfUsers = 4;
      const eachUserPoints = target / numOfUsers;
      const eachUserPerDay = eachUserPoints / totalDays;

      let points = 1;

      if (level == 0) {
         points = eachUserPerDay / actionLevelDividers[0];
      } else if (level == 1) {
         points = eachUserPerDay / actionLevelDividers[1];
      } else if (level == 2) {
         points = eachUserPerDay / actionLevelDividers[2];
      } else if (level == 3) {
         points = eachUserPerDay / actionLevelDividers[3];
      } else if (level == 4) {
         points = eachUserPerDay * actionLevelDividers[4];
      }

      points = parseInt(points);

      // / points should be less depending on the game level

      const pointsPercentage = points / 100;

      const percentToDeduct = pointsPercentage;

      const finalPoints = parseInt(points - percentToDeduct);

      let endPoints = finalPoints * ((bonusMuliply > 0 && bonusMuliply) || 1);

      endPoints *= this.difficultyModifier(difficulty);

      endPoints = isBad ? -endPoints : endPoints;

      return activity?.activityValue
         ? activity?.activityValue
         : parseInt(endPoints) < 1
            ? 1
            : parseInt(endPoints);
   }

   numberWithCommas(x) {
      return (x && x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')) || 0;
   }
   kFormatter(num) {
      if (Math.abs(num) >= 1000000) {
         return Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + 'mil';
      } else if (Math.abs(num) > 999) {
         return Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k';
      } else {
         return Math.sign(num) * Math.abs(num).toFixed(1);
      }
   }


   stringLimit(str, length, showDots = true) {
      let newstr = '';
      if (str?.length > length) {
         newstr = str?.substring(0, length);
      } else {
         newstr = str;
      }

      let end = newstr?.length >= length && showDots ? '..' : '';

      return newstr + end;
   }
   daysRemaining(eventdate, plusText) {
      if (!eventdate) {
         return;
      }
      var todaysdate = moment();
      const daysLeft = eventdate.diff(todaysdate, 'days') + 1;

      if (plusText) {
         return daysLeft == 1
            ? daysLeft + ' day left'
            : daysLeft + ' days left';
      } else {
         return daysLeft + 1;
      }
   }
   ordinal_suffix_of(i) {
      var j = i % 10,
         k = i % 100;
      if (j == 1 && k != 11) {
         return i + 'st!';
      }
      if (j == 2 && k != 12) {
         return i + 'nd';
      }
      if (j == 3 && k != 13) {
         return i + 'rd';
      }
      return i + 'th';
   }

   checkInfinity(num) {
      const X = 2;

      if (isFinite(num)) {
         return +(Math.round(num + 'e+' + X) + 'e-' + X);
      } else {
         return 0;
      }
   }

   @computed get levelColors() {
      return (
         this?.settings?.activityLevelColors || [
            '#000',
            '#3366E6',
            '#643895',
            '#C90035',
            '#93063E',
         ]
      );
   }

   ordinal_suffix_of(i) {
      var j = i % 10,
         k = i % 100;
      if (j == 1 && k != 11) {
         return i + 'st';
      }
      if (j == 2 && k != 12) {
         return i + 'nd';
      }
      if (j == 3 && k != 13) {
         return i + 'rd';
      }
      return i + 'th';
   }

   @computed get dayLabelsThisWeek() {
      const dayLabels = [];
      let count = 7;

      let i = count;
      while (i--) {
         dayLabels.push(
            moment()
               .endOf('isoWeek')
               .subtract(i, 'days')
               .startOf('day')
               .format('DDMMYYYY'),
         );
      }

      return dayLabels;
   }

   @computed get dayKeysThisWeek() {
      const dayLabels = [];
      let count = 7;

      let i = count;
      while (i--) {
         dayLabels.push(
            moment()
               .endOf('isoWeek')
               .subtract(i, 'days')
               .startOf('day')
               .format('DDMMYYYY'),
         );
      }

      return dayLabels;
   }

   @computed get dayLabelsThisMonth() {
      const dayLabels = [];
      let count = moment().daysInMonth();

      let i = count;
      while (i--) {
         dayLabels.push(
            moment()
               .endOf('month')
               .subtract(i, 'days')
               .startOf('day')
               .format('DDMMYYYY'),
         );
      }

      return dayLabels;
   }

   @computed get dayLabelsLast7() {
      const dayLabels = [];
      let count = 7;

      let i = count;
      while (i--) {
         dayLabels.push(
            moment().subtract(i, 'days').startOf('day').format('DDMMYYYY'),
         );
      }

      return dayLabels;
   }

   getDayLabelsInMonth(month) {
      const dayLabels = [];
      let count = moment().daysInMonth();

      let i = count;
      while (i--) {
         dayLabels.push(
            moment(month, 'DDMMYYYY')
               .endOf('month')
               .subtract(i, 'days')
               .startOf('day')
               .format('DDMMYYYY'),
         );
      }

      return dayLabels;
   }

   @computed get dayLabels() {
      const dayLabels = [];

      const dayLabels7 = [];
      const dayLabels14 = [];
      const dayLabels30 = [];
      let count = 7;

      // if (this.graphView == 0) { count = 7 } // last 7
      // if (this.graphView == 1) { count = 14 } // last 14
      // if (this.graphView == 2) { count = 30 } // last 30

      let i = count;
      while (i--) {
         dayLabels7.push(
            moment().subtract(i, 'days').startOf('day').format('DDMMYYYY'),
         );
      }

      i = 14;
      while (i--) {
         dayLabels14.push(
            moment().subtract(i, 'days').startOf('day').format('DDMMYYYY'),
         );
      }

      i = 30;
      while (i--) {
         dayLabels30.push(
            moment().subtract(i, 'days').startOf('day').format('DDMMYYYY'),
         );
      }

      return [dayLabels7, dayLabels14, dayLabels30];
   }
}


export default SmashStore;