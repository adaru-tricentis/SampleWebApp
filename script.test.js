
const { add } = require('./script');

test('dodaje dwie liczby', () => {
  expect(add(2, 3)).toBe(5);
});