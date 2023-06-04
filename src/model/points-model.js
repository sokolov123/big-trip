import { destinations, offersByEventType } from '../mocks/const.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {

  #points = [];

  constructor(points) {
    super();
    this.#points = points;
  }

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points;
  }

  //updatePoint = (update, data) => {

  //};

  getDestinations = () => destinations;
  getOffers = () => offersByEventType;

  getCurrentOffers = (point) => {
    this.currentOffers = offersByEventType.find((offer) => offer.type === point.type)
      .offers.filter((offer) => point.offers.includes(offer.id));
    return this.currentOffers;
  };

  getOffersByType = (point) => {
    if (this.points.length === 0) {
      return 'no-offers';
    }
    this.offersByType = offersByEventType.find((offer) => offer.type === point.type);
    return this.offersByType;
  };
}
