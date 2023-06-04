import Observable from '../framework/observable.js';
import { FilterTypes } from '../mocks/const.js';

export default class FiltersModel extends Observable {

  #filter = FilterTypes.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  };
}
