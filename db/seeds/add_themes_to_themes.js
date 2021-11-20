
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('reviews').del()
  .then(function() {
    return knex('percent_positive').del()
  })
  .then(function() {
    return knex('rankings').del()
  })
  .then(function() {
    return knex('themes').del()
  })
  .then(function() {
    return knex('brands').insert([
      { brand: 'Pixel Union' },
      { brand: 'Out of the Sandbox' }
    ])
  })
  .then(function () {
    // Inserts seed entries
    return knex('themes').insert([
      { handle: 'atlantic', url: 'https://themes.shopify.com/themes/atlantic/styles/modern', brand_id: 1 },
      { handle: 'editions', url: 'https://themes.shopify.com/themes/editions/styles/modern', brand_id: 1 },
      { handle: 'empire', url: 'https://themes.shopify.com/themes/empire/styles/supply', brand_id: 1 },
      { handle: 'grid', url: 'https://themes.shopify.com/themes/grid/styles/bright', brand_id: 1 },
      { handle: 'handy', url: 'https://themes.shopify.com/themes/handy/styles/cool', brand_id: 1 },
      { handle: 'launch', url: 'https://themes.shopify.com/themes/launch/styles/cool', brand_id: 1 },
      { handle: 'pacific', url: 'https://themes.shopify.com/themes/pacific/styles/cool', brand_id: 1 },
      { handle: 'reach', url: 'https://themes.shopify.com/themes/reach/styles/solid', brand_id: 1 },
      { handle: 'startup', url: 'https://themes.shopify.com/themes/startup/styles/home', brand_id: 1 },
      { handle: 'vogue', url: 'https://themes.shopify.com/themes/vogue/styles/elegant', brand_id: 1 },
      { handle: 'responsive', url: 'https://themes.shopify.com/themes/responsive/styles/london', brand_id: 2 },
      { handle: 'retina', url: 'https://themes.shopify.com/themes/retina/styles/austin', brand_id: 2 },
      { handle: 'parallax', url: 'https://themes.shopify.com/themes/parallax/styles/aspen', brand_id: 2 },
      { handle: 'mobilia', url: 'https://themes.shopify.com/themes/mobilia/styles/milan', brand_id: 2 },
      { handle: 'artisan', url: 'https://themes.shopify.com/themes/artisan/styles/victoria', brand_id: 2 },
    ]);
  });
};
