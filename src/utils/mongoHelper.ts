export const queryParser = (data: any): any => {
  if (!data.id) return data;
  return {
    _id: data.id,
    ...data,
  };
};
export const queryMapParser = (data: any): any => {
  return data.map((element) => queryParser(element));
};
