import {getRandomInteger} from '../utils/util.js';
import {destinations, eventTypes, offersByEventType} from './const.js';


const generateEventType = () => eventTypes[getRandomInteger(0, eventTypes.length - 1)];

const getRandomOffersIds = (type) => {
  const randomIds = [];
  const currentOffers = offersByEventType.find((offer) => offer.type === type);
  const randomLength = getRandomInteger(0, currentOffers.offers.length - 1);
  if (randomLength === 0) {
    return randomIds;
  }
  for (let i = 0; i < randomLength; i++) {
    randomIds.push(currentOffers.offers[i].id);
  }
  return randomIds;
};

export const generatePoint = () => {
  const type = generateEventType();

  return ({
    id: getRandomInteger(1, 100),
    basePrice: getRandomInteger(100, 2000),
    dateFrom: `2023-01-${getRandomInteger(10, 31)}T${getRandomInteger(10, 23)}:${getRandomInteger(10, 50)}:56.845Z`,
    dateTo: `2023-01-${10, 30}T11:${getRandomInteger(30, 55)}:13.375Z`,
    destination: destinations[getRandomInteger(0, destinations.length - 1)],
    offers: getRandomOffersIds(type),
    type,
  });
};
