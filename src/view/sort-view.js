import AbstractView from '../framework/view/abstract-view.js';
import { SortModes } from '../const.js';
import { capitalizeFirstLetter } from '../utils/util.js';

const createSortButtons = (mode) => {
  const container = document.createElement('div');
  const modes = Object.values(SortModes);
  for (let i = 0; i < modes.length; i++) {
    const sortElement = document.createElement('div');
    sortElement.classList.add('trip-sort__item', `trip-sort__item--${modes[i]}`);
    sortElement.insertAdjacentHTML('beforeend', `
    <input id="sort-${modes[i]}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${modes[i]}" data-mode="${modes[i]}" ${mode === modes[i] ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-${modes[i]}">${capitalizeFirstLetter(modes[i])}</label>
    `);
    container.appendChild(sortElement);
  }
  return container.innerHTML;
};

const createTripSortTemplate = (mode) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createSortButtons(mode)}
  </form>`
);

export default class SortView extends AbstractView {

  #mode = SortModes.DAY;

  constructor(mode) {
    super();

    this.#mode = mode;
  }

  get template() {
    return createTripSortTemplate(this.#mode);
  }

  setSortModeChangeHandler = (callback) => {
    this._callback.sortModeChange = callback;
    this.element.addEventListener('input', this.#sortModeChangeHandler);
  };

  #sortModeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.sortModeChange(evt.target.dataset.mode);
  };
}
