export const queryParser = (data: any): any => {
  if (!data.id) return data;
  return {
    _id: data.id,
    ...data,
  };
};
