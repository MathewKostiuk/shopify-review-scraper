
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('themes').del()
    .then(function () {
      // Inserts seed entries
      return knex('themes').insert([
        { name: 'atlantic', url: 'https://themes.shopify.com/themes/atlantic/styles/modern' },
        { name: 'editions', url: 'https://themes.shopify.com/themes/editions/styles/modern' },
        { name: 'empire', url: 'https://themes.shopify.com/themes/empire/styles/supply' },
        { name: 'grid', url: 'https://themes.shopify.com/themes/grid/styles/bright' },
        { name: 'handy', url: 'https://themes.shopify.com/themes/handy/styles/cool' },
        { name: 'launch', url: 'https://themes.shopify.com/themes/launch/styles/cool' },
        { name: 'pacific', url: 'https://themes.shopify.com/themes/pacific/styles/cool' },
        { name: 'reach', url: 'https://themes.shopify.com/themes/reach/styles/solid' },
        { name: 'startup', url: 'https://themes.shopify.com/themes/startup/styles/home' },
        { name: 'vogue', url: 'https://themes.shopify.com/themes/vogue/styles/elegant' },
      ]);
    });
};
