import {createElement} from '../render.js';

const createEventsUlist = () => (
  '<ul class="trip-events__list"></ul>'
);

class EventsUlistView {

  getElement() {
    if (!this.element) {
      this.element = createElement(createEventsUlist);
    }
    return this.element;
  }
}

export default EventsUlistView;
