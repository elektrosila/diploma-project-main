export const camelToSnake = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const convertKeysToSnakeCase = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    const snakeKey = camelToSnake(key);
    newObj[snakeKey] = obj[key];
  });
  return newObj;
};
