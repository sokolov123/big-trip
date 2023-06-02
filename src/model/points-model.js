import { destinations, offersByEventType } from '../mocks/const.js';
import { generatePoint } from '../mocks/point-mock.js';

export default class PointsModel {

  points = Array.from({length: 10}, generatePoint);
  getPoints = () => this.points;

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
