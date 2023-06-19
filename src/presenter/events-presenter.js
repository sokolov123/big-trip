import SortView from '../view/sort-view.js';
import EventCreatorView from '../view/event-creator-view.js';
import EventsUlistView from '../view/events-ulist-view.js';
import { render, remove, replace } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import { FilterTypes, UpdateTypes, PRIMARY_POINT, UserActions, SortModes } from '../const.js';
import PointPresenter from './point-presenter.js';
import { sortByDay, sortByEvent, sortByOffers, sortByPrice, sortByTime } from '../utils/sorts.js';
import { filter } from '../utils/filter.js';

export default class EventsPresenter {
  #eventsContainer = null;
  #pointsModel = null;
  #filtersModel = null;
  #currentSortMode = SortModes.DAY;

  #eventsUlistView = new EventsUlistView();
  #emptyListView = null;
  #eventCreator = null;
  #sortView = new SortView(this.#currentSortMode);
  #newEventBtn = document.querySelector('.trip-main__event-add-btn');
  #pointPresenters = [];

  constructor(eventsContainer, pointsModel, filtersModel) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#emptyListView = new EmptyListView(filtersModel.filter);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get pointPresenters() {
    return this.#pointPresenters;
  }

  get points() {
    const filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[filterType](points);
    switch (this.#currentSortMode) {
      case SortModes.DAY:
        return sortByDay(filteredPoints);
      case SortModes.EVENT:
        return sortByEvent(filteredPoints, this.#pointsModel.destinations);
      case SortModes.TIME:
        return sortByTime(filteredPoints);
      case SortModes.PRICE:
        return sortByPrice(filteredPoints);
      case SortModes.OFFERS:
        return sortByOffers(filteredPoints);
    }
    return filteredPoints;
  }

  init = () => {
    this.#renderSort();
    render(this.#eventsUlistView, this.#eventsContainer);
    this.#renderPoints();
    this.#newEventBtn.addEventListener('click', (evt) => {
      this.#eventCreator = new EventCreatorView(structuredClone(PRIMARY_POINT),
        this.#addPoint,
        this.#resetAllPoints,
        this.#pointsModel.destinations,
        this.#pointsModel.offers);
      evt.target.disabled = true;
      this.#clearAllPoints();
      render(this.#eventCreator, this.#eventsUlistView.element);
      this.#renderPoints();
      remove(this.#emptyListView);
    });
  };

  #handleSortModeChange = (sortMode) => {
    if (this.#currentSortMode === sortMode) {
      return;
    }

    this.#currentSortMode = sortMode;
    this.#clearAllPoints();
    this.#renderPoints();
  };

  #handleViewAction = async (actionType, updateType, update) => {

    switch (actionType) {
      case UserActions.UPDATE_POINT:
        this.#pointPresenters.find((pp) => pp.point.id === update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.find((pp) => pp.point.id === update.id).setAborting();
        }
        break;
      case UserActions.ADD_POINT:
        this.#pointPresenters.find((pp) => pp.point.id === update.id).setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.setAborting();
        }
        break;
      case UserActions.DELETE_POINT:
        this.#pointPresenters.find((pp) => pp.point.id === update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.find((pp) => pp.point.id === update.id).setAborting();
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateTypes.PATCH:
        this.#pointPresenters.find((obj) => obj.point === data).init(data);
        break;
      case UpdateTypes.MINOR:
        this.#clearAllPoints();
        this.#renderPoints();
        break;
      case UpdateTypes.MAJOR: {
        this.#currentSortMode = SortModes.DAY;
        remove(this.#emptyListView);
        const prevSortView = this.#sortView;
        this.#sortView = new SortView(this.#currentSortMode);
        this.#emptyListView = new EmptyListView(this.#filtersModel.filter);
        this.#sortView.setSortModeChangeHandler(this.#handleSortModeChange);
        replace(this.#sortView, prevSortView);
        this.#clearAllPoints();
        this.#renderPoints();
        break;
      }
    }
  };

  #renderSort = () => {
    this.#sortView = new SortView(this.#currentSortMode);
    this.#sortView.setSortModeChangeHandler(this.#handleSortModeChange);

    render(this.#sortView, this.#eventsContainer);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#eventsUlistView,
      this.#resetAllPoints,
      this.#deletePoint,
      this.#editPoint,
      this.#pointsModel.destinations,
      this.#pointsModel.offers);
    this.#pointPresenters.push(pointPresenter);
    pointPresenter.init(point);
  };

  #renderPoints = () => {
    if (this.points.length === 0) {
      render(this.#emptyListView, this.#eventsUlistView.element);
    } else {
      remove(this.#emptyListView);
      for (let i = 0; i < this.points.length; i++) {
        this.#renderPoint(this.points[i]);
      }
    }
  };

  #addPoint = (point) => {
    this.#clearAllPoints();
    this.#pointsModel.addPoint(point);
    this.#filtersModel.setFilter(UpdateTypes.MAJOR, FilterTypes.EVERYTHING);
    remove(this.#eventCreator);
    this.#eventCreator = new EventCreatorView(structuredClone(PRIMARY_POINT),
      this.#addPoint,
      this.#resetAllPoints,
      this.#pointsModel.destinations,
      this.#pointsModel.offers);
    this.#newEventBtn.disabled = false;
  };

  #editPoint = (point) => {
    this.#handleViewAction(UserActions.UPDATE_POINT, UpdateTypes.PATCH, point);
    this.#handleModelEvent(UpdateTypes.PATCH, point);
    this.#clearAllPoints();
    this.#renderPoints();
  };

  #deletePoint = (point) => {
    this.#handleViewAction(UserActions.UPDATE_POINT, UpdateTypes.MINOR, point);
    this.#handleModelEvent(UpdateTypes.MINOR, point);
    const index = this.#pointsModel.points.indexOf(point);
    this.#pointsModel.points.splice(index, 1);
    if (filter[this.#filtersModel.filter](this.points).length === 0) {
      this.#emptyListView = new EmptyListView(this.#filtersModel.filter);
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
      this.#eventCreator = new EventCreatorView(structuredClone(PRIMARY_POINT),
        this.#addPoint,
        this.#resetAllPoints,
        this.#pointsModel.destinations,
        this.#pointsModel.offers);
      this.#newEventBtn.disabled = false;
    }
  };
}
