function add(a, b) {
  return a + b;
}

// Eksport tylko dla Node/Jest — w przeglądarce ten blok jest pomijany
if (typeof module !== 'undefined') {
  module.exports = { add };
}