import { action, observable, computed, makeObservable } from 'mobx';
import Firebase from '../config/Firebase';
import { moment } from 'helpers/generalHelpers';;
import firebase from 'firebase';
import { inject } from 'mobx-react';


class ChallengeArenaStore {



    @observable _challengeArenaScreen = [];
    @observable _challengeArenaIndex = 0;
    @observable _playerChallengeDoc = {};

    constructor() {
        makeObservable(this);
    }



    @computed get playerChallengeDoc() {
        return this._playerChallengeDoc;
    }

    set playerChallengeDoc(playerChallengeDoc) {
        this._playerChallengeDoc = playerChallengeDoc;
    }

    @computed get challengeArenaIndex() {
        return this._challengeArenaIndex;
    }

    set challengeArenaIndex(challengeArenaIndex) {
        this._challengeArenaIndex = challengeArenaIndex;
    }

    @computed get challengeArenaScreen() {
        return this._challengeArenaScreen;
    }

    set challengeArenaScreen(challengeArenaScreen) {
        this._challengeArenaScreen = challengeArenaScreen;
    }

    @action.bound
    setChallengeArenaIndex(index) {

        this.challengeArenaIndex = index;
    }






}




export default ChallengeArenaStore;