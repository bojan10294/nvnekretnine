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