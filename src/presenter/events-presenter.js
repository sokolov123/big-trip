import SortView from '../view/sort-view.js';
import EventCreatorView from '../view/event-creator-view.js';
import EventEditorView from '../view/event-editor-view.js';
import PointInListView from '../view/point-in-list.js';
import EventsUlistView from '../view/events-ulist-view.js';
import {render} from '../render.js';

class EventsPresenter {

  eventsUlistView = new EventsUlistView();

  init = (eventsContainer) => {
    this.eventsContainer = eventsContainer;
    render (new SortView(), this.eventsContainer);
    render(this.eventsUlistView, this.eventsContainer);
    render(new EventEditorView(), this.eventsUlistView.getElement());
    render(new EventCreatorView(), this.eventsUlistView.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointInListView(), this.eventsUlistView.getElement());
    }
  };
}

export default EventsPresenter;
