import {createElement} from '../render.js';

const createEventsUlistTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class EventsUlistView {

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  getTemplate() {
    return createEventsUlistTemplate();
  }
}
