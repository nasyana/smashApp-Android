import {action, observable, computed, makeObservable} from 'mobx';

class ActionsStore {
   @observable _selectedActions = [];

   constructor() {
      makeObservable(this);
   }

   @computed get selectedActions() {
      return this._selectedActions;
   }
   set selectedActions(selectedActions) {
      this._selectedActions = selectedActions;
   }

   @action
   setSelectedActions(actions: any) {
      this.selectedActions = actions;
   }

   @action
   pushAction(action: any) {
      const actions = [...this._selectedActions, action];
      this.selectedActions = actions;
   }

   @action
   removeAction(index: number) {
      this.selectedActions.splice(index, 1);
   }

   @action
   clearSelectedActions() {
      this.selectedActions = [];
   }
}

export default ActionsStore;
