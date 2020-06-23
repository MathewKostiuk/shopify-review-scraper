
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('themes').del()
    .then(function () {
      // Inserts seed entries
      return knex('themes').insert([
        { handle: 'atlantic', url: 'https://themes.shopify.com/themes/atlantic/styles/modern' },
        { handle: 'editions', url: 'https://themes.shopify.com/themes/editions/styles/modern' },
        { handle: 'empire', url: 'https://themes.shopify.com/themes/empire/styles/supply' },
        { handle: 'grid', url: 'https://themes.shopify.com/themes/grid/styles/bright' },
        { handle: 'handy', url: 'https://themes.shopify.com/themes/handy/styles/cool' },
        { handle: 'launch', url: 'https://themes.shopify.com/themes/launch/styles/cool' },
        { handle: 'pacific', url: 'https://themes.shopify.com/themes/pacific/styles/cool' },
        { handle: 'reach', url: 'https://themes.shopify.com/themes/reach/styles/solid' },
        { handle: 'startup', url: 'https://themes.shopify.com/themes/startup/styles/home' },
        { handle: 'vogue', url: 'https://themes.shopify.com/themes/vogue/styles/elegant' },
      ]);
    });
};
