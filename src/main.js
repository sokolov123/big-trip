import FiltersView from './view/filters-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import { generatePoint } from './mocks/point-mock.js';
import { render } from './framework/render.js';
import PointsModel from './model/points-model.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-body__page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const pointsModel = new PointsModel(Array.from({length: 2}, generatePoint));
const eventsPresenter = new EventsPresenter(tripEventsElement, pointsModel);

render(new FiltersView(), tripControlsElement);
eventsPresenter.init();
