import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { eventTypes, destinations, offersByEventType } from '../mocks/const.js';
import { separateDate, capitalizeFirstLetter } from '../utils/util.js';

const createOffersTemplate = (offers, type) => {
  const currentOffersByType = offersByEventType.find((o) => o.type === type).offers;
  const offersContainer = document.createElement('section');
  offersContainer.classList.add('event__section');
  offersContainer.classList.add('event__section--offers');
  for (let i = 0; i < currentOffersByType.length; i++) {
    const newOfferElement = document.createElement('div');
    newOfferElement.classList.add('event__offer-selector');
    const offer = currentOffersByType[i];
    newOfferElement.insertAdjacentHTML('beforeend', `
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.toLowerCase()}-1" type="checkbox"
      name="event-offer-${offer.title.toLowerCase()}" ${offers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.title.toLowerCase()}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    `);
    offersContainer.appendChild(newOfferElement);
  }
  return offersContainer.innerHTML;
};

const createDestinations = () => {
  const container = document.createElement('div');
  const datalist = document.createElement('datalist');
  datalist.setAttribute('id', 'destination-list-1');
  for (let i = 0; i < destinations.length; i++) {
    const option = document.createElement('option');
    option.setAttribute('value', destinations[i].name);
    datalist.appendChild(option);
  }
  container.appendChild(datalist);
  return container.innerHTML;
};

const createTypesTemplate = (type) => {
  const container = document.createElement('div');
  const types = Object.values(eventTypes);
  for (let i = 0; i < types.length; i++) {
    const typeElement = document.createElement('div');
    typeElement.classList.add('event__type-item');
    typeElement.insertAdjacentHTML('beforeend', `
    <input id="event-type-${types[i]}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${types[i]} ${type === types[i] ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${types[i]}" for="event-type-${types[i]}-1">${capitalizeFirstLetter(types[i])}</label>
    `);
    container.appendChild(typeElement);
  }
  return container.innerHTML;
};

const createEditEventTemplate = (point) => {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = point;
  return (
    `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
              ${createTypesTemplate(type)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${capitalizeFirstLetter(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${destination.name} list="destination-list-1" autocomplete="off">
          ${createDestinations(destinations)}
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${separateDate(dateFrom)}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${separateDate(dateTo)}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${basePrice} autocomplete="off">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createOffersTemplate(offers, type)}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            <img class="event__photo" src=${destination.pictures[0].src} alt="Event photo">
            <img class="event__photo" src=${destination.pictures[1].src} alt="Event photo">
          </div>
        </div>
      </section>
    </section>
  </form>`
  );};

export default class EventEditorView extends AbstractStatefulView {

  constructor(point) {
    super();
    this._state = point;

    this.#setInnerHandlers();
  }

  get template() {
    return createEditEventTemplate(this._state);
  }

  get rollupButton() {
    return this.element.querySelector('.event__rollup-btn');
  }

  _restoreHandlers() {
    this.#setInnerHandlers();
    this.setRollupHandler(this._callback.rollup);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteHandler(this._callback.onDelete);
  }

  setRollupHandler = (callback) => {
    this._callback.rollup = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupHandler);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  setDeleteHandler = (callback) => {
    this._callback.onDelete = callback;
    this.element.addEventListener('reset', this.#formDeleteHandler);
  };

  #setInnerHandlers = () => {
    const radioTypeBtns = this.element.querySelectorAll('.event__type-input');
    radioTypeBtns.forEach((btn) => btn.addEventListener('input', (evt) => {
      this._state.type = evt.target.value;
      this.updateElement(this._state);
    }));

    const destinationBtn = this.element.querySelector('.event__input--destination');
    destinationBtn.addEventListener('change', (evt) => {
      this._state.destination = destinations.find((obj) => obj.name === evt.target.value);
      this.updateElement(this._state);
    });
  };

  #rollupHandler = () => {
    this._callback.rollup();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  };

  #formDeleteHandler = (evt) => {
    evt.preventDefault();
    this._callback.onDelete();
  };
}

export {createTypesTemplate, createOffersTemplate, createDestinations};
