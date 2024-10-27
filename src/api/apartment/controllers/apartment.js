'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::apartment.apartment', ({ strapi }) => ({
  ...createCoreController('api::apartment.apartment'),

  async findHighlighted(ctx) {
    try {
      const entries = await strapi.entityService.findMany('api::apartment.apartment', {
        filters: {
          Istaknuto: true
        },
        sort: { createdAt: 'desc' },
        limit: 3,
        populate: {
          Slike: {
            fields: ['formats', 'url']
          },
          Detalji: true,
          Lokacija: {
            fields: ['Adresa', 'Latitude', 'Longitude']
          },
          Grad: {
            fields: ['Naziv']
          }
        }
      });

      const formattedEntries = entries.map(entry => ({
        id: entry.id,
        title: entry.Naziv,
        description: entry.Opis,
        type: entry.Tip,
        purpose: entry.Detalji?.Namena,
        area: entry.Detalji?.PovrsinaKvM,
        address: entry.Lokacija?.data?.attributes?.Adresa,
        city: entry.Grad?.Naziv,
        image: entry.Slike ? {
          url: entry.Slike.url,
          thumbnail: entry.Slike.formats?.thumbnail?.url,
          small: entry.Slike.formats?.small?.url,
          medium: entry.Slike.formats?.medium?.url,
          large: entry.Slike.formats?.large?.url
        } : null
      }));

      return { data: formattedEntries };
    } catch (error) {
      console.error('Error in findHighlighted:', error);
      ctx.throw(500, error);
    }
  }
}));