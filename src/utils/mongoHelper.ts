import { ObjectID } from 'mongodb';

export const queryParser = (data: any): any => {
  if (!data.id) return data;
  return {
    _id: data.id,
    ...data,
  };
};
export const mongoidParser = (data: any): any => {
  if (!data.id) return data;
  const { id, author, ...rest } = data;
  let newData = {};
  if (author) {
    newData = {
      _id: new ObjectID(data.id),
      author: new ObjectID(data.author),
      ...rest,
    };
  } else {
    newData = {
      _id: new ObjectID(data.id),
      ...rest,
    };
  }
  return newData;
};
export const queryMapParser = (data: any): any => {
  return data.map((element) => queryParser(element));
};
