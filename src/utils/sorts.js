import dayjs from 'dayjs';

const sortByDay = (points) => points.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));
const sortByEvent = (points, destinations) => points.sort((a, b) => {
  const cityA = destinations.find((dest) => dest.id === a.destination).name;
  const cityB = destinations.find((dest) => dest.id === b.destination).name;
  if (cityA === cityB) {return 0;}
  if (cityA > cityB) {return 1;}
  if (cityA < cityB) {return -1;}
});
const sortByTime = (points) => points.sort((a, b) => {
  const durationA = dayjs(a.dateTo).diff(a.dateFrom);
  const durationB = dayjs(b.dateTo).diff(b.dateFrom);
  return durationA - durationB;
});
const sortByPrice = (points) => points.sort((a, b) => a.basePrice - b.basePrice);
const sortByOffers = (points) => points.sort((a, b) => a.offers.length - b.offers.length);

export { sortByDay, sortByEvent, sortByTime, sortByPrice, sortByOffers };
