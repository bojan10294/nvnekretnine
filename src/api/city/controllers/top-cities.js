'use strict';

module.exports = {
  async find(ctx) {
    try {
      const entries = await strapi.entityService.findMany('api::city.city', {
        populate: {
          Nekretnine: {
            fields: ['id', 'Naziv']
          }
        },
        fields: ['id', 'Naziv']
      });

      const citiesWithCount = entries.map(city => ({
        id: city.id,
        naziv: city.Naziv,
        brojNekretnina: city.Nekretnine?.length || 0
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