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
        Naziv: entry.Naziv,
        Opis: entry.Opis,
        Tip: entry.Tip,
        Namena: entry.Detalji?.Namena,
        PovrsinaKvM: entry.Detalji?.PovrsinaKvM,
        Cena: entry.Cena,
        Uknjizen: entry.Detalji?.Uknjizen,
        Parking: entry.Detalji?.Parking,
        Adresa: entry.Lokacija?.data?.attributes?.Adresa,
        Grad: entry.Grad?.Naziv,
        image: entry.Slike[0] ? {
          url: entry.Slike[0].url,
          thumbnail: entry.Slike[0].formats?.thumbnail?.url,
          small: entry.Slike[0].formats?.small?.url,
          medium: entry.Slike[0].formats?.medium?.url,
          large: entry.Slike[0].formats?.large?.url
        } : null
      }));

      return { data: formattedEntries };
    } catch (error) {
      console.error('Error in findHighlighted:', error);
      ctx.throw(500, error);
    }
  }
}));