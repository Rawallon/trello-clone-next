export default async function ApiCall(url, method, body) {
  return await fetch(`${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((parsed) => parsed);
}
