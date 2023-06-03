import dayjs from 'dayjs';

const sortByDay = (points) => points.sort((a, b) => dayjs(a.point.dateFrom).diff(dayjs(b.point.dateFrom)));
const sortByEvent = (points) => points.sort((a, b) => {
  if (a.point.destination.name === b.point.destination.name) {return 0;}
  if (a.point.destination.name > b.point.destination.name) {return 1;}
  if (a.point.destination.name < b.point.destination.name) {return -1;}
});
const sortByTime = (points) => points.sort((a, b) => {
  const durationA = dayjs(a.point.dateTo).diff(a.point.dateFrom);
  const durationB = dayjs(b.point.dateTo).diff(b.point.dateFrom);
  return durationA - durationB;
});
const sortByPrice = (points) => points.sort((a, b) => a.point.basePrice - b.point.basePrice);
const sortByOffers = (points) => points.sort((a, b) => a.point.offers.length - b.point.offers.length);
const firstSort = (points) => points.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));

export { sortByDay, sortByEvent, sortByTime, sortByPrice, sortByOffers, firstSort };
