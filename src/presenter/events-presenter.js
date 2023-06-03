import SortView from '../view/sort-view.js';
// import EventCreatorView from '../view/event-creator-view.js';
import EventsUlistView from '../view/events-ulist-view.js';
import { render } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import { filterTypes } from '../view/filters-view.js';
import PointPresenter from './point-presenter.js';

export default class EventsPresenter {

  #eventsUlistView = new EventsUlistView();
  #pointPresenters = [];

  init = (eventsContainer, pointsModel) => {
    this.eventsContainer = eventsContainer;
    this.pointsModel = pointsModel;
    this.eventPoints = [...pointsModel.getPoints()];
    this.eventDestinations = [...pointsModel.getDestinations()];
    this.eventOffers = [...pointsModel.getOffers()];
    render(new SortView(), this.eventsContainer);
    render(this.#eventsUlistView, this.eventsContainer);
    // render(new EventCreatorView(), this.#eventsUlistView.getElement());

    if (this.eventPoints.length === 0) {
      render(new EmptyListView(filterTypes.EVERYTHING), this.#eventsUlistView.element);
    } else {
      for (let i = 0; i < this.eventPoints.length; i++) {
        const pointPresenter = new PointPresenter(this.#eventsUlistView, this.#resetAllPoints);
        pointPresenter.init(this.eventPoints[i]);
        this.#pointPresenters[i] = pointPresenter;
      }
    }
  };

  #resetAllPoints = () => {
    this.#pointPresenters.forEach((pp) => pp.resetView());
  };

}
