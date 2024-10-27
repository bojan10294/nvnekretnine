'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/apartments/highlighted',
      handler: 'apartment.findHighlighted',  // This should match the controller method name
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};