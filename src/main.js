import EventsPresenter from './presenter/events-presenter.js';
import PointsModel from './model/points-model.js';
import FiltersModel from './model/filters-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import PointsApiService from './presenter/points-api-service.js';


const AUTHORIZATION = 'Basic slfdiwodlseqwecv';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-body__page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FiltersModel();
const filtersPresenter = new FiltersPresenter(tripControlsElement, filterModel, pointsModel);
const eventsPresenter = new EventsPresenter(tripEventsElement, pointsModel, filterModel);
const init = async () => {
  await pointsModel.init();
  filtersPresenter.init();
  eventsPresenter.init();
};

init();
