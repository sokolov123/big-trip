import { FilterTypes } from '../mocks/const';
import dayjs from 'dayjs';

const filter = {
  [FilterTypes.EVERYTHING]: (points) => points,
  [FilterTypes.PAST]: (points) => points.filter((point) => dayjs().isAfter(point.dateFrom)),
  [FilterTypes.FUTURE]: (points) => points.filter((point) => dayjs().isBefore(point.dateFrom))
};

export { filter };
