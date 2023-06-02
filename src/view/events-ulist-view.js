import AbstractView from '../framework/view/abstract-view.js';

const createEventsUlistTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class EventsUlistView extends AbstractView {

  get template() {
    return createEventsUlistTemplate();
  }
}
