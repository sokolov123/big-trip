import SortView from '../view/sort-view.js';
import { SortModes } from '../view/sort-view.js';
// import EventCreatorView from '../view/event-creator-view.js';
import EventsUlistView from '../view/events-ulist-view.js';
import { render } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import { filterTypes } from '../view/filters-view.js';
import PointPresenter from './point-presenter.js';
import { sortByDay, sortByEvent, sortByOffers, sortByPrice, sortByTime, firstSort } from '../utils/sorts.js';

export default class EventsPresenter {

  #eventsUlistView = new EventsUlistView();
  #pointPresenters = [];

  init = (eventsContainer, pointsModel) => {
    this.eventsContainer = eventsContainer;
    this.pointsModel = pointsModel;
    this.eventPoints = [...pointsModel.getPoints()];
    firstSort(this.eventPoints);
    this.eventDestinations = [...pointsModel.getDestinations()];
    this.eventOffers = [...pointsModel.getOffers()];
    render(new SortView(this.#sort), this.eventsContainer);
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

  #clearAllPoints = () => {
    this.#pointPresenters.forEach((pp) => pp.destroy());
  };

  #resetAllPoints = () => {
    this.#pointPresenters.forEach((pp) => pp.resetView());
  };

  #sort = (mode) => {
    switch (mode) {
      case SortModes.DAY: {
        this.#pointPresenters = sortByDay(this.#pointPresenters);
        break;
      }
      case SortModes.EVENT: {
        this.#pointPresenters = sortByEvent(this.#pointPresenters);
        break;
      }
      case SortModes.TIME: {
        this.#pointPresenters = sortByTime(this.#pointPresenters);
        break;
      }
      case SortModes.PRICE: {
        this.#pointPresenters = sortByPrice(this.#pointPresenters);
        break;
      }
      case SortModes.OFFERS: {
        this.#pointPresenters = sortByOffers(this.#pointPresenters);
        break;
      }
    }
    this.#clearAllPoints();
    this.#pointPresenters.forEach((pp) => pp.init(pp.point));
  };
}
