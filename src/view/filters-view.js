import AbstractView from '../framework/view/abstract-view.js';

export const filterTypes = {
  EVERYTHING: 'Everything',
  // PAST: 'There are no past events now',
  FUTURE: 'Future'
};

const createTripFiltersTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything">
      <label class="trip-filters__filter-label" for="filter-everything">${filterTypes.EVERYTHING}</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
      <label class="trip-filters__filter-label" for="filter-future">${filterTypes.FUTURE}</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView {

  get template() {
    return createTripFiltersTemplate();
  }
}
