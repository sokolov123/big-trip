import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { eventTypes, destinations, offersByEventType } from '../mocks/const.js';
import { separateDate, capitalizeFirstLetter } from '../utils/util.js';
import he from 'he';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createOffersTemplate = (offers, type) => {
  const currentOffersByType = offersByEventType.find((o) => o.type === type).offers;
  const offersContainer = document.createElement('section');
  offersContainer.classList.add('event__section', 'event__section--offers');
  for (let i = 0; i < currentOffersByType.length; i++) {
    const newOfferElement = document.createElement('div');
    newOfferElement.classList.add('event__offer-selector');
    const offer = currentOffersByType[i];
    newOfferElement.insertAdjacentHTML('beforeend', `
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.toLowerCase()}-1" type="checkbox"
      name="event-offer-${offer.title.toLowerCase()}" value="${offer.id}" ${offers.includes(offer.id) ? 'checked' : ''}>
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
          ${he.encode(String(capitalizeFirstLetter(type)))}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${destination.name} list="destination-list-1" autocomplete="off">
          ${createDestinations()}
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
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(String(basePrice))}" autocomplete="off" required>
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

  #datepicker = null;

  constructor(point) {
    super();
    this._state = point;

    // this._callback.onSubmit = onSubmit;
    // this._callback.onSubmit = onDelete;

    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteHandler(this._callback.formDelete);
    this.#setDatepickers();
  }

  getState = () => this._state;

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

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
    this.#setDatepickers();
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
    this._callback.formDelete = callback;
    this.element.addEventListener('reset', this.#formDeleteHandler);
  };

  #setInnerHandlers = () => {

    // Type
    const radioTypeBtns = this.element.querySelectorAll('.event__type-input');
    radioTypeBtns.forEach((btn) => btn.addEventListener('input', (evt) => {
      this.updateElement({ type: evt.target.value });
    }));

    // Destination
    const destinationBtn = this.element.querySelector('.event__input--destination');
    destinationBtn.addEventListener('change', (evt) => {
      const newDestination = destinations.find((obj) => obj.name === evt.target.value);
      this.updateElement({ destination: newDestination });
    });

    // Price
    const priceInput = this.element.querySelector('.event__input--price');
    priceInput.addEventListener('change', (evt) => {
      evt.preventDefault();
      this._state.basePrice = evt.target.value;
    });

    // Offers
    const offersCheckbox = this.element.querySelectorAll('.event__offer-checkbox');
    offersCheckbox.forEach((btn) => btn.addEventListener('change', () => {
      const newOffers = Array.from(offersCheckbox).filter((i) => i.checked).map((i) => i.value);
      this.updateElement({ offer: newOffers });
    }));
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
    this._callback.formDelete();
  };

  #setDatepickers = () => {
    this.#setFromDatepicker();
    this.#setToDatepicker();
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #setFromDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setToDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      },
    );
  };
}

export {createTypesTemplate, createOffersTemplate, createDestinations};
