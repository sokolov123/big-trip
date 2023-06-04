import { remove } from '../framework/render.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { destinations } from '../mocks/const.js';
import { createTypesTemplate, createDestinations, createOffersTemplate } from './event-editor-view.js';
import { capitalizeFirstLetter, separateDate } from '../utils/util.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createEventTemplate = (point) => {
  const {dateFrom, dateTo, destination, offers, type} = point;
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
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="" autocomplete="off">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
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
        </div>
      </section>
    </section>
  </form>`
  );
};

export default class EventCreatorView extends AbstractStatefulView {

  #datepicker = null;

  constructor(point) {
    super();

    this._state = point;
    this.#setInnerHandlers();
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
    return createEventTemplate(this._state);
  }

  _restoreHandlers() {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.#setDatepickers();
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
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

    // Esc
    this.element.addEventListener('keydown', this.#onEscKeyDown);

    // Cancel
    this.element.addEventListener('reset', (evt) => {
      evt.preventDefault();
      document.removeEventListener('keydown', this.#onEscKeyDown);
      remove(this);
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this._callback.formSubmit();
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

