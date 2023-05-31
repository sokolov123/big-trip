import {createElement} from '../render.js';

const createEventsUlistTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class EventsUlistView {

  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createEventsUlistTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
