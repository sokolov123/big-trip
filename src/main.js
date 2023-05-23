import FiltersView from './view/filters-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import {render} from './render.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-body__page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const eventsPresenter = new EventsPresenter();

render(new FiltersView(), tripControlsElement);
eventsPresenter.init(tripEventsElement);
