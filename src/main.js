import EventsPresenter from './presenter/events-presenter.js';
import { generatePoint } from './mocks/point-mock.js';
import PointsModel from './model/points-model.js';
import FiltersModel from './model/filters-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-body__page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const pointsModel = new PointsModel(Array.from({length: 2}, generatePoint));
const filterModel = new FiltersModel();
const filtersPresenter = new FiltersPresenter(tripControlsElement, filterModel, pointsModel);
const eventsPresenter = new EventsPresenter(tripEventsElement, pointsModel, filterModel);

filtersPresenter.init();
eventsPresenter.init();
