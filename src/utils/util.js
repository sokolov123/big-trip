import dayjs from 'dayjs';

const getRandomInteger = (a, b) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return lower + Math.floor(Math.random() * (upper - lower + 1));
};

const dateToString = (date) => dayjs(date).format('MMM D');
const separateDate = (date) => dayjs(date).format('YY/MM/DD-HH:mm');
const timeToString = (date) => dayjs(date).format('H:mm');

export {getRandomInteger, dateToString, timeToString, separateDate};
