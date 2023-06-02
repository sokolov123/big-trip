import FiltersView from './view/filters-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import { render } from './render.js';
import PointsModel from './model/points-model.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-body__page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const eventsPresenter = new EventsPresenter();
const pointsModel = new PointsModel();

render(new FiltersView(), tripControlsElement);
eventsPresenter.init(tripEventsElement, pointsModel);
