import AbstractView from '../framework/view/abstract-view';
import { filterTypes } from './filters-view';

const messageByFilterType = {
  EVERYTHING: 'Click New Event to create your first point',
  // PAST: 'There are no past events now',
  FUTURE: 'There are no future events now'
};

const createEmptyListTemplate = (filter) => {
  let message = '';
  switch (filter) {
    case filterTypes.EVERYTHING: {
      message = messageByFilterType.EVERYTHING;
      break;
    }
    case filterTypes.FUTURE: {
      message = messageByFilterType.EVERYTHING;
      break;
    }
  }
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <p class="trip-events__msg">${message}</p>

      <!--
        Значение отображаемого текста зависит от выбранного фильтра:
          * Everything - 'Click New Event to create your first point'
          * Past — 'There are no past events now';
          * Future — 'There are no future events now'.
      -->
    </section>`);
};

export default class EmptyListView extends AbstractView {

  #filter = filterTypes.EVERYTHING;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get filter() {
    return this.#filter;
  }

  set filter(filter) {
    this.#filter = filter;
  }

  get template() {
    return createEmptyListTemplate(this.#filter);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
