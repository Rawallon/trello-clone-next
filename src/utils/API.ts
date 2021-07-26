export default async function ApiCall(
  url: string,
  method?: string,
  body?: any,
) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((parsed) => parsed);
}
