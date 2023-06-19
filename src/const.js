import { getRandomInteger } from './utils/util';

const FilterTypes = {
  EVERYTHING: 'everything',
  PAST: 'past',
  FUTURE: 'future'
};

const UpdateTypes = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const UserActions = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const eventTypes = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECKIN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant'
};

const PRIMARY_POINT = {
  id: getRandomInteger(1, 100),
  basePrice: '',
  dateFrom: '2023-01-01T00:00:56.845Z',
  dateTo: '2023-01-01T01:00:13.375Z',
  destination: 1,
  offers: [],
  type: eventTypes.FLIGHT,
};

const SortModes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offer'
};

export {eventTypes, PRIMARY_POINT, FilterTypes, UpdateTypes, UserActions, SortModes};
