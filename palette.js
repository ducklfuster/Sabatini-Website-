/* Randomizes the swatch palette on every page load. Runs synchronously in
   <head>, before paint, so there's no flash of the default colors.
   Cream background / ink text stay fixed across all palettes for
   contrast; only the chip colors change.

   All four variants stay inside the logo's own world (heritage green,
   gold, cream, terracotta, sage) rather than unrelated hues — each is
   a different "paint deck" pulled from the same brand mark. */
(function () {
  var palettes = [
    { // Heritage Green & Gold (default — straight from the logo)
      apricot: '#C9A24B', salmon: '#9CAE8C', rust: '#A8542A',
      navy: '#1E4636', lavender: '#E1E5D6', skyblue: '#AFC8C5'
    },
    { // Olive & Copper
      apricot: '#B9702E', salmon: '#8C9463', rust: '#8C3A22',
      navy: '#2E3D22', lavender: '#E6DCC4', skyblue: '#7FA39A'
    },
    { // Marsh & Brass
      apricot: '#B69148', salmon: '#7E9885', rust: '#96432A',
      navy: '#1B4740', lavender: '#DCE4DC', skyblue: '#9FBFC4'
    },
    { // Meadow & Ochre
      apricot: '#D1A855', salmon: '#A8BE8F', rust: '#B15E36',
      navy: '#24483A', lavender: '#E8E7D3', skyblue: '#B9D2CE'
    }
  ];

  var chosen = palettes[Math.floor(Math.random() * palettes.length)];
  var root = document.documentElement.style;
  Object.keys(chosen).forEach(function (key) {
    root.setProperty('--' + key, chosen[key]);
  });
})();
