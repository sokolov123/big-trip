import { remove } from '../framework/render.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createTypesTemplate, createDestinations, createOffersTemplate, createPicturesTemplate } from './event-editor-view.js';
import { capitalizeFirstLetter, separateDate, getOffersByType } from '../utils/util.js';
import he from 'he';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createEventTemplate = (point, destinations, offers) => {
  const { basePrice, dateFrom, dateTo, destination, type} = point;
  const destinationObj = destinations.find((obj) => obj.id === destination);
  const currentOffers = point.offers;
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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationObj.name}" list="destination-list-1" autocomplete="off" required>
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
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(String(basePrice))}" autocomplete="off" required>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createOffersTemplate(currentOffers, getOffersByType(type, offers))}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinationObj.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPicturesTemplate(destinationObj)}
          </div>
        </div>
        </div>
      </section>
    </section>
  </form>`
  );
};

export default class EventCreatorView extends AbstractStatefulView {

  #datepicker = null;
  #destinations = null;
  #offers = null;

  constructor(point, onSubmit, onDelete, destinations, offers) {
    super();

    this._state = point;
    this._callback.formSubmit = onSubmit;
    this._callback.formDelete = onDelete;
    this.#destinations = destinations;
    this.#offers = offers;

    this.#setInnerHandlers();
    this.setFormSubmitHandler();
    this.setCancelHandler();
    this.#setDatepickers();
  }


  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  get template() {
    return createEventTemplate(this._state, this.#destinations, this.#offers);
  }

  _restoreHandlers() {
    this.#setInnerHandlers();
    this.setFormSubmitHandler();
    this.setCancelHandler();
    this.#setDatepickers();
  }

  setFormSubmitHandler = () => {
    this.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      document.removeEventListener('keydown', this.#onEscKeyDown);
      const offersCheckbox = this.element.querySelectorAll('.event__offer-checkbox');
      const newOffers = Array.from(offersCheckbox).filter((i) => i.checked).map((i) => i.value);
      this._state.offers = newOffers;
      this._callback.formSubmit(this._state);
    });
  };

  setCancelHandler = () => {
    this.element.addEventListener('reset', (evt) => {
      evt.preventDefault();
      document.removeEventListener('keydown', this.#onEscKeyDown);
      document.querySelector('.trip-main__event-add-btn').disabled = false;
      this._callback.formDelete();
    });
  };

  #setInnerHandlers = () => {

    // Type
    const radioTypeBtns = this.element.querySelectorAll('.event__type-input');
    radioTypeBtns.forEach((btn) => btn.addEventListener('input', (evt) => {
      this.updateElement({ offers: getOffersByType(evt.target.value, this.#offers),
        type: evt.target.value });
    }));

    // Destination
    const destinationBtn = this.element.querySelector('.event__input--destination');
    destinationBtn.addEventListener('change', (evt) => {
      const newDestination = this.#destinations.find((obj) => obj.name === evt.target.value);
      this.updateElement({ destination: newDestination.id });
    });

    // Esc
    this.element.addEventListener('keydown', this.#onEscKeyDown);

    // Price
    const priceInput = this.element.querySelector('.event__input--price');
    priceInput.addEventListener('change', (evt) => {
      evt.preventDefault();
      this._state.basePrice = evt.target.value;
    });
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this);
    }
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

