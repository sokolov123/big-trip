import { getRandomInteger } from '../utils/util';

const eventTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'
];
const generatePicturesArray = () => {
  const resultPicturesArray = [];
  for (let i = 0; i < 5; i++) {
    resultPicturesArray[i] = {
      src:'http://picsum.photos/248/152?',
      description: `Some description for ${i} photo`,
    };
  }
  return resultPicturesArray;
};

const destinations = [
  {
    id: 1,
    description: descriptions[getRandomInteger(0, descriptions.length - 1)],
    name: 'Kazan',
    pictures: generatePicturesArray(),
  },
  {
    id: 2,
    description: descriptions[getRandomInteger(0, descriptions.length - 1)],
    name: 'Tokyo',
    pictures: generatePicturesArray(),
  },
  {
    id: 3,
    description: descriptions[getRandomInteger(0, descriptions.length - 1)],
    name: 'Toronto',
    pictures: generatePicturesArray(),
  },
  {
    id: 4,
    description: descriptions[getRandomInteger(0, descriptions.length - 1)],
    name: 'Krasnoyarsk',
    pictures: generatePicturesArray(),
  },
  {
    id: 5,
    description: descriptions[getRandomInteger(0, descriptions.length - 1)],
    name: 'Moscow',
    pictures: generatePicturesArray(),
  },
  {
    id: 6,
    description: descriptions[getRandomInteger(0, descriptions.length - 1)],
    name: 'Novosibirsk',
    pictures: generatePicturesArray(),
  },
  {
    id: 7,
    description: descriptions[getRandomInteger(0, descriptions.length - 1)],
    name: 'Yekaterinburg',
    pictures: generatePicturesArray(),
  },
];

const offersByEventType = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 3,
        title: 'Comfort',
        price: 320,
      }
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a comfort class',
        price: 20,
      },
      {
        id: 2,
        title: 'Upgrade',
        price: 50,
      }
    ]
  },
  {
    type: 'train',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a comfort class',
        price: 200,
      },
      {
        id: 2,
        title: 'Upgrade',
        price: 600,
      },
      {
        id: 3,
        title: 'Tea',
        price: 5,
      }
    ]
  },
  {
    type: 'ship',
    offers: [
      {
        id: 1,
        title: 'Meals',
        price: 300,
      },
      {
        id: 2,
        title: 'Upgrade+',
        price: 50,
      }
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: 1,
        title: 'Upgrade+',
        price: 60,
      },
      {
        id: 2,
        title: 'Upgrade to business class',
        price: 500,
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 300,
      }
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a comfort class',
        price: 20,
      },
      {
        id: 2,
        title: 'Fast check-in',
        price: 100,
      },
      {
        id: 3,
        title: 'Online check-in',
        price: 0,
      }
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: 1,
        title: 'Upgrade',
        price: 15,
      }
    ]
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: 1,
        title: 'Breakfasts',
        price: 300,
      },
      {
        id: 1,
        title: 'Dinners',
        price: 400,
      }
    ]
  }
];

export {eventTypes, offersByEventType, destinations};
