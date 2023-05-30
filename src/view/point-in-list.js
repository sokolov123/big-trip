import { offersByEventType } from '../mocks/const.js';
import {createElement} from '../render.js';
import { dateToString, timeToString } from '../utils/util.js';

const createOfferTemplate = (offers, type) => {
  if (offers.length === 0) {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">No additional offers</span>
      </li>`);
  }
  const newOffersContainer = document.createElement('div');
  for (let i = 0; i < offers.length; i++) {
    const newOfferElement = document.createElement('li');
    newOfferElement.classList.add('event__offer');
    const currentOffersByType = offersByEventType.find((o) => o.type === type).offers;
    const offer = currentOffersByType.find((o) => o.id === offers[i]);
    newOfferElement.insertAdjacentHTML('beforeend', `
      <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    `);
    newOffersContainer.appendChild(newOfferElement);
  }
  return newOffersContainer.innerHTML;
};

const createPointInListTemplate = (point) => {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = point;
  return (`<div class="event">
    <time class="event__date" datetime=${dateFrom}>${dateToString(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${destination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime=${dateFrom}>${timeToString(dateFrom)}</time>
        &mdash;
        <time class="event__end-time" datetime=${dateTo}>${timeToString(dateTo)}</time>
      </p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${createOfferTemplate(offers, type)}
    </ul>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>`);
};

export default class PointInListView {

  constructor(point) {
    this.point = point;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  getTemplate() {
    return createPointInListTemplate(this.point);
  }
}
