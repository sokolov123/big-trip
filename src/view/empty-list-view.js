import AbstractView from '../framework/view/abstract-view';
import { FilterTypes } from '../const';

const messageByFilterType = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  FUTURE: 'There are no future events now'
};

const createEmptyListTemplate = (filter) => {
  let message = '';
  switch (filter) {
    case FilterTypes.EVERYTHING:
      message = messageByFilterType.EVERYTHING;
      break;
    case FilterTypes.FUTURE:
      message = messageByFilterType.FUTURE;
      break;
    case FilterTypes.PAST:
      message = messageByFilterType.PAST;
      break;
  }
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <p class="trip-events__msg">${message}</p>
    </section>`);
};

export default class EmptyListView extends AbstractView {

  #filter = null;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get filter() {
    return this.#filter;
  }

  get template() {
    return createEmptyListTemplate(this.#filter);
  }
}
