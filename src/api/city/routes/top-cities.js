'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/top-cities',
      handler: 'top-cities.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};