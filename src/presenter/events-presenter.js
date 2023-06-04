import SortView from '../view/sort-view.js';
import { SortModes } from '../view/sort-view.js';
import EventCreatorView from '../view/event-creator-view.js';
import EventsUlistView from '../view/events-ulist-view.js';
import { render, remove } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import { filterTypes } from '../view/filters-view.js';
import PointPresenter from './point-presenter.js';
import { PRIMARY_POINT } from '../mocks/const.js';
import { sortByDay, sortByEvent, sortByOffers, sortByPrice, sortByTime, firstSort } from '../utils/sorts.js';

export default class EventsPresenter {

  #eventsUlistView = new EventsUlistView();
  #emptyListView = new EmptyListView(filterTypes.EVERYTHING);
  #newEventBtn = document.querySelector('.trip-main__event-add-btn');
  #pointPresenters = [];
  #eventCreator = null;

  get pointPresenters() {
    return this.#pointPresenters;
  }

  init = (eventsContainer, pointsModel) => {
    this.eventsContainer = eventsContainer;
    this.pointsModel = pointsModel;
    this.eventPoints = [...pointsModel.getPoints()];
    firstSort(this.eventPoints);
    this.eventDestinations = [...pointsModel.getDestinations()];
    this.eventOffers = [...pointsModel.getOffers()];
    render(new SortView(this.#sort), this.eventsContainer);
    render(this.#eventsUlistView, this.eventsContainer);
    this.#newEventBtn.addEventListener('click', (evt) => {
      evt.target.disabled = true;
      this.#clearAllPoints();
      this.#eventCreator = new EventCreatorView(PRIMARY_POINT);
      render(this.#eventCreator, this.#eventsUlistView.element);
      this.#renderPoints();
      remove(this.#emptyListView);
    });

    for (let i = 0; i < this.eventPoints.length; i++) {
      const pointPresenter = new PointPresenter(this.#eventsUlistView, this.#resetAllPoints, this.#deletePoint);
      this.#pointPresenters[i] = pointPresenter;
    }

    this.#renderPoints();
  };

  #renderPoints = () => {
    if (this.#pointPresenters.length === 0) {
      render(this.#emptyListView, this.#eventsUlistView.element);
    } else {
      for (let i = 0; i < this.#pointPresenters.length; i++) {
        this.#pointPresenters[i].init(this.eventPoints[i]);
      }
    }
  };

  #deletePoint = (toDelete) => {
    const index = this.#pointPresenters.indexOf(toDelete);
    this.#pointPresenters.splice(index, 1);
    if (this.#pointPresenters.length === 0) {
      render(this.#emptyListView, this.#eventsUlistView.element);
    }
  };

  #clearAllPoints = () => {
    this.#pointPresenters.forEach((pp) => pp.destroy());
  };

  #resetAllPoints = () => {
    this.#pointPresenters.forEach((pp) => pp.resetView());
    if (this.#eventCreator !== null) {
      remove(this.#eventCreator);
      this.#eventCreator = null;
      this.#newEventBtn.disabled = false;
    }
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
