import SortView from '../view/sort-view.js';
import { SortModes } from '../view/sort-view.js';
import EventCreatorView from '../view/event-creator-view.js';
import EventsUlistView from '../view/events-ulist-view.js';
import { render, remove } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import { filterTypes } from '../view/filters-view.js';
import PointPresenter from './point-presenter.js';
import { PRIMARY_POINT } from '../mocks/const.js';
import { sortByDay, sortByEvent, sortByOffers, sortByPrice, sortByTime } from '../utils/sorts.js';

export default class EventsPresenter {
  #eventsContainer = null;
  #pointsModel = null;
  #currentSortMode = SortModes.DAY;

  #eventsUlistView = new EventsUlistView();
  #emptyListView = new EmptyListView(filterTypes.EVERYTHING);
  #eventCreator = null;
  #sortView = new SortView(this.#currentSortMode);
  #newEventBtn = document.querySelector('.trip-main__event-add-btn');
  #pointPresenters = [];

  constructor(eventsContainer, pointsModel) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  get pointPresenters() {
    return this.#pointPresenters;
  }

  get points() {
    switch (this.#currentSortMode) {
      case SortModes.DAY:
        return sortByDay(this.#pointsModel.points);
      case SortModes.EVENT:
        return sortByEvent(this.#pointsModel.points);
      case SortModes.TIME:
        return sortByTime(this.#pointsModel.points);
      case SortModes.PRICE:
        return sortByPrice(this.#pointsModel.points);
      case SortModes.OFFERS:
        return sortByOffers(this.#pointsModel.points);
    }
    return this.#pointsModel.points;
  }

  init = () => {
    this.#renderSort();
    this.#eventCreator = new EventCreatorView(PRIMARY_POINT);
    render(this.#eventsUlistView, this.#eventsContainer);
    this.#newEventBtn.addEventListener('click', (evt) => {
      evt.target.disabled = true;
      this.#clearAllPoints();
      render(this.#eventCreator, this.#eventsUlistView.element);
      this.#renderPoints();
      remove(this.#emptyListView);
    });

    this.#renderPoints();
  };

  #handleSortModeChange = (sortMode) => {
    if (this.#currentSortMode === sortMode) {
      return;
    }

    this.#currentSortMode = sortMode;
    this.#clearAllPoints();
    this.#renderPoints();
  };

  #renderSort = () => {
    this.#sortView = new SortView(this.#currentSortMode);
    this.#sortView.setSortModeChangeHandler(this.#handleSortModeChange);

    render(this.#sortView, this.#eventsContainer);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#eventsUlistView, this.#resetAllPoints, this.#deletePoint);
    this.#pointPresenters.push(pointPresenter);
    pointPresenter.init(point);
  };

  #renderPoints = () => {
    if (this.points.length === 0) {
      render(this.#emptyListView, this.#eventsUlistView.element);
    } else {
      for (let i = 0; i < this.points.length; i++) {
        this.#renderPoint(this.points[i]);
      }
    }
  };

  #deletePoint = (toDelete) => {
    const index = this.points.indexOf(toDelete);
    this.points.splice(index, 1);
    if (this.points.length === 0) {
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
      this.#eventCreator = new EventCreatorView(PRIMARY_POINT);
      this.#newEventBtn.disabled = false;
    }
  };
}
