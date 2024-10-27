'use strict';

module.exports = {
  async find(ctx) {
    try {
      const entries = await strapi.entityService.findMany('api::city.city', {
        populate: {
          Nekretnine: {
            fields: ['id', 'Naziv']
          },
          Slika: {
            fields: ['url', 'formats']
          }
        },
        fields: ['id', 'Naziv']
      });

      const citiesWithCount = entries.map(city => ({
        id: city.id,
        naziv: city.Naziv,
        brojNekretnina: city.Nekretnine?.length || 0,
        slika: {
          url: city.Slika?.data?.attributes?.url || null,
          thumbnail: city.Slika?.data?.attributes?.formats?.thumbnail?.url || null,
          small: city.Slika?.data?.attributes?.formats?.small?.url || null,
          medium: city.Slika?.data?.attributes?.formats?.medium?.url || null,
          large: city.Slika?.data?.attributes?.formats?.large?.url || null
        }
      }));

      const topCities = citiesWithCount
        .sort((a, b) => b.brojNekretnina - a.brojNekretnina)
        .slice(0, 3);

      return { data: topCities };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
};