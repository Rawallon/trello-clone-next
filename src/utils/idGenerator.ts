export const idGenerator = (): string =>
  Math.random().toString(10).substr(2, 9) +
  '-' +
  Math.random().toString(10).substr(2, 9);
