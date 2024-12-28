'use strict';

module.exports = {
  async find(ctx) {
    try {
      const entries = await strapi.entityService.findMany('api::city.city', {
        populate: '*'
      });

      const citiesWithCount = entries.map(city => ({
        id: city.id,
        naziv: city.Naziv,
        brojNekretnina: city.Nekretnine?.length || 0,
        slika: city.Slika ? {
          url: city.Slika.url,
          thumbnail: city.Slika.formats?.thumbnail?.url,
          small: city.Slika.formats?.small?.url,
          medium: city.Slika.formats?.medium?.url,
          large: city.Slika.formats?.large?.url
        } : null
      }));

      const topCities = citiesWithCount
        .sort((a, b) => b.brojNekretnina - a.brojNekretnina)
        .slice(0, 3);

      return { data: topCities };
    } catch (error) {
      console.error('Error: ', error);
      ctx.throw(500, error);
    }
  }
};