import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { dateToString, timeToString, getOffersByType } from '../utils/util.js';

const createOfferTemplate = (currentOffersIDs, offers) => {
  if (currentOffersIDs.length === 0) {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">No additional offers</span>
      </li>`);
  }
  const newOffersContainer = document.createElement('div');
  for (let i = 0; i < currentOffersIDs.length; i++) {
    const newOfferElement = document.createElement('li');
    newOfferElement.classList.add('event__offer');
    newOfferElement.insertAdjacentHTML('beforeend', `
      <span class="event__offer-title">${offers.find((offer) => offer.id === parseInt(currentOffersIDs[i], 10)).title}</span>
        &plus;
      <span class="event__offer-price">${offers.find((offer) => offer.id === parseInt(currentOffersIDs[i], 10)).price}</span>&euro;&nbsp;
    `);
    newOffersContainer.appendChild(newOfferElement);
  }
  return newOffersContainer.innerHTML;
};

const createPointInListTemplate = (point, destinations, offers) => {
  const {basePrice, dateFrom, dateTo, destination, type} = point;
  const currentOffersIDs = point.offers;
  const destinationName = destinations.find((obj) => obj.id === destination).name;
  return (`<div class="event">
    <time class="event__date" datetime=${dateFrom}>${dateToString(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${destinationName}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime=${dateFrom}>${timeToString(dateFrom)}</time>
        &mdash;
        <time class="event__end-time" datetime=${dateTo}>${timeToString(dateTo)}</time>
      </p>
    </div>
    <p class="event__price">
      <span class="event__price-value">${basePrice}</span>&euro;&nbsp;
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${createOfferTemplate(currentOffersIDs, offers)}
    </ul>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>`);
};

export default class PointInListView extends AbstractStatefulView {

  #destinations = null;
  #offers = null;

  constructor(point, destinations, offers) {
    super();
    this._state = point;
    this.#destinations = destinations;
    this.#offers = getOffersByType(point.type, offers);
  }

  get template() {
    return createPointInListTemplate(this._state, this.#destinations, this.#offers);
  }

  getState = () => this._state;

  get rollupButton() {
    return this.element.querySelector('.event__rollup-btn');
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };
}
