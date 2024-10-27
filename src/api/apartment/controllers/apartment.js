'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::apartment.apartment', ({ strapi }) => ({
  // Keep existing core methods
  ...createCoreController('api::apartment.apartment'),

  // Add custom method for highlighted apartments
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
        city: entry.Grad?.data?.attributes?.Naziv,
        image: entry.Slike?.data?.attributes ? {
          url: entry.Slike.data.attributes.url,
          thumbnail: entry.Slike.data.attributes.formats?.thumbnail?.url,
          small: entry.Slike.data.attributes.formats?.small?.url,
          medium: entry.Slike.data.attributes.formats?.medium?.url,
          large: entry.Slike.data.attributes.formats?.large?.url
        } : null
      }));

      return { data: formattedEntries };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));