import { UpdateTypes } from '../const';
import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view';

export default class FiltersPresenter {

  #filtersContainer = null;
  #filtersModel = null;
  #filterComponent = null;
  #pointsModel = null;

  constructor(filetrsContainer, filtersModel, pointsModel) {
    this.#filtersContainer = filetrsContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(this.filters, this.#filtersModel.filter, this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateTypes.MAJOR, filterType);
  };
}
