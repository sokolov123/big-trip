import SortView from '../view/sort-view.js';
// import EventCreatorView from '../view/event-creator-view.js';
import EventEditorView from '../view/event-editor-view.js';
import PointInListView from '../view/point-in-list.js';
import EventsUlistView from '../view/events-ulist-view.js';
import { render } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import { filterTypes } from '../view/filters-view.js';
import PointPresenter from './point-presenter.js';

export default class EventsPresenter {

  #eventsUlistView = new EventsUlistView();

  init = (eventsContainer, pointsModel) => {
    this.eventsContainer = eventsContainer;
    this.pointsModel = pointsModel;
    this.eventPoints = [...pointsModel.getPoints()];
    this.eventDestinations = [...pointsModel.getDestinations()];
    this.eventOffers = [...pointsModel.getOffers()];
    render(new SortView(), this.eventsContainer);
    render(this.#eventsUlistView, this.eventsContainer);
    const currentOffersByType = this.pointsModel.getOffersByType(this.eventPoints[0]);
    // render(new EventCreatorView(), this.#eventsUlistView.getElement());

    if (this.eventPoints.length === 0) {
      render(new EmptyListView(filterTypes.EVERYTHING), this.#eventsUlistView.element);
    } else {
      for (let i = 0; i < this.eventPoints.length; i++) {
        const editPoint = new EventEditorView(this.eventPoints[i],
          this.eventDestinations,
          currentOffersByType);
        const eventPoint = new PointInListView(this.eventPoints[i],
          this.eventDestinations[i],
          this.eventOffers[i]);
        const pointPresenter = new PointPresenter(editPoint, eventPoint);
        pointPresenter.renderPoint(this.#eventsUlistView);
      }
    }
  };
}
